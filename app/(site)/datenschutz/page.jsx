import LegalNotice from "@/components/LegalNotice";

export default function DatenschutzPage() {
  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">
        Datenschutzerklärung
      </h1>
      <LegalNotice />

      <div className="text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="font-display text-lg mb-2">Verantwortlicher</h2>
          <p className="site-muted">
            Matthäus Auer, Schrotteis Gwandlstubn, Schratten 4, 5441 Abtenau
            <br />
            info@schrotteis-gwandlstubn.at
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Welche Daten verarbeitet werden</h2>
          <p className="site-muted">
            Bei einer Bestellung: Name, E-Mail-Adresse, Lieferadresse.
            Zahlungsdaten werden ausschließlich vom Zahlungsdienstleister
            Mollie verarbeitet und laufen nicht über unsere eigenen Server.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Eingesetzte Dienstleister</h2>
          <ul className="site-muted list-disc pl-5 space-y-1">
            <li>Mollie B.V. (Zahlungsabwicklung)</li>
            <li>Supabase (Datenbank & Bildspeicher)</li>
            <li>Vercel (Hosting)</li>
            <li>sevDesk (Rechnungsstellung)</li>
          </ul>
          <p className="site-muted mt-3">
            [Platzhalter — für jeden Dienstleister Serverstandort,
            Auftragsverarbeitungsvertrag und Rechtsgrundlage der Übermittlung
            ergänzen, insbesondere bei Verarbeitung außerhalb der EU]
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Ihre Rechte</h2>
          <p className="site-muted">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit sowie
            Widerspruch. Zuständige Aufsichtsbehörde in Österreich ist die
            Datenschutzbehörde (www.dsb.gv.at).
          </p>
        </section>
      </div>
    </main>
  );
}
