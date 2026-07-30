"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function CuentaPage() {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmar, setConfirmar] = useState(false);
  const [borrando, setBorrando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace("/login");
      } else {
        setUser(data.user);
      }
      setLoading(false);
    });
  }, []);

  async function eliminarCuenta() {
    setBorrando(true);
    setError("");
    try {
      const res = await fetch("/api/delete-account", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "No se pudo eliminar la cuenta.");
        setBorrando(false);
        return;
      }
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (e) {
      setError("Error de red. Inténtalo de nuevo.");
      setBorrando(false);
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <div className="cuenta-wrap">
        <p style={{ color: "var(--muted)" }}>Cargando…</p>
      </div>
    );
  }

  const nombre =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0];

  return (
    <div className="cuenta-wrap">
      <div className="cuenta-card">
        <a href="/" className="legal-back" style={{ display: "inline-block", marginBottom: 20 }}>
          ← Volver al sitio
        </a>

        <h1 className="cuenta-title">Mi cuenta</h1>

        <div className="cuenta-field">
          <span className="cuenta-label">Nombre</span>
          <span className="cuenta-value">{nombre}</span>
        </div>
        <div className="cuenta-field">
          <span className="cuenta-label">Correo</span>
          <span className="cuenta-value">{user.email}</span>
        </div>
        {user?.user_metadata?.phone && (
          <div className="cuenta-field">
            <span className="cuenta-label">Teléfono</span>
            <span className="cuenta-value">{user.user_metadata.phone}</span>
          </div>
        )}

        <button className="cuenta-logout" onClick={cerrarSesion}>
          Cerrar sesión
        </button>

        <div className="cuenta-danger">
          <h2>Eliminar cuenta</h2>
          <p>
            Esta acción elimina permanentemente tu cuenta y tus datos personales
            (derecho de supresión). No se puede deshacer.
          </p>

          {error && <div className="auth-error">{error}</div>}

          {!confirmar ? (
            <button className="cuenta-delete" onClick={() => setConfirmar(true)}>
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="cuenta-confirm">
              <p>¿Seguro que deseas eliminar tu cuenta?</p>
              <div className="cuenta-confirm-actions">
                <button
                  className="cuenta-cancel"
                  onClick={() => setConfirmar(false)}
                  disabled={borrando}
                >
                  Cancelar
                </button>
                <button
                  className="cuenta-delete"
                  onClick={eliminarCuenta}
                  disabled={borrando}
                >
                  {borrando ? "Eliminando…" : "Sí, eliminar definitivamente"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
