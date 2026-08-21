import Link from "next/link";
import { theme as c } from "@/lib/theme";

export default function Footer() {
  return (
    <footer className="px-6 md:px-14 py-10 mt-10" style={{ borderTop: `1px solid ${c.line}` }}>
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div>
          <span className="font-display" style={{ fontSize: "16px", color: c.ink }}>
            Schrotteis Gwandlstubn
          </span>
          <p className="mt-1.5" style={{ color: c.muted, fontSize: "12px" }}>
            Matthäus Auer · Schratten 4 · 5441 Abtenau
          </p>
          <p style={{ color: c.muted, fontSize: "12px" }}>info@schrotteis-gwandlstubn.at</p>
        </div>
        <div className="flex gap-7 font-mono" style={{ fontSize: "11px", color: c.muted }}>
          <Link href="/impressum" className="hover:opacity-70">Impressum</Link>
          <Link href="/agb" className="hover:opacity-70">AGB</Link>
          <Link href="/widerruf" className="hover:opacity-70">Widerrufsrecht</Link>
          <Link href="/datenschutz" className="hover:opacity-70">Datenschutz</Link>
        </div>
      </div>
    </footer>
  );
}
