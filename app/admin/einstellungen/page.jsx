import { supabaseAdmin } from "@/lib/supabase";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getSettings() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
  return data;
}

export default async function EinstellungenPage() {
  const settings = await getSettings();

  return (
    <main className="px-6 md:px-12 py-16 max-w-[480px]">
      <h1 className="font-display text-3xl font-medium mb-10">Einstellungen</h1>
      <SettingsForm initialShippingCents={settings?.shipping_cost_cents ?? 500} />
    </main>
  );
}
