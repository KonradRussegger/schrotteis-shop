import LegalNotice from "@/components/LegalNotice";

export default function AGBPage() {
  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>
      <LegalNotice />

      <div className="text-sm leading-relaxed space-y-6 text-cream">
        <section>
          <h2 className="font-display text-lg mb-2">1. Geltungsbereich</h2>
          <p className="text-muted">
            Diese AGB gelten für alle Bestellungen über den Onlineshop von
            Schrotteis Gwandlstubn, Matthäus Auer, Schratten 4, 5441 Abtenau.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">2. Vertragsabschluss</h2>
          <p className="text-muted">
            [Platzhalter — Ablauf von Bestellung, Zahlungsbestätigung durch
            Mollie und Vertragszustandekommen konkret beschreiben]
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">3. Preise & Zahlung</h2>
          <p className="text-muted">
            Alle Preise verstehen sich in Euro inkl. der gesetzlichen
            Umsatzsteuer. Die Zahlung erfolgt über den Zahlungsdienstleister
            Mollie per Kreditkarte, Apple Pay, Google Pay oder PayPal.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">4. Versand</h2>
          <p className="text-muted">
            [Platzhalter — Versandkosten, Liefergebiete, Lieferzeiten
            ergänzen]
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">5. Gewährleistung</h2>
          <p className="text-muted">
            Es gelten die gesetzlichen Gewährleistungsbestimmungen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">6. Widerrufsrecht</h2>
          <p className="text-muted">
            Es gilt das gesetzliche Widerrufsrecht — Details siehe eigene
            Widerrufsbelehrung.
          </p>
        </section>
      </div>
    </main>
  );
}
