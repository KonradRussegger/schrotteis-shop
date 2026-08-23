"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Lädt die Seite nach kurzer Verzögerung automatisch neu (per URL mit
// hochgezähltem Zähler, damit force-dynamic-Seiten frische Daten holen).
// Wird nur gerendert, solange der Bestellstatus noch nicht final ist —
// verschwindet danach automatisch, weil die Elternseite dann den anderen
// Anzeige-Zweig rendert.
export default function AutoRefresh({ nextHref, delayMs = 2000 }) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace(nextHref);
    }, delayMs);
    return () => clearTimeout(timer);
  }, [nextHref, delayMs, router]);

  return null;
}
