import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic"; // immer aktuelle Daten im Admin-Bereich

async function getData() {
  const supabase = supabaseAdmin();
  const { data: categories, error: catError } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  const { data: products, error: prodError } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .order("created_at");
  return {
    categories: categories || [],
    products: products || [],
    error: catError?.message || prodError?.message || null,
  };
}

export default async function AdminPage() {
  const { categories, products, error } = await getData();

  return (
    <main className="px-6 md:px-12 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-3xl font-medium">Produkte</h1>
        <div className="flex gap-6 font-mono text-xs text-muted">
          <Link href="/admin/produkte/neu" className="hover:text-tanLight">+ Neues Produkt</Link>
          <Link href="/admin/orders" className="hover:text-tanLight">Bestellübersicht →</Link>
          <Link href="/admin/kategorien" className="hover:text-tanLight">Kategorien verwalten →</Link>
        </div>
      </div>

      {error && (
        <div className="border border-red-900 bg-red-950/40 rounded-sm px-4 py-3 mb-8 font-mono text-xs text-red-300">
          Verbindung zu Supabase fehlgeschlagen: {error}
          <br />
          Vermutlich stimmt SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY in den Vercel-Umgebungsvariablen nicht.
        </div>
      )}

      {/* TEMPORÄRE DIAGNOSE — danach wieder entfernen */}
      <div className="border border-amber-700 bg-amber-950/30 rounded-sm px-4 py-3 mb-8 font-mono text-xs text-amber-300">
        DIAGNOSE: {products.length} Produkte gefunden, {categories.length} Kategorien gefunden.
        <br />
        SUPABASE_URL beginnt mit: {(process.env.SUPABASE_URL || "NICHT GESETZT").slice(0, 30)}
        <br />
        SERVICE_ROLE_KEY Länge: {(process.env.SUPABASE_SERVICE_ROLE_KEY || "").length} Zeichen
      </div>

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
                <td className="py-3 font-mono">{(p.price_cents / 100).toFixed(2)} €</td>
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

      {/*
        TODO nächster Schritt: Formular zum Anlegen/Bearbeiten eines Produkts
        inkl. mehrerer Farbvarianten und Foto-Upload je Farbe nach Supabase
        Storage. Aktuell bewusst nur die Übersicht, damit die Datenstruktur
        zuerst steht.
      */}
    </main>
  );
}
