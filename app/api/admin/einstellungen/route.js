import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request) {
  const { shippingCostCents } = await request.json();

  if (typeof shippingCostCents !== "number" || shippingCostCents < 0) {
    return NextResponse.json({ error: "Ungültiger Wert." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("shop_settings")
    .update({ shipping_cost_cents: shippingCostCents, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
