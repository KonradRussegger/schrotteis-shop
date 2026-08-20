// Schlanker sevDesk-API-Client für die Kern-Workflows:
// 1) Kontakt (Kunde) suchen oder anlegen
// 2) Rechnung zu einer Bestellung erstellen
//
// Voraussetzung: sevDesk-Tarif "Buchhaltung Pro" (nur dort ist die API freigeschaltet).
// API-Token: sevDesk -> Einstellungen -> Benutzer -> API-Token, als SEVDESK_API_TOKEN in .env

const BASE_URL = "https://my.sevdesk.de/api/v1";

async function sevdeskFetch(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: process.env.SEVDESK_API_TOKEN,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`sevDesk API Fehler (${res.status}): ${body}`);
  }
  return res.json();
}

// Sucht einen Kontakt anhand der E-Mail-Adresse. Legt einen neuen an, falls keiner existiert.
export async function findOrCreateContact({ name, email }) {
  const search = await sevdeskFetch(
    `/Contact?depth=1&customerNumber=${encodeURIComponent(email)}`
  );
  if (search.objects && search.objects.length > 0) {
    return search.objects[0];
  }

  const created = await sevdeskFetch("/Contact", {
    method: "POST",
    body: JSON.stringify({
      name,
      customerNumber: email, // vereinfachter Ansatz: E-Mail als eindeutiger Schlüssel
      category: { id: 3, objectName: "Category" }, // 3 = Kunde (Standard-Kategorie in sevDesk)
    }),
  });
  return created.objects;
}

// Erstellt eine Rechnung zu einer bezahlten Bestellung.
// order: { customer_name, customer_email, items, total_cents, shipping_address, shipping_cost_cents }
export async function createInvoiceForOrder(order, contactId) {
  const invoicePositions = order.items.map((item) => ({
    quantity: item.qty,
    price: item.price_cents / 100,
    name: `${item.product_name} (${item.color_name})`,
    unity: { id: 1, objectName: "Unity" }, // 1 = Stück
    taxRate: 20, // österreichischer Regelsteuersatz — bei Bedarf anpassen
  }));

  // Versandkosten als eigene Position, nur wenn tatsächlich welche angefallen sind
  if (order.shipping_cost_cents > 0) {
    invoicePositions.push({
      quantity: 1,
      price: order.shipping_cost_cents / 100,
      name: "Versandkosten",
      unity: { id: 1, objectName: "Unity" },
      taxRate: 20,
    });
  }

  // Rabatt oder eingelöster Gutschein als eigene, negative Position
  if (order.discount_amount_cents > 0) {
    invoicePositions.push({
      quantity: 1,
      price: -(order.discount_amount_cents / 100),
      name: order.redeemed_voucher_id
        ? `Gutschein eingelöst (${order.discount_code})`
        : `Rabattcode ${order.discount_code}`,
      unity: { id: 1, objectName: "Unity" },
      taxRate: 20,
    });
  }

  return sevdeskFetch("/Invoice/Factory/saveInvoice", {
    method: "POST",
    body: JSON.stringify({
      invoice: {
        contact: { id: contactId, objectName: "Contact" },
        invoiceDate: new Date().toISOString().slice(0, 10),
        status: 100, // 100 = Entwurf; nach Zahlungseingang ggf. auf 1000 (bezahlt) setzen
        currency: "EUR",
        taxRule: { id: 1, objectName: "TaxRule" }, // Standard-Steuersatz Inland
      },
      invoicePosSave: invoicePositions,
      invoicePosDelete: null,
      takeDefaultEmailTemplate: false,
    }),
  });
}
