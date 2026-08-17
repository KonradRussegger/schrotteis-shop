import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

export async function POST(request) {
  const { name, categoryId, description, material, dimensions, priceCents, variants } =
    await request.json();

  if (!name || !priceCents || !variants || variants.length === 0) {
    return NextResponse.json(
      { error: "Name, Preis und mindestens eine Farbvariante sind erforderlich." },
      { status: 400 }
    );
  }

  const supabase = supabaseAdmin();

  // 1. Produkt anlegen
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      slug: slugify(name),
      name,
      category_id: categoryId || null,
      description,
      material,
      dimensions,
      price_cents: priceCents,
    })
    .select()
    .single();

  if (productError) {
    return NextResponse.json(
      { error: "Produkt konnte nicht angelegt werden: " + productError.message },
      { status: 500 }
    );
  }

  // 2. Farbvarianten anlegen
  const variantRows = variants.map((v) => ({
    product_id: product.id,
    color_name: v.colorName,
    color_hex: v.colorHex || null,
    stock_quantity: v.stockQuantity || 0,
    images: v.images || [],
  }));

  const { error: variantsError } = await supabase.from("product_variants").insert(variantRows);

  if (variantsError) {
    // Produkt existiert schon, aber ohne Varianten — für den MVP-Fall belassen
    // wir das Produkt und melden den Fehler, statt automatisch zurückzurollen.
    return NextResponse.json(
      { error: "Produkt angelegt, aber Farbvarianten fehlgeschlagen: " + variantsError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, product });
}
