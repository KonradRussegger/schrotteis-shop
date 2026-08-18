import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// Produkte und Farbvarianten getrennt abgefragt und zusammengeführt (siehe
// Kommentar in app/admin/page.jsx) statt PostgREST-Embedding.
async function getProductsByCategory() {
  const supabase = supabasePublic();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Fehler beim Laden der Produkte:", error);
    return { categories: categories || [], products: [] };
  }

  const { data: variants } = await supabase.from("product_variants").select("*");

  const productsWithVariants = (products || []).map((p) => ({
    ...p,
    product_variants: (variants || []).filter((v) => v.product_id === p.id),
  }));

  return { categories: categories || [], products: productsWithVariants };
}

export default async function ShopPage() {
  const { categories, products } = await getProductsByCategory();

  return (
    <main className="px-6 md:px-12 py-16">
      <h1 className="font-display text-3xl font-medium mb-10">Kollektion</h1>

      {products.length === 0 && (
        <p className="text-muted font-mono text-sm">
          Noch keine Produkte hinterlegt — im Admin-Bereich unter /admin anlegen.
        </p>
      )}

      {categories.map((cat) => {
        const catProducts = products.filter((p) => p.category_id === cat.id);
        if (catProducts.length === 0) return null;

        return (
          <section key={cat.id} className="mb-16">
            <h2 className="font-display text-xl font-medium mb-6 text-tanLight">
              {cat.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {catProducts.map((p) => {
                const variants = p.product_variants || [];
                const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
                const firstImage = variants.find((v) => v.images?.length)?.images?.[0];

                return (
                  <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                    <div className="w-full aspect-[4/3] rounded-sm bg-card flex items-center justify-center overflow-hidden">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono text-muted text-xs tracking-wide">FOTO FOLGT</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-lg font-medium group-hover:text-tanLight">{p.name}</h3>
                      <p className="text-muted text-sm mt-1">
                        {variants.length} Farbe{variants.length !== 1 ? "n" : ""}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-mono text-tanLight text-sm">{(p.price_cents / 100).toFixed(2)} €</span>
                        {totalStock === 0 && (
                          <span className="font-mono text-muted text-xs">Ausverkauft</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Fallback: Produkte ohne (gültige) Kategorie trotzdem anzeigen, statt
          sie unsichtbar verschwinden zu lassen */}
      {(() => {
        const categoryIds = categories.map((c) => c.id);
        const uncategorized = products.filter((p) => !categoryIds.includes(p.category_id));
        if (uncategorized.length === 0) return null;

        return (
          <section className="mb-16">
            <h2 className="font-display text-xl font-medium mb-6 text-tanLight">
              Weitere Produkte
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {uncategorized.map((p) => {
                const variants = p.product_variants || [];
                const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
                const firstImage = variants.find((v) => v.images?.length)?.images?.[0];

                return (
                  <Link key={p.id} href={`/shop/${p.slug}`} className="group">
                    <div className="w-full aspect-[4/3] rounded-sm bg-card flex items-center justify-center overflow-hidden">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono text-muted text-xs tracking-wide">FOTO FOLGT</span>
                      )}
                    </div>
                    <div className="mt-4">
                      <h3 className="font-display text-lg font-medium group-hover:text-tanLight">{p.name}</h3>
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-mono text-tanLight text-sm">{(p.price_cents / 100).toFixed(2)} €</span>
                        {totalStock === 0 && (
                          <span className="font-mono text-muted text-xs">Ausverkauft</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })()}
    </main>
  );
}
