-- =====================================================================
-- Oliztic - Automatizacion de tenant + org_id en el JWT
-- Ejecutar DESPUES de schema-multitenant.sql, en Supabase -> SQL Editor
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. TRIGGER: al crear un usuario, crear su empresa y su membresia
--    Funciona para registro por correo Y por Google (cualquier signup).
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_org_id uuid;
  org_nombre text;
begin
  org_nombre := coalesce(
    nullif(new.raw_user_meta_data->>'company_name', ''),
    nullif(new.raw_user_meta_data->>'full_name', ''),
    split_part(new.email, '@', 1)
  );

  insert into public.organizations (nombre)
  values (org_nombre)
  returning id into new_org_id;

  insert into public.memberships (user_id, org_id, rol)
  values (new.id, new_org_id, 'admin');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 2. CUSTOM ACCESS TOKEN HOOK: agrega org_id al JWT (app_metadata.org_id)
--    Recuerda ACTIVARLO en el Dashboard (paso manual, ver notas abajo).
-- ---------------------------------------------------------------------
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  v_org_id uuid;
begin
  select org_id into v_org_id
  from public.memberships
  where user_id = (event->>'user_id')::uuid
  limit 1;

  claims := event->'claims';

  if claims->'app_metadata' is null then
    claims := jsonb_set(claims, '{app_metadata}', '{}'::jsonb);
  end if;

  if v_org_id is not null then
    claims := jsonb_set(claims, '{app_metadata,org_id}', to_jsonb(v_org_id::text));
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

-- Permisos requeridos por Supabase Auth para ejecutar el hook
grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
grant select on table public.memberships to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook(jsonb) from authenticated, anon, public;

-- ---------------------------------------------------------------------
-- 3. auth_org_id() mejorada: usa el JWT si esta disponible; si no,
--    consulta la tabla (fallback). Reemplaza la version anterior.
-- ---------------------------------------------------------------------
create or replace function public.auth_org_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(auth.jwt() -> 'app_metadata' ->> 'org_id', '')::uuid,
    (select org_id from public.memberships where user_id = auth.uid() limit 1)
  );
$$;

-- =====================================================================
-- PASO MANUAL (obligatorio para el hook del JWT):
--   Supabase Dashboard -> Authentication -> Hooks (Auth Hooks)
--   -> "Custom Access Token" -> selecciona la funcion
--      public.custom_access_token_hook -> Enable.
--
--   El org_id aparece en el token en el proximo login / refresh.
--   Mientras tanto, auth_org_id() sigue funcionando por el fallback.
-- =====================================================================
