import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { createAdminClient, buscarUsuarioPorCorreo } from "../../../../lib/supabase/admin";
import { enviarInvitacionProveedor } from "../../../../lib/email";

const PUBLICOS = [
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "live.com",
  "icloud.com", "aol.com", "protonmail.com", "proton.me", "gmx.com",
  "yandex.com", "mail.com", "hotmail.es", "outlook.es", "yahoo.es",
];

function tempPassword() {
  const base = Math.random().toString(36).slice(2, 10);
  return base.charAt(0).toUpperCase() + base.slice(1) + "9!";
}

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }

  const nit = (body?.nit || "").trim();
  const correo = (body?.correo || "").trim().toLowerCase();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  const { data: mem } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  const orgId = mem?.org_id;
  if (!orgId) {
    return NextResponse.json({ error: "Sin empresa asociada" }, { status: 400 });
  }

  const dominio = correo.split("@")[1];
  if (!dominio || PUBLICOS.includes(dominio)) {
    return NextResponse.json(
      { error: "El correo del proveedor debe ser corporativo" },
      { status: 400 }
    );
  }
  if (!nit) {
    return NextResponse.json({ error: "El NIT es obligatorio" }, { status: 400 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor" },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const pass = tempPassword();
  const nombre = dominio.split(".")[0];

  // Crear o actualizar la cuenta del proveedor (siempre aplica la clave temporal)
  let providerUserId = null;
  let yaExistia = false;
  const existente = await buscarUsuarioPorCorreo(admin, correo);
  if (existente) {
    yaExistia = true;
    providerUserId = existente.id;
    await admin.auth.admin.updateUserById(existente.id, {
      password: pass,
      email_confirm: true,
      user_metadata: {
        ...(existente.user_metadata || {}),
        rol: "proveedor",
        verificado: true,
        must_change_password: true,
        company_nit: nit,
      },
    });
  } else {
    const { data: created } = await admin.auth.admin.createUser({
      email: correo,
      password: pass,
      email_confirm: true,
      user_metadata: {
        rol: "proveedor",
        verificado: true,
        must_change_password: true,
        company_name: nombre,
        company_nit: nit,
      },
    });
    providerUserId = created?.user?.id ?? null;
  }

  // Registrar la invitación en la empresa que invita
  const { error: iErr } = await admin.from("proveedores").insert({
    org_id: orgId,
    nit,
    nombre,
    correo,
    estado: "Invitado",
    invited_by: user.id,
    user_id: providerUserId,
  });
  if (iErr) {
    if (iErr.code === "23505") {
      return NextResponse.json(
        { error: "Este proveedor ya fue invitado" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: iErr.message }, { status: 500 });
  }

  // Enviar el correo con la contraseña temporal
  const origin = req.headers.get("origin") || new URL(req.url).origin;
  let emailSent = false;
  try {
    emailSent = await enviarInvitacionProveedor(correo, pass, origin);
  } catch {
    emailSent = false;
  }

  return NextResponse.json({
    ok: true,
    emailSent,
    yaExistia,
    tempPassword: emailSent ? undefined : pass,
  });
}
