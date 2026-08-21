import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request) {
  const { lowStockThreshold, voucherEnabled } = await request.json();

  const update = { updated_at: new Date().toISOString() };

  if (lowStockThreshold !== undefined) {
    if (typeof lowStockThreshold !== "number" || lowStockThreshold < 0) {
      return NextResponse.json({ error: "Ungültiger Wert für Lagerbestand." }, { status: 400 });
    }
    update.low_stock_threshold = lowStockThreshold;
  }

  if (voucherEnabled !== undefined) {
    update.voucher_enabled = Boolean(voucherEnabled);
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("shop_settings").update(update).eq("id", 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
