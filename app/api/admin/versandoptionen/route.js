import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const { countryCode, countryName, shippingCostCents } = await request.json();

  if (!countryCode || !countryName || typeof shippingCostCents !== "number") {
    return NextResponse.json({ error: "Bitte alle Felder ausfüllen." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: existing } = await supabase
    .from("shipping_options")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

  const { data, error } = await supabase
    .from("shipping_options")
    .insert({
      country_code: countryCode.trim().toUpperCase(),
      country_name: countryName.trim(),
      shipping_cost_cents: shippingCostCents,
      sort_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    // z.B. Verletzung der unique-Regel bei doppeltem Länderkürzel
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
