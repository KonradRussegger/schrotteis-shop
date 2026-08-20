# Schrotteis Gwandlstubn — Shop

Projektgerüst: Next.js (App Router) + Tailwind + Supabase + Mollie + sevDesk.

## Was schon steht

- **Design**: Espresso-Leder-Farbwelt aus dem Prototyp (Sattelnaht-Divider als Signature-Element), Fraunces/Work Sans/IBM Plex Mono
- **Startseite**: Video-Hero (Logo/Headline über Video, `public/hero.mp4` noch zu ergänzen) → Story-Text → Handwerksprozess → Foto-Slider → CTA zum Shop
- Shop-Katalog (`/shop`) + Produktdetail (`/shop/[slug]`)
- Checkout-Formular (`/checkout`) → API-Route erstellt Bestellung + Mollie-Zahlung
- Mollie-Webhook (`/api/webhooks/mollie`): prüft Zahlungsstatus, reduziert Lager, erstellt sevDesk-Rechnung
- Admin-Bereich (`/admin`, passwortgeschützt): Produktübersicht + Bestell-/Packliste (`/admin/orders`)
- Supabase-Schema (`supabase/schema.sql`): Tabellen `categories`, `products`, `product_variants` (Farben, je mit eigenem Lager & beliebig vielen Fotos), `orders`
- **Kategorien** (`/admin/kategorien`): im Admin erweiterbar, Start-Kategorien Handtaschen/Rucksäcke/Federpennal sind im Schema vorbelegt
- **Farbvarianten**: pro Produkt beliebig viele Farben, jede mit eigenem Lagerbestand und eigener (nicht in der Anzahl begrenzter) Foto-Galerie — im Shop per Farb-Buttons auf der Produktseite auswählbar
- **Rechtstexte** (`/impressum`, `/agb`, `/widerruf`, `/datenschutz`): Struktur-Entwürfe mit den echten Geschäftsdaten (Matthäus Auer, Schratten 4, 5441 Abtenau) — **nicht rechtsverbindlich**, jede Seite trägt einen deutlich sichtbaren Hinweis dazu. Vor Veröffentlichung durch Anwalt/WKO/Generator prüfen bzw. erstellen lassen.

- **Produkt-Anlegen-Formular** (`/admin/produkte/neu`): Modellname, Kategorie, Beschreibung, Material, Maße, Preis, optionaler Ursprungspreis (Rabatt-Anzeige), "Neu"-Markierung, beliebig viele Farbvarianten mit je eigenem Lagerbestand und Foto-Upload (Fotos landen direkt in Supabase Storage, Reihenfolge per Pfeile änderbar)
- **Design**: helles Espresso-Leder-Farbschema (Kundenseiten + Admin einheitlich), eigenes Logo, Instagram/E-Mail im Header
- **Abholung/Versand** im Checkout, Versandkosten nach Land im Admin konfigurierbar (`/admin/einstellungen`)
- **Niedriger Lagerbestand**: einstellbare Schwelle, zeigt "Nur noch X Stück" im Shop
- **Bestellabwicklung**: "Als versendet/abgeholt markieren" setzt den Status, E-Mail-Entwurf per Mailto-Link (Übergangslösung bis Resend mit eigener Domain eingerichtet ist)
- **Rabattcodes** (`/admin/rabattcodes`): Prozent oder Fixbetrag, optionaler Gültigkeitszeitraum, aktivierbar/deaktivierbar
- **Geschenkgutscheine** (`/gutschein` zum Kauf, `/admin/gutscheine` zur Verwaltung): vereinfachtes Modell — kein Restguthaben, ein Gutschein wird beim Einlösen komplett verbraucht ("alles oder nichts"), auch wenn die Bestellung kleiner ist als der Gutscheinwert. Gutschein-Kauf läuft über denselben Mollie-Checkout wie Produkte. Rabattcode und Gutschein teilen sich dasselbe Eingabefeld im Checkout.

## Was als Nächstes fehlt (bewusst noch offen)

- Eigenes Hero-Video (`public/hero.mp4`) und echte Produktfotos
- Automatischer E-Mail-Versand über Resend (braucht verifizierte Domain, siehe `components/OrderActions.jsx` und `components/VoucherEmailButton.jsx`)
- sevDesk-Anbindung: Code steht, aber pausiert (kein API-Token hinterlegt)
- Grafisch gestaltete Gutschein-Vorlage (PDF/Bild) statt reiner Code-Anzeige — aktuell manuell vorstellbar, sobald gewünscht
- Mehrere Produkte in einem Warenkorb (aktuell: 1 Variante pro Bestellung, MVP)
- Rechtstexte final durch Anwalt/WKO/Generator freigeben lassen

## Setup

1. `npm install`
2. `.env.example` nach `.env.local` kopieren und ausfüllen (Supabase, Mollie, sevDesk, Admin-Login)
3. `supabase/schema.sql` im Supabase SQL Editor ausführen
4. In Supabase unter **Storage** einen neuen Bucket anlegen: Name `product-images`, **Public bucket** aktivieren (sonst funktioniert der Foto-Upload im Admin nicht)
5. `npm run dev` — lokal unter http://localhost:3000

## Deployment

1. Projekt zu GitHub pushen
2. Bei Vercel importieren (kostenlose `.vercel.app`-Subdomain zum Testen)
3. Umgebungsvariablen aus `.env.local` in den Vercel-Projekteinstellungen hinterlegen
4. Domain (IONOS) später per DNS auf Vercel verweisen, sobald bereit
