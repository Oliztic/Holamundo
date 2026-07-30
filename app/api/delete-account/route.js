import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { createAdminClient } from "../../../lib/supabase/admin";

// Elimina la cuenta del usuario autenticado (derecho de supresión / Habeas Data).
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      {
        error:
          "Falta la variable SUPABASE_SERVICE_ROLE_KEY en el servidor. Agrégala para habilitar la eliminación de cuenta.",
      },
      { status: 500 }
    );
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Cerramos la sesión (limpia las cookies)
  await supabase.auth.signOut();

  return NextResponse.json({ ok: true });
}
