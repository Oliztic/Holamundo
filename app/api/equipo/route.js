import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { createAdminClient } from "../../../lib/supabase/admin";

export async function GET() {
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
  const { data: miembros } = await admin
    .from("memberships")
    .select("user_id, rol, created_at")
    .eq("org_id", orgId)
    .order("created_at", { ascending: true });

  const equipo = [];
  for (const m of miembros || []) {
    const { data } = await admin.auth.admin.getUserById(m.user_id);
    const u = data?.user;
    equipo.push({
      id: m.user_id,
      rol: m.rol,
      nombre:
        u?.user_metadata?.full_name || u?.email?.split("@")[0] || "Usuario",
      correo: u?.email || "",
      telefono: u?.user_metadata?.phone || "",
      desde: m.created_at,
    });
  }

  return NextResponse.json({ equipo, yo: user.id });
}
