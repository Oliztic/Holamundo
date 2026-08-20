import { NextResponse } from "next/server";
import {
  createAdminClient,
  buscarUsuarioPorCorreo,
} from "../../../../lib/supabase/admin";
import { enviarCodigoReset } from "../../../../lib/email";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
  const correo = (body?.email || "").trim().toLowerCase();
  if (!correo) {
    return NextResponse.json({ error: "Correo requerido" }, { status: 400 });
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Servidor sin configurar" }, { status: 500 });
  }

  const admin = createAdminClient();
  const usuario = await buscarUsuarioPorCorreo(admin, correo);

  // Solo enviamos si el usuario existe, pero respondemos ok igual (no filtrar)
  if (usuario) {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    const expires = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    // Invalidar códigos previos y crear el nuevo
    await admin.from("reset_codes").delete().eq("email", correo);
    await admin
      .from("reset_codes")
      .insert({ email: correo, code, expires_at: expires });

    try {
      await enviarCodigoReset(correo, code);
    } catch {}
  }

  return NextResponse.json({ ok: true });
}
