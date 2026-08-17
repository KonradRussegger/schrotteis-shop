# Schrotteis Gwandlstuben — Shop

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

- **Produkt-Anlegen-Formular** (`/admin/produkte/neu`): Modellname, Kategorie, Beschreibung, Material, Maße, Preis, beliebig viele Farbvarianten mit je eigenem Lagerbestand und Foto-Upload (Fotos landen direkt in Supabase Storage)

## Was als Nächstes fehlt (bewusst noch offen)

- Eigenes Hero-Video (`public/hero.mp4`) und echte Produktfotos
- Bearbeiten/Löschen bestehender Produkte (aktuell nur Anlegen)
- "Als versendet markieren"-Funktion (Server Action)
- Mehrere Produkte in einem Warenkorb (aktuell: 1 Variante pro Bestellung, MVP)
- E-Mail-Bestätigung an Kund:innen nach Bestellung
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
