-- =====================================================================
-- Migracion 03: codigos de recuperacion de contrasena (via Resend)
-- Ejecutar en Supabase -> SQL Editor
-- =====================================================================

create table if not exists public.reset_codes (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  code text not null,
  expires_at timestamptz not null,
  used boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_reset_codes_email on public.reset_codes (lower(email));

-- Sin policies: solo el service_role (que bypasea RLS) puede leer/escribir.
alter table public.reset_codes enable row level security;
