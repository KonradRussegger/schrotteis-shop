import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import VoucherEmailButton from "@/components/VoucherEmailButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getVouchers() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("gift_vouchers")
    .select("*")
    .order("created_at", { ascending: false });
  return data || [];
}

const STATUS_LABELS = {
  pending: { text: "Zahlung offen", className: "bg-line text-muted" },
  active: { text: "Aktiv", className: "bg-tan/20 text-tanLight" },
  redeemed: { text: "Eingelöst", className: "bg-brass/20 text-brass" },
  cancelled: { text: "Storniert", className: "bg-line text-muted" },
};

export default async function GutscheinePage() {
  const vouchers = await getVouchers();

  return (
    <main className="px-6 md:px-12 py-16">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-2">Geschenkgutscheine</h1>
      <p className="text-muted text-sm mb-10">{vouchers.length} gekauft</p>

      {vouchers.length === 0 && (
        <p className="text-muted font-mono text-sm">Noch kein Gutschein gekauft.</p>
      )}

      <div className="space-y-4">
        {vouchers.map((v) => {
          const status = STATUS_LABELS[v.status] || STATUS_LABELS.pending;
          return (
            <section key={v.id} className="border border-line rounded-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-sm">{v.code}</span>
                <span className={`font-mono text-[10px] px-2 py-1 rounded-sm ${status.className}`}>
                  {status.text}
                </span>
              </div>
              <p className="text-sm mb-1">
                <span className="text-muted">Wert:</span> {(v.value_cents / 100).toFixed(2)} €
              </p>
              <p className="text-sm mb-1">
                <span className="text-muted">Käufer:in:</span> {v.buyer_name} ({v.buyer_email})
              </p>
              {v.recipient_note && (
                <p className="text-sm mb-3">
                  <span className="text-muted">Nachricht:</span> "{v.recipient_note}"
                </p>
              )}
              {v.status === "active" && (
                <div className="mt-3">
                  <VoucherEmailButton voucher={v} />
                </div>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
