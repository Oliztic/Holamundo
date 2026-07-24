"use client";

import { useState, useRef } from "react";

/* ---------- Íconos de línea (stroke, heredan color) ---------- */
const paths = {
  shield: "M12 3l7 3v5c0 4-3 7.5-7 8.5C8 18.5 5 15 5 11V6l7-3z",
  box: "M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3zm0 0v18M4 7.5l8 4.5 8-4.5",
  users:
    "M9 11a3 3 0 100-6 3 3 0 000 6zm7 0a3 3 0 100-6M3 20v-1a4 4 0 014-4h4a4 4 0 014 4v1m2 0v-1a4 4 0 00-3-3.87",
  key: "M15 7a3 3 0 11-2.83 4H8v3H5v-3H3.5L2 9.5 3.5 8H12.2A3 3 0 0115 7z",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  plug: "M9 2v6M15 2v6M7 8h10v3a5 5 0 01-10 0V8zM12 16v6",
  doc: "M7 3h7l5 5v13H7V3zm7 0v5h5",
  face: "M12 21a9 9 0 100-18 9 9 0 000 18zM9 10h.01M15 10h.01M9 15c1 1 5 1 6 0",
  building: "M4 21V5l8-2v18M12 21V9l6 2v10M4 21h16M8 8h.01M8 12h.01M8 16h.01",
  lock: "M6 10V8a6 6 0 1112 0v2M5 10h14v11H5V10zm7 4v3",
  phone: "M5 4h4l2 5-3 2a12 12 0 005 5l2-3 5 2v4a2 2 0 01-2 2A17 17 0 013 6a2 2 0 012-2z",
  info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01",
  handshake: "M8 11l3-3 3 3 3-3M3 12l4 4a2 2 0 003 0l1-1 1 1a2 2 0 003 0l4-4",
  spark: "M12 3v6M12 15v6M3 12h6M15 12h6M6 6l3 3M15 15l3 3M18 6l-3 3M9 15l-3 3",
};

function Icon({ name }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}

/* ---------- Contenido de los mega-menús ---------- */
const MENUS = {
  products: {
    label: "Products",
    width: 660,
    cols: [
      {
        title: "Módulos Passly",
        items: [
          { icon: "shield", t: "Passly GATE", d: "Control de acceso y compliance en tiempo real.", href: "#passly-gate" },
          { icon: "box", t: "Passly VENDOR", d: "Onboarding y monitoreo de proveedores.", href: "#passly-vendor" },
          { icon: "users", t: "Passly WORK", d: "Gestión de talento y RRHH sincronizada.", href: "#passly-work" },
        ],
      },
      {
        title: "Plataforma",
        items: [
          { icon: "key", t: "API de verificación", d: "Verifica identidad y documentos vía API.", href: "#api" },
          { icon: "chart", t: "Dashboard & Reportes", d: "Métricas y auditoría en vivo.", href: "#api" },
          { icon: "plug", t: "Integraciones", d: "ZKTeco, Hikvision y más.", href: "#api", badge: "Nuevo" },
        ],
      },
    ],
  },
  solutions: {
    label: "Solutions",
    width: 820,
    cols: [
      {
        title: "Por caso de uso",
        items: [
          { icon: "lock", t: "Control de acceso", href: "#passly-gate" },
          { icon: "shield", t: "Cumplimiento legal", href: "#como-funciona" },
          { icon: "box", t: "Onboarding de proveedores", href: "#passly-vendor" },
          { icon: "doc", t: "Gestión de contratistas", href: "#passly-vendor" },
          { icon: "users", t: "Certificaciones RRHH", href: "#passly-work" },
        ],
      },
      {
        title: "Por industria",
        items: [
          { icon: "building", t: "Manufactura", href: "#" },
          { icon: "box", t: "Logística y transporte", href: "#" },
          { icon: "building", t: "Construcción", href: "#" },
          { icon: "chart", t: "Retail", href: "#" },
          { icon: "shield", t: "Salud", href: "#" },
        ],
      },
      {
        title: "Por tecnología",
        items: [
          { icon: "face", t: "Verificación biométrica", href: "#" },
          { icon: "doc", t: "Firma digital", href: "#" },
          { icon: "spark", t: "API-first", href: "#api" },
        ],
      },
    ],
  },
  company: {
    label: "Company",
    width: 320,
    cols: [
      {
        title: "Compañía",
        items: [
          { icon: "info", t: "Nosotros", d: "Quiénes somos y nuestra misión.", href: "#" },
          { icon: "phone", t: "Contacto", d: "Habla con nuestro equipo.", href: "#cta-final" },
          { icon: "handshake", t: "Partners", d: "Conviértete en aliado Oliztic.", href: "#" },
        ],
      },
    ],
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef(null);

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = (key) => {
    cancelClose();
    setOpen(key);
  };
  // Retardo de gracia: al salir esperamos un instante antes de cerrar,
  // así se puede cruzar el hueco entre el botón y el panel sin que desaparezca.
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpen(null), 180);
  };

  const activeMenu = open ? MENUS[open] : null;

  return (
    <header className="site-header">
      <a href="/" className="brand">
        <img src="/logo_nav.svg" alt="OLIZTIC" className="brand-logo" />
      </a>

      {/* NAV DESKTOP con mega-menús */}
      <nav
        className="mega-nav"
        onMouseEnter={cancelClose}
        onMouseLeave={scheduleClose}
      >
        {Object.entries(MENUS).map(([key, menu]) => (
          <button
            key={key}
            className={`mega-item ${open === key ? "is-open" : ""}`}
            onMouseEnter={() => openMenu(key)}
            onClick={() => setOpen(open === key ? null : key)}
          >
            {menu.label}
            <svg className="chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        ))}
        <a href="#precios" className="mega-link-plain">Precios</a>
        <a href="#api" className="mega-link-plain">API Docs</a>

        {/* Panel desplegable */}
        {activeMenu && (
          <div
            className="mega-panel"
            style={{ width: activeMenu.width }}
            onMouseEnter={cancelClose}
          >
            <div
              className="mega-cols"
              style={{ gridTemplateColumns: `repeat(${activeMenu.cols.length}, 1fr)` }}
            >
              {activeMenu.cols.map((col) => (
                <div className="mega-col" key={col.title}>
                  <div className="mega-col-title">{col.title}</div>
                  {col.items.map((it) => (
                    <a className="mega-link" href={it.href} key={it.t} onClick={() => setOpen(null)}>
                      <span className="mega-ico">
                        <Icon name={it.icon} />
                      </span>
                      <span className="mega-txt">
                        <span className="mega-t">
                          {it.t}
                          {it.badge && <span className="pill-new">{it.badge}</span>}
                        </span>
                        {it.d && <span className="mega-d">{it.d}</span>}
                      </span>
                      {!it.d && <span className="mega-arrow">›</span>}
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      <a href="/login" className="btn btn-primary header-cta">
        Solicitar demo
      </a>

      {/* Botón hamburguesa (móvil) */}
      <button
        className="nav-toggle"
        aria-label="Abrir menú"
        onClick={() => setMobile((v) => !v)}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          {mobile ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {/* Menú móvil desplegable */}
      {mobile && (
        <div className="mobile-menu">
          {Object.values(MENUS).map((menu) => (
            <div className="mobile-group" key={menu.label}>
              <div className="mobile-group-title">{menu.label}</div>
              {menu.cols.flatMap((c) => c.items).map((it) => (
                <a key={it.t} href={it.href} onClick={() => setMobile(false)}>
                  {it.t}
                </a>
              ))}
            </div>
          ))}
          <div className="mobile-group">
            <a href="#precios" onClick={() => setMobile(false)}>Precios</a>
            <a href="#api" onClick={() => setMobile(false)}>API Docs</a>
            <a href="/login" className="btn btn-primary" style={{ padding: "12px", borderRadius: 10, marginTop: 8 }}>
              Solicitar demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
