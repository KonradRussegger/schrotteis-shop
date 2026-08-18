import { createClient } from "@supabase/supabase-js";

// Next.js/Vercel cachen fetch()-Aufrufe standardmäßig, auch wenn eine Seite
// als "force-dynamic" markiert ist — supabase-js nutzt intern fetch(), daher
// hier explizit "no-store" erzwingen, damit Datenbankabfragen nie auf
// Infrastrukturebene zwischengespeichert werden.
const noStoreFetch = (url, options = {}) => fetch(url, { ...options, cache: "no-store" });

// Für serverseitige Aufrufe (API-Routen, Admin) — nutzt den Service-Role-Key,
// der volle Rechte hat. NIE im Frontend / Browser verwenden.
export function supabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false }, global: { fetch: noStoreFetch } }
  );
}

// Für öffentliche, lesende Zugriffe (Produktkatalog im Shop-Frontend).
export function supabasePublic() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { fetch: noStoreFetch } }
  );
}
