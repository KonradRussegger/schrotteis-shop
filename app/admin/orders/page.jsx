import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import CopyAddressButton from "@/components/CopyAddressButton";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getOpenOrders() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "paid") // bezahlt, aber noch nicht versendet/abgeholt
    .order("created_at", { ascending: true });
  return data || [];
}

async function getCountryNames() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("shipping_options").select("country_code, country_name");
  const map = {};
  (data || []).forEach((o) => (map[o.country_code] = o.country_name));
  return map;
}

export default async function OrdersPage() {
  const [orders, countryNames] = await Promise.all([getOpenOrders(), getCountryNames()]);

  return (
    <main className="px-6 md:px-12 py-16">
      <Link href="/admin" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Übersicht
      </Link>
      <h1 className="font-display text-3xl font-medium mt-4 mb-2">Offene Bestellungen</h1>
      <p className="text-muted text-sm mb-10">{orders.length} Bestellung(en) zu verpacken/abzuholen bereitzustellen</p>

      {orders.length === 0 && (
        <p className="text-muted font-mono text-sm">Aktuell keine offenen Bestellungen.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const isPickup = order.delivery_type === "pickup";
          const countryName = countryNames[order.shipping_address?.country] || order.shipping_address?.country;
          return (
            <section key={order.id} className="border border-line rounded-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-medium">Bestellung {order.id.slice(0, 8)}</h3>
                <span
                  className={`font-mono text-[10px] px-2 py-1 rounded-sm ${
                    isPickup ? "bg-brass/20 text-brass" : "bg-tan/20 text-tanLight"
                  }`}
                >
                  {isPickup ? "ABHOLUNG" : "VERSAND"}
                </span>
              </div>

              <p className="text-sm mb-4">
                <span className="text-muted">Kunde:</span> {order.customer_name} ({order.customer_email})
                {isPickup ? (
                  <>
                    <br />
                    <span className="text-muted">Wird in Abtenau abgeholt — keine Adresse nötig.</span>
                  </>
                ) : (
                  <>
                    <br />
                    {order.shipping_address?.street}
                    <br />
                    {order.shipping_address?.zip} {order.shipping_address?.city}
                    <br />
                    {countryName}
                  </>
                )}
              </p>

              {!isPickup && (
                <div className="mb-4">
                  <CopyAddressButton
                    name={order.customer_name}
                    street={order.shipping_address?.street}
                    zip={order.shipping_address?.zip}
                    city={order.shipping_address?.city}
                    country={countryName}
                  />
                </div>
              )}

              <p className="font-mono text-xs text-muted mb-1.5">ZU VERPACKEN:</p>
              <ul className="text-sm mb-4 space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>{item.qty}x {item.product_name} — {item.color_name}</li>
                ))}
              </ul>

              {/* TODO: Button "Als versendet/abgeholt markieren" -> Server Action,
                  die order.status auf "shipped" setzt */}
              <button className="font-mono text-xs text-muted hover:text-tanLight border border-line rounded-sm px-4 py-2">
                Als {isPickup ? "abgeholt" : "versendet"} markieren
              </button>
            </section>
          );
        })}
      </div>
    </main>
  );
}
