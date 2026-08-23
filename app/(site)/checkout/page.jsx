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

async function getVariant(variantId) {
  if (!variantId) return null;
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("product_variants")
    .select("id, price_cents, color_name")
    .eq("id", variantId)
    .single();
  return data;
}

export default async function CheckoutPage({ searchParams }) {
  const [shippingOptions, variant] = await Promise.all([
    getShippingOptions(),
    getVariant(searchParams?.variant),
  ]);

  return (
    <CheckoutForm
      variantId={searchParams?.variant}
      shippingOptions={shippingOptions}
      productSubtotalCents={variant?.price_cents ?? 0}
    />
  );
}
