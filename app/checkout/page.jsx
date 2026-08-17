"use client";

import { useState } from "react";

// Vereinfachtes Checkout-Formular für ein einzelnes Produkt (MVP).
// Für einen echten Warenkorb mit mehreren Positionen müsste der State
// erweitert werden (z.B. über Kontext oder Query-Params mit mehreren IDs).
export default function CheckoutPage({ searchParams }) {
  const variantId = searchParams?.variant;
  const [form, setForm] = useState({
    name: "",
    email: "",
    street: "",
    zip: "",
    city: "",
    country: "AT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          customer: {
            name: form.name,
            email: form.email,
          },
          shippingAddress: {
            street: form.street,
            zip: form.zip,
            city: form.city,
            country: form.country,
          },
        }),
      });

      if (!res.ok) throw new Error("Bestellung konnte nicht erstellt werden.");
      const { checkoutUrl } = await res.json();
      window.location.href = checkoutUrl; // Weiterleitung zum Mollie-Checkout
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-card border border-line rounded-sm px-3.5 py-2.5 text-sm text-cream placeholder:text-muted focus:outline-none focus:border-tan";
  const labelClass = "font-mono text-xs text-muted block mb-1.5";

  return (
    <main className="px-6 md:px-12 py-16 max-w-[480px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-2">Bestellung abschließen</h1>
      <p className="text-muted text-sm mb-10">
        Auf der nächsten Seite bezahlst du sicher über Mollie.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Name</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>E-Mail</label>
          <input
            type="email"
            className={inputClass}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>

        <div>
          <label className={labelClass}>Straße &amp; Hausnummer</label>
          <input
            className={inputClass}
            value={form.street}
            onChange={(e) => setForm({ ...form, street: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>PLZ</label>
            <input
              className={inputClass}
              value={form.zip}
              onChange={(e) => setForm({ ...form, zip: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Ort</label>
            <input
              className={inputClass}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 px-7 py-3.5 rounded-sm bg-tan text-bg font-mono text-sm font-medium disabled:opacity-60"
        >
          {loading ? "Wird weitergeleitet…" : "Weiter zur Zahlung"}
        </button>
      </form>
    </main>
  );
}
