import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { sendShippedEmail } from "@/lib/resend";

export async function PUT(request, { params }) {
  const { id } = params;
  const { trackingNumber } = await request.json().catch(() => ({}));
  const supabase = supabaseAdmin();

  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status: "shipped",
      tracking_number: trackingNumber || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Rechnung als PDF anhängen, falls zuvor manuell hochgeladen (sevDesk läuft
  // aktuell ohne API-Anbindung). invoice_pdf_url enthält nur den Storage-Pfad
  // (privater Bucket) — der Download läuft direkt über den Service-Role-Key,
  // ganz ohne öffentliche oder signierte URL. Ein Fehler hier soll den
  // Versand-Workflow nicht blockieren, die Mail geht notfalls ohne Anhang raus.
  let invoicePdfBase64 = null;
  if (order.invoice_pdf_url) {
    try {
      const { data: pdfBlob, error: downloadError } = await supabase.storage
        .from("invoices")
        .download(order.invoice_pdf_url);
      if (downloadError) throw downloadError;
      const buffer = Buffer.from(await pdfBlob.arrayBuffer());
      invoicePdfBase64 = buffer.toString("base64");
    } catch (err) {
      console.error("Hochgeladene Rechnung konnte nicht geladen werden:", err);
    }
  }

  try {
    await sendShippedEmail(order, { trackingNumber, invoicePdfBase64 });
  } catch (err) {
    console.error("Versand-Mail fehlgeschlagen:", err);
  }

  return NextResponse.json({ ok: true });
}
