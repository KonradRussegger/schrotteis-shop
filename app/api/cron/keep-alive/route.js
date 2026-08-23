import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Wird von Vercel Cron einmal täglich aufgerufen (siehe vercel.json).
// Der einzige Zweck ist eine winzige, harmlose Datenbankabfrage — Supabase
// pausiert Free-Tier-Projekte automatisch nach 7 Tagen ohne jede Aktivität,
// das hier verhindert das zuverlässig, mit deutlichem Puffer.
export async function GET(request) {
  // Vercel Cron schickt einen Authorization-Header mit CRON_SECRET, falls
  // gesetzt — schützt davor, dass irgendjemand von außen die Route aufruft.
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("shop_settings").select("id").limit(1);

  if (error) {
    console.error("Keep-Alive-Ping fehlgeschlagen:", error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
