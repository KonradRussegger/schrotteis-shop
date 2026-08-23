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
  const [trackingNumber, setTrackingNumber] = useState("");
  const [invoiceFile, setInvoiceFile] = useState(null);
  const [uploadingInvoice, setUploadingInvoice] = useState(false);
  const [invoiceUploaded, setInvoiceUploaded] = useState(Boolean(order.invoice_pdf_url));
  const [error, setError] = useState(null);

  async function handleInvoiceChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Bitte eine PDF-Datei auswählen.");
      return;
    }

    setInvoiceFile(file);
    setError(null);
    setUploadingInvoice(true);

    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`/api/admin/orders/${order.id}/rechnung`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Rechnung konnte nicht hochgeladen werden.");
      setUploadingInvoice(false);
      return;
    }

    setInvoiceUploaded(true);
    setUploadingInvoice(false);
  }

  async function markShipped() {
    setUpdating(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingNumber: trackingNumber.trim() || undefined }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-2">
        {!isPickup && (
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Sendungsnummer — optional"
            className="font-mono text-xs bg-card border border-line rounded-sm px-3 py-2 w-48"
          />
        )}

        <label className="font-mono text-xs text-muted border border-line rounded-sm px-3 py-2 cursor-pointer">
          {uploadingInvoice
            ? "Lädt hoch…"
            : invoiceUploaded
            ? "Rechnung ersetzen (PDF)"
            : "Rechnung hochladen (PDF)"}
          <input type="file" accept="application/pdf" onChange={handleInvoiceChange} className="hidden" />
        </label>
        {invoiceUploaded && !uploadingInvoice && (
          <span className="font-mono text-xs text-tanLight">Rechnung hinterlegt ✓</span>
        )}

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
      {error && <p className="text-xs text-red-400">{error}</p>}
      {!invoiceUploaded && (
        <p className="font-mono text-xs text-muted">
          Ohne hochgeladene Rechnung geht die Versandmail ohne PDF-Anhang raus.
        </p>
      )}
    </div>
  );
}
