import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";
import { enviarInvitacionProveedor } from "../../../../lib/email";

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
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: "Falta SUPABASE_SERVICE_ROLE_KEY en el servidor" },
      { status: 500 }
    );
  }

  const admin = createAdminClient();

  // Solo proveedores de la empresa del usuario
  const { data: prov } = await admin
    .from("proveedores")
    .select("id, nit, user_id")
    .eq("org_id", orgId)
    .eq("correo", correo)
    .maybeSingle();
  if (!prov) {
    return NextResponse.json(
      { error: "Proveedor no encontrado" },
      { status: 404 }
    );
  }

  const pass = tempPassword();
  const nombre = correo.split("@")[1].split(".")[0];

  if (prov.user_id) {
    const { error } = await admin.auth.admin.updateUserById(prov.user_id, {
      password: pass,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: correo,
      password: pass,
      email_confirm: true,
      user_metadata: {
        rol: "proveedor",
        verificado: true,
        company_name: nombre,
        company_nit: prov.nit,
      },
    });
    if (!error && created?.user?.id) {
      await admin
        .from("proveedores")
        .update({ user_id: created.user.id })
        .eq("id", prov.id);
    }
  }

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
    tempPassword: emailSent ? undefined : pass,
  });
}
