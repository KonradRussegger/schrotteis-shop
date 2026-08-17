import { supabasePublic } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";

async function getProduct(slug) {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return <ProductDetail product={product} />;
}
