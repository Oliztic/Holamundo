"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setCargando(false);
    if (error) {
      setMensaje(error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function continuarConGoogle() {
    setMensaje("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setMensaje(error.message);
  }

  return (
    <div className="auth">
      {/* IZQUIERDA: marca */}
      <aside className="auth-side">
        <div className="auth-side-inner">
          <img src="/logo_nav1.svg" alt="OLIZTIC" className="auth-logo" />
        </div>
        <div className="auth-side-foot">
          © {new Date().getFullYear()} OLIZTIC ·{" "}
          <a href="/">Volver al sitio</a>
        </div>
      </aside>

      {/* DERECHA: formulario */}
      <main className="auth-main">
        <form className="auth-form" onSubmit={iniciarSesion}>
          <div className="auth-eyebrow">Passly · Portal de clientes</div>
          <h1 className="auth-title">Bienvenido de nuevo</h1>
          <p className="auth-sub">
            Ingresa con tu cuenta corporativa para continuar.
          </p>

          <label className="auth-label" htmlFor="email">
            Correo corporativo
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

          <div className="auth-row">
            <label className="auth-check">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Recordarme
            </label>
            <a href="#" className="auth-link">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {mensaje && <div className="auth-error">{mensaje}</div>}

          <button type="submit" className="auth-submit" disabled={cargando}>
            {cargando ? "Entrando…" : "Iniciar sesión"}
          </button>

          <div className="auth-divider">
            <span>o</span>
          </div>

          <button
            type="button"
            className="auth-google"
            onClick={continuarConGoogle}
          >
            <GoogleIcon />
            Continuar con Google
          </button>

          <p className="auth-foot">
            ¿No tienes acceso? <a href="/#cta-final">Solicita una demo</a>
          </p>
        </form>
      </main>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 16 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.2C29.2 35.1 26.7 36 24 36c-5.3 0-9.7-3.1-11.3-7.5l-6.5 5C9.6 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.3 5.2C41.4 36.4 44 30.7 44 24c0-1.3-.1-2.3-.4-3.5z"
      />
    </svg>
  );
}
