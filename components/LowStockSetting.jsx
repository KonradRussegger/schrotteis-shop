"use client";

import { useState } from "react";

export default function LowStockSetting({ initialThreshold }) {
  const [threshold, setThreshold] = useState(String(initialThreshold));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/einstellungen", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lowStockThreshold: Number(threshold) || 0 }),
    });

    setSaving(false);
    setSaved(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div>
        <label className="font-mono text-xs text-muted block mb-1.5">
          Ab wie vielen Stück "Nur noch X verfügbar" anzeigen?
        </label>
        <input
          type="number"
          min="0"
          className="w-28 bg-card border border-line rounded-sm px-3 py-2 text-sm"
          value={threshold}
          onChange={(e) => setThreshold(e.target.value)}
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="px-5 py-2 rounded-sm bg-tan text-bg font-mono text-xs font-medium h-[38px]"
      >
        {saving ? "…" : "Speichern"}
      </button>
      {saved && <span className="font-mono text-xs text-tanLight self-center">Gespeichert.</span>}
    </form>
  );
}
