import { Resend } from "resend";

function resend() {
  return new Resend(process.env.RESEND_API_KEY);
}

// Absender-Adresse — muss zur bei Resend verifizierten Domain gehören.
const FROM = "Schrotteis Gwandlstubn <info@schrotteis-gwandlstubn.at>";

// Schlichtes, einheitliches HTML-Grundgerüst für alle E-Mails
function wrapHtml(title, bodyHtml) {
  return `
    <div style="font-family: Georgia, 'Times New Roman', serif; max-width: 520px; margin: 0 auto; color: #211812;">
      <h1 style="font-size: 22px; font-weight: 500; margin-bottom: 4px;">Schrotteis Gwandlstubn</h1>
      <p style="color: #9C9184; font-size: 13px; margin-top: 0; margin-bottom: 28px;">Handgefertigte Lederwaren aus Abtenau</p>
      <h2 style="font-size: 18px; font-weight: 500;">${title}</h2>
      ${bodyHtml}
      <p style="color: #9C9184; font-size: 12px; margin-top: 36px; border-top: 1px solid #E8E3DA; padding-top: 16px;">
        Matthäus Auer · Schratten 4 · 5441 Abtenau · info@schrotteis-gwandlstubn.at
      </p>
    </div>
  `;
}

// Sendet die Bestellbestätigung nach erfolgreicher Zahlung.
export async function sendOrderConfirmationEmail(order) {
  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 6px 0;">${item.qty}x ${item.product_name} (${item.color_name})</td>
          <td style="padding: 6px 0; text-align: right;">${((item.price_cents * item.qty) / 100).toFixed(2)} €</td>
        </tr>`
    )
    .join("");

  const discountRowHtml =
    order.discount_amount_cents > 0
      ? `<tr>
          <td style="padding: 6px 0; color: #96693F;">
            ${order.redeemed_voucher_id ? "Gutschein eingelöst" : "Rabattcode"} (${order.discount_code})
          </td>
          <td style="padding: 6px 0; text-align: right; color: #96693F;">
            −${(order.discount_amount_cents / 100).toFixed(2)} €
          </td>
        </tr>`
      : "";

  const shippingRowHtml =
    order.shipping_cost_cents > 0
      ? `<tr>
          <td style="padding: 6px 0;">Versand</td>
          <td style="padding: 6px 0; text-align: right;">${(order.shipping_cost_cents / 100).toFixed(2)} €</td>
        </tr>`
      : "";

  const isPickup = order.delivery_type === "pickup";
  const deliveryLine = isPickup
    ? "Deine Bestellung wird in Abtenau zur Abholung bereitgestellt. Wir melden uns, sobald sie fertig ist."
    : "Deine Bestellung wird verpackt und an dich verschickt.";

  const html = wrapHtml(
    `Danke für deine Bestellung, ${order.customer_name.split(" ")[0]}!`,
    `
      <p>${deliveryLine}</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        ${itemsHtml}
        ${discountRowHtml}
        ${shippingRowHtml}
        <tr style="border-top: 1px solid #E8E3DA;">
          <td style="padding: 10px 0; font-weight: 600;">Gesamt</td>
          <td style="padding: 10px 0; text-align: right; font-weight: 600;">${(order.total_cents / 100).toFixed(2)} €</td>
        </tr>
      </table>
      <p style="font-size: 13px; color: #9C9184;">Bestellnummer: ${order.id.slice(0, 8)}</p>
    `
  );

  return resend().emails.send({
    from: FROM,
    to: order.customer_email,
    subject: `Deine Bestellung bei Schrotteis Gwandlstubn (${order.id.slice(0, 8)})`,
    html,
  });
}

// Sendet den Gutschein-Code nach erfolgreicher Zahlung.
export async function sendVoucherEmail(voucher) {
  const html = wrapHtml(
    `Dein Geschenkgutschein`,
    `
      <p>Vielen Dank für deinen Einkauf, ${voucher.buyer_name.split(" ")[0]}!</p>
      <div style="background: #F7F5F1; padding: 24px; text-align: center; margin: 20px 0;">
        <p style="font-family: monospace; font-size: 12px; color: #9C9184; margin: 0 0 8px;">GUTSCHEINCODE</p>
        <p style="font-family: monospace; font-size: 24px; letter-spacing: 0.05em; margin: 0;">${voucher.code}</p>
        <p style="font-family: monospace; font-size: 18px; color: #96693F; margin: 12px 0 0;">${(voucher.value_cents / 100).toFixed(2)} €</p>
      </div>
      <p style="font-size: 13px; color: #9C9184;">
        Der Gutschein gilt vollständig auf einmal beim Einkauf im Checkout-Formular —
        es gibt kein Restguthaben nach teilweiser Einlösung.
      </p>
      ${voucher.recipient_note ? `<p style="font-size: 13px;">Deine Nachricht: "${voucher.recipient_note}"</p>` : ""}
    `
  );

  return resend().emails.send({
    from: FROM,
    to: voucher.buyer_email,
    subject: "Dein Geschenkgutschein von Schrotteis Gwandlstubn",
    html,
  });
}

// Sendet eine Versandbenachrichtigung, wenn eine Bestellung als
// versendet/abgeholt markiert wird. invoicePdfBase64 wird, falls vorhanden,
// als PDF angehängt; trackingNumber erscheint nur bei Versand (nicht Abholung).
export async function sendShippedEmail(order, { trackingNumber, invoicePdfBase64 } = {}) {
  const isPickup = order.delivery_type === "pickup";

  const trackingHtml =
    !isPickup && trackingNumber
      ? `<p style="font-size: 14px;"><strong>Sendungsnummer:</strong> ${trackingNumber}</p>`
      : "";

  const html = wrapHtml(
    isPickup ? "Deine Bestellung ist abholbereit!" : "Deine Bestellung ist unterwegs!",
    `
      <p>
        ${isPickup
          ? "Du kannst deine Bestellung jetzt in Abtenau abholen."
          : "Deine Bestellung wurde soeben versendet."}
      </p>
      ${trackingHtml}
      <p style="font-size: 13px; color: #9C9184;">Bestellnummer: ${order.id.slice(0, 8)}</p>
      ${invoicePdfBase64 ? `<p style="font-size: 13px; color: #9C9184;">Die Rechnung findest du im Anhang.</p>` : ""}
    `
  );

  return resend().emails.send({
    from: FROM,
    to: order.customer_email,
    subject: isPickup ? "Bestellung abholbereit" : "Bestellung versendet",
    html,
    attachments: invoicePdfBase64
      ? [
          {
            filename: `Rechnung-${order.id.slice(0, 8)}.pdf`,
            content: invoicePdfBase64,
          },
        ]
      : undefined,
  });
}
