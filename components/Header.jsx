"use client";

import { useState } from "react";
import Link from "next/link";
import { theme as c } from "@/lib/theme";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-30"
      style={{ background: c.bg, borderBottom: `1px solid ${c.line}` }}
    >
      <div className="grid grid-cols-3 items-center px-6 md:px-14 py-4">
        {/* Links: Navigation am Desktop, Hamburger-Button am Handy */}
        <div className="flex items-center">
          <nav
            className="hidden md:flex gap-8 items-center font-mono"
            style={{ fontSize: "15px", letterSpacing: "0.03em", color: c.ink }}
          >
            <a href="/#handwerk" className="hover:opacity-70">HANDWERK</a>
            <Link href="/shop" className="hover:opacity-70">SHOP</Link>
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col justify-center gap-1.5 w-6 h-6"
            aria-label="Menü öffnen"
            aria-expanded={menuOpen}
          >
            <span style={{ width: "22px", height: "1.5px", background: c.ink, display: "block" }} />
            <span style={{ width: "22px", height: "1.5px", background: c.ink, display: "block" }} />
          </button>
        </div>

        <div className="flex justify-center">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Schrotteis Gwandlstubn" style={{ height: "58px", width: "auto", display: "block" }} />
          </Link>
        </div>

        {/* Rechts: nur Symbole, kein Text-Label mehr (weder mobil noch am Desktop) */}
        <div className="flex items-center justify-end gap-5">
          <a
            href="https://instagram.com/schrotteis_gwandlstubn"
            className="hover:opacity-70"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.3" cy="6.7" r="1.1" fill={c.ink} stroke="none" />
            </svg>
          </a>
          <a href="mailto:info@schrotteis-gwandlstubn.at" className="hover:opacity-70" aria-label="E-Mail">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth="1.6">
              <rect x="3" y="5" width="18" height="14" rx="2.5" />
              <path d="M4 6.5l8 6.5 8-6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>

      {/* Mobiles Dropdown-Menü — nur sichtbar, wenn geöffnet */}
      {menuOpen && (
        <nav
          className="md:hidden flex flex-col px-6 py-5 gap-4 font-mono"
          style={{ borderTop: `1px solid ${c.line}`, fontSize: "15px", letterSpacing: "0.03em", color: c.ink }}
        >
          <a href="/#handwerk" onClick={() => setMenuOpen(false)} className="hover:opacity-70">HANDWERK</a>
          <Link href="/shop" onClick={() => setMenuOpen(false)} className="hover:opacity-70">SHOP</Link>
        </nav>
      )}
    </header>
  );
}
