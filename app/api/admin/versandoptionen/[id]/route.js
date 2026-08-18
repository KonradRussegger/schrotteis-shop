import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request, { params }) {
  const { id } = params;
  const { countryName, shippingCostCents } = await request.json();

  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("shipping_options")
    .update({
      country_name: countryName,
      shipping_cost_cents: shippingCostCents,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const supabase = supabaseAdmin();
  const { error } = await supabase.from("shipping_options").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
