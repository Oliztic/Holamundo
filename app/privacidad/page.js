export const metadata = {
  title: "Política de Tratamiento de Datos — Oliztic",
  description:
    "Política de Tratamiento de Datos Personales de Oliztic Cloud Solutions S.A.S. conforme a la Ley 1581 de 2012.",
};

export default function PrivacidadPage() {
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
        <h1>Política de Tratamiento de Datos Personales</h1>
        <p className="legal-updated">Última actualización: 30 de julio de 2026</p>

        <div className="legal-callout">
          <strong>Plantilla base.</strong> Este documento sigue la estructura de
          la Ley 1581 de 2012 y el Decreto 1074 de 2015 de Colombia. Debe ser
          revisado y ajustado por el área legal de Oliztic antes de su uso
          definitivo.
        </div>

        <h2>1. Responsable del Tratamiento</h2>
        <p>
          <strong>Razón social:</strong> Oliztic Cloud Solutions S.A.S.
          <br />
          <strong>NIT:</strong> 901.234.567-8
          <br />
          <strong>Domicilio:</strong> Colombia
          <br />
          <strong>Correo de contacto:</strong>{" "}
          <a href="mailto:help@oliztic.com">help@oliztic.com</a>
        </p>

        <h2>2. Marco legal</h2>
        <p>
          La presente política se expide en cumplimiento de la Ley 1581 de 2012,
          el Decreto 1074 de 2015 y demás normas concordantes en materia de
          protección de datos personales y del derecho de Habeas Data
          (Constitución Política, Artículo 15).
        </p>

        <h2>3. Definiciones</h2>
        <ul>
          <li>
            <strong>Titular:</strong> persona natural cuyos datos personales son
            objeto de tratamiento.
          </li>
          <li>
            <strong>Dato personal:</strong> cualquier información vinculada o que
            pueda asociarse a una persona natural determinada o determinable.
          </li>
          <li>
            <strong>Tratamiento:</strong> cualquier operación sobre datos
            personales, como recolección, almacenamiento, uso, circulación o
            supresión.
          </li>
          <li>
            <strong>Responsable:</strong> Oliztic Cloud Solutions S.A.S.
          </li>
        </ul>

        <h2>4. Datos que recolectamos</h2>
        <ul>
          <li>Nombre completo</li>
          <li>Correo electrónico corporativo</li>
          <li>Credenciales de acceso (contraseña, almacenada de forma cifrada)</li>
          <li>Datos de uso y navegación necesarios para la operación del servicio</li>
        </ul>

        <h2>5. Finalidades del Tratamiento</h2>
        <ul>
          <li>Crear y administrar la cuenta del usuario en la plataforma.</li>
          <li>Autenticar el acceso y garantizar la seguridad del servicio.</li>
          <li>Prestar y dar soporte a los servicios contratados.</li>
          <li>Enviar comunicaciones relacionadas con el servicio.</li>
          <li>Cumplir obligaciones legales y contractuales.</li>
        </ul>

        <h2>6. Principios</h2>
        <p>
          El tratamiento se rige por los principios de legalidad, finalidad,
          libertad, veracidad, transparencia, acceso y circulación restringida,
          seguridad y confidencialidad.
        </p>

        <h2>7. Derechos del Titular (Habeas Data)</h2>
        <p>Como titular de los datos, usted tiene derecho a:</p>
        <ul>
          <li>Conocer, actualizar y rectificar sus datos personales.</li>
          <li>
            Solicitar prueba de la autorización otorgada para el tratamiento.
          </li>
          <li>Ser informado sobre el uso que se ha dado a sus datos.</li>
          <li>
            Presentar quejas ante la Superintendencia de Industria y Comercio
            (SIC) por infracciones a la ley.
          </li>
          <li>
            Revocar la autorización y/o solicitar la supresión de los datos
            cuando proceda.
          </li>
          <li>Acceder de forma gratuita a sus datos personales.</li>
        </ul>

        <h2>8. Procedimiento para ejercer sus derechos</h2>
        <p>
          El Titular podrá presentar consultas y reclamos al correo{" "}
          <a href="mailto:help@oliztic.com">help@oliztic.com</a>. De acuerdo con
          la ley:
        </p>
        <ul>
          <li>
            <strong>Consultas:</strong> se atenderán en un término máximo de diez
            (10) días hábiles.
          </li>
          <li>
            <strong>Reclamos:</strong> se atenderán en un término máximo de
            quince (15) días hábiles.
          </li>
        </ul>

        <h2>9. Seguridad de la información</h2>
        <p>
          Oliztic adopta medidas técnicas y administrativas razonables para
          proteger los datos: cifrado de contraseñas, conexiones seguras (HTTPS),
          control de acceso y restricción por usuario mediante políticas de
          seguridad a nivel de base de datos.
        </p>

        <h2>10. Encargados del Tratamiento y transferencia internacional</h2>
        <p>
          Para prestar el servicio, Oliztic se apoya en proveedores tecnológicos
          que actúan como <strong>Encargados del Tratamiento</strong> y que
          pueden almacenar o procesar datos en servidores ubicados{" "}
          <strong>fuera de Colombia (principalmente en Estados Unidos)</strong>:
        </p>
        <ul>
          <li>
            <strong>Supabase</strong> — autenticación y base de datos.
          </li>
          <li>
            <strong>Vercel</strong> — alojamiento y entrega de la aplicación.
          </li>
          <li>
            <strong>Google</strong> — inicio de sesión opcional con cuenta de
            Google.
          </li>
        </ul>
        <p>
          Al autorizar esta política, el Titular declara conocer y consentir la
          <strong> transferencia y transmisión internacional</strong> de sus
          datos a dichos Encargados, quienes ofrecen niveles adecuados de
          seguridad y tratan la información únicamente bajo las instrucciones y
          finalidades definidas por Oliztic.
        </p>

        <h2>11. Conservación de los datos</h2>
        <p>
          Los datos personales se conservarán durante el tiempo que exista la
          relación con el Titular y mientras no se solicite su supresión. Una vez
          terminada la relación, los datos podrán conservarse bloqueados por los
          plazos legales aplicables (obligaciones contables, tributarias o de
          responsabilidad) y luego serán suprimidos de forma segura.
        </p>

        <h2>12. Autorización</h2>
        <p>
          Al registrarse y marcar la casilla de autorización, el Titular declara
          conocer y aceptar esta política y otorga su consentimiento previo,
          expreso e informado para el tratamiento de sus datos personales
          conforme a las finalidades aquí descritas.
        </p>

        <h2>13. Vigencia</h2>
        <p>
          Esta política rige a partir de su publicación y podrá ser actualizada;
          los cambios se publicarán en esta misma página con su fecha
          correspondiente.
        </p>

        <p className="legal-foot">
          © {new Date().getFullYear()} Oliztic Cloud Solutions S.A.S. — Contacto:{" "}
          <a href="mailto:help@oliztic.com">help@oliztic.com</a>
        </p>
      </main>
    </div>
  );
}
