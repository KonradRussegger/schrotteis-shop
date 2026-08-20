"use client";

// Öffnet eine vorausgefüllte E-Mail mit dem Gutscheincode — Übergangslösung,
// bis automatischer Versand über Resend eingerichtet ist (braucht eine
// verifizierte Domain). Hinweis auf das "alles oder nichts"-Prinzip ist im
// Text enthalten, wie manuell in ein PDF/Bild eingebettet werden kann.
export default function VoucherEmailButton({ voucher }) {
  const subject = `Dein Geschenkgutschein von Schrotteis Gwandlstubn`;
  const body = `Hallo ${voucher.buyer_name},

vielen Dank für deinen Einkauf! Hier ist dein Geschenkgutschein:

Code: ${voucher.code}
Wert: ${(voucher.value_cents / 100).toFixed(2)} €

Der Gutschein gilt vollständig auf einmal beim Einkauf im Checkout-Formular — es gibt kein Restguthaben nach teilweiser Einlösung.
${voucher.recipient_note ? `\nNachricht: "${voucher.recipient_note}"\n` : ""}
Liebe Grüße
Schrotteis Gwandlstubn`;

  const mailto = `mailto:${voucher.buyer_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <a
      href={mailto}
      className="font-mono text-xs text-muted hover:text-tanLight border border-line rounded-sm px-4 py-2"
    >
      E-Mail vorbereiten
    </a>
  );
}
