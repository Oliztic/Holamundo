"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [ok, setOk] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const e = new URLSearchParams(window.location.search).get("email");
    if (e) setEmail(e);
  }, []);

  async function guardar(e) {
    e.preventDefault();
    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setCargando(true);
    setMensaje("");
    setOk("");

    let json = {};
    try {
      const res = await fetch("/api/reset/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), code: codigo.trim(), password }),
      });
      json = await res.json();
      if (!res.ok) {
        setCargando(false);
        setMensaje(json.error || "No se pudo cambiar la contraseña.");
        return;
      }
    } catch {
      setCargando(false);
      setMensaje("Error de red.");
      return;
    }
    setCargando(false);
    setOk("Contraseña actualizada. Redirigiendo a iniciar sesión…");
    setTimeout(() => router.push("/login"), 1400);
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
        <form className="auth-form" onSubmit={guardar}>
          <div className="auth-eyebrow">Passly · Portal de clientes</div>
          <h1 className="auth-title">Nueva contraseña</h1>
          <p className="auth-sub">
            Ingresa el código de 6 dígitos que enviamos a tu correo y tu nueva
            contraseña.
          </p>

          <label className="auth-label" htmlFor="email">
            Correo
          </label>
          <input
            id="email"
            type="email"
            className="auth-input"
            placeholder="nombre@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ height: 14 }} />
          <label className="auth-label" htmlFor="codigo">
            Código de verificación
          </label>
          <input
            id="codigo"
            type="text"
            inputMode="numeric"
            maxLength={6}
            className="auth-input"
            placeholder="123456"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
            required
          />

          <div style={{ height: 14 }} />
          <div className="auth-label-row">
            <label className="auth-label" htmlFor="password">
              Nueva contraseña
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <div style={{ height: 20 }} />

          {mensaje && <div className="auth-error">{mensaje}</div>}
          {ok && <div className="auth-ok">{ok}</div>}

          <button type="submit" className="auth-submit" disabled={cargando}>
            {cargando ? "Guardando…" : "Guardar contraseña"}
          </button>

          <p className="auth-foot">
            <a href="/login">Volver a iniciar sesión</a>
          </p>
        </form>
      </main>
    </div>
  );
}
