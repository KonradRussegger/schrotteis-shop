import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request) {
  const { lowStockThreshold } = await request.json();

  if (typeof lowStockThreshold !== "number" || lowStockThreshold < 0) {
    return NextResponse.json({ error: "Ungültiger Wert." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase
    .from("shop_settings")
    .update({ low_stock_threshold: lowStockThreshold, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
