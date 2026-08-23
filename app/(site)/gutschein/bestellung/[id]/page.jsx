import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { theme as c } from "@/lib/theme";
import AutoRefresh from "@/components/AutoRefresh";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const MAX_AUTO_REFRESH_ATTEMPTS = 15;

async function getVoucher(id) {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("gift_vouchers").select("*").eq("id", id).single();
  return data;
}

export default async function GutscheinBestellungPage({ params, searchParams }) {
  const voucher = await getVoucher(params.id);
  if (!voucher) notFound();

  const isPaid = voucher.status === "active" || voucher.status === "redeemed";
  const attempt = parseInt(searchParams?.check || "0", 10);

  return (
    <main className="px-6 md:px-14 py-20 max-w-[520px] mx-auto text-center">
      {isPaid ? (
        <>
          <p className="font-mono tracking-[0.2em] mb-4" style={{ fontSize: "12px", color: c.brass }}>
            GUTSCHEIN AKTIV
          </p>
          <h1 className="font-display font-medium mb-6" style={{ fontSize: "28px", color: c.ink }}>
            Danke, {voucher.buyer_name.split(" ")[0]}!
          </h1>

          <div className="p-8 mb-6" style={{ background: c.card, border: `1px solid ${c.line}` }}>
            <p className="font-mono mb-2" style={{ fontSize: "12px", color: c.muted }}>GUTSCHEINCODE</p>
            <p className="font-mono" style={{ fontSize: "26px", color: c.ink, letterSpacing: "0.05em" }}>
              {voucher.code}
            </p>
            <p className="font-mono mt-4" style={{ fontSize: "20px", color: c.tanDeep }}>
              {(voucher.value_cents / 100).toFixed(2)} €
            </p>
          </div>

          <p style={{ color: c.muted, fontSize: "13px", lineHeight: 1.6 }} className="mb-2">
            Diesen Code beim Einkauf im Checkout-Formular eingeben. Der Gutschein gilt vollständig auf einmal —
            es gibt kein Restguthaben nach teilweiser Einlösung.
          </p>
          <p style={{ color: c.muted, fontSize: "13px" }}>
            Eine Kopie geht an {voucher.buyer_email}.
          </p>
        </>
      ) : (
        <>
          {attempt < MAX_AUTO_REFRESH_ATTEMPTS && (
            <AutoRefresh nextHref={`/gutschein/bestellung/${voucher.id}?check=${attempt + 1}`} delayMs={2000} />
          )}
          <p className="font-mono tracking-[0.2em] mb-4" style={{ fontSize: "12px", color: c.muted }}>
            ZAHLUNG WIRD BESTÄTIGT …
          </p>
          <h1 className="font-display font-medium mb-5" style={{ fontSize: "26px", color: c.ink }}>
            Einen Moment noch
          </h1>
          <p style={{ color: c.muted, lineHeight: 1.6 }}>
            {attempt < MAX_AUTO_REFRESH_ATTEMPTS
              ? "Die Seite aktualisiert sich automatisch, sobald deine Zahlung bestätigt ist."
              : "Das dauert gerade länger als gewöhnlich — bitte lade die Seite in Kürze nochmal manuell neu."}
          </p>
        </>
      )}

      <Link href="/shop" className="font-mono inline-block mt-8" style={{ fontSize: "13px", color: c.muted }}>
        ← Zurück zur Kollektion
      </Link>
    </main>
  );
}
