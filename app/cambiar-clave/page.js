"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function CambiarClavePage() {
  const router = useRouter();
  const supabase = createClient();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.replace("/login-proveedores");
        return;
      }
      setReady(true);
    });
  }, []);

  async function guardar(e) {
    e.preventDefault();
    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmar) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    setMensaje("");
    const { error } = await supabase.auth.updateUser({
      password,
      data: { must_change_password: false },
    });
    setCargando(false);
    if (error) {
      setMensaje(error.message);
      return;
    }
    router.push("/panel-proveedor");
    router.refresh();
  }

  if (!ready) {
    return (
      <div className="panel-loading">
        <p>Cargando…</p>
      </div>
    );
  }

  return (
    <div className="auth">
      <aside className="auth-side">
        <div className="auth-side-inner">
          <img src="/logo_nav1.svg" alt="OLIZTIC" className="auth-logo" />
        </div>
        <div className="auth-side-foot">© {new Date().getFullYear()} OLIZTIC</div>
      </aside>

      <main className="auth-main">
        <form className="auth-form" onSubmit={guardar}>
          <div className="auth-eyebrow">Portal de proveedores</div>
          <h1 className="auth-title">Cambia tu contraseña</h1>
          <p className="auth-sub">
            Por seguridad, define una contraseña nueva antes de continuar.
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
            required
          />

          <div style={{ height: 14 }} />
          <label className="auth-label" htmlFor="confirmar">
            Confirmar contraseña
          </label>
          <input
            id="confirmar"
            type={showPass ? "text" : "password"}
            className="auth-input"
            placeholder="Repite la contraseña"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            required
          />

          <div style={{ height: 20 }} />

          {mensaje && <div className="auth-error">{mensaje}</div>}

          <button type="submit" className="auth-submit" disabled={cargando}>
            {cargando ? "Guardando…" : "Guardar y continuar"}
          </button>
        </form>
      </main>
    </div>
  );
}
