import { supabasePublic } from "@/lib/supabase";
import { theme as c } from "@/lib/theme";
import ProductCard from "@/components/ProductCard";

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

export default async function ShopPage() {
  const products = await getProducts();

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

      {products.length === 0 ? (
        <p className="font-mono text-sm" style={{ color: c.muted }}>
          Noch keine Produkte hinterlegt.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-12">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
