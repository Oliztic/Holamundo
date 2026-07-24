"use client";

import { useState } from "react";

export default function Pricing() {
  const [anual, setAnual] = useState(false);
  const fmt = (monthly) => (anual ? Math.round(monthly * 0.8) : monthly);
  const suffix = anual ? "/mes, facturado anual" : "/mes";

  return (
    <>
      <div className="billing-toggle reveal from-bottom">
        <div className="switch">
          <button
            className={!anual ? "active" : ""}
            onClick={() => setAnual(false)}
          >
            Mensual
          </button>
          <button
            className={anual ? "active" : ""}
            onClick={() => setAnual(true)}
          >
            Anual <span className="save">-20%</span>
          </button>
        </div>
      </div>

      <div className="pricing-grid">
        {/* Starter */}
        <div className="price-card reveal d1">
          <h3>Starter</h3>
          <p className="p-desc">
            Para equipos que inician su transformación digital.
          </p>
          <div className="price-row">
            <span className="price-amount">${fmt(490)}</span>
            <span className="price-cur">USD</span>
          </div>
          <div className="price-suffix">{suffix}</div>
          <div className="price-feats">
            <div className="feat">
              <span className="check check-gate">✓</span>1 módulo Passly
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Hasta 250
              verificaciones/mes
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Soporte por correo
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Panel de reportes básico
            </div>
          </div>
          <a href="/login" className="price-cta outline">
            Empezar
          </a>
        </div>

        {/* Business (featured) */}
        <div className="price-card featured reveal d2">
          <div className="badge-popular">Más elegido</div>
          <h3>Business</h3>
          <p className="p-desc">
            Para operaciones con múltiples frentes de compliance.
          </p>
          <div className="price-row">
            <span className="price-amount">${fmt(1290)}</span>
            <span className="price-cur">USD</span>
          </div>
          <div className="price-suffix">{suffix}</div>
          <div className="price-feats">
            <div className="feat">
              <span className="check check-gate">✓</span>Los 3 módulos Passly
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Verificaciones ilimitadas
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Acceso completo a la API
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Soporte prioritario 24/7
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Reportes y auditoría
              avanzada
            </div>
          </div>
          <a href="/login" className="price-cta btn-primary">
            Solicitar demo
          </a>
        </div>

        {/* Enterprise */}
        <div className="price-card reveal d3">
          <h3>Enterprise</h3>
          <p className="p-desc">
            Para operaciones multi-país con necesidades a medida.
          </p>
          <div className="price-row">
            <span className="price-amount sm">Personalizado</span>
          </div>
          <div className="price-suffix">Cotización a medida</div>
          <div className="price-feats">
            <div className="feat">
              <span className="check check-gate">✓</span>Todo lo de Business
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>SLA e integración dedicada
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Despliegue multi-país
            </div>
            <div className="feat">
              <span className="check check-gate">✓</span>Gerente de cuenta dedicado
            </div>
          </div>
          <a href="/login" className="price-cta outline">
            Hablar con ventas
          </a>
        </div>
      </div>
    </>
  );
}
