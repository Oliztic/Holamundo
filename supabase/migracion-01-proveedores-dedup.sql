-- =====================================================================
-- Migracion 01: proveedores + dedup de empresas por dominio/NIT
-- Ejecutar en Supabase -> SQL Editor (despues de los scripts anteriores)
-- =====================================================================

-- 1. Renombrar tabla y columna
alter table if exists public.contratistas rename to proveedores;
alter table if exists public.proveedores rename column documento to nit;

-- 2. Empresas: agregar NIT normalizado y dominio corporativo
alter table public.organizations add column if not exists dominio text;

-- Deduplicacion:
--  - dominio corporativo unico (cada @empresa.com es un solo tenant)
--  - NIT unico cuando esta presente
create unique index if not exists uq_org_dominio
  on public.organizations (lower(dominio)) where dominio is not null;
create unique index if not exists uq_org_nit
  on public.organizations (nit) where nit is not null;

-- 3. Trigger de alta: fuerza correo corporativo, hace trim,
--    reutiliza la empresa si ya existe (por dominio o NIT).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_dominio text := lower(split_part(new.email, '@', 2));
  v_nombre  text := nullif(trim(new.raw_user_meta_data->>'company_name'), '');
  v_nit     text := nullif(trim(new.raw_user_meta_data->>'company_nit'), '');
  v_org uuid;
  v_rol text := 'miembro';
  publicos text[] := array[
    'gmail.com','hotmail.com','outlook.com','yahoo.com','live.com',
    'icloud.com','aol.com','protonmail.com','proton.me','gmx.com',
    'yandex.com','mail.com','hotmail.es','outlook.es','yahoo.es'
  ];
begin
  if v_dominio = any(publicos) then
    raise exception 'Debes registrarte con un correo corporativo';
  end if;

  if v_nombre is null then
    v_nombre := initcap(split_part(v_dominio, '.', 1));
  end if;

  -- Reutilizar empresa existente: primero por dominio, luego por NIT
  select id into v_org from public.organizations
    where lower(dominio) = v_dominio limit 1;
  if v_org is null and v_nit is not null then
    select id into v_org from public.organizations
      where nit = v_nit limit 1;
  end if;

  if v_org is null then
    insert into public.organizations (nombre, nit, dominio)
    values (v_nombre, v_nit, v_dominio)
    returning id into v_org;
    v_rol := 'admin';   -- el primero de la empresa es admin
  end if;

  insert into public.memberships (user_id, org_id, rol)
  values (new.id, v_org, v_rol);

  return new;
end;
$$;

-- 4. (Opcional) limpiar empresas duplicadas de las pruebas anteriores.
--    Ejecuta manualmente tras revisar:
-- delete from public.organizations where dominio is null;
