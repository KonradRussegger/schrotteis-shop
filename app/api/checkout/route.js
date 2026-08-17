import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mollie } from "@/lib/mollie";

export async function POST(request) {
  const { variantId, quantity, customer, shippingAddress } = await request.json();
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

  const totalCents = product.price_cents * quantity;

  // 2. Bestellung mit Status "open" anlegen
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      status: "open",
      customer_name: customer.name,
      customer_email: customer.email,
      shipping_address: shippingAddress,
      items: [
        {
          variant_id: variant.id,
          product_name: product.name,
          color_name: variant.color_name,
          qty: quantity,
          price_cents: product.price_cents,
        },
      ],
      total_cents: totalCents,
    })
    .select()
    .single();

  if (orderError) {
    return NextResponse.json({ error: "Bestellung konnte nicht angelegt werden." }, { status: 500 });
  }

  // 3. Mollie-Zahlung erstellen
  const payment = await mollie().payments.create({
    amount: {
      currency: "EUR",
      value: (totalCents / 100).toFixed(2),
    },
    description: `Bestellung ${order.id.slice(0, 8)} — Schrotteis Gwandlstuben`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/bestellung/${order.id}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mollie`,
    metadata: { orderId: order.id },
  });

  // 4. Mollie-Payment-ID an der Bestellung speichern, um sie im Webhook wiederzufinden
  await supabase
    .from("orders")
    .update({ mollie_payment_id: payment.id })
    .eq("id", order.id);

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
}
