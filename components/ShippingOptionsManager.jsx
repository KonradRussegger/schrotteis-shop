"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ShippingOptionsManager({ initialOptions }) {
  const router = useRouter();
  const [options, setOptions] = useState(initialOptions);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newCost, setNewCost] = useState("");
  const [error, setError] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const inputClass =
    "w-full bg-card border border-line rounded-sm px-3 py-2 text-sm text-cream";

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    const shippingCostCents = Math.round(parseFloat(newCost.replace(",", ".")) * 100);

    const res = await fetch("/api/admin/versandoptionen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryCode: newCode, countryName: newName, shippingCostCents }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Konnte nicht angelegt werden.");
      return;
    }

    const created = await res.json();
    setOptions((prev) => [...prev, created]);
    setNewCode("");
    setNewName("");
    setNewCost("");
    router.refresh();
  }

  async function handleUpdateCost(option, newCostEuro) {
    setSavingId(option.id);
    const shippingCostCents = Math.round(parseFloat(newCostEuro.replace(",", ".")) * 100);

    await fetch(`/api/admin/versandoptionen/${option.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ countryName: option.country_name, shippingCostCents }),
    });

    setOptions((prev) =>
      prev.map((o) => (o.id === option.id ? { ...o, shipping_cost_cents: shippingCostCents } : o))
    );
    setSavingId(null);
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Dieses Land wirklich entfernen?")) return;
    await fetch(`/api/admin/versandoptionen/${id}`, { method: "DELETE" });
    setOptions((prev) => prev.filter((o) => o.id !== id));
    router.refresh();
  }

  return (
    <div>
      <p className="text-muted text-sm mb-6">
        Diese Länder erscheinen im Checkout als Auswahl, sobald "Versand" gewählt wird.
        Bei "Abholung" fallen nie Kosten an.
      </p>

      <div className="space-y-3 mb-8">
        {options.map((o) => (
          <div key={o.id} className="flex items-center gap-3 border border-line rounded-sm px-4 py-3">
            <span className="font-mono text-xs text-muted w-10">{o.country_code}</span>
            <span className="flex-1 text-sm">{o.country_name}</span>
            <input
              type="text"
              defaultValue={(o.shipping_cost_cents / 100).toFixed(2).replace(".", ",")}
              onBlur={(e) => handleUpdateCost(o, e.target.value)}
              className="w-24 bg-bg border border-line rounded-sm px-2 py-1.5 text-sm text-right"
            />
            <span className="font-mono text-xs text-muted">€</span>
            <button
              type="button"
              onClick={() => handleDelete(o.id)}
              className="font-mono text-xs text-muted hover:text-red-400 ml-2"
            >
              Entfernen
            </button>
            {savingId === o.id && <span className="font-mono text-[10px] text-muted">…</span>}
          </div>
        ))}
      </div>

      <h2 className="font-display text-lg font-medium mb-4">Neues Land hinzufügen</h2>
      <form onSubmit={handleAdd} className="flex items-end gap-3">
        <div className="w-20">
          <label className="font-mono text-xs text-muted block mb-1.5">Kürzel</label>
          <input
            className={inputClass}
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            placeholder="DE"
            maxLength={2}
            required
          />
        </div>
        <div className="flex-1">
          <label className="font-mono text-xs text-muted block mb-1.5">Land</label>
          <input
            className={inputClass}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Deutschland"
            required
          />
        </div>
        <div className="w-28">
          <label className="font-mono text-xs text-muted block mb-1.5">Kosten (€)</label>
          <input
            className={inputClass}
            value={newCost}
            onChange={(e) => setNewCost(e.target.value)}
            placeholder="12,00"
            required
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 rounded-sm bg-tan text-bg font-mono text-xs font-medium h-[38px]"
        >
          Hinzufügen
        </button>
      </form>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}
