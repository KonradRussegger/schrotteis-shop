import { supabasePublic } from "@/lib/supabase";
import { theme as c } from "@/lib/theme";
import ShopGrid from "@/components/ShopGrid";

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

async function getCategories() {
  const supabase = supabasePublic();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data || [];
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
  const [products, categories, { lowStockThreshold, voucherEnabled }] = await Promise.all([
    getProducts(),
    getCategories(),
    getSettings(),
  ]);

  return (
    <main className="px-6 md:px-14 py-14">
      <h1 className="font-display font-medium mb-8" style={{ fontSize: "36px", color: c.ink }}>
        Kollektion
      </h1>

      <ShopGrid
        products={products}
        categories={categories}
        lowStockThreshold={lowStockThreshold}
        voucherEnabled={voucherEnabled}
      />
    </main>
  );
}
