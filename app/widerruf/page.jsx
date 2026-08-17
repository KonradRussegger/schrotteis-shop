import LegalNotice from "@/components/LegalNotice";

export default function WiderrufPage() {
  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">
        Widerrufsrecht
      </h1>
      <LegalNotice />

      <div className="text-sm leading-relaxed space-y-6 text-cream">
        <section>
          <h2 className="font-display text-lg mb-2">Widerrufsbelehrung</h2>
          <p className="text-muted">
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
            diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
            Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
            der nicht der Beförderer ist, die Waren in Besitz genommen haben.
          </p>
          <p className="text-muted mt-3">
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            <br />
            Matthäus Auer, Schrotteis Gwandlstuben, Schratten 4, 5441 Abtenau
            <br />
            [Platzhalter — Telefonnummer, E-Mail-Adresse ergänzen]
            <br />
            mittels einer eindeutigen Erklärung (z. B. per Post oder E-Mail)
            über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Folgen des Widerrufs</h2>
          <p className="text-muted">
            [Platzhalter — Rückerstattungsmodalitäten, Rücksendekosten,
            eventuelle Sonderregelungen bei Sonderanfertigungen (z. B.
            individuell angefertigte Kostümteile) ergänzen — bei
            maßgefertigten Einzelstücken kann das Widerrufsrecht unter
            Umständen eingeschränkt sein, das muss rechtlich geprüft werden]
          </p>
        </section>
      </div>
    </main>
  );
}
