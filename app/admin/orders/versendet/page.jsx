import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getShippedOrders() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "shipped")
    .order("updated_at", { ascending: false }); // zuletzt versendet zuerst
  return data || [];
}

async function getCountryNames() {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("shipping_options").select("country_code, country_name");
  const map = {};
  (data || []).forEach((o) => (map[o.country_code] = o.country_name));
  return map;
}

export default async function VersendeteBestellungenPage() {
  const [orders, countryNames] = await Promise.all([getShippedOrders(), getCountryNames()]);

  return (
    <main className="px-6 md:px-12 py-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/orders" className="font-mono text-xs text-muted hover:text-tanLight">
            ← Zurück zu offenen Bestellungen
          </Link>
          <h1 className="font-display text-3xl font-medium mt-4 mb-2">Versendete Bestellungen</h1>
          <p className="text-muted text-sm mb-10">{orders.length} bereits versendet/abgeholt</p>
        </div>
      </div>

      {orders.length === 0 && (
        <p className="text-muted font-mono text-sm">Noch keine Bestellung als versendet markiert.</p>
      )}

      <div className="space-y-6">
        {orders.map((order) => {
          const isPickup = order.delivery_type === "pickup";
          const countryName = countryNames[order.shipping_address?.country] || order.shipping_address?.country;
          return (
            <section key={order.id} className="border border-line rounded-sm p-5 opacity-80">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-medium">Bestellung {order.id.slice(0, 8)}</h3>
                <span className="font-mono text-[10px] px-2 py-1 rounded-sm bg-tan/20 text-tanLight">
                  {isPickup ? "ABGEHOLT" : "VERSENDET"}
                </span>
              </div>

              <p className="text-sm mb-4">
                <span className="text-muted">Kunde:</span> {order.customer_name} ({order.customer_email})
                {isPickup ? (
                  <>
                    <br />
                    <span className="text-muted">Wurde in Abtenau abgeholt.</span>
                  </>
                ) : (
                  <>
                    <br />
                    {order.shipping_address?.street}
                    <br />
                    {order.shipping_address?.zip} {order.shipping_address?.city}
                    <br />
                    {countryName}
                    {order.tracking_number && (
                      <>
                        <br />
                        <span className="text-muted">Sendungsnummer:</span> {order.tracking_number}
                      </>
                    )}
                  </>
                )}
              </p>

              <p className="font-mono text-xs text-muted mb-1.5">ARTIKEL:</p>
              <ul className="text-sm space-y-1">
                {order.items.map((item, i) => (
                  <li key={i}>{item.qty}x {item.product_name} — {item.color_name}</li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
