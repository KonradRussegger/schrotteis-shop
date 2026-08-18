"use client";

import { useState } from "react";

// Formatiert die Lieferadresse als 3 Zeilen (Name / Straße / PLZ Ort) zum
// direkten Einfügen auf einen Versandaufkleber o.ä.
export default function CopyAddressButton({ name, street, zip, city, country }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const text = `${name}\n${street}\n${zip} ${city}\n${country}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Zwischenablage evtl. ohne Berechtigung — still ignorieren
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="font-mono text-xs text-muted hover:text-tanLight border border-line rounded-sm px-3 py-1.5"
    >
      {copied ? "Kopiert ✓" : "Adresse kopieren"}
    </button>
  );
}
