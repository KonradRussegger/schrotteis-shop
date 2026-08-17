"use client";

import { useState } from "react";

// Zeigt ein Produkt mit Farbauswahl. Jede Farbvariante hat ihre eigenen
// Fotos (beliebig viele) und ihren eigenen Lagerbestand.
export default function ProductDetail({ product }) {
  const variants = product.product_variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id);
  const [photoIndex, setPhotoIndex] = useState(0);

  const variant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const images = variant?.images?.length ? variant.images : [];

  function selectVariant(id) {
    setSelectedVariantId(id);
    setPhotoIndex(0); // beim Farbwechsel wieder beim ersten Foto starten
  }

  return (
    <main className="px-6 md:px-12 py-16 max-w-[720px] mx-auto">
      {/* Foto-Galerie der gewählten Farbe */}
      <div className="w-full aspect-[4/3] rounded-sm bg-card flex items-center justify-center mb-3 overflow-hidden">
        {images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[photoIndex]} alt={`${product.name} – ${variant?.color_name}`} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-muted text-xs tracking-wide">FOTO FOLGT</span>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 mb-8">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setPhotoIndex(i)}
              className={`w-14 h-14 rounded-sm overflow-hidden border ${
                i === photoIndex ? "border-tan" : "border-line"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <h1 className="font-display text-3xl font-medium mb-3">{product.name}</h1>
      <p className="text-muted leading-relaxed mb-5">{product.description}</p>
      {product.material && <p className="text-sm text-muted mb-1">Material: {product.material}</p>}
      {product.dimensions && <p className="text-sm text-muted mb-1">Maße: {product.dimensions}</p>}
      <p className="font-mono text-tanLight text-lg mt-4 mb-6">
        {(product.price_cents / 100).toFixed(2)} €
      </p>

      {/* Farbauswahl */}
      {variants.length > 0 && (
        <div className="mb-8">
          <p className="font-mono text-xs text-muted mb-2.5 tracking-wide">FARBE</p>
          <div className="flex gap-2 flex-wrap">
            {variants.map((v) => (
              <button
                key={v.id}
                onClick={() => selectVariant(v.id)}
                disabled={v.stock_quantity === 0}
                className={`px-4 py-2 rounded-sm font-mono text-xs border transition-colors ${
                  v.id === selectedVariantId
                    ? "border-tan text-tanLight"
                    : "border-line text-muted"
                } ${v.stock_quantity === 0 ? "opacity-40 line-through" : "hover:border-tan"}`}
              >
                {v.color_name}
              </button>
            ))}
          </div>
        </div>
      )}

      {variant && variant.stock_quantity > 0 ? (
        <a
          href={`/checkout?variant=${variant.id}`}
          className="inline-block px-7 py-3.5 rounded-sm bg-tan text-bg font-mono text-sm font-medium"
        >
          Zur Bestellung
        </a>
      ) : (
        <p className="font-mono text-muted text-sm">Diese Farbe ist ausverkauft</p>
      )}
    </main>
  );
}
