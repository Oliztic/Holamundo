"use client";

import { useEffect, useState } from "react";

const KEY = "oliztic_cookie_consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      // localStorage no disponible
    }
  }, []);

  function decidir(valor) {
    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ value: valor, date: new Date().toISOString() })
      );
    } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consentimiento de cookies">
      <div className="cookie-text">
        Usamos cookies esenciales para el funcionamiento del sitio y, con tu
        permiso, cookies de analítica para mejorar la experiencia. Consulta
        nuestra <a href="/privacidad">Política de Datos</a>.
      </div>
      <div className="cookie-actions">
        <button className="cookie-reject" onClick={() => decidir("rejected")}>
          Rechazar
        </button>
        <button className="cookie-accept" onClick={() => decidir("accepted")}>
          Aceptar
        </button>
      </div>
    </div>
  );
}
