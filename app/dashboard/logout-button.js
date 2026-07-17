"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();
  const supabase = createClient();

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={cerrarSesion}
      style={{
        marginTop: "2rem",
        padding: "0.75rem 1.5rem",
        borderRadius: "8px",
        border: "none",
        background: "white",
        color: "#1e3a8a",
        fontSize: "1rem",
        cursor: "pointer",
      }}
    >
      Cerrar sesión
    </button>
  );
}
