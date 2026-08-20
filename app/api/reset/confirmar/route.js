import { NextResponse } from "next/server";
import {
  createAdminClient,
  buscarUsuarioPorCorreo,
} from "../../../../lib/supabase/admin";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
  const correo = (body?.email || "").trim().toLowerCase();
  const code = (body?.code || "").trim();
  const password = body?.password || "";

  if (!correo || !code || password.length < 6) {
    return NextResponse.json(
      { error: "Datos incompletos o contraseña muy corta" },
      { status: 400 }
    );
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Servidor sin configurar" }, { status: 500 });
  }

  const admin = createAdminClient();

  const { data: fila } = await admin
    .from("reset_codes")
    .select("id, expires_at, used")
    .eq("email", correo)
    .eq("code", code)
    .maybeSingle();

  if (!fila || fila.used || new Date(fila.expires_at) < new Date()) {
    return NextResponse.json(
      { error: "Código inválido o expirado" },
      { status: 400 }
    );
  }

  const usuario = await buscarUsuarioPorCorreo(admin, correo);
  if (!usuario) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }

  const { error } = await admin.auth.admin.updateUserById(usuario.id, {
    password,
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await admin.from("reset_codes").update({ used: true }).eq("id", fila.id);

  return NextResponse.json({ ok: true });
}
