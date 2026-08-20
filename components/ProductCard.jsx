import Link from "next/link";
import { theme as c } from "@/lib/theme";

const FALLBACK_SWATCH_COLORS = [c.tan, "#3B2A20", "#C9A876", "#7A6A55"];

export default function ProductCard({ product, lowStockThreshold = 3 }) {
  const variants = product.product_variants || [];
  const totalStock = variants.reduce((sum, v) => sum + v.stock_quantity, 0);
  const firstImage = variants.find((v) => v.images?.length)?.images?.[0];
  const isLowStock = totalStock > 0 && totalStock <= lowStockThreshold;

  // Preis lebt pro Farbvariante — auf der Karte zeigen wir die günstigste
  // Farbe. Unterscheiden sich die Preise, kommt ein "ab" davor.
  const prices = variants.map((v) => v.price_cents).filter(Boolean);
  const minPrice = prices.length ? Math.min(...prices) : null;
  const pricesDiffer = prices.length > 1 && Math.max(...prices) !== minPrice;
  const cheapestVariant = variants.find((v) => v.price_cents === minPrice);
  const hasDiscount = cheapestVariant?.original_price_cents && cheapestVariant.original_price_cents > cheapestVariant.price_cents;

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5]" style={{ background: c.card }}>
        {firstImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-[10px]" style={{ color: c.muted }}>FOTO FOLGT</span>
          </div>
        )}
        {hasDiscount && (
          <span
            className="absolute top-3 left-3 font-mono px-2 py-1"
            style={{ fontSize: "10px", background: c.tanDeep, color: "#fff" }}
          >
            REDUZIERT
          </span>
        )}
      </div>

      {variants.length > 0 && (
        <div className="flex gap-1.5 mt-3">
          {variants.slice(0, 5).map((v, i) => (
            <span
              key={v.id}
              className="w-3.5 h-3.5 rounded-full border"
              style={{ background: v.color_hex || FALLBACK_SWATCH_COLORS[i % 4], borderColor: c.line }}
              title={v.color_name}
            />
          ))}
        </div>
      )}

      <p className="font-mono mt-2.5" style={{ fontSize: "13px", letterSpacing: "0.02em", color: c.ink }}>
        {product.name.toUpperCase()}
      </p>
      <div className="flex items-center justify-between mt-1.5">
        <span className="font-mono flex items-center gap-2">
          {hasDiscount && (
            <span style={{ fontSize: "12px", color: c.muted, textDecoration: "line-through" }}>
              {(cheapestVariant.original_price_cents / 100).toFixed(2)} €
            </span>
          )}
          {minPrice !== null && (
            <span style={{ fontSize: "15px", color: hasDiscount ? c.tanDeep : c.ink }}>
              {pricesDiffer && "ab "}
              {(minPrice / 100).toFixed(2)} €
            </span>
          )}
        </span>
        {totalStock === 0 ? (
          <span className="font-mono" style={{ fontSize: "11px", color: c.muted }}>Ausverkauft</span>
        ) : isLowStock ? (
          <span className="font-mono" style={{ fontSize: "11px", color: c.tanDeep }}>
            Nur noch {totalStock} Stück
          </span>
        ) : null}
      </div>
    </Link>
  );
}
