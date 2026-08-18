import { supabasePublic } from "@/lib/supabase";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getShippingCost() {
  const supabase = supabasePublic();
  const { data } = await supabase.from("shop_settings").select("shipping_cost_cents").eq("id", 1).single();
  return data?.shipping_cost_cents ?? 0;
}

export default async function CheckoutPage({ searchParams }) {
  const shippingCostCents = await getShippingCost();

  return (
    <CheckoutForm
      variantId={searchParams?.variant}
      shippingCostCents={shippingCostCents}
    />
  );
}
