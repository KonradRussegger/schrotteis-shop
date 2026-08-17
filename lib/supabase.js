import { createClient } from "@supabase/supabase-js";

// Für serverseitige Aufrufe (API-Routen, Admin) — nutzt den Service-Role-Key,
// der volle Rechte hat. NIE im Frontend / Browser verwenden.
export function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
}

// Für öffentliche, lesende Zugriffe (Produktkatalog im Shop-Frontend).
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
