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
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      const q = url.searchParams;

      // Error explícito devuelto por Supabase (enlace expirado, etc.)
      const errCode = q.get("error") || hash.get("error");
      const errDesc = q.get("error_description") || hash.get("error_description");
      if (errCode) {
        setMensaje(`Error: ${errDesc || errCode}`);
        return;
      }

      let err = null;
      try {
        const code = q.get("code");
        const token_hash = q.get("token_hash") || hash.get("token_hash");
        const type = q.get("type") || hash.get("type") || "recovery";
        const access_token = hash.get("access_token");
        const refresh_token = hash.get("refresh_token");

        if (access_token && refresh_token) {
          const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          err = error;
        } else if (code) {
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
