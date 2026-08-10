-- =====================================================================
-- Oliztic - Esquema base multi-tenant con aislamiento por RLS
-- Ejecutar en: Supabase -> SQL Editor
-- Garantiza que una empresa cliente nunca vea datos/logs de otra.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TENANTS (empresas cliente)
-- ---------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  nit text,
  created_at timestamptz not null default now()
);

-- Relacion usuario -> empresa
create table if not exists public.memberships (
  user_id uuid not null references auth.users(id) on delete cascade,
  org_id  uuid not null references public.organizations(id) on delete cascade,
  rol     text not null default 'miembro',   -- 'admin' | 'miembro'
  created_at timestamptz not null default now(),
  primary key (user_id, org_id)
);

create index if not exists idx_memberships_user on public.memberships(user_id);
create index if not exists idx_memberships_org  on public.memberships(org_id);

-- ---------------------------------------------------------------------
-- 2. FUNCION: empresa del usuario autenticado
-- ---------------------------------------------------------------------
create or replace function public.auth_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select org_id
  from public.memberships
  where user_id = auth.uid()
  limit 1;
$$;

-- ---------------------------------------------------------------------
-- 3. RLS en las tablas de control (organizations / memberships)
-- ---------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.memberships   enable row level security;

-- El usuario solo ve su propia empresa
create policy "org: ver la propia"
  on public.organizations for select
  using ( id = public.auth_org_id() );

-- El usuario solo ve sus membresias
create policy "membership: ver las propias"
  on public.memberships for select
  using ( user_id = auth.uid() );

-- ---------------------------------------------------------------------
-- 4. TABLA DE DATOS DE EJEMPLO (patron a replicar en TODAS las tablas)
--    Regla: toda tabla de negocio lleva org_id y RLS por org_id.
-- ---------------------------------------------------------------------
create table if not exists public.contratistas (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  nombre text not null,
  documento text,
  estado text default 'activo',
  created_at timestamptz not null default now()
);

create index if not exists idx_contratistas_org on public.contratistas(org_id);

alter table public.contratistas enable row level security;

-- Lectura: solo filas de la empresa del usuario
create policy "contratistas: lectura de su empresa"
  on public.contratistas for select
  using ( org_id = public.auth_org_id() );

-- Insercion: solo puede crear filas dentro de su empresa
create policy "contratistas: insertar en su empresa"
  on public.contratistas for insert
  with check ( org_id = public.auth_org_id() );

-- Actualizacion / borrado: solo dentro de su empresa
create policy "contratistas: modificar su empresa"
  on public.contratistas for update
  using ( org_id = public.auth_org_id() )
  with check ( org_id = public.auth_org_id() );

create policy "contratistas: borrar su empresa"
  on public.contratistas for delete
  using ( org_id = public.auth_org_id() );

-- ---------------------------------------------------------------------
-- 5. TABLA DE LOGS / AUDITORIA (tambien segregada por empresa)
-- ---------------------------------------------------------------------
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id),
  accion text not null,
  detalle jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_org on public.audit_logs(org_id);

alter table public.audit_logs enable row level security;

-- Solo lectura de los logs de su propia empresa (no escritura desde el cliente)
create policy "audit: lectura de su empresa"
  on public.audit_logs for select
  using ( org_id = public.auth_org_id() );

-- ---------------------------------------------------------------------
-- 6. STORAGE (fotos/documentos) - aislamiento por carpeta = org_id
--    Estructura de ruta esperada:  <org_id>/archivo.ext
--    Requiere un bucket llamado 'documentos' (crealo en Storage).
-- ---------------------------------------------------------------------
-- create policy "storage: archivos de su empresa"
--   on storage.objects for all
--   using (
--     bucket_id = 'documentos'
--     and (storage.foldername(name))[1] = public.auth_org_id()::text
--   )
--   with check (
--     bucket_id = 'documentos'
--     and (storage.foldername(name))[1] = public.auth_org_id()::text
--   );

-- =====================================================================
-- NOTAS DE SEGURIDAD
-- - La clave service_role BYPASEA RLS. En el backend (webhooks, borrado
--   de cuenta, etc.) filtra SIEMPRE por org_id manualmente.
-- - Nunca expongas service_role en el frontend.
-- - Para asignar un usuario a una empresa (ej. tras registro), inserta
--   en memberships desde el servidor:
--     insert into memberships (user_id, org_id) values (:uid, :org);
-- =====================================================================
