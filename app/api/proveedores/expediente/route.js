import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";
import { createAdminClient } from "../../../../lib/supabase/admin";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
  }
  const proveedorUserId = (body?.proveedorUserId || "").trim();
  if (!proveedorUserId) {
    return NextResponse.json({ error: "Falta el proveedor" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { data: mem } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();
  const orgId = mem?.org_id;
  if (!orgId) return NextResponse.json({ error: "Sin empresa asociada" }, { status: 400 });

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Falta configuración del servidor" }, { status: 500 });
  }
  const admin = createAdminClient();

  // La empresa solo puede ver el expediente de un proveedor que ELLA invitó
  const { data: inv } = await admin
    .from("proveedores")
    .select("id")
    .eq("org_id", orgId)
    .eq("user_id", proveedorUserId)
    .limit(1)
    .maybeSingle();
  if (!inv) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { data: prov } = await admin.auth.admin.getUserById(proveedorUserId);
  const meta = prov?.user?.user_metadata || {};

  const { data: docs, error } = await admin
    .from("proveedor_documentos")
    .select("doc_key, categoria, nombre, tag, file_name, file_size, fecha_expedicion, estado")
    .eq("proveedor_user_id", proveedorUserId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    personnel: meta.sends_personnel !== false,
    enviado: !!meta.expediente_enviado,
    enviadoAt: meta.expediente_enviado_at || null,
    docs: docs || [],
  });
}
