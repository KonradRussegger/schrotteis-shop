import { supabasePublic } from "@/lib/supabase";
import CheckoutForm from "@/components/CheckoutForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getShippingOptions() {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("shipping_options")
    .select("*")
    .order("sort_order", { ascending: true });
  return data || [];
}

export default async function CheckoutPage({ searchParams }) {
  const shippingOptions = await getShippingOptions();

  return (
    <CheckoutForm
      variantId={searchParams?.variant}
      shippingOptions={shippingOptions}
    />
  );
}
