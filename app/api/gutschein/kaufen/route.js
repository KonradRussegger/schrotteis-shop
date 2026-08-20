import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { mollie } from "@/lib/mollie";
import { generateVoucherCode } from "@/lib/voucherCode";

export async function POST(request) {
  const { valueCents, buyerName, buyerEmail, recipientNote } = await request.json();

  if (!valueCents || valueCents < 500 || !buyerName || !buyerEmail) {
    return NextResponse.json({ error: "Bitte alle Felder korrekt ausfüllen." }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // Eindeutigen Code erzeugen (im unwahrscheinlichen Kollisionsfall neu versuchen)
  let code = generateVoucherCode();
  for (let i = 0; i < 5; i++) {
    const { data: existing } = await supabase.from("gift_vouchers").select("id").eq("code", code).maybeSingle();
    if (!existing) break;
    code = generateVoucherCode();
  }

  const { data: voucher, error: voucherError } = await supabase
    .from("gift_vouchers")
    .insert({
      code,
      value_cents: valueCents,
      status: "pending",
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      recipient_note: recipientNote || null,
    })
    .select()
    .single();

  if (voucherError) {
    return NextResponse.json({ error: "Gutschein konnte nicht angelegt werden." }, { status: 500 });
  }

  const payment = await mollie().payments.create({
    amount: {
      currency: "EUR",
      value: (valueCents / 100).toFixed(2),
    },
    description: `Geschenkgutschein ${(valueCents / 100).toFixed(2)} € — Schrotteis Gwandlstubn`,
    redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/gutschein/bestellung/${voucher.id}`,
    webhookUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/mollie`,
    metadata: { voucherId: voucher.id },
  });

  await supabase.from("gift_vouchers").update({ mollie_payment_id: payment.id }).eq("id", voucher.id);

  return NextResponse.json({ checkoutUrl: payment.getCheckoutUrl() });
}
