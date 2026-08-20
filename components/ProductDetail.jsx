"use client";

import { useState } from "react";
import { theme as c } from "@/lib/theme";

// Zeigt ein Produkt mit Farbauswahl. Jede Farbvariante hat ihre eigenen
// Fotos (beliebig viele) und ihren eigenen Lagerbestand.
export default function ProductDetail({ product, lowStockThreshold = 3 }) {
  const variants = product.product_variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id);
  const [photoIndex, setPhotoIndex] = useState(0);

  const variant = variants.find((v) => v.id === selectedVariantId) || variants[0];
  const images = variant?.images?.length ? variant.images : [];
  const hasDiscount = variant?.original_price_cents && variant.original_price_cents > variant.price_cents;
  const isLowStock = variant && variant.stock_quantity > 0 && variant.stock_quantity <= lowStockThreshold;

  function selectVariant(id) {
    setSelectedVariantId(id);
    setPhotoIndex(0); // beim Farbwechsel wieder beim ersten Foto starten
  }

  return (
    <main className="px-6 md:px-14 py-14 grid md:grid-cols-2 gap-12 max-w-[1000px] mx-auto">
      <div>
        <div className="aspect-[4/5] flex items-center justify-center overflow-hidden mb-3" style={{ background: c.card }}>
          {images.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[photoIndex]} alt={`${product.name} – ${variant?.color_name}`} className="w-full h-full object-cover" />
          ) : (
            <span className="font-mono text-xs" style={{ color: c.muted }}>FOTO FOLGT</span>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setPhotoIndex(i)}
                className="w-14 h-14 overflow-hidden border"
                style={{ borderColor: i === photoIndex ? c.ink : c.line }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="font-display font-medium mb-3" style={{ fontSize: "36px", color: c.ink }}>{product.name}</h1>
        <p style={{ color: c.muted, lineHeight: 1.6, fontSize: "16px" }} className="mb-6">{product.description}</p>
        {product.material && <p className="font-mono" style={{ fontSize: "14px", color: c.muted }}>Material: {product.material}</p>}
        {product.dimensions && <p className="font-mono mb-6" style={{ fontSize: "14px", color: c.muted }}>Maße: {product.dimensions}</p>}
        <div className="flex items-center gap-3 mb-2">
          {hasDiscount && (
            <span className="font-mono" style={{ fontSize: "17px", color: c.muted, textDecoration: "line-through" }}>
              {(variant.original_price_cents / 100).toFixed(2)} €
            </span>
          )}
          <p className="font-mono" style={{ fontSize: "24px", color: hasDiscount ? c.tanDeep : c.ink }}>
            {variant ? (variant.price_cents / 100).toFixed(2) : "—"} €
          </p>
        </div>
        {isLowStock && (
          <p className="font-mono mb-5" style={{ fontSize: "13px", color: c.tanDeep }}>
            Nur noch {variant.stock_quantity} Stück in {variant.color_name} verfügbar
          </p>
        )}
        {!isLowStock && <div className="mb-5" />}

        {variants.length > 0 && (
          <div className="mb-8">
            <p className="font-mono mb-2.5" style={{ fontSize: "13px", color: c.muted }}>FARBE</p>
            <div className="flex gap-2.5 flex-wrap">
              {variants.map((v) => {
                const pricesDiffer = variants.some((other) => other.price_cents !== variants[0].price_cents);
                return (
                  <button
                    key={v.id}
                    onClick={() => selectVariant(v.id)}
                    disabled={v.stock_quantity === 0}
                    className="px-5 py-2.5 font-mono border transition-colors"
                    style={{
                      fontSize: "13px",
                      borderColor: v.id === selectedVariantId ? c.ink : c.line,
                      color: v.id === selectedVariantId ? c.ink : c.muted,
                      opacity: v.stock_quantity === 0 ? 0.4 : 1,
                      textDecoration: v.stock_quantity === 0 ? "line-through" : "none",
                    }}
                  >
                    {v.color_name}
                    {pricesDiffer && ` — ${(v.price_cents / 100).toFixed(2)} €`}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {variant && variant.stock_quantity > 0 ? (
          <a
            href={`/checkout?variant=${variant.id}`}
            className="inline-block font-mono px-9 py-4"
            style={{ fontSize: "14px", background: c.ink, color: "#fff", letterSpacing: "0.04em" }}
          >
            ZUR BESTELLUNG
          </a>
        ) : (
          <p className="font-mono text-sm" style={{ color: c.muted }}>Diese Farbe ist ausverkauft</p>
        )}
      </div>
    </main>
  );
}
