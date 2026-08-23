import LegalNotice from "@/components/LegalNotice";

export default function AGBPage() {
  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>
      <LegalNotice />

      <div className="text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="font-display text-lg mb-2">1. Geltungsbereich</h2>
          <p className="site-muted">
            Diese AGB gelten für alle Bestellungen über den Onlineshop von
            Schrotteis Gwandlstubn, Matthäus Auer, Schratten 4, 5441 Abtenau.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">2. Vertragsabschluss</h2>
          <p className="site-muted">
            Die Darstellung der Produkte im Onlineshop der Gwandlstubn stellt
            kein rechtlich bindendes Angebot, sondern eine unverbindliche
            Aufforderung zur Bestellung dar.
          </p>
          <p className="site-muted mt-3">
            Durch Auswahl der gewünschten Artikel und Ablegen in den
            Warenkorb sowie durch Anklicken des Bestellbuttons am Ende des
            Bestellvorgangs gibt der Kunde ein verbindliches Angebot zum
            Abschluss eines Kaufvertrags ab.
          </p>
          <p className="site-muted mt-3">
            Unmittelbar nach Absenden der Bestellung erhält der Kunde eine
            automatische E-Mail über den Eingang seiner Bestellung. Diese
            Eingangsbestätigung stellt noch keine Annahme des
            Vertragsangebots dar, sondern dient lediglich der Information des
            Kunden über den Eingang der Bestellung.
          </p>
          <p className="site-muted mt-3">
            Die Zahlung erfolgt über den Zahlungsdienstleister Mollie B.V.
            Der Kaufvertrag kommt erst durch den Versand der bestellten Ware
            zustande. Dies wird dem Kunden durch eine Versandbestätigung per
            E-Mail mit beigefügter Rechnung mitgeteilt.
          </p>
          <p className="site-muted mt-3">
            Vertragspartner ist Matthäus Auer.
          </p>
          <p className="site-muted mt-3">
            Es gelten die gesetzlichen Bestimmungen zum
            Verbraucherrücktrittsrecht (Fern- und Auswärtsgeschäfte-Gesetz,
            FAGG); siehe hierzu die gesonderte Widerrufsbelehrung.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">3. Preise & Zahlung</h2>
          <p className="site-muted">
            Alle Preise verstehen sich in Euro inkl. der gesetzlichen
            Umsatzsteuer. Die Zahlung erfolgt über den Zahlungsdienstleister
            Mollie per Kreditkarte, Apple Pay, Google Pay oder PayPal.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">4. Versand</h2>
          <p className="site-muted">
            [Platzhalter — Versandkosten, Liefergebiete, Lieferzeiten
            ergänzen]
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">5. Gewährleistung</h2>
          <p className="site-muted">
            Es gelten die gesetzlichen Gewährleistungsbestimmungen.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">6. Widerrufsrecht</h2>
          <p className="site-muted">
            Es gilt das gesetzliche Widerrufsrecht — Details siehe eigene
            Widerrufsbelehrung.
          </p>
        </section>
      </div>
    </main>
  );
}
