"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [ok, setOk] = useState("");
  const [cargando, setCargando] = useState(false);

  // Establece la sesión desde el enlace del correo antes de permitir el cambio.
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) setReady(true);
    });

    (async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const token_hash =
        url.searchParams.get("token_hash") ||
        new URLSearchParams(url.hash.replace(/^#/, "")).get("token_hash");
      const type = url.searchParams.get("type") || "recovery";
      let err = null;
      try {
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          err = error;
        } else if (token_hash) {
          const { error } = await supabase.auth.verifyOtp({ type, token_hash });
          err = error;
        }
      } catch (e) {
        err = e;
      }
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setReady(true);
      } else {
        setMensaje(
          "Enlace inválido o expirado" +
            (err?.message ? ` (${err.message})` : "") +
            ". Solicita de nuevo el correo de recuperación."
        );
      }
    })();

    return () => sub.subscription.unsubscribe();
  }, []);

  async function guardar(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    setOk("");
    const { error } = await supabase.auth.updateUser({ password });
    setCargando(false);
    if (error) {
      setMensaje(error.message);
    } else {
      setOk("Contraseña actualizada. Redirigiendo…");
      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1400);
    }
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
            Escribe tu nueva contraseña para acceder a tu cuenta.
          </p>

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

          <div style={{ height: 24 }} />

          {mensaje && <div className="auth-error">{mensaje}</div>}
          {ok && <div className="auth-ok">{ok}</div>}

          <button
            type="submit"
            className="auth-submit"
            disabled={cargando || !ready}
          >
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
