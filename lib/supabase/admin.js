import { createClient } from "@supabase/supabase-js";

// Cliente con privilegios de servicio — SOLO se usa en el servidor (API routes).
// Nunca expongas SUPABASE_SERVICE_ROLE_KEY con prefijo NEXT_PUBLIC_.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
