"use client";

import { useState } from "react";

// Einfacher Foto-Slider für Werkstatt-/Produktbilder. Bewusst ohne
// Auto-Rotation gebaut — bei Handwerksbildern will man idR selbst
// durchklicken, statt dass Bilder wegspringen, während man hinschaut.
export default function PhotoSlider({ images = [] }) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    // Platzhalter, solange keine echten Fotos hinterlegt sind
    images = Array.from({ length: 5 }).map((_, i) => ({
      src: null,
      alt: `Werkstattfoto ${i + 1} — folgt`,
    }));
  }

  const current = images[index];

  return (
    <div className="w-full">
      <div className="relative w-full aspect-[16/10] rounded-sm overflow-hidden bg-card flex items-center justify-center">
        {current.src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current.src} alt={current.alt} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-muted text-xs tracking-wide">
            {current.alt}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
          className="font-mono text-xs text-muted hover:text-tanLight"
          aria-label="Vorheriges Foto"
        >
          ← Zurück
        </button>
        <span className="font-mono text-xs text-muted">
          {index + 1} / {images.length}
        </span>
        <button
          onClick={() => setIndex((i) => (i + 1) % images.length)}
          className="font-mono text-xs text-muted hover:text-tanLight"
          aria-label="Nächstes Foto"
        >
          Weiter →
        </button>
      </div>
    </div>
  );
}
