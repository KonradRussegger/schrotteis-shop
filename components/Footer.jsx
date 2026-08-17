import Link from "next/link";

export default function Footer() {
  return (
    <footer id="kontakt" className="px-6 md:px-12 py-12 border-t border-line">
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span className="font-display text-lg">Schrotteis Gwandlstuben</span>
          <p className="text-muted text-sm mt-1.5">
            Matthäus Auer · Schratten 4 · 5441 Abtenau
          </p>
        </div>
        <div className="flex gap-8 font-mono text-xs text-muted">
          <Link href="/impressum" className="hover:text-tanLight">Impressum</Link>
          <Link href="/agb" className="hover:text-tanLight">AGB</Link>
          <Link href="/widerruf" className="hover:text-tanLight">Widerrufsrecht</Link>
          <Link href="/datenschutz" className="hover:text-tanLight">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
