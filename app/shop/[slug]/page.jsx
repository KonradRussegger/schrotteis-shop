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

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
