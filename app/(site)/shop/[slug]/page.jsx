import { supabasePublic } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// Produkt und Farbvarianten getrennt abgefragt und zusammengeführt (siehe
// Kommentar in app/admin/page.jsx) statt PostgREST-Embedding.
async function getProduct(slug) {
  const supabase = supabasePublic();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) return null;

  const { data: variants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", product.id);

  return { ...product, product_variants: variants || [] };
}

async function getLowStockThreshold() {
  const supabase = supabasePublic();
  const { data } = await supabase.from("shop_settings").select("low_stock_threshold").eq("id", 1).single();
  return data?.low_stock_threshold ?? 3;
}

export default async function ProductPage({ params }) {
  const [product, lowStockThreshold] = await Promise.all([
    getProduct(params.slug),
    getLowStockThreshold(),
  ]);
  if (!product) notFound();

  return <ProductDetail product={product} lowStockThreshold={lowStockThreshold} />;
}
