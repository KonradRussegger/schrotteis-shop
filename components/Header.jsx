import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 md:px-12 py-6 sticky top-0 z-30 bg-bg border-b border-line">
      <Link href="/" className="font-display text-xl tracking-wide">
        Schrotteis Gwandlstuben
      </Link>
      <nav className="hidden md:flex gap-8 items-center font-mono text-[13px] text-muted">
        <Link href="/shop" className="hover:text-tanLight">Kollektion</Link>
        <Link href="/#handwerk" className="hover:text-tanLight">Handwerk</Link>
        <Link href="/#kontakt" className="hover:text-tanLight">Kontakt</Link>
      </nav>
      <Link
        href="/shop"
        className="px-4 py-2 rounded-sm bg-tan text-bg font-mono text-xs font-medium"
      >
        Zum Shop
      </Link>
    </header>
  );
}
