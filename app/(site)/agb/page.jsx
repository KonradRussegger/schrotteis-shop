import { supabasePublic } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function getShippingOptions() {
  const supabase = supabasePublic();
  const { data } = await supabase
    .from("shipping_options")
    .select("*")
    .order("sort_order", { ascending: true });
  return data || [];
}

export default async function AGBPage() {
  const shippingOptions = await getShippingOptions();

  return (
    <main className="px-6 md:px-12 py-16 max-w-[680px] mx-auto">
      <h1 className="font-display text-3xl font-medium mb-8">
        Allgemeine Geschäftsbedingungen
      </h1>

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
          <p className="site-muted mb-3">
            Wir liefern in die unten angeführten Länder. Die jeweils
            aktuellen Versandkosten werden im Bestellprozess vor Abschluss
            der Bestellung angezeigt und sind zudem hier ersichtlich:
          </p>
          {shippingOptions.length > 0 && (
            <table style={{ width: "100%", borderCollapse: "collapse" }} className="mb-3">
              <tbody>
                {shippingOptions.map((o) => (
                  <tr key={o.country_code} style={{ borderBottom: "1px solid #E8E3DA" }}>
                    <td className="site-muted" style={{ padding: "6px 0" }}>{o.country_name}</td>
                    <td style={{ padding: "6px 0", textAlign: "right" }}>
                      {(o.shipping_cost_cents / 100).toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <p className="site-muted">
            Alternativ ist eine kostenlose Selbstabholung am Betriebsstandort
            in 5441 Abtenau möglich. Die Lieferzeit innerhalb Österreichs
            beträgt in der Regel 3–7 Werktage nach Zahlungseingang; bei
            individuell gefertigten Stücken kann sich die Lieferzeit
            entsprechend verlängern, worauf im Bestellprozess gesondert
            hingewiesen wird.
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
