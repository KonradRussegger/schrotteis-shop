import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import DiscountCodesManager from "@/components/DiscountCodesManager";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getDiscountCodes() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("discount_codes").select("*").order("created_at", { ascending: false });
  return data || [];
}

export default async function RabattcodesPage() {
  const codes = await getDiscountCodes();

  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px]">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-10">Rabattcodes</h1>
      <DiscountCodesManager initialCodes={codes} />
    </main>
  );
}
