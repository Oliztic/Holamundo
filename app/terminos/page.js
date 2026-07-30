export const metadata = {
  title: "Términos y Condiciones — Oliztic",
  description:
    "Términos y Condiciones de uso de la plataforma Oliztic Cloud Solutions S.A.S.",
};

export default function TerminosPage() {
  return (
    <div className="legal">
      <header className="legal-header">
        <a href="/" className="brand">
          <img src="/logo_nav.svg" alt="OLIZTIC" className="brand-logo" />
        </a>
        <a href="/" className="legal-back">
          ← Volver al sitio
        </a>
      </header>

      <main className="legal-body">
        <p className="legal-eyebrow">Legal</p>
        <h1>Términos y Condiciones de Uso</h1>
        <p className="legal-updated">Última actualización: 30 de julio de 2026</p>

        <div className="legal-callout">
          <strong>Plantilla base.</strong> Debe ser revisada y ajustada por el
          área legal de Oliztic antes de su uso definitivo.
        </div>

        <h2>1. Aceptación</h2>
        <p>
          El acceso y uso de la plataforma Oliztic implica la aceptación plena de
          los presentes Términos y Condiciones. Si no está de acuerdo, absténgase
          de utilizar el servicio.
        </p>

        <h2>2. Identificación del prestador</h2>
        <p>
          <strong>Razón social:</strong> Oliztic Cloud Solutions S.A.S.
          <br />
          <strong>NIT:</strong> 901.234.567-8
          <br />
          <strong>Contacto:</strong>{" "}
          <a href="mailto:help@oliztic.com">help@oliztic.com</a>
        </p>

        <h2>3. Objeto del servicio</h2>
        <p>
          Oliztic ofrece un ecosistema modular B2B para la gestión de
          cumplimiento, proveedores y talento (módulos Passly GATE, VENDOR y
          WORK), incluyendo acceso a través de API.
        </p>

        <h2>4. Cuenta de usuario</h2>
        <ul>
          <li>
            El usuario es responsable de la veracidad de los datos suministrados.
          </li>
          <li>
            El usuario debe custodiar sus credenciales y es responsable de la
            actividad realizada bajo su cuenta.
          </li>
          <li>
            Oliztic podrá suspender cuentas ante usos indebidos o incumplimientos.
          </li>
        </ul>

        <h2>5. Uso aceptable</h2>
        <p>
          El usuario se compromete a no utilizar la plataforma para fines ilícitos,
          ni a vulnerar la seguridad, disponibilidad o integridad del servicio.
        </p>

        <h2>6. Propiedad intelectual</h2>
        <p>
          Todos los derechos sobre la plataforma, marcas, logotipos y contenidos
          pertenecen a Oliztic Cloud Solutions S.A.S. o a sus licenciantes.
        </p>

        <h2>7. Protección de datos</h2>
        <p>
          El tratamiento de datos personales se rige por nuestra{" "}
          <a href="/privacidad">Política de Tratamiento de Datos Personales</a>,
          conforme a la Ley 1581 de 2012.
        </p>

        <h2>8. Limitación de responsabilidad</h2>
        <p>
          El servicio se presta &quot;tal cual&quot;. Oliztic no será responsable
          por daños indirectos derivados del uso o imposibilidad de uso de la
          plataforma, en los términos permitidos por la ley.
        </p>

        <h2>9. Modificaciones</h2>
        <p>
          Oliztic podrá modificar estos términos. Los cambios se publicarán en
          esta página con su respectiva fecha de actualización.
        </p>

        <h2>10. Ley aplicable</h2>
        <p>
          Estos términos se rigen por las leyes de la República de Colombia.
        </p>

        <p className="legal-foot">
          © {new Date().getFullYear()} Oliztic Cloud Solutions S.A.S. — Contacto:{" "}
          <a href="mailto:help@oliztic.com">help@oliztic.com</a>
        </p>
      </main>
    </div>
  );
}
