import LegalNotice from "@/components/LegalNotice";

export default function ImpressumPage() {
  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">Impressum</h1>
      <LegalNotice />

      <div className="text-sm leading-relaxed space-y-4 text-cream">
        <p>
          <strong>Angaben gemäß § 5 ECG, § 25 MedienG, § 63 GewO</strong>
        </p>
        <p>
          Matthäus Auer
          <br />
          Schrotteis Gwandlstubn
          <br />
          Schratten 4
          <br />
          5441 Abtenau
          <br />
          Österreich
        </p>

        <p>
          E-Mail: info@schrotteis-gwandlstubn.at
        </p>

        <p className="text-muted">
          [Platzhalter — noch zu ergänzen: Telefonnummer,
          Gewerbeberechtigung/-anschrift, GISA-Zahl, zuständige Gewerbebehörde,
          UID-Nummer, Mitgliedschaft bei der WKO Salzburg]
        </p>

        <p>
          <strong>Unternehmensgegenstand:</strong> Herstellung und Verkauf
          handgefertigter Lederwaren und Kostümteile (Fellausstattung)
        </p>

        <p>
          <strong>Anwendbare Rechtsvorschriften:</strong> Gewerbeordnung
          (www.ris.bka.gv.at)
        </p>

        <p>
          <strong>EU-Streitschlichtung:</strong> Verbraucher haben die
          Möglichkeit, Beschwerden an die Online-Streitbeilegungsplattform der
          EU zu richten: https://ec.europa.eu/consumers/odr/
        </p>
      </div>
    </main>
  );
}
