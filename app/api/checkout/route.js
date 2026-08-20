import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mollie } from "@/lib/mollie";
import { findOrCreateContact, createInvoiceForOrder } from "@/lib/sevdesk";

export async function POST(request) {
  const { variantId, quantity, deliveryType, customer, shippingAddress, code } = await request.json();
  const supabase = supabaseAdmin();

  // 1. Variante und zugehöriges Produkt getrennt laden und zusammenführen
  //    (siehe Kommentar in app/admin/page.jsx zum Embedding-Problem).
  //    Preis kommt aus der DB, nie vom Client — sonst könnte der Preis im
  //    Browser manipuliert werden.
  const { data: variant, error: variantError } = await supabase
    .from("product_variants")
    .select("*")
    .eq("id", variantId)
    .single();

  if (variantError || !variant) {
    return NextResponse.json({ error: "Farbvariante nicht gefunden." }, { status: 404 });
  }

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("*")
    .eq("id", variant.product_id)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Produkt nicht gefunden." }, { status: 404 });
  }

  if (variant.stock_quantity < quantity) {
    return NextResponse.json({ error: "Nicht genug Lagerbestand." }, { status: 400 });
  }

  // Versandkosten kommen aus der Datenbank (je nach gewähltem Land), nie vom
  // Client — sonst könnte der Betrag im Browser manipuliert werden. Bei
  // Abholung fallen keine an.
  let shippingCostCents = 0;
  if (deliveryType === "shipping") {
    const countryCode = shippingAddress?.country;
    const { data: shippingOption } = await supabase
      .from("shipping_options")
      .select("shipping_cost_cents")
      .eq("country_code", countryCode)
      .single();

    if (!shippingOption) {
      return NextResponse.json({ error: "Versand in dieses Land ist nicht verfügbar." }, { status: 400 });
    }
    shippingCostCents = shippingOption.shipping_cost_cents;
  }

  const productSubtotal = variant.price_cents * quantity;

  // 2. Gutschein- oder Rabattcode prüfen (dasselbe Eingabefeld deckt beides
  //    ab). Ein Gutschein hat Vorrang, falls der Code zufällig in beiden
  //    Tabellen existieren sollte — sehr unwahrscheinlich, aber sauberer.
  let discountAmountCents = 0;
  let appliedVoucher = null;
  let appliedDiscountCode = null;

  if (code && code.trim()) {
    const normalizedCode = code.trim().toUpperCase();

    const { data: voucher } = await supabase
      .from("gift_vouchers")
      .select("*")
      .eq("code", normalizedCode)
      .eq("status", "active")
      .maybeSingle();

    if (voucher) {
      // "Alles oder nichts": der volle Gutscheinwert wird auf einmal
      // eingelöst, unabhängig davon ob die Bestellung ihn ganz ausschöpft.
      // Ein eventueller Restbetrag verfällt — kein Restguthaben.
      discountAmountCents = Math.min(voucher.value_cents, productSubtotal);
      appliedVoucher = voucher;
    } else {
      const now = new Date().toISOString();
      const { data: discountCode } = await supabase
        .from("discount_codes")
        .select("*")
        .eq("code", normalizedCode)
        .eq("is_active", true)
        .or(`valid_from.is.null,valid_from.lte.${now}`)
        .or(`valid_until.is.null,valid_until.gte.${now}`)
        .maybeSingle();

      if (discountCode) {
        discountAmountCents =
          discountCode.discount_type === "percent"
            ? Math.round((productSubtotal * discountCode.discount_value) / 100)
            : Math.min(discountCode.discount_value, productSubtotal);
        appliedDiscountCode = discountCode;
      } else {
        return NextResponse.json({ error: "Code ungültig oder abgelaufen." }, { status: 400 });
      }
    }
  }

  const discountedSubtotal = Math.max(0, productSubtotal - discountAmountCents);
  const totalCents = discountedSubtotal + shippingCostCents;

  // 3. Bestellung mit Status "open" anlegen
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status: "open",
      customer_name: customer.name,
      customer_email: customer.email,
      delivery_type: deliveryType === "pickup" ? "pickup" : "shipping",
      shipping_cost_cents: shippingCostCents,
      discount_code: appliedVoucher ? appliedVoucher.code : appliedDiscountCode ? appliedDiscountCode.code : null,
      discount_amount_cents: discountAmountCents,
      redeemed_voucher_id: appliedVoucher ? appliedVoucher.id : null,
      // shipping_address ist NOT NULL in der DB — bei Abholung einen
      // Platzhalter statt einer echten Adresse speichern.
      shipping_address: deliveryType === "pickup" ? { pickup: true } : shippingAddress,
      items: [
        {
          variant_id: variant.id,
          product_name: product.name,
          color_name: variant.color_name,
          qty: quantity,
          price_cents: variant.price_cents,
        },
      ],
      total_cents: totalCents,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Bestellung konnte nicht angelegt werden." }, { status: 500 });
  }

  // Gutschein sofort reservieren (verhindert doppelte Einlösung, während die
  // Zahlung noch läuft) — der Webhook bestätigt das später endgültig.
  if (appliedVoucher) {
    await supabase
      .from("gift_vouchers")
      .update({ status: "redeemed", redeemed_order_id: order.id, redeemed_at: new Date().toISOString() })
      .eq("id", appliedVoucher.id);
  }

  // 4. Mollie-Zahlung erstellen (bei komplett durch Gutschein gedecktem
  //    Betrag könnte totalCents 0 sein — Mollie braucht aber einen Betrag
  //    über 0, daher in dem Fall eine Mindestsumme von 0,01 € ansetzen ist
  //    keine gute Lösung; stattdessen leiten wir direkt zur Bestätigung.)
  if (totalCents <= 0) {
    await supabase.from("orders").update({ status: "paid", mollie_payment_id: null }).eq("id", order.id);
    for (const item of order.items) {
      await supabase.rpc("decrement_variant_stock", { variant_id: item.variant_id, amount: item.qty });
    }
    try {
      const contact = await findOrCreateContact({ name: customer.name, email: customer.email });
      const invoice = await createInvoiceForOrder({ ...order, status: "paid" }, contact.id);
      await supabase.from("orders").update({ sevdesk_invoice_id: invoice.invoice.id }).eq("id", order.id);
    } catch (err) {
      console.error("sevDesk-Rechnung fehlgeschlagen (durch Gutschein gedeckte Bestellung):", err);
    }
    return NextResponse.json({ checkoutUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/bestellung/${order.id}` });
  }

  const payment = await mollie().payments.create({
    amount: {
      currency: "EUR",
      value: (totalCents / 100).toFixed(2),
    },
    description: `Bestellung ${order.id.slice(0, 8)} — Schrotteis Gwandlstubn`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/bestellung/${order.id}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mollie`,
    metadata: { orderId: order.id },
  });

  // 5. Mollie-Payment-ID an der Bestellung speichern, um sie im Webhook wiederzufinden
  await supabase
    .from("orders")
    .update({ mollie_payment_id: payment.id })
    .eq("id", order.id);

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
}
