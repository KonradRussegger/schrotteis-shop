import Link from "next/link";
import { supabasePublic } from "@/lib/supabase";
import { theme as c } from "@/lib/theme";
import VideoHero from "@/components/VideoHero";
import StitchDivider from "@/components/StitchDivider";
import ProductCard from "@/components/ProductCard";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

const steps = [
  {
    n: "01",
    title: "Zuschnitt",
    text: "Jedes Teil wird einzeln nach Schablone aus dem Leder oder Fell geschnitten — kein Rollenschnitt, keine zwei Stücke identisch.",
  },
  {
    n: "02",
    title: "Sattelnaht",
    text: "Von Hand genäht mit zwei Nadeln durch dasselbe Loch. Reißt ein Faden, hält die Naht trotzdem.",
  },
  {
    n: "03",
    title: "Kantenschluss",
    text: "Kanten werden geschliffen, gefärbt und poliert — der Unterschied zwischen Handwerk und Massenware.",
  },
  {
    n: "04",
    title: "Fertigstellung",
    text: "Zum Schluss von Hand nachbehandelt, damit Leder und Fell von Anfang an geschützt und langlebig sind.",
  },
];

// Produkte für "Neu in der Kollektion": zuerst manuell markierte (is_new),
// falls noch keine markiert sind, ersatzweise die zuletzt angelegten
// aktiven Produkte — damit der Abschnitt nie leer wirkt.
async function getNewProducts() {
  const supabase = supabasePublic();

  let { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_new", true)
    .order("created_at", { ascending: false })
    .limit(3);

  if (!products || products.length === 0) {
    const fallback = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false })
      .limit(3);
    products = fallback.data;
  }

  if (!products || products.length === 0) return [];

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .in("product_id", products.map((p) => p.id));

  return products.map((p) => ({
    ...p,
    product_variants: (variants || []).filter((v) => v.product_id === p.id),
  }));
}

export default async function HomePage() {
  const supabase = supabasePublic();
  const [newProducts, settingsResult] = await Promise.all([
    getNewProducts(),
    supabase.from("shop_settings").select("low_stock_threshold").eq("id", 1).single(),
  ]);
  const lowStockThreshold = settingsResult.data?.low_stock_threshold ?? 3;

  return (
    <main>
      <VideoHero />

      <section className="px-6 md:px-14 py-16 max-w-[680px] mx-auto text-center">
        <h2 className="font-display font-medium mb-5" style={{ fontSize: "32px", color: c.ink }}>
          Handwerk, das man trägt
        </h2>
        <p style={{ color: c.muted, lineHeight: 1.7, fontSize: "17px" }}>
          In der Werkstatt in Abtenau entstehen Lederwaren und Kostümteile für
          Krampus- und Perchtenläufe — jedes Stück von Hand gefertigt.
        </p>
      </section>

      <div className="px-6 md:px-14"><StitchDivider /></div>

      {newProducts.length > 0 && (
        <section className="px-6 md:px-14 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="font-display font-medium" style={{ fontSize: "28px", color: c.ink }}>
              Neu in der Kollektion
            </h2>
            <Link href="/shop" className="font-mono" style={{ fontSize: "14px", color: c.tanDeep }}>
              Alle ansehen →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {newProducts.map((p) => (
              <ProductCard key={p.id} product={p} lowStockThreshold={lowStockThreshold} />
            ))}
          </div>
        </section>
      )}

      <div className="px-6 md:px-14"><StitchDivider /></div>

      <section id="handwerk" className="px-6 md:px-14 py-16" style={{ background: c.bgAlt }}>
        <h2 className="font-display font-medium mb-2" style={{ fontSize: "28px", color: c.ink }}>
          Vom Fell zum fertigen Stück
        </h2>
        <p style={{ color: c.muted, maxWidth: "460px", marginBottom: "44px" }}>
          Vier Schritte, keiner davon lässt sich abkürzen, ohne dass man es dem Ergebnis ansieht.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {steps.map((s) => (
            <div key={s.n}>
              <span className="font-mono" style={{ color: c.brass, fontSize: "13px" }}>{s.n}</span>
              <h3 className="font-display font-medium" style={{ fontSize: "17px", color: c.ink, margin: "10px 0 8px" }}>
                {s.title}
              </h3>
              <p style={{ color: c.muted, fontSize: "13.5px", lineHeight: 1.55 }}>{s.text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
