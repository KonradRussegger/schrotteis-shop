import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mollie } from "@/lib/mollie";
import { findOrCreateContact, createInvoiceForOrder } from "@/lib/sevdesk";

// Mollie ruft diese Route auf, sobald sich der Zahlungsstatus ändert.
// Wichtig: dem Payload selbst nie vertrauen — den Status immer live über
// die Mollie-API nachladen (siehe Mollie-Doku "Verifying webhook calls").
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

  if (!order) {
    return NextResponse.json({ error: "Bestellung nicht gefunden." }, { status: 404 });
  }

  // Idempotenz: Mollie kann denselben Webhook mehrfach senden.
  // Wenn die Bestellung schon als "paid" markiert ist, nichts doppelt ausführen.
  if (order.status === "paid" || order.status === "shipped") {
    return NextResponse.json({ ok: true, note: "Bereits verarbeitet." });
  }

  if (payment.status !== "paid") {
    // z.B. "open", "canceled", "expired" — nur bei "paid" weitermachen
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

  // 3. sevDesk: Kontakt finden/anlegen + Rechnung erstellen
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
