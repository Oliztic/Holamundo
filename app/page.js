import ScrollReveal from "./scroll-reveal";
import Pricing from "./pricing";
import Navbar from "./navbar";

export default function Home() {
  return (
    <>
      <ScrollReveal />

      {/* ---------- HEADER ---------- */}
      <Navbar />

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-col">
           
            <h1 className="hero-title reveal d1">
              Cumplimiento, proveedores y talento —{" "}
              <span className="grad-text">en un solo lugar.</span>
            </h1>
            <p className="hero-desc reveal d2">
              OLIZTIC conecta control de acceso, gestión de contratistas y RRHH
              en un ecosistema modular que elimina las fricciones operativas de
              tu empresa.
            </p>
            <div className="hero-actions reveal d3">
              <a href="/login" className="btn btn-primary shadow">
                Solicitar demo
              </a>
              <a href="#api" className="btn btn-outline">
                Ver documentación API
              </a>
            </div>
            <div className="hero-stats reveal d4">
              <div>
                <div className="num">3</div>
                <div className="lbl">Módulos integrados</div>
              </div>
              <div>
                <div className="num">98%</div>
                <div className="lbl">Cumplimiento legal promedio</div>
              </div>
              <div>
                <div className="num">API-first</div>
                <div className="lbl">Integración universal</div>
              </div>
            </div>
          </div>

          {/* DASHBOARD MOCK */}
          <div className="hero-col">
            <div className="mock reveal from-right d2">
              <div className="mock-top">
                <span className="tdot" style={{ background: "oklch(70% 0.16 25)" }} />
                <span className="tdot" style={{ background: "oklch(78% 0.14 85)" }} />
                <span className="tdot" style={{ background: "oklch(72% 0.15 150)" }} />
                <span className="label">Dashboard OLIZTIC</span>
              </div>
              <div className="mock-grid">
                <div
                  className="mock-card"
                  style={{
                    background: "oklch(96% 0.02 264)",
                    border: "1px solid oklch(90% 0.03 264)",
                  }}
                >
                  <div className="mc-label" style={{ color: "oklch(42% 0.14 264)" }}>
                    Passly GATE · Compliance
                  </div>
                  <div className="mc-val">98%</div>
                  <div className="mc-bar" style={{ background: "oklch(90% 0.02 264)" }}>
                    <span style={{ width: "92%", background: "oklch(54% 0.20 264)" }} />
                  </div>
                </div>
                <div
                  className="mock-card"
                  style={{
                    background: "oklch(95% 0.03 300)",
                    border: "1px solid oklch(89% 0.04 300)",
                  }}
                >
                  <div className="mc-label" style={{ color: "oklch(42% 0.15 300)" }}>
                    Passly VENDOR · Hub
                  </div>
                  <div className="mc-val">1.4k</div>
                  <div className="mc-bar" style={{ background: "oklch(89% 0.03 300)" }}>
                    <span style={{ width: "74%", background: "oklch(56% 0.18 300)" }} />
                  </div>
                </div>
                <div
                  className="mock-card"
                  style={{
                    background: "oklch(94% 0.04 170)",
                    border: "1px solid oklch(88% 0.05 170)",
                  }}
                >
                  <div className="mc-label" style={{ color: "oklch(38% 0.10 170)" }}>
                    Passly WORK · HR Sync
                  </div>
                  <div className="mc-val">312</div>
                  <div className="mc-bar" style={{ background: "oklch(88% 0.05 170)" }}>
                    <span style={{ width: "60%", background: "oklch(60% 0.15 170)" }} />
                  </div>
                </div>
                <div
                  className="mock-card"
                  style={{
                    background: "oklch(97% 0.004 260)",
                    border: "1px solid oklch(91% 0.008 260)",
                  }}
                >
                  <div className="mc-label" style={{ color: "oklch(46% 0.02 265)" }}>
                    Contratos activos
                  </div>
                  <div className="mc-val">87</div>
                  <div className="mc-bar" style={{ background: "oklch(91% 0.008 260)" }}>
                    <span style={{ width: "48%", background: "oklch(38% 0.02 265)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- LOGOS STRIP ---------- */}
      <section className="logos-strip">
        <p className="caption reveal">
          Empresas que confían su cumplimiento a OLIZTIC
        </p>
        <div className="logos-row reveal from-bottom d1">
          {["01", "02", "03", "04", "05", "06"].map((n) => (
            <div className="logo-ph" key={n}>
              LOGO CLIENTE {n}
            </div>
          ))}
        </div>
      </section>

      {/* ---------- PRODUCTO / MÓDULOS ---------- */}
      <section className="sec wrap">
        <div className="sec-head reveal">
          <div className="eyebrow">Producto</div>
          <h2 className="sec-title">Un ecosistema, tres módulos</h2>
          <p className="sec-sub">
            Cada módulo resuelve un frente distinto de tu operación B2B — y
            comparten datos entre sí para que nada se te escape.
          </p>
        </div>
        <div className="cards-grid">
          <div id="passly-gate" className="module-card reveal d1">
            <div className="module-badge mb-gate">G</div>
            <h3>Passly GATE</h3>
            <p className="desc">
              Control de acceso y compliance en tiempo real para instalaciones
              físicas y digitales.
            </p>
            <div className="feat-list">
              <div className="feat">
                <span className="check check-gate">✓</span>Verificación de
                identidad instantánea
              </div>
              <div className="feat">
                <span className="check check-gate">✓</span>Registro de auditoría
                inmutable
              </div>
              <div className="feat">
                <span className="check check-gate">✓</span>Alertas de
                incumplimiento en vivo
              </div>
            </div>
            <a href="/login" className="module-link" style={{ color: "var(--blue)" }}>
              Explorar Passly GATE →
            </a>
          </div>

          <div id="passly-vendor" className="module-card reveal d2">
            <div className="module-badge mb-vendor">V</div>
            <h3>Passly VENDOR</h3>
            <p className="desc">
              Onboarding, evaluación y monitoreo continuo de proveedores y
              contratistas.
            </p>
            <div className="feat-list">
              <div className="feat">
                <span className="check check-vendor">✓</span>Validación documental
                automática
              </div>
              <div className="feat">
                <span className="check check-vendor">✓</span>Scoring de riesgo por
                proveedor
              </div>
              <div className="feat">
                <span className="check check-vendor">✓</span>Portal de autogestión
                para terceros
              </div>
            </div>
            <a href="/login" className="module-link" style={{ color: "var(--purple)" }}>
              Explorar Passly VENDOR →
            </a>
          </div>

          <div id="passly-work" className="module-card reveal d3">
            <div className="module-badge mb-work">W</div>
            <h3>Passly WORK</h3>
            <p className="desc">
              Gestión de talento y RRHH sincronizada con nómina, turnos y
              certificaciones.
            </p>
            <div className="feat-list">
              <div className="feat">
                <span className="check check-work">✓</span>Sincronización HRIS en
                tiempo real
              </div>
              <div className="feat">
                <span className="check check-work">✓</span>Certificaciones y
                vencimientos automatizados
              </div>
              <div className="feat">
                <span className="check check-work">✓</span>Flujos de aprobación
                configurables
              </div>
            </div>
            <a href="/login" className="module-link" style={{ color: "var(--teal)" }}>
              Explorar Passly WORK →
            </a>
          </div>
        </div>
      </section>

      {/* ---------- CÓMO FUNCIONA ---------- */}
      <section id="como-funciona" className="sec sec-alt">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">Proceso</div>
            <h2 className="sec-title">
              De la integración al cumplimiento, en cuatro pasos
            </h2>
          </div>
          <div className="process">
            <div className="process-line" />
            <div className="step reveal d1">
              <div className="step-num">1</div>
              <h3>Conecta</h3>
              <p>Integra tus sistemas actuales vía API o SDK en minutos.</p>
            </div>
            <div className="step reveal d2">
              <div className="step-num">2</div>
              <h3>Verifica</h3>
              <p>OLIZTIC valida identidades, documentos y datos en tiempo real.</p>
            </div>
            <div className="step reveal d3">
              <div className="step-num">3</div>
              <h3>Automatiza</h3>
              <p>
                Flujos de aprobación y alertas corren solos, sin fricciones
                manuales.
              </p>
            </div>
            <div className="step reveal d4">
              <div className="step-num">4</div>
              <h3>Reporta</h3>
              <p>
                Dashboards y auditorías listas para tus equipos legal y de
                compliance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- API ---------- */}
      <section id="api" className="sec wrap">
        <div className="api-inner">
          <div className="api-col reveal">
            <div className="eyebrow">API Docs</div>
            <h2>Una API, todo tu ecosistema de compliance.</h2>
            <p className="lead">
              Conecta Passly GATE, VENDOR y WORK con un único set de
              credenciales. Documentación clara, SDKs listos y soporte técnico
              directo.
            </p>
            <div className="api-list">
              <div className="api-item">
                <div className="bullet" />
                <div>
                  <strong>Implementación rápida</strong>
                  <div className="sub">Endpoints listos en minutos, no semanas.</div>
                </div>
              </div>
              <div className="api-item">
                <div className="bullet" />
                <div>
                  <strong>SDKs flexibles</strong>
                  <div className="sub">Node.js, Python, PHP y más.</div>
                </div>
              </div>
              <div className="api-item">
                <div className="bullet" />
                <div>
                  <strong>Seguro y auditable</strong>
                  <div className="sub">Cifrado end-to-end y logs completos.</div>
                </div>
              </div>
            </div>
            <a href="#" className="btn btn-dark" style={{ padding: "14px 26px", borderRadius: 11, fontSize: 15 }}>
              Ver documentación completa
            </a>
          </div>

          <div className="api-col reveal from-right d1">
            <div className="code-window">
              <div className="code-top">
                <span className="tdot" style={{ background: "oklch(70% 0.16 25)" }} />
                <span className="tdot" style={{ background: "oklch(78% 0.14 85)" }} />
                <span className="tdot" style={{ background: "oklch(72% 0.15 150)" }} />
                <span className="fname">verify.js</span>
              </div>
              <div className="code-body">
                <div>
                  <span className="c-method">POST</span>{" "}
                  https://api.oliztic.com/v1/gate/verify
                </div>
                <div>&nbsp;</div>
                <div><span className="c-punc">{"{"}</span></div>
                <div>
                  &nbsp;&nbsp;<span className="c-key">"vendor_id"</span>:{" "}
                  <span className="c-str">"vnd_8841"</span>,
                </div>
                <div>
                  &nbsp;&nbsp;<span className="c-key">"document"</span>:{" "}
                  <span className="c-str">"CC-1029384756"</span>,
                </div>
                <div>
                  &nbsp;&nbsp;<span className="c-key">"module"</span>:{" "}
                  <span className="c-str">"gate"</span>
                </div>
                <div><span className="c-punc">{"}"}</span></div>
                <div>&nbsp;</div>
                <div><span className="c-comment">// respuesta</span></div>
                <div>
                  <span className="c-punc">{"{"}</span>{" "}
                  <span className="c-key">"status"</span>:{" "}
                  <span className="c-ok">"compliant"</span>,{" "}
                  <span className="c-key">"score"</span>:{" "}
                  <span className="c-num">98</span>{" "}
                  <span className="c-punc">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- PRECIOS ---------- */}
      <section id="precios" className="sec sec-alt">
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow">Precios</div>
            <h2 className="sec-title">
              Un plan para cada etapa de tu operación B2B
            </h2>
            <p className="sec-sub">
              Todos los planes incluyen acceso a los tres módulos Passly.
            </p>
          </div>
          <Pricing />
        </div>
      </section>

      {/* ---------- TESTIMONIOS ---------- */}
      <section id="testimonios" className="sec wrap">
        <div className="sec-head reveal">
          <div className="eyebrow">Testimonios</div>
          <h2 className="sec-title">Empresas que ya operan sin fricciones</h2>
        </div>
        <div className="cards-grid">
          <div className="testi-card reveal d1">
            <p>
              "Desde que integramos Passly GATE redujimos a cero los incidentes
              de acceso no autorizado en nuestras plantas."
            </p>
            <div className="testi-author">
              <div className="avatar av-gate">MR</div>
              <div>
                <div className="name">María Fernanda Ríos</div>
                <div className="role">
                  Directora de Seguridad, Grupo Industrial Andino
                </div>
              </div>
            </div>
          </div>
          <div className="testi-card reveal d2">
            <p>
              "Passly VENDOR nos permitió pasar de tres semanas a 48 horas para
              aprobar un proveedor nuevo."
            </p>
            <div className="testi-author">
              <div className="avatar av-vendor">CM</div>
              <div>
                <div className="name">Carlos Medina</div>
                <div className="role">
                  Gerente de Compras, Constructora Meridiano
                </div>
              </div>
            </div>
          </div>
          <div className="testi-card reveal d3">
            <p>
              "El equipo de RRHH ya no persigue certificaciones vencidas — Passly
              WORK las controla por nosotros."
            </p>
            <div className="testi-author">
              <div className="avatar av-work">LG</div>
              <div>
                <div className="name">Laura Gómez</div>
                <div className="role">
                  VP de Talento Humano, Logística Continental
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA FINAL ---------- */}
      <section id="cta-final" className="cta-final">
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 className="reveal">Empieza tu transformación digital B2B hoy</h2>
          <p className="reveal d1">
            Agenda una demo y descubre cómo OLIZTIC reduce fricciones en
            compliance, proveedores y talento.
          </p>
          <div className="actions reveal d2">
            <a href="/login" className="btn btn-white">
              Solicitar demo
            </a>
            <a href="/login" className="btn btn-ghost-dark">
              Hablar con un especialista
            </a>
          </div>
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="site-footer">
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="mark" />
                <span className="name">OLIZTIC</span>
              </div>
              <p className="footer-about">
                Ecosistema modular B2B para compliance, proveedores y talento.
              </p>
              <div className="socials">
                <a href="#">in</a>
                <a href="#">X</a>
              </div>
            </div>
            <div className="footer-col">
              <div className="col-title">Producto</div>
              <div className="links">
                <a href="#passly-gate">Passly GATE</a>
                <a href="#passly-vendor">Passly VENDOR</a>
                <a href="#passly-work">Passly WORK</a>
                <a href="#api">API Docs</a>
              </div>
            </div>
            <div className="footer-col">
              <div className="col-title">Compañía</div>
              <div className="links">
                <a href="#">Nosotros</a>
                <a href="#">Blog</a>
                <a href="#">Contacto</a>
              </div>
            </div>
            <div className="footer-col">
              <div className="col-title">Legal</div>
              <div className="links">
                <a href="#">Términos</a>
                <a href="#">Privacidad</a>
                <a href="#">Seguridad</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            © 2026 OLIZTIC. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
