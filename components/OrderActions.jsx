"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Öffnet eine vorausgefüllte E-Mail (über das Standard-Mailprogramm) mit
// Bestätigungstext — Übergangslösung, bis automatischer Versand über Resend
// eingerichtet ist (braucht eine verifizierte Domain).
function buildConfirmationMailto(order, isPickup) {
  const subject = `Deine Bestellung bei Schrotteis Gwandlstubn (${order.id.slice(0, 8)})`;
  const itemsText = order.items.map((i) => `- ${i.qty}x ${i.product_name} (${i.color_name})`).join("\n");
  const body = isPickup
    ? `Hallo ${order.customer_name},\n\nvielen Dank für deine Bestellung! Sie ist bereit zur Abholung in Abtenau.\n\n${itemsText}\n\nGesamt: ${(order.total_cents / 100).toFixed(2)} €\n\nBitte melde dich kurz, wann es dir passt.\n\nLiebe Grüße\nSchrotteis Gwandlstubn`
    : `Hallo ${order.customer_name},\n\nvielen Dank für deine Bestellung! Sie ist unterwegs zu dir.\n\n${itemsText}\n\nGesamt: ${(order.total_cents / 100).toFixed(2)} €\n\nLiebe Grüße\nSchrotteis Gwandlstubn`;

  return `mailto:${order.customer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function OrderActions({ order, isPickup }) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function markShipped() {
    setUpdating(true);
    await fetch(`/api/admin/orders/${order.id}`, { method: "PUT" });
    router.refresh();
  }

  return (
    <div className="flex gap-3">
      <a
        href={buildConfirmationMailto(order, isPickup)}
        className="font-mono text-xs text-muted hover:text-tanLight border border-line rounded-sm px-4 py-2"
      >
        E-Mail vorbereiten
      </a>
      <button
        onClick={markShipped}
        disabled={updating}
        className="font-mono text-xs text-bg bg-tan rounded-sm px-4 py-2 disabled:opacity-60"
      >
        {updating ? "…" : `Als ${isPickup ? "abgeholt" : "versendet"} markieren`}
      </button>
    </div>
  );
}
