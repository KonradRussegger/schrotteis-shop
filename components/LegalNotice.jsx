import { theme as c } from "@/lib/theme";

export default function LegalNotice() {
  return (
    <div
      className="rounded-sm px-5 py-4 mb-10 font-mono text-xs leading-relaxed"
      style={{ border: `1px solid ${c.tan}`, background: c.card, color: c.tanDeep }}
    >
      ENTWURF — nicht rechtsverbindlich. Dieser Text ist eine strukturelle
      Vorlage mit den hinterlegten Geschäftsdaten und ersetzt keine rechtliche
      Prüfung. Vor Veröffentlichung durch einen Anwalt, die WKO oder einen
      geprüften Generator (z. B. e-recht24, adsimple) erstellen bzw. freigeben
      lassen.
    </div>
  );
}
