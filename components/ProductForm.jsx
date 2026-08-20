"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { resizeImage } from "@/lib/imageResize";

const emptyVariant = () => ({
  id: undefined, // gesetzt bei bestehenden Varianten, undefined bei neuen
  colorName: "",
  colorHex: "",
  stockQuantity: 0,
  priceEuro: "",
  originalPriceEuro: "",
  images: [],
  uploading: false,
});

// Ein Formular für Anlegen UND Bearbeiten. Ohne initialProduct: Neuanlage.
// Mit initialProduct: vorbefüllt, sendet PUT statt POST, zeigt Löschen-Button.
// Preise liegen pro Farbvariante, nicht mehr global am Produkt — verschiedene
// Farben (z.B. andere Lederart) können unterschiedlich viel kosten und
// einzeln reduziert werden.
export default function ProductForm({ categories, initialProduct }) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [material, setMaterial] = useState(initialProduct?.material || "");
  const [dimensions, setDimensions] = useState(initialProduct?.dimensions || "");
  const [isNew, setIsNew] = useState(initialProduct?.is_new || false);
  const [variants, setVariants] = useState(
    initialProduct?.product_variants?.length
      ? initialProduct.product_variants.map((v) => ({
          id: v.id,
          colorName: v.color_name,
          colorHex: v.color_hex || "",
          stockQuantity: v.stock_quantity,
          priceEuro: v.price_cents ? (v.price_cents / 100).toFixed(2).replace(".", ",") : "",
          originalPriceEuro: v.original_price_cents
            ? (v.original_price_cents / 100).toFixed(2).replace(".", ",")
            : "",
          images: v.images || [],
          uploading: false,
        }))
      : [emptyVariant()]
  );
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  function updateVariant(index, patch) {
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));
  }

  function addVariant() {
    setVariants((prev) => [...prev, emptyVariant()]);
  }

  function removeVariant(index) {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handlePhotoUpload(index, files) {
    updateVariant(index, { uploading: true });
    const uploadedUrls = [];
    const failedFiles = [];

    for (const file of files) {
      let uploadFile;
      try {
        uploadFile = await resizeImage(file); // auf max. 1600px verkleinern & komprimieren
      } catch {
        uploadFile = file; // falls die Verkleinerung scheitert, Original hochladen statt abzubrechen
      }

      const formData = new FormData();
      formData.append("file", uploadFile);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          uploadedUrls.push(url);
        } else {
          const body = await res.json().catch(() => ({}));
          failedFiles.push(`${file.name}: ${body.error || "Upload fehlgeschlagen"}`);
        }
      } catch (err) {
        failedFiles.push(`${file.name}: ${err.message}`);
      }
    }

    setVariants((prev) =>
      prev.map((v, i) =>
        i === index ? { ...v, images: [...v.images, ...uploadedUrls], uploading: false } : v
      )
    );

    if (failedFiles.length > 0) {
      setError(`Foto-Upload fehlgeschlagen — ${failedFiles.join("; ")}`);
    }
  }

  function removePhoto(variantIndex, photoIndex) {
    setVariants((prev) =>
      prev.map((v, i) =>
        i === variantIndex ? { ...v, images: v.images.filter((_, pi) => pi !== photoIndex) } : v
      )
    );
  }

  // Verschiebt ein Foto in der Reihenfolge nach links (-1) oder rechts (+1).
  // Das erste Foto ist automatisch das Titelbild im Shop.
  function movePhoto(variantIndex, photoIndex, direction) {
    setVariants((prev) =>
      prev.map((v, i) => {
        if (i !== variantIndex) return v;
        const newIndex = photoIndex + direction;
        if (newIndex < 0 || newIndex >= v.images.length) return v;
        const images = [...v.images];
        [images[photoIndex], images[newIndex]] = [images[newIndex], images[photoIndex]];
        return { ...v, images };
      })
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    for (const v of variants) {
      if (!v.priceEuro.trim()) {
        setError(`Bitte einen Preis für die Farbe "${v.colorName || "(unbenannt)"}" eintragen.`);
        return;
      }
    }

    setSubmitting(true);

    const payload = {
      name,
      categoryId,
      description,
      material,
      dimensions,
      isNew,
      variants: variants.map((v) => ({
        id: v.id,
        colorName: v.colorName,
        colorHex: v.colorHex,
        stockQuantity: Number(v.stockQuantity) || 0,
        priceCents: Math.round(parseFloat(v.priceEuro.replace(",", ".")) * 100),
        originalPriceCents: v.originalPriceEuro.trim()
          ? Math.round(parseFloat(v.originalPriceEuro.replace(",", ".")) * 100)
          : null,
        images: v.images,
      })),
    };

    const res = await fetch(
      isEditing ? `/api/admin/produkte/${initialProduct.id}` : "/api/admin/produkte",
      {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!res.ok) {
      const body = await res.json();
      setError(body.error || "Produkt konnte nicht gespeichert werden.");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm(`„${name}“ wirklich unwiderruflich löschen?`)) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/produkte/${initialProduct.id}`, { method: "DELETE" });

    if (!res.ok) {
      setError("Produkt konnte nicht gelöscht werden.");
      setDeleting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  const inputClass = "w-full bg-card border border-line rounded-sm px-3 py-2 text-sm";
  const labelClass = "font-mono text-xs text-muted block mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Grunddaten */}
      <section className="space-y-4">
        <div>
          <label className={labelClass}>Modellname</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className={labelClass}>Kategorie</label>
          <select
            className={inputClass}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Beschreibung</label>
          <textarea
            className={inputClass}
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Material</label>
            <input className={inputClass} value={material} onChange={(e) => setMaterial(e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Maße</label>
            <input className={inputClass} value={dimensions} onChange={(e) => setDimensions(e.target.value)} placeholder="z. B. 42 x 30 x 15 cm" />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isNew}
            onChange={(e) => setIsNew(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="font-mono text-xs text-muted">
            Als "Neu" in der Kollektion auf der Startseite zeigen
          </span>
        </label>
      </section>

      {/* Farbvarianten — jede mit eigenem Preis */}
      <section>
        <h2 className="font-display text-lg font-medium mb-1">Farbvarianten</h2>
        <p className="text-muted text-xs mb-4">
          Preis wird pro Farbe festgelegt — unterschiedliche Lederarten oder gezielte Sale-Aktionen sind so möglich.
        </p>
        <div className="space-y-6">
          {variants.map((variant, i) => (
            <div key={i} className="border border-line rounded-sm p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-muted">Farbe {i + 1}</span>
                {variants.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="font-mono text-xs text-muted hover:text-tanLight"
                  >
                    Entfernen
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Farbname</label>
                  <input
                    className={inputClass}
                    value={variant.colorName}
                    onChange={(e) => updateVariant(i, { colorName: e.target.value })}
                    placeholder="z. B. Cognac"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Lagerbestand</label>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={variant.stockQuantity}
                    onChange={(e) => updateVariant(i, { stockQuantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Preis (€)</label>
                  <input
                    className={inputClass}
                    value={variant.priceEuro}
                    onChange={(e) => updateVariant(i, { priceEuro: e.target.value })}
                    placeholder="z. B. 380,00"
                    required
                  />
                </div>
                <div>
                  <label className={labelClass}>Ursprungspreis (€) — optional</label>
                  <input
                    className={inputClass}
                    value={variant.originalPriceEuro}
                    onChange={(e) => updateVariant(i, { originalPriceEuro: e.target.value })}
                    placeholder="nur bei Sale"
                  />
                </div>
              </div>

              {/* Fotos dieser Farbe — beliebig viele */}
              <div>
                <label className={labelClass}>Fotos ({variant.images.length})</label>
                <p className="text-muted text-xs mb-2">
                  Werden automatisch auf max. 1600px verkleinert und komprimiert — Originalgröße spielt keine Rolle.
                  Das erste Foto ist das Titelbild im Shop; mit den Pfeilen verschieben.
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {variant.images.map((img, pi) => (
                    <div key={pi} className="relative w-16 h-16">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt="" className="w-full h-full object-cover rounded-sm" />
                      {pi === 0 && (
                        <span className="absolute -top-1.5 -left-1.5 px-1 rounded-sm bg-tan text-bg text-[8px] font-mono font-medium">
                          Titel
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(i, pi)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-saddle text-cream text-xs"
                      >
                        ×
                      </button>
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 flex gap-0.5">
                        <button
                          type="button"
                          onClick={() => movePhoto(i, pi, -1)}
                          disabled={pi === 0}
                          className="w-5 h-5 rounded-sm bg-bg border border-line text-cream text-[10px] disabled:opacity-30"
                          aria-label="Nach links verschieben"
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          onClick={() => movePhoto(i, pi, 1)}
                          disabled={pi === variant.images.length - 1}
                          className="w-5 h-5 rounded-sm bg-bg border border-line text-cream text-[10px] disabled:opacity-30"
                          aria-label="Nach rechts verschieben"
                        >
                          →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handlePhotoUpload(i, Array.from(e.target.files))}
                  className="font-mono text-xs text-muted mt-3"
                />
                {variant.uploading && <p className="font-mono text-xs text-muted mt-1">Lädt hoch…</p>}
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addVariant}
          className="mt-4 font-mono text-xs text-tanLight border border-line rounded-sm px-4 py-2 hover:border-tan"
        >
          + Weitere Farbe
        </button>
      </section>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          className="px-7 py-3.5 rounded-sm bg-tan text-bg font-mono text-sm font-medium"
        >
          {submitting ? "Wird gespeichert…" : isEditing ? "Änderungen speichern" : "Produkt anlegen"}
        </button>

        <Link
          href="/admin"
          className="font-mono text-xs text-muted hover:text-tanLight"
        >
          Abbrechen (ohne zu speichern)
        </Link>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="font-mono text-xs text-muted hover:text-red-400 ml-auto"
          >
            {deleting ? "Wird gelöscht…" : "Produkt löschen"}
          </button>
        )}
      </div>
    </form>
  );
}
