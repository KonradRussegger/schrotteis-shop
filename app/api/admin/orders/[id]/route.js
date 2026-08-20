import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function PUT(request, { params }) {
  const { id } = params;
  const supabase = supabaseAdmin();

  const { error } = await supabase
    .from("orders")
    .update({ status: "shipped", updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
