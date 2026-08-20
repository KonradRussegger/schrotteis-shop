"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DiscountCodesManager({ initialCodes }) {
  const router = useRouter();
  const [codes, setCodes] = useState(initialCodes);
  const [code, setCode] = useState("");
  const [type, setType] = useState("percent");
  const [value, setValue] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const inputClass = "w-full bg-card border border-line rounded-sm px-3 py-2 text-sm";
  const labelClass = "font-mono text-xs text-muted block mb-1.5";

  async function handleAdd(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const discountValue = type === "percent" ? Number(value) : Math.round(parseFloat(value.replace(",", ".")) * 100);

    const res = await fetch("/api/admin/rabattcodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        discountType: type,
        discountValue,
        validFrom: validFrom || null,
        validUntil: validUntil || null,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Konnte nicht angelegt werden.");
      setSaving(false);
      return;
    }

    const created = await res.json();
    setCodes((prev) => [created, ...prev]);
    setCode("");
    setValue("");
    setValidFrom("");
    setValidUntil("");
    setSaving(false);
    router.refresh();
  }

  async function toggleActive(c) {
    await fetch(`/api/admin/rabattcodes/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !c.is_active }),
    });
    setCodes((prev) => prev.map((x) => (x.id === c.id ? { ...x, is_active: !x.is_active } : x)));
    router.refresh();
  }

  async function handleDelete(id) {
    if (!confirm("Diesen Rabattcode wirklich löschen?")) return;
    await fetch(`/api/admin/rabattcodes/${id}`, { method: "DELETE" });
    setCodes((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <div>
      <p className="text-muted text-sm mb-6">
        Ein Code kann bei Bestellungen im Checkout eingegeben werden. Bei "Zeitraum" ohne Angabe gilt der Code
        zeitlich unbegrenzt, solange er aktiv ist.
      </p>

      <div className="space-y-3 mb-8">
        {codes.map((c) => {
          const now = new Date();
          const expired = c.valid_until && new Date(c.valid_until) < now;
          const notYetValid = c.valid_from && new Date(c.valid_from) > now;
          return (
            <div key={c.id} className="flex items-center gap-3 border border-line rounded-sm px-4 py-3">
              <span className="font-mono text-sm flex-1">{c.code}</span>
              <span className="font-mono text-xs text-muted">
                {c.discount_type === "percent" ? `-${c.discount_value}%` : `-${(c.discount_value / 100).toFixed(2)} €`}
              </span>
              <span className="font-mono text-[10px] text-muted">
                {c.valid_from || c.valid_until
                  ? `${c.valid_from ? new Date(c.valid_from).toLocaleDateString("de-AT") : "…"} – ${c.valid_until ? new Date(c.valid_until).toLocaleDateString("de-AT") : "…"}`
                  : "unbegrenzt"}
              </span>
              {(expired || notYetValid) && (
                <span className="font-mono text-[10px] text-red-400">
                  {expired ? "abgelaufen" : "noch nicht gültig"}
                </span>
              )}
              <button
                type="button"
                onClick={() => toggleActive(c)}
                className={`font-mono text-[10px] px-2 py-1 rounded-sm ${c.is_active ? "bg-tan/20 text-tanLight" : "bg-line text-muted"}`}
              >
                {c.is_active ? "Aktiv" : "Deaktiviert"}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="font-mono text-xs text-muted hover:text-red-400"
              >
                Löschen
              </button>
            </div>
          );
        })}
        {codes.length === 0 && <p className="text-muted font-mono text-sm">Noch keine Rabattcodes angelegt.</p>}
      </div>

      <h2 className="font-display text-lg font-medium mb-4">Neuer Rabattcode</h2>
      <form onSubmit={handleAdd} className="space-y-4">
        <div>
          <label className={labelClass}>Code</label>
          <input className={inputClass} value={code} onChange={(e) => setCode(e.target.value)} placeholder="z. B. SOMMER20" required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Art</label>
            <select className={inputClass} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="percent">Prozent</option>
              <option value="fixed">Fixer Betrag (€)</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{type === "percent" ? "Prozent" : "Betrag (€)"}</label>
            <input
              className={inputClass}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "percent" ? "z. B. 20" : "z. B. 15,00"}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Gültig ab — optional</label>
            <input type="date" className={inputClass} value={validFrom} onChange={(e) => setValidFrom(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Gültig bis — optional</label>
            <input type="date" className={inputClass} value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-sm bg-tan text-bg font-mono text-xs font-medium"
        >
          {saving ? "…" : "Anlegen"}
        </button>
      </form>
    </div>
  );
}
