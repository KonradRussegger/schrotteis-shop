import "./globals.css";

export const metadata = {
  title: "Schrotteis Gwandlstubn",
  description:
    "Handgefertigte Lederwaren und Kostümteile aus Abtenau, Salzburg — Handwerk statt Massenware.",
};

// Bewusst schlank: Header/Footer der Kundenseiten sitzen im Layout der
// (site)-Routengruppe, damit der Admin-Bereich sie NICHT bekommt.
export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="font-body">{children}</body>
    </html>
  );
}
