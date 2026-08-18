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

// Busca un usuario por correo (la API admin no expone getByEmail directo).
export async function buscarUsuarioPorCorreo(admin, correo) {
  const objetivo = correo.toLowerCase();
  const { data } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  return (
    data?.users?.find((u) => u.email?.toLowerCase() === objetivo) || null
  );
}
