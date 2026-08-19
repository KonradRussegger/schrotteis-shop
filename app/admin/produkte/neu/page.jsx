import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

async function getCategories() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data || [];
}

export default async function NeuesProduktPage() {
  const categories = await getCategories();

  return (
    <main className="px-6 md:px-12 py-16 max-w-[640px]">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-10">Neues Produkt</h1>
      <ProductForm categories={categories} />
    </main>
  );
}
