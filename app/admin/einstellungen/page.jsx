import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import ShippingOptionsManager from "@/components/ShippingOptionsManager";
import LowStockSetting from "@/components/LowStockSetting";
import VoucherToggleSetting from "@/components/VoucherToggleSetting";
import HelpButton from "@/components/HelpButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getShippingOptions() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("shipping_options")
    .select("*")
    .order("sort_order", { ascending: true });
  return data || [];
}

async function getSettings() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("shop_settings")
    .select("low_stock_threshold, voucher_enabled")
    .eq("id", 1)
    .single();
  return {
    lowStockThreshold: data?.low_stock_threshold ?? 3,
    voucherEnabled: data?.voucher_enabled ?? true,
  };
}

export default async function EinstellungenPage() {
  const [options, { lowStockThreshold, voucherEnabled }] = await Promise.all([
    getShippingOptions(),
    getSettings(),
  ]);

  return (
    <main className="px-6 md:px-12 py-16 max-w-[640px]">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-4">Versandkosten nach Land</h1>
      <HelpButton topic="einstellungen" />
      <ShippingOptionsManager initialOptions={options} />

      <div className="mt-14 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium mb-4">Niedriger Lagerbestand</h2>
        <LowStockSetting initialThreshold={lowStockThreshold} />
      </div>

      <div className="mt-14 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium mb-2">Geschenkgutschein-Block</h2>
        <p className="text-muted text-xs mb-4">
          Steuert, ob der Gutschein-Block am Ende der Shop-Kollektion sichtbar ist.
        </p>
        <VoucherToggleSetting initialEnabled={voucherEnabled} />
      </div>
    </main>
  );
}
