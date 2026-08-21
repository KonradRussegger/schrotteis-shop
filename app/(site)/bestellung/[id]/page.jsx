import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";
import { theme as c } from "@/lib/theme";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getOrder(id) {
  const supabase = supabaseAdmin();
  const { data } = await supabase.from("orders").select("*").eq("id", id).single();
  return data;
}

export default async function BestellungPage({ params }) {
  const order = await getOrder(params.id);
  if (!order) notFound();

  const isPaid = order.status === "paid" || order.status === "shipped";

  return (
    <main className="px-6 md:px-14 py-20 max-w-[560px] mx-auto text-center">
      {isPaid ? (
        <>
          <p className="font-mono tracking-[0.2em] mb-4" style={{ fontSize: "12px", color: c.brass }}>
            BESTELLUNG BESTÄTIGT
          </p>
          <h1 className="font-display font-medium mb-5" style={{ fontSize: "30px", color: c.ink }}>
            Danke für deine Bestellung, {order.customer_name.split(" ")[0]}!
          </h1>
          <p style={{ color: c.muted, lineHeight: 1.6 }} className="mb-8">
            Deine Zahlung ist eingegangen, eine Bestätigung wurde an {order.customer_email}{" "}
            geschickt. Wir bereiten deine Bestellung jetzt vor und melden uns nochmal, sobald sie{" "}
            {order.delivery_type === "pickup" ? "abholbereit ist" : "unterwegs ist"}.
          </p>
        </>
      ) : (
        <>
          <p className="font-mono tracking-[0.2em] mb-4" style={{ fontSize: "12px", color: c.muted }}>
            ZAHLUNG NOCH OFFEN
          </p>
          <h1 className="font-display font-medium mb-5" style={{ fontSize: "30px", color: c.ink }}>
            Bestellung {order.id.slice(0, 8)}
          </h1>
          <p style={{ color: c.muted, lineHeight: 1.6 }} className="mb-8">
            Deine Zahlung wurde noch nicht bestätigt. Falls du die Zahlung
            gerade abgeschlossen hast, lade diese Seite in ein paar Sekunden
            neu — die Bestätigung kann kurz dauern.
          </p>
        </>
      )}

      <div className="text-left p-5 mb-8" style={{ background: c.card }}>
        <p className="font-mono mb-3" style={{ fontSize: "12px", color: c.muted }}>BESTELLÜBERSICHT</p>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span style={{ color: c.ink }}>{item.qty}x {item.product_name} ({item.color_name})</span>
            <span className="font-mono" style={{ color: c.ink }}>{((item.price_cents * item.qty) / 100).toFixed(2)} €</span>
          </div>
        ))}
        <div className="flex justify-between text-sm mt-3 pt-3" style={{ borderTop: `1px solid ${c.line}` }}>
          <span className="font-medium" style={{ color: c.ink }}>Gesamt</span>
          <span className="font-mono" style={{ color: c.ink }}>{(order.total_cents / 100).toFixed(2)} €</span>
        </div>
      </div>

      <Link href="/shop" className="font-mono" style={{ fontSize: "13px", color: c.muted }}>
        ← Zurück zur Kollektion
      </Link>
    </main>
  );
}
