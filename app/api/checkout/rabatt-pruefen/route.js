import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Berechnet, wie viel Rabatt ein Code bringen würde — rein zur Anzeige im
// Checkout, bevor tatsächlich bestellt wird. Die eigentliche, verbindliche
// Berechnung passiert nochmal serverseitig in /api/checkout selbst.
export async function POST(request) {
  const { code, productSubtotalCents } = await request.json();
  const supabase = supabaseAdmin();

  if (!code || !code.trim()) {
    return NextResponse.json({ error: "Kein Code angegeben." }, { status: 400 });
  }

  const normalizedCode = code.trim().toUpperCase();

  const { data: voucher } = await supabase
    .from("gift_vouchers")
    .select("code, value_cents")
    .eq("code", normalizedCode)
    .eq("status", "active")
    .maybeSingle();

  if (voucher) {
    const discountAmountCents = Math.min(voucher.value_cents, productSubtotalCents);
    return NextResponse.json({ type: "voucher", discountAmountCents, label: voucher.code });
  }

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
    const discountAmountCents =
      discountCode.discount_type === "percent"
        ? Math.round((productSubtotalCents * discountCode.discount_value) / 100)
        : Math.min(discountCode.discount_value, productSubtotalCents);
    return NextResponse.json({ type: "code", discountAmountCents, label: discountCode.code });
  }

  return NextResponse.json({ error: "Code ungültig oder abgelaufen." }, { status: 400 });
}
