import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import AddCategoryForm from "@/components/AddCategoryForm";
import HelpButton from "@/components/HelpButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getCategories() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data || [];
}

export default async function KategorienPage() {
  const categories = await getCategories();

  return (
    <main className="px-6 md:px-12 py-16 max-w-[560px]">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-4">Kategorien</h1>
      <HelpButton topic="kategorien" />

      <ul className="mb-10 space-y-2">
        {categories.map((c) => (
          <li key={c.id} className="flex items-center justify-between border-b border-line/50 py-2 text-sm">
            <span>{c.name}</span>
            <span className="font-mono text-muted text-xs">{c.slug}</span>
          </li>
        ))}
      </ul>

      <h2 className="font-display text-lg font-medium mb-4">Neue Kategorie</h2>
      <AddCategoryForm />
    </main>
  );
}
