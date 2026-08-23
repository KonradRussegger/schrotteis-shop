export default function WiderrufPage() {
  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">
        Widerrufsrecht
      </h1>

      <div className="text-sm leading-relaxed space-y-6">
        <section>
          <h2 className="font-display text-lg mb-2">Widerrufsbelehrung</h2>
          <p className="site-muted">
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen
            diesen Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn
            Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter,
            der nicht der Beförderer ist, die Waren in Besitz genommen haben.
          </p>
          <p className="site-muted mt-3">
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns
            <br />
            Matthäus Auer, Schrotteis Gwandlstubn, Schratten 4, 5441 Abtenau
            <br />
            Telefon: +43 664 3869893
            <br />
            E-Mail: info@schrotteis-gwandlstubn.at
            <br />
            mittels einer eindeutigen Erklärung (z. B. per Post oder E-Mail)
            über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Folgen des Widerrufs</h2>
          <p className="site-muted">
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle
            Zahlungen, die wir von Ihnen erhalten haben, einschließlich der
            Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich
            daraus ergeben, dass Sie eine andere Art der Lieferung als die
            von uns angebotene, günstigste Standardlieferung gewählt haben),
            unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
            zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
            Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden
            wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen
            Transaktion eingesetzt haben, es sei denn, mit Ihnen wurde
            ausdrücklich etwas anderes vereinbart; in keinem Fall werden
            Ihnen wegen dieser Rückzahlung Entgelte berechnet.
          </p>
          <p className="site-muted mt-3">
            Wir können die Rückzahlung verweigern, bis wir die Waren wieder
            zurückerhalten haben oder bis Sie den Nachweis erbracht haben,
            dass Sie die Waren zurückgesandt haben, je nachdem, welches der
            frühere Zeitpunkt ist.
          </p>
          <p className="site-muted mt-3">
            Sie haben die Waren unverzüglich und in jedem Fall spätestens
            binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den
            Widerruf dieses Vertrags unterrichten, an uns zurückzusenden
            oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor
            Ablauf der Frist von vierzehn Tagen absenden.
          </p>
          <p className="mt-3">
            <strong>Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.</strong>
          </p>
          <p className="site-muted mt-3">
            Sie müssen für einen etwaigen Wertverlust der Waren nur
            aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der
            Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht
            notwendigen Umgang mit ihnen zurückzuführen ist.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">
            Ausschluss des Widerrufsrechts bei Sonderanfertigungen
          </h2>
          <p className="site-muted">
            Bei Waren, die nicht vorgefertigt sind und für deren Herstellung
            eine individuelle Auswahl oder Bestimmung durch Sie maßgeblich
            ist oder die eindeutig auf Ihre persönlichen Bedürfnisse
            zugeschnitten sind (z. B. individuell angefertigte oder nach Maß
            gefertigte Kostümteile), besteht <strong>kein</strong> Widerrufsrecht.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg mb-2">Muster-Widerrufsformular</h2>
          <p className="site-muted italic">
            (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses
            Formular aus und senden Sie es zurück.)
          </p>
          <div className="mt-4 p-5" style={{ border: "1px solid #E8E3DA" }}>
            <p className="mb-4">
              An: Matthäus Auer, Schrotteis Gwandlstubn, Schratten 4, 5441
              Abtenau, info@schrotteis-gwandlstubn.at
            </p>
            <p className="mb-4">
              Hiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen
              Vertrag über den Kauf der folgenden Waren:
            </p>
            <p className="mb-2">_________________________________________________</p>
            <p className="mb-4">Bestellt am: _______ / erhalten am: _______</p>
            <p className="mb-2">Name des/der Verbraucher(s):</p>
            <p className="mb-4">_________________________________________________</p>
            <p className="mb-2">Anschrift des/der Verbraucher(s):</p>
            <p className="mb-4">_________________________________________________</p>
            <p className="mb-2">
              Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
            </p>
            <p className="mb-4">_________________________________________________</p>
            <p>Datum: _______</p>
          </div>
        </section>
      </div>
    </main>
  );
}
