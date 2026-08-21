import { supabasePublic } from "@/lib/supabase";
import { theme as c } from "@/lib/theme";
import ProductCard from "@/components/ProductCard";
import VoucherCard from "@/components/VoucherCard";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getProducts() {
  const supabase = supabasePublic();
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !products || products.length === 0) return [];

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .in("product_id", products.map((p) => p.id));

  return products.map((p) => ({
    ...p,
    product_variants: (variants || []).filter((v) => v.product_id === p.id),
  }));
}

async function getSettings() {
  const supabase = supabasePublic();
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

export default async function ShopPage() {
  const [products, { lowStockThreshold, voucherEnabled }] = await Promise.all([
    getProducts(),
    getSettings(),
  ]);

  return (
    <main className="px-6 md:px-14 py-14">
      <h1 className="font-display font-medium mb-3" style={{ fontSize: "36px", color: c.ink }}>
        Kollektion
      </h1>
      {/* Filtern/Sortieren sind aktuell nur Platzhalter ohne Funktion,
          bei 10–15 Produkten lohnt sich echte Filterlogik noch nicht */}
      <div className="flex gap-7 font-mono mb-10" style={{ fontSize: "14px", color: c.muted }}>
        <span>FILTERN ▾</span>
        <span>SORTIEREN ▾</span>
      </div>

      {products.length === 0 && !voucherEnabled ? (
        <p className="font-mono text-sm" style={{ color: c.muted }}>
          Noch keine Produkte hinterlegt.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} lowStockThreshold={lowStockThreshold} />
          ))}
          {/* Fix an letzter Stelle, unabhängig von Sortierung/neuen Produkten */}
          {voucherEnabled && <VoucherCard />}
        </div>
      )}
    </main>
  );
}
