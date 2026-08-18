"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function PanelProveedorPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user;
      if (!u) {
        router.replace("/login-proveedores");
        return;
      }
      if (u.user_metadata?.rol !== "proveedor") {
        router.replace("/panel");
        return;
      }
      if (u.user_metadata?.must_change_password) {
        router.replace("/cambiar-clave");
        return;
      }
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login-proveedores");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="panel-loading">
        <p>Cargando…</p>
      </div>
    );
  }

  const nombre =
    user?.user_metadata?.company_name || user?.email?.split("@")[0] || "Proveedor";

  return (
    <div className="prov-shell">
      <header className="prov-topbar">
        <img src="/logo_nav.svg" alt="OLIZTIC" className="prov-logo" />
        <div className="prov-topbar-right">
          <span className="prov-user">{user.email}</span>
          <button className="prov-logout" onClick={cerrarSesion}>
            Cerrar sesión
          </button>
        </div>
      </header>
      <main className="prov-main">
        <h1>Portal de proveedor</h1>
        <p>Bienvenido, {nombre}. Aún no hay módulos disponibles.</p>
      </main>
    </div>
  );
}
