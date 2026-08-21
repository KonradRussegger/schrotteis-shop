import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import * as XLSX from "xlsx";

// Lädt die wichtigsten Tabellen und packt sie als Excel-Datei mit einem
// Reiter pro Tabelle zusammen — dient als lokales Backup-Snapshot, das
// jederzeit ohne weitere Hilfsmittel im Admin-Bereich heruntergeladen
// werden kann. Ersetzt keine echten Datenbank-Backups (siehe Supabase
// Pro-Plan für automatische tägliche Backups), ist aber eine schnelle,
// eigenständige Absicherung.
const TABLES = [
  "products",
  "product_variants",
  "categories",
  "orders",
  "gift_vouchers",
  "discount_codes",
  "shipping_options",
  "shop_settings",
];

function flattenForSheet(rows) {
  // JSON-/Array-Spalten (z.B. items, images, shipping_address) als lesbaren
  // Text darstellen, statt "[object Object]" in der Zelle zu zeigen.
  return rows.map((row) => {
    const flat = {};
    for (const [key, value] of Object.entries(row)) {
      flat[key] =
        value !== null && typeof value === "object" ? JSON.stringify(value) : value;
    }
    return flat;
  });
}

export async function GET() {
  const supabase = supabaseAdmin();
  const workbook = XLSX.utils.book_new();

  for (const table of TABLES) {
    const { data, error } = await supabase.from(table).select("*");
    const rows = error ? [{ Fehler: error.message }] : flattenForSheet(data || []);
    const sheet = XLSX.utils.json_to_sheet(rows.length > 0 ? rows : [{ Hinweis: "Keine Daten" }]);
    // Sheet-Namen sind in Excel auf 31 Zeichen begrenzt
    XLSX.utils.book_append_sheet(workbook, sheet, table.slice(0, 31));
  }

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const dateStamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="backup-schrotteis-gwandlstubn-${dateStamp}.xlsx"`,
    },
  });
}
