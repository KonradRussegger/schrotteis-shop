import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Nimmt eine manuell aus sevDesk exportierte Rechnung (PDF) entgegen und lädt
// sie in den Supabase-Storage-Bucket "invoices" hoch. Der Bucket muss
// einmalig manuell in Supabase angelegt werden — bewusst NICHT public
// (anders als "product-images"), da Rechnungen personenbezogene Daten
// enthalten. Storage -> New bucket -> Name: invoices, Public bucket: AUS.
export async function POST(request, { params }) {
  const { id } = params;
  const formData = await request.formData();
  const file = formData.get("file");

  if (!file) {
    return NextResponse.json({ error: "Keine Datei übermittelt." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return NextResponse.json({ error: "Bitte eine PDF-Datei hochladen." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const path = `${id}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from("invoices")
    .upload(path, buffer, { contentType: "application/pdf", upsert: true });

  if (error) {
    return NextResponse.json({ error: `Supabase Storage: ${error.message}` }, { status: 500 });
  }

  // In der Datenbank wird nur der Storage-Pfad gespeichert, keine öffentliche
  // URL — der Zugriff läuft später ausschließlich über den Service-Role-Key
  // (z.B. beim Mailversand) oder über kurzlebige, eigens generierte Links.
  await supabase.from("orders").update({ invoice_pdf_url: path }).eq("id", id);

  return NextResponse.json({ ok: true });
}
