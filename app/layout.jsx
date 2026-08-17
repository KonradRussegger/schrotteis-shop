import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Schrotteis Gwandlstuben",
  description:
    "Handgefertigte Lederwaren und Kostümteile aus Abtenau, Salzburg — Handwerk statt Massenware.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body className="bg-bg text-cream font-body">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
