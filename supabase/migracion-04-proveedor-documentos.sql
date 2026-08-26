-- =====================================================================
-- Migracion 04: expediente de cumplimiento del proveedor
-- Ejecutar en Supabase -> SQL Editor (despues de migracion-03)
--
-- Requiere ademas crear un bucket PRIVADO llamado 'documentos'
-- en Storage (Dashboard -> Storage -> New bucket, Public = off).
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. Tabla de documentos del expediente
--    El expediente pertenece al PROVEEDOR (proveedor_user_id).
--    Una fila por documento cargado (catalogo fijo + adicionales).
-- ---------------------------------------------------------------------
create table if not exists public.proveedor_documentos (
  id uuid primary key default gen_random_uuid(),
  proveedor_user_id uuid not null references auth.users(id) on delete cascade,
  nit text,
  categoria text not null,               -- legal | fin | laft | sst
  doc_key text not null,                 -- clave del catalogo o clave del adicional
  nombre text not null,
  tag text,                              -- Obligatorio | Condicional | Adicional
  storage_path text,
  file_name text,
  file_size bigint,
  fecha_expedicion date,
  estado text not null default 'en_revision',  -- en_revision | validado
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists uq_prov_doc_user_key
  on public.proveedor_documentos (proveedor_user_id, doc_key);
create index if not exists idx_prov_doc_user on public.proveedor_documentos(proveedor_user_id);
create index if not exists idx_prov_doc_nit  on public.proveedor_documentos(nit);

-- ---------------------------------------------------------------------
-- 2. RLS
-- ---------------------------------------------------------------------
alter table public.proveedor_documentos enable row level security;

-- El proveedor (dueño) gestiona su propio expediente
create policy "prov_doc: dueño gestiona"
  on public.proveedor_documentos for all
  using ( proveedor_user_id = auth.uid() )
  with check ( proveedor_user_id = auth.uid() );

-- La empresa que invito al proveedor puede LEER su expediente
create policy "prov_doc: cliente lee"
  on public.proveedor_documentos for select
  using ( exists (
    select 1 from public.proveedores p
    where p.org_id = public.auth_org_id()
      and p.user_id = proveedor_documentos.proveedor_user_id
  ));

-- ---------------------------------------------------------------------
-- 3. Storage: bucket 'documentos', ruta <proveedor_user_id>/archivo.ext
-- ---------------------------------------------------------------------
-- El proveedor gestiona los archivos bajo su propia carpeta
create policy "storage prov: dueño gestiona"
  on storage.objects for all
  using (
    bucket_id = 'documentos'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'documentos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- La empresa que invito puede leer los archivos del proveedor
create policy "storage prov: cliente lee"
  on storage.objects for select
  using (
    bucket_id = 'documentos'
    and exists (
      select 1 from public.proveedores p
      where p.org_id = public.auth_org_id()
        and p.user_id::text = (storage.foldername(name))[1]
    )
  );
