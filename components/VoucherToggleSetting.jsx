"use client";

import { useState } from "react";

export default function VoucherToggleSetting({ initialEnabled }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleToggle() {
    const next = !enabled;
    setSaving(true);
    setSaved(false);

    await fetch("/api/admin/einstellungen", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voucherEnabled: next }),
    });

    setEnabled(next);
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleToggle}
        disabled={saving}
        className={`font-mono text-xs px-4 py-2 rounded-sm ${enabled ? "bg-tan/20 text-tanLight" : "bg-line text-muted"}`}
      >
        {saving ? "…" : enabled ? "Aktiv — im Shop sichtbar" : "Deaktiviert — im Shop ausgeblendet"}
      </button>
      {saved && <span className="font-mono text-xs text-tanLight">Gespeichert.</span>}
    </div>
  );
}
