import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getOpenOrders() {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("status", "paid") // bezahlt, aber noch nicht versendet
    .order("created_at", { ascending: true });
  return data || [];
}

export default async function OrdersPage() {
  const orders = await getOpenOrders();

  return (
    <main>
      <h1>Zu versendende Bestellungen</h1>
      <p>{orders.length} offene Bestellung(en)</p>

      {orders.map((order) => (
        <section key={order.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "12px" }}>
          <h3>Bestellung {order.id.slice(0, 8)}</h3>
          <p>
            <strong>Empfänger:</strong> {order.customer_name}
            <br />
            {order.shipping_address.street}
            <br />
            {order.shipping_address.zip} {order.shipping_address.city}
            <br />
            {order.shipping_address.country}
          </p>
          <p><strong>Zu verpacken:</strong></p>
          <ul>
            {order.items.map((item, i) => (
              <li key={i}>{item.qty}x {item.product_name} — {item.color_name}</li>
            ))}
          </ul>
          {/* TODO: Button "Als versendet markieren" -> Server Action,
              die order.status auf "shipped" setzt */}
          <button>Als versendet markieren</button>
        </section>
      ))}
    </main>
  );
}
