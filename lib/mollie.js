import { createMollieClient } from "@mollie/api-client";

export function mollie() {
  return createMollieClient({ apiKey: process.env.MOLLIE_API_KEY });
}
