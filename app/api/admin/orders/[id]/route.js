import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendShippedEmail } from "@/lib/resend";

export async function PUT(request, { params }) {
  const { id } = params;
  const supabase = supabaseAdmin();

  const { data: order, error } = await supabase
    .from("orders")
    .update({ status: "shipped", updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  try {
    await sendShippedEmail(order);
  } catch (err) {
    console.error("Versand-Mail fehlgeschlagen:", err);
  }

  return NextResponse.json({ ok: true });
}
