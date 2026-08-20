import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import ShippingOptionsManager from "@/components/ShippingOptionsManager";
import LowStockSetting from "@/components/LowStockSetting";

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

async function getLowStockThreshold() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("shop_settings").select("low_stock_threshold").eq("id", 1).single();
  return data?.low_stock_threshold ?? 3;
}

export default async function EinstellungenPage() {
  const [options, lowStockThreshold] = await Promise.all([
    getShippingOptions(),
    getLowStockThreshold(),
  ]);

  return (
    <main className="px-6 md:px-12 py-16 max-w-[640px]">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-10">Versandkosten nach Land</h1>
      <ShippingOptionsManager initialOptions={options} />

      <div className="mt-14 pt-10 border-t border-line">
        <h2 className="font-display text-xl font-medium mb-4">Niedriger Lagerbestand</h2>
        <LowStockSetting initialThreshold={lowStockThreshold} />
      </div>
    </main>
  );
}
