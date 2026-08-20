import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const { code, discountType, discountValue, validFrom, validUntil } = await request.json();

  if (!code || !discountType || !discountValue) {
    return NextResponse.json({ error: "Code, Typ und Wert sind erforderlich." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("discount_codes")
    .insert({
      code: code.trim().toUpperCase(),
      discount_type: discountType,
      discount_value: discountValue,
      valid_from: validFrom || null,
      valid_until: validUntil || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
