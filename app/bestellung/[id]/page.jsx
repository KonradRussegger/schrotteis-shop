import { supabaseAdmin } from "@/lib/supabase";
import { notFound } from "next/navigation";
import Link from "next/link";

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
    <main className="px-6 md:px-12 py-20 max-w-[560px] mx-auto text-center">
      {isPaid ? (
        <>
          <p className="font-mono text-brass text-xs tracking-[0.2em] mb-4">
            BESTELLUNG BESTÄTIGT
          </p>
          <h1 className="font-display text-3xl font-medium mb-5">
            Danke für deine Bestellung, {order.customer_name.split(" ")[0]}!
          </h1>
          <p className="text-muted leading-relaxed mb-8">
            Deine Zahlung ist eingegangen. Eine Bestätigung wurde an{" "}
            {order.customer_email} gesendet. Wir verpacken deine Bestellung so schnell wie möglich.
          </p>
        </>
      ) : (
        <>
          <p className="font-mono text-muted text-xs tracking-[0.2em] mb-4">
            ZAHLUNG NOCH OFFEN
          </p>
          <h1 className="font-display text-3xl font-medium mb-5">
            Bestellung {order.id.slice(0, 8)}
          </h1>
          <p className="text-muted leading-relaxed mb-8">
            Deine Zahlung wurde noch nicht bestätigt. Falls du die Zahlung
            gerade abgeschlossen hast, lade diese Seite in ein paar Sekunden
            neu — die Bestätigung kann kurz dauern.
          </p>
        </>
      )}

      <div className="text-left bg-card rounded-sm p-5 mb-8">
        <p className="font-mono text-xs text-muted mb-3">BESTELLÜBERSICHT</p>
        {order.items.map((item, i) => (
          <div key={i} className="flex justify-between text-sm mb-2">
            <span>{item.qty}x {item.product_name} ({item.color_name})</span>
            <span className="font-mono text-tanLight">{((item.price_cents * item.qty) / 100).toFixed(2)} €</span>
          </div>
        ))}
        <div className="flex justify-between text-sm mt-3 pt-3 border-t border-line">
          <span className="font-medium">Gesamt</span>
          <span className="font-mono text-tanLight">{(order.total_cents / 100).toFixed(2)} €</span>
        </div>
      </div>

      <Link href="/shop" className="font-mono text-xs text-muted hover:text-tanLight">
        ← Zurück zur Kollektion
      </Link>
    </main>
  );
}
