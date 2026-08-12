"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";
import ProveedoresSection from "./proveedores";
import EquipoSection from "./equipo";

const ICONS = {
  inicio: "M3 11l9-8 9 8M5 10v10h14V10",
  gate: "M3 7h18M3 12h18M3 17h18",
  facturacion: "M6 2h9l5 5v15H6zM14 2v5h5M9 13h6M9 17h6",
  config:
    "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 00-.1-1l2-1.6-2-3.4-2.4 1a7 7 0 00-1.7-1L14.5 2h-4l-.3 2.9a7 7 0 00-1.7 1l-2.4-1-2 3.4L4 11a7 7 0 000 2l-2 1.6 2 3.4 2.4-1a7 7 0 001.7 1l.3 2.9h4l.3-2.9a7 7 0 001.7-1l2.4 1 2-3.4-2-1.6a7 7 0 00.1-1z",
};

const MENU = [
  { key: "inicio", label: "Inicio" },
  { key: "gate", label: "Proveedores" },
  { key: "facturacion", label: "Facturación" },
  { key: "config", label: "Configuración" },
];

function Icon({ name }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d={ICONS[name]} />
    </svg>
  );
}

export default function PanelPage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [org, setOrg] = useState("");
  const [seccion, setSeccion] = useState("inicio");
  const [navOpen, setNavOpen] = useState(false);
  const [avisoVerif, setAvisoVerif] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      setUser(user);
      let nombre = user.user_metadata?.company_name || "";
      try {
        const { data } = await supabase
          .from("memberships")
          .select("organizations(nombre)")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();
        if (data?.organizations?.nombre) nombre = data.organizations.nombre;
      } catch {}
      setOrg(nombre || "Mi empresa");
      setLoading(false);
    })();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function enviarVerificacion() {
    setEnviando(true);
    setAvisoVerif("");
    const { error } = await supabase.auth.signInWithOtp({
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/verificar`,
        shouldCreateUser: false,
      },
    });
    setEnviando(false);
    setAvisoVerif(
      error ? error.message : "Correo de verificación enviado. Revisa tu bandeja."
    );
  }

  if (loading) {
    return (
      <div className="panel-loading">
        <p>Cargando panel…</p>
      </div>
    );
  }

  const nombreUsuario =
    user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario";
  const inicial = (org || "E").charAt(0).toUpperCase();
  const seccionActual = MENU.find((m) => m.key === seccion);
  const provider = user?.app_metadata?.provider || "email";
  const noVerificado =
    provider === "email" && user?.user_metadata?.verificado !== true;

  return (
    <div className="panel">
      <aside className={`panel-side ${navOpen ? "open" : ""}`}>
        <div className="panel-brand">
          <img src="/logo_nav.svg" alt="OLIZTIC" />
        </div>

        <div className="panel-org">
          <span className="panel-org-badge">{inicial}</span>
          <div className="panel-org-txt">
            <span className="panel-org-name">{org}</span>
            <span className="panel-org-sub">Espacio de trabajo</span>
          </div>
        </div>

        <div className="panel-nav-label">Contenido</div>
        <nav className="panel-nav">
          {MENU.map((m) => (
            <button
              key={m.key}
              className={seccion === m.key ? "active" : ""}
              onClick={() => {
                setSeccion(m.key);
                setNavOpen(false);
              }}
            >
              <Icon name={m.key} />
              {m.label}
            </button>
          ))}
        </nav>

        <div className="panel-user">
          <span className="panel-user-avatar">
            {nombreUsuario.charAt(0).toUpperCase()}
          </span>
          <div className="panel-user-info">
            <span className="panel-user-name">{nombreUsuario}</span>
            <span className="panel-user-email">{user.email}</span>
          </div>
          <button
            className="panel-logout"
            onClick={cerrarSesion}
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="panel-main">
  

        <div className="panel-content">
          {noVerificado && (
            <div className="panel-alert">
              <div className="panel-alert-txt">
                <strong>Cuenta sin verificar.</strong> Verifica tu correo para
                asegurar el acceso a {org}.
              </div>
              <button
                className="panel-alert-btn"
                onClick={enviarVerificacion}
                disabled={enviando}
              >
                {enviando ? "Enviando…" : "Verificar correo"}
              </button>
            </div>
          )}
          {avisoVerif && <div className="panel-alert ok">{avisoVerif}</div>}

          {seccion === "inicio" ? (
            <>
              <div className="panel-welcome">
                <h2>Hola, {nombreUsuario}</h2>
                <p>Este es el panel de {org}.</p>
              </div>
              <div className="panel-cards">
                {MENU.filter((m) => m.key !== "inicio").map((m) => (
                  <button
                    key={m.key}
                    className="panel-card"
                    onClick={() => setSeccion(m.key)}
                  >
                    <span className="panel-card-ico">
                      <Icon name={m.key} />
                    </span>
                    <span className="panel-card-title">{m.label}</span>
                    <span className="panel-card-go">Abrir</span>
                  </button>
                ))}
              </div>
            </>
          ) : seccion === "gate" ? (
            <ProveedoresSection supabase={supabase} />
          ) : seccion === "config" ? (
            <EquipoSection />
          ) : (
            <Placeholder titulo={seccionActual?.label} />
          )}
        </div>
      </div>
    </div>
  );
}

function Placeholder({ titulo }) {
  return (
    <div className="panel-placeholder">
      <h2>{titulo}</h2>
      <p>Esta sección estará disponible pronto.</p>
    </div>
  );
}
