"use client";

import { useState } from "react";
import { theme as c } from "@/lib/theme";

// Vereinfachtes Checkout-Formular für ein einzelnes Produkt (MVP).
export default function CheckoutForm({ variantId, shippingOptions }) {
  const [deliveryType, setDeliveryType] = useState("shipping"); // "shipping" | "pickup"
  const [countryCode, setCountryCode] = useState(shippingOptions[0]?.country_code || "");
  const [form, setForm] = useState({ name: "", email: "", street: "", zip: "", city: "" });
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selectedShipping = shippingOptions.find((o) => o.country_code === countryCode);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId,
          quantity: 1,
          deliveryType,
          customer: { name: form.name, email: form.email },
          shippingAddress:
            deliveryType === "shipping"
              ? { street: form.street, zip: form.zip, city: form.city, country: countryCode }
              : null,
          code: code.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Bestellung konnte nicht erstellt werden.");
      }
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const inputClass = "w-full px-4 py-3 text-sm";
  const inputStyle = { border: `1px solid ${c.line}`, background: c.bgAlt, color: c.ink };
  const labelStyle = { fontSize: "13px", color: c.muted };

  return (
    <main className="px-6 md:px-14 py-16 max-w-[460px] mx-auto">
      <h1 className="font-display font-medium mb-2" style={{ fontSize: "30px", color: c.ink }}>Bestellung abschließen</h1>
      <p style={{ color: c.muted, fontSize: "14px" }} className="mb-9">
        Auf der nächsten Seite bezahlst du sicher über Mollie.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-mono block mb-2.5" style={labelStyle}>LIEFERUNG</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryType("shipping")}
              className="px-4 py-3 border text-left font-mono"
              style={{ fontSize: "13px", borderColor: deliveryType === "shipping" ? c.ink : c.line, color: deliveryType === "shipping" ? c.ink : c.muted }}
            >
              Versand
              <br />
              <span style={{ fontSize: "11px" }}>
                {selectedShipping
                  ? selectedShipping.shipping_cost_cents > 0
                    ? `+ ${(selectedShipping.shipping_cost_cents / 100).toFixed(2)} €`
                    : "kostenlos"
                  : "Land wählen"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              className="px-4 py-3 border text-left font-mono"
              style={{ fontSize: "13px", borderColor: deliveryType === "pickup" ? c.ink : c.line, color: deliveryType === "pickup" ? c.ink : c.muted }}
            >
              Abholung
              <br />
              <span style={{ fontSize: "11px" }}>kostenlos, in Abtenau</span>
            </button>
          </div>
        </div>

        {deliveryType === "shipping" && (
          <div>
            <label className="font-mono block mb-1.5" style={labelStyle}>LAND</label>
            <select className={inputClass} style={inputStyle} value={countryCode} onChange={(e) => setCountryCode(e.target.value)} required>
              {shippingOptions.map((o) => (
                <option key={o.country_code} value={o.country_code}>
                  {o.country_name} — {(o.shipping_cost_cents / 100).toFixed(2)} €
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="font-mono block mb-1.5" style={labelStyle}>NAME</label>
          <input className={inputClass} style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>

        <div>
          <label className="font-mono block mb-1.5" style={labelStyle}>E-MAIL</label>
          <input type="email" className={inputClass} style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        </div>

        {deliveryType === "shipping" && (
          <>
            <div>
              <label className="font-mono block mb-1.5" style={labelStyle}>STRASSE &amp; HAUSNUMMER</label>
              <input className={inputClass} style={inputStyle} value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono block mb-1.5" style={labelStyle}>PLZ</label>
                <input className={inputClass} style={inputStyle} value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required />
              </div>
              <div>
                <label className="font-mono block mb-1.5" style={labelStyle}>ORT</label>
                <input className={inputClass} style={inputStyle} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="font-mono block mb-1.5" style={labelStyle}>GUTSCHEIN- ODER RABATTCODE — OPTIONAL</label>
          <input
            className={inputClass}
            style={inputStyle}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="z. B. SOMMER20"
          />
        </div>

        {error && <p className="text-sm" style={{ color: "#B03A2C" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-mono py-4 mt-2"
          style={{ fontSize: "14px", background: c.ink, color: "#fff", letterSpacing: "0.04em", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Wird weitergeleitet…" : "WEITER ZUR ZAHLUNG"}
        </button>
      </form>
    </main>
  );
}
