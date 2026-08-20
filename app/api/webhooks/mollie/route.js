import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mollie } from "@/lib/mollie";
import { findOrCreateContact, createInvoiceForOrder } from "@/lib/sevdesk";

// Mollie ruft diese Route auf, sobald sich der Zahlungsstatus ändert — sowohl
// für normale Bestellungen als auch für Gutschein-Käufe. Wichtig: dem Payload
// selbst nie vertrauen — den Status immer live über die Mollie-API nachladen
// (siehe Mollie-Doku "Verifying webhook calls").
export async function POST(request) {
  const form = await request.formData();
  const paymentId = form.get("id");
  if (!paymentId) {
    return NextResponse.json({ error: "Keine Payment-ID übermittelt." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const payment = await mollie().payments.get(paymentId);

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("mollie_payment_id", paymentId)
    .single();

  if (order) {
    return handleOrderPayment(supabase, order, payment);
  }

  const { data: voucher } = await supabase
    .from("gift_vouchers")
    .select("*")
    .eq("mollie_payment_id", paymentId)
    .single();

  if (voucher) {
    return handleVoucherPayment(supabase, voucher, payment);
  }

  return NextResponse.json({ error: "Weder Bestellung noch Gutschein gefunden." }, { status: 404 });
}

async function handleOrderPayment(supabase, order, payment) {
  // Idempotenz: Mollie kann denselben Webhook mehrfach senden.
  if (order.status === "paid" || order.status === "shipped") {
    return NextResponse.json({ ok: true, note: "Bereits verarbeitet." });
  }

  if (payment.status !== "paid") {
    return NextResponse.json({ ok: true, note: `Status: ${payment.status}` });
  }

  // 1. Bestellung als bezahlt markieren
  await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);

  // 2. Lagerbestand der jeweiligen Farbvariante reduzieren
  for (const item of order.items) {
    await supabase.rpc("decrement_variant_stock", {
      variant_id: item.variant_id,
      amount: item.qty,
    });
  }

  // 3. Falls ein Gutschein eingelöst wurde: endgültig als eingelöst markieren
  //    (im Checkout schon reserviert, hier nur zur Sicherheit bestätigt)
  if (order.redeemed_voucher_id) {
    await supabase
      .from("gift_vouchers")
      .update({ status: "redeemed", redeemed_order_id: order.id, redeemed_at: new Date().toISOString() })
      .eq("id", order.redeemed_voucher_id);
  }

  // 4. sevDesk: Kontakt finden/anlegen + Rechnung erstellen
  try {
    const contact = await findOrCreateContact({
      name: order.customer_name,
      email: order.customer_email,
    });
    const invoice = await createInvoiceForOrder(order, contact.id);
    await supabase
      .from("orders")
      .update({ sevdesk_invoice_id: invoice.invoice.id })
      .eq("id", order.id);
  } catch (err) {
    // Zahlung ist bereits erfolgreich verbucht — ein sevDesk-Fehler soll den
    // Bestellprozess nicht blockieren, aber unbedingt geloggt/überwacht werden.
    console.error("sevDesk-Rechnung fehlgeschlagen:", err);
  }

  return NextResponse.json({ ok: true });
}

async function handleVoucherPayment(supabase, voucher, payment) {
  // Idempotenz
  if (voucher.status === "active" || voucher.status === "redeemed") {
    return NextResponse.json({ ok: true, note: "Bereits verarbeitet." });
  }

  if (payment.status !== "paid") {
    return NextResponse.json({ ok: true, note: `Status: ${payment.status}` });
  }

  await supabase
    .from("gift_vouchers")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("id", voucher.id);

  return NextResponse.json({ ok: true });
}
