import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import HelpButton from "@/components/HelpButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // verhindert jede Zwischenspeicherung, auch auf Infrastrukturebene
export const revalidate = 0;

// Produkte und Farbvarianten bewusst getrennt abgefragt und in JS
// zusammengeführt, statt PostgREST-Embedding (product_variants(*)) zu
// nutzen — bei diesem Projekt lieferte die eingebettete Abfrage trotz
// vorhandener Daten und ohne Fehlermeldung leere Ergebnisse zurück.
async function getData() {
  const supabase = supabaseAdmin();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .order("created_at");
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*");

  const productsWithVariants = (products || []).map((p) => ({
    ...p,
    product_variants: (variants || []).filter((v) => v.product_id === p.id),
  }));

  return { categories: categories || [], products: productsWithVariants };
}

export default async function AdminPage() {
  const { categories, products } = await getData();

  return (
    <main className="px-6 md:px-12 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-medium">Produkte</h1>
        <div className="flex gap-6 font-mono text-xs text-muted">
          <Link href="/admin/produkte/neu" className="hover:text-tanLight">+ Neues Produkt</Link>
          <Link href="/admin/orders" className="hover:text-tanLight">Bestellübersicht →</Link>
          <Link href="/admin/kategorien" className="hover:text-tanLight">Kategorien verwalten →</Link>
          <Link href="/admin/rabattcodes" className="hover:text-tanLight">Rabattcodes →</Link>
          <Link href="/admin/gutscheine" className="hover:text-tanLight">Gutscheine →</Link>
          <Link href="/admin/einstellungen" className="hover:text-tanLight">Einstellungen →</Link>
          <a href="/api/admin/backup" className="hover:text-tanLight">Backup herunterladen ↓</a>
        </div>
      </div>

      <HelpButton topic="uebersicht" />

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted font-mono text-xs border-b border-line">
            <th className="pb-3">Foto</th>
            <th className="pb-3">Modell</th>
            <th className="pb-3">Kategorie</th>
            <th className="pb-3">Preis</th>
            <th className="pb-3">Farben</th>
            <th className="pb-3">Lager gesamt</th>
            <th className="pb-3">Sichtbar</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const cat = categories.find((c) => c.id === p.category_id);
            const variants = p.product_variants || [];
            const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
            const firstImage = variants.find((v) => v.images?.length)?.images?.[0];
            const prices = variants.map((v) => v.price_cents).filter(Boolean);
            const minPrice = prices.length ? Math.min(...prices) : null;
            const maxPrice = prices.length ? Math.max(...prices) : null;
            const priceLabel =
              minPrice === null
                ? "—"
                : minPrice === maxPrice
                ? `${(minPrice / 100).toFixed(2)} €`
                : `${(minPrice / 100).toFixed(2)}–${(maxPrice / 100).toFixed(2)} €`;
            return (
              <tr key={p.id} className="border-b border-line/50">
                <td className="py-3">
                  <Link href={`/admin/produkte/${p.id}/bearbeiten`}>
                    <div className="w-12 h-12 rounded-sm bg-bgAlt overflow-hidden flex items-center justify-center">
                      {firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={firstImage} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-mono text-muted text-[9px]">—</span>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="py-3">
                  <Link href={`/admin/produkte/${p.id}/bearbeiten`} className="hover:text-tanLight">
                    {p.name}
                  </Link>
                </td>
                <td className="py-3 text-muted">{cat?.name || "—"}</td>
                <td className="py-3 font-mono">{priceLabel}</td>
                <td className="py-3 text-muted">
                  {variants.map((v) => v.color_name).join(", ") || "—"}
                </td>
                <td className="py-3 font-mono">{totalStock}</td>
                <td className="py-3">{p.is_active ? "Ja" : "Nein"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="text-muted font-mono text-sm mt-4">
          Noch keine Produkte vorhanden.
        </p>
      )}
    </main>
  );
}
