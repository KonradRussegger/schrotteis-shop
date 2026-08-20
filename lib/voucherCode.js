// Erzeugt einen gut lesbaren, aber schwer zu erratenden Gutschein-Code
// (Format: SG-XXXX-XXXX), verwechslungsanfällige Zeichen (0/O, 1/I) weggelassen.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateVoucherCode() {
  const block = () =>
    Array.from({ length: 4 }, () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]).join("");
  return `SG-${block()}-${block()}`;
}
