"use client";

import { useState } from "react";
import { theme as c } from "@/lib/theme";

const PRESETS = [5000, 10000, 15000, 20000]; // Cent

export default function GutscheinForm() {
  const [amountCents, setAmountCents] = useState(10000);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recipientNote, setRecipientNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const finalAmountCents = useCustom
    ? Math.round(parseFloat((customAmount || "0").replace(",", ".")) * 100)
    : amountCents;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!finalAmountCents || finalAmountCents < 500) {
      setError("Bitte einen Betrag von mindestens 5,00 € wählen.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/gutschein/kaufen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          valueCents: finalAmountCents,
          buyerName,
          buyerEmail,
          recipientNote,
        }),
      });

      if (!res.ok) throw new Error("Gutschein konnte nicht erstellt werden.");
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
    <main className="px-6 md:px-14 py-16 max-w-[480px] mx-auto">
      <h1 className="font-display font-medium mb-2" style={{ fontSize: "30px", color: c.ink }}>
        Geschenkgutschein
      </h1>
      <p style={{ color: c.muted, fontSize: "14px" }} className="mb-9">
        Der Gutschein wird per Code eingelöst — nach der Zahlung bekommst du ihn auf der nächsten Seite angezeigt.
        Hinweis: Der Gutschein gilt vollständig auf einmal ("alles oder nichts"), es gibt kein Restguthaben nach
        teilweiser Einlösung.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="font-mono block mb-2.5" style={labelStyle}>BETRAG</label>
          <div className="grid grid-cols-2 gap-3 mb-3">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setUseCustom(false);
                  setAmountCents(p);
                }}
                className="px-4 py-3 border font-mono"
                style={{
                  fontSize: "14px",
                  borderColor: !useCustom && amountCents === p ? c.ink : c.line,
                  color: !useCustom && amountCents === p ? c.ink : c.muted,
                }}
              >
                {(p / 100).toFixed(0)} €
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setUseCustom(true)}
            className="font-mono text-xs mb-2"
            style={{ color: useCustom ? c.ink : c.muted }}
          >
            Anderer Betrag
          </button>
          {useCustom && (
            <input
              className={inputClass}
              style={inputStyle}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="z. B. 75,00"
            />
          )}
        </div>

        <div>
          <label className="font-mono block mb-1.5" style={labelStyle}>DEIN NAME</label>
          <input className={inputClass} style={inputStyle} value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required />
        </div>

        <div>
          <label className="font-mono block mb-1.5" style={labelStyle}>DEINE E-MAIL</label>
          <input type="email" className={inputClass} style={inputStyle} value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} required />
        </div>

        <div>
          <label className="font-mono block mb-1.5" style={labelStyle}>NACHRICHT AN DIE BESCHENKTE PERSON — OPTIONAL</label>
          <textarea
            className={inputClass}
            style={inputStyle}
            rows={3}
            value={recipientNote}
            onChange={(e) => setRecipientNote(e.target.value)}
          />
        </div>

        {error && <p className="text-sm" style={{ color: "#B03A2C" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full font-mono py-4"
          style={{ fontSize: "14px", background: c.ink, color: "#fff", letterSpacing: "0.04em", opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "Wird weitergeleitet…" : `GUTSCHEIN ÜBER ${(finalAmountCents / 100).toFixed(2)} € KAUFEN`}
        </button>
      </form>
    </main>
  );
}
