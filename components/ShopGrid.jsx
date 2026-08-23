"use client";

import { useMemo, useState } from "react";
import { theme as c } from "@/lib/theme";
import ProductCard from "@/components/ProductCard";
import VoucherCard from "@/components/VoucherCard";

function minPrice(product) {
  const prices = (product.product_variants || []).map((v) => v.price_cents).filter(Boolean);
  return prices.length ? Math.min(...prices) : 0;
}

export default function ShopGrid({ products, categories, lowStockThreshold, voucherEnabled }) {
  const [categoryId, setCategoryId] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const selectClass = "font-mono bg-transparent border-none appearance-none cursor-pointer";
  const selectStyle = { fontSize: "14px", color: c.muted };

  const filteredSorted = useMemo(() => {
    let list = products;
    if (categoryId !== "all") {
      list = list.filter((p) => p.category_id === categoryId);
    }

    const sorted = [...list];
    if (sortBy === "price_asc") {
      sorted.sort((a, b) => minPrice(a) - minPrice(b));
    } else if (sortBy === "price_desc") {
      sorted.sort((a, b) => minPrice(b) - minPrice(a));
    }
    // "newest" braucht nichts zu tun — Produkte kommen schon so sortiert aus der Datenbank

    return sorted;
  }, [products, categoryId, sortBy]);

  return (
    <div>
      <div className="flex gap-7 mb-10">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="all">Alle Kategorien</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={selectClass}
          style={selectStyle}
        >
          <option value="newest">Neueste zuerst</option>
          <option value="price_asc">Preis aufsteigend</option>
          <option value="price_desc">Preis absteigend</option>
        </select>
      </div>

      {filteredSorted.length === 0 && !voucherEnabled ? (
        <p className="font-mono text-sm" style={{ color: c.muted }}>
          {products.length === 0 ? "Noch keine Produkte hinterlegt." : "Keine Produkte in dieser Kategorie."}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-8 gap-y-12">
          {filteredSorted.map((p) => (
            <ProductCard key={p.id} product={p} lowStockThreshold={lowStockThreshold} />
          ))}
          {/* Fix an letzter Stelle, unabhängig von Filter/Sortierung */}
          {voucherEnabled && <VoucherCard />}
        </div>
      )}
    </div>
  );
}
