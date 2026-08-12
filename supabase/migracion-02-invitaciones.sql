-- =====================================================================
-- Migracion 02: invitaciones de proveedores
-- Ejecutar en Supabase -> SQL Editor
-- =====================================================================

alter table public.proveedores
  add column if not exists correo text,
  add column if not exists invited_by uuid references auth.users(id),
  add column if not exists user_id uuid references auth.users(id);

alter table public.proveedores alter column estado set default 'Invitado';

create index if not exists idx_proveedores_org on public.proveedores(org_id);
create index if not exists idx_proveedores_correo on public.proveedores(correo);

-- Un mismo proveedor (correo) no se invita dos veces por la misma empresa
create unique index if not exists uq_proveedor_org_correo
  on public.proveedores (org_id, lower(correo)) where correo is not null;
