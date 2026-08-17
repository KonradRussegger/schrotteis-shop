import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

async function getData(id) {
  const supabase = supabaseAdmin();
  const { data: product } = await supabase
    .from("products")
    .select("*, product_variants(*)")
    .eq("id", id)
    .single();
  const { data: categories } = await supabase.from("categories").select("*").order("sort_order");
  return { product, categories: categories || [] };
}

export default async function BearbeitenPage({ params }) {
  const { product, categories } = await getData(params.id);
  if (!product) notFound();

  return (
    <main className="px-6 md:px-12 py-16 max-w-[640px]">
      <h1 className="font-display text-3xl font-medium mb-10">Produkt bearbeiten</h1>
      <ProductForm categories={categories} initialProduct={product} />
    </main>
  );
}
