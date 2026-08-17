import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

export async function POST(request) {
  const { name } = await request.json();
  if (!name || !name.trim()) {
    return NextResponse.json({ error: "Name fehlt." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: existing } = await supabase.from("categories").select("sort_order").order("sort_order", { ascending: false }).limit(1);
  const nextOrder = (existing?.[0]?.sort_order || 0) + 1;

  const { data, error } = await supabase
    .from("categories")
    .insert({ name: name.trim(), slug: slugify(name), sort_order: nextOrder })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Kategorie konnte nicht angelegt werden." }, { status: 500 });
  }

  return NextResponse.json(data);
}
