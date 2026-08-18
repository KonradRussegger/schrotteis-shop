import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { slugify } from "@/lib/slugify";

export async function PUT(request, { params }) {
  const { id } = params;
  const { name, categoryId, description, material, dimensions, priceCents, variants } =
    await request.json();

  const supabase = supabaseAdmin();

  // 1. Produktdaten aktualisieren
  const { error: productError } = await supabase
    .from("products")
    .update({
      name,
      slug: slugify(name),
      category_id: categoryId || null,
      description,
      material,
      dimensions,
      price_cents: priceCents,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (productError) {
    return NextResponse.json(
      { error: "Produkt konnte nicht aktualisiert werden: " + productError.message },
      { status: 500 }
    );
  }

  // 2. Farbvarianten abgleichen: bestehende (mit id) updaten, neue (ohne id)
  //    anlegen, entfernte (nicht mehr im Payload) löschen.
  const { data: existingVariants } = await supabase
    .from("product_variants")
    .select("id")
    .eq("product_id", id);

  const incomingIds = variants.filter((v) => v.id).map((v) => v.id);
  const toDelete = (existingVariants || [])
    .map((v) => v.id)
    .filter((existingId) => !incomingIds.includes(existingId));

  if (toDelete.length > 0) {
    await supabase.from("product_variants").delete().in("id", toDelete);
  }

  const variantErrors = [];

  for (const v of variants) {
    const row = {
      product_id: id,
      color_name: v.colorName,
      color_hex: v.colorHex || null,
      stock_quantity: v.stockQuantity || 0,
      images: v.images || [],
      updated_at: new Date().toISOString(),
    };

    if (v.id) {
      const { error } = await supabase.from("product_variants").update(row).eq("id", v.id);
      if (error) variantErrors.push(`${v.colorName} (Update): ${error.message}`);
    } else {
      const { error } = await supabase.from("product_variants").insert(row);
      if (error) variantErrors.push(`${v.colorName} (Neu): ${error.message}`);
    }
  }

  if (variantErrors.length > 0) {
    return NextResponse.json(
      { error: "Farbvarianten teilweise nicht gespeichert: " + variantErrors.join("; ") },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = params;
  const supabase = supabaseAdmin();

  // product_variants haben "on delete cascade" auf product_id — werden
  // automatisch mitgelöscht.
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Produkt konnte nicht gelöscht werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
