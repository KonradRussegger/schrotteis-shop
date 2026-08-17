"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Legt neue Produktkategorien an (z.B. "Geldbörsen" zusätzlich zu
// Handtaschen/Rucksäcke/Federpennal), ohne dass dafür Code angepasst werden muss.
export default function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/kategorien", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      setError("Kategorie konnte nicht angelegt werden.");
      setLoading(false);
      return;
    }

    setName("");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        placeholder="z. B. Geldbörsen"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="flex-1 bg-card border border-line rounded-sm px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 rounded-sm bg-tan text-bg font-mono text-xs font-medium"
      >
        {loading ? "…" : "Anlegen"}
      </button>
      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
    </form>
  );
}
