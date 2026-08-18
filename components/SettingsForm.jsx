"use client";

import { useState } from "react";

export default function SettingsForm({ initialShippingCents }) {
  const [shippingEuro, setShippingEuro] = useState(
    (initialShippingCents / 100).toFixed(2).replace(".", ",")
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);

    const shippingCents = Math.round(parseFloat(shippingEuro.replace(",", ".")) * 100);

    const res = await fetch("/api/admin/einstellungen", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shippingCostCents: shippingCents }),
    });

    if (!res.ok) {
      setError("Konnte nicht gespeichert werden.");
      setSaving(false);
      return;
    }

    setSaved(true);
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="font-mono text-xs text-muted block mb-1.5">
          Versandkosten (€)
        </label>
        <p className="text-muted text-xs mb-2">
          Wird bei der Option "Versand" im Checkout automatisch zum Gesamtpreis addiert. Bei "Abholung" fällt nichts an.
        </p>
        <input
          className="w-full bg-card border border-line rounded-sm px-3.5 py-2.5 text-sm text-cream"
          value={shippingEuro}
          onChange={(e) => setShippingEuro(e.target.value)}
          placeholder="z. B. 5,00"
        />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {saved && <p className="text-tanLight text-sm font-mono text-xs">Gespeichert.</p>}

      <button
        type="submit"
        disabled={saving}
        className="px-7 py-3.5 rounded-sm bg-tan text-bg font-mono text-sm font-medium"
      >
        {saving ? "Wird gespeichert…" : "Speichern"}
      </button>
    </form>
  );
}
