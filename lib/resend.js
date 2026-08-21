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
// versendet/abgeholt markiert wird.
export async function sendShippedEmail(order) {
  const isPickup = order.delivery_type === "pickup";
  const html = wrapHtml(
    isPickup ? "Deine Bestellung ist abholbereit!" : "Deine Bestellung ist unterwegs!",
    `
      <p>
        ${isPickup
          ? "Du kannst deine Bestellung jetzt in Abtenau abholen."
          : "Deine Bestellung wurde soeben versendet."}
      </p>
      <p style="font-size: 13px; color: #9C9184;">Bestellnummer: ${order.id.slice(0, 8)}</p>
    `
  );

  return resend().emails.send({
    from: FROM,
    to: order.customer_email,
    subject: isPickup ? "Bestellung abholbereit" : "Bestellung versendet",
    html,
  });
}
