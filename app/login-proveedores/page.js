"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginProveedoresPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setCargando(false);
    if (error) {
      setMensaje(error.message);
      return;
    }
    if (data?.user?.user_metadata?.must_change_password) {
      router.push("/cambiar-clave");
    } else {
      router.push("/panel-proveedor");
    }
    router.refresh();
  }

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="auth-side-inner">
          <img src="/logo_nav1.svg" alt="OLIZTIC" className="auth-logo" />
        </div>
        <div className="auth-side-foot">
          © {new Date().getFullYear()} OLIZTIC · <a href="/">Volver al sitio</a>
        </div>
      </aside>

      <main className="auth-main">
        <form className="auth-form" onSubmit={iniciarSesion}>
          <div className="auth-eyebrow">Portal de proveedores</div>
          <h1 className="auth-title">Acceso proveedores</h1>
          <p className="auth-sub">
            Ingresa con el correo y la contraseña temporal de tu invitación.
          </p>

          <label className="auth-label" htmlFor="email">
            Correo corporativo
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="contacto@proveedor.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="auth-label-row">
            <label className="auth-label" htmlFor="password">
              Contraseña
            </label>
            <button
              type="button"
              className="auth-linkbtn"
              onClick={() => setShowPass((v) => !v)}
            >
              {showPass ? "Ocultar" : "Mostrar"}
            </button>
          </div>
          <input
            id="password"
            type={showPass ? "text" : "password"}
            className="auth-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div style={{ height: 20 }} />

          {mensaje && <div className="auth-error">{mensaje}</div>}

          <button type="submit" className="auth-submit" disabled={cargando}>
            {cargando ? "Entrando…" : "Iniciar sesión"}
          </button>
        </form>
      </main>
    </div>
  );
}
