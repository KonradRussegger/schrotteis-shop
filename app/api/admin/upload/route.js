import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Nimmt ein einzelnes Foto entgegen und lädt es in den Supabase-Storage-Bucket
// "product-images" hoch. Der Bucket muss einmalig manuell in Supabase als
// "public" angelegt werden (Storage -> New bucket -> Name: product-images,
// Public bucket: an) — siehe README.
export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "Keine Datei übermittelt." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const extension = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("product-images")
    .upload(path, buffer, { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: "Upload fehlgeschlagen." }, { status: 500 });
  }

  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
