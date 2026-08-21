import Link from "next/link";
import { theme as c } from "@/lib/theme";

// Fester Block am Ende des Shop-Rasters, im selben Stil wie eine
// Produktkarte, aber führt zum Gutschein-Kauf statt zu einem Produkt.
export default function VoucherCard() {
  return (
    <Link href="/gutschein" className="group block">
      <div
        className="relative aspect-[4/5] flex items-center justify-center"
        style={{ background: c.ink }}
      >
        <div className="text-center px-4">
          <span className="font-mono block mb-2" style={{ fontSize: "11px", color: c.tan, letterSpacing: "0.1em" }}>
            GESCHENKGUTSCHEIN
          </span>
          <span className="font-display block" style={{ fontSize: "20px", color: "#fff" }}>
            Für alle,
            <br />
            die's lieben
          </span>
        </div>
      </div>
      <p className="font-mono mt-2.5" style={{ fontSize: "13px", letterSpacing: "0.02em", color: c.ink }}>
        GESCHENKGUTSCHEIN
      </p>
      <p className="font-mono mt-1.5" style={{ fontSize: "15px", color: c.ink }}>ab 5,00 €</p>
    </Link>
  );
}
