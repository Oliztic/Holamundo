// Envío de correo transaccional vía Resend (solo servidor).
// Si RESEND_API_KEY no está configurada, devuelve false y el llamador
// muestra la contraseña temporal para compartirla manualmente.
export async function enviarCodigoReset(correo, code) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  const from = process.env.RESEND_FROM || "Oliztic <onboarding@resend.dev>";
  const html = `
    <div style="font-family:Arial,sans-serif;color:#1e293b">
      <h2 style="margin:0 0 12px">Recuperación de contraseña</h2>
      <p>Tu código de verificación es:</p>
      <p style="font-size:26px;font-weight:bold;letter-spacing:6px;background:#f1f5f9;padding:12px 16px;border-radius:4px;display:inline-block">${code}</p>
      <p style="color:#64748b;font-size:13px">El código vence en 15 minutos. Si no lo solicitaste, ignora este correo.</p>
    </div>`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: correo,
      subject: "Código de recuperación - Oliztic",
      html,
    }),
  });
  return res.ok;
}

export async function enviarInvitacionProveedor(correo, tempPass, origin) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;

  const from = process.env.RESEND_FROM || "Oliztic <onboarding@resend.dev>";
  const link = `${origin}/login-proveedores`;

  const html = `
    <div style="font-family:Arial,sans-serif;color:#1e293b">
      <h2 style="margin:0 0 12px">Invitación como proveedor</h2>
      <p>Has sido invitado a registrarte como proveedor en Oliztic.</p>
      <p>Ingresa con estas credenciales temporales:</p>
      <p style="background:#f1f5f9;padding:12px;border-radius:4px">
        Correo: <b>${correo}</b><br/>
        Contraseña temporal: <b>${tempPass}</b>
      </p>
      <p><a href="${link}" style="background:#2563eb;color:#fff;padding:10px 18px;border-radius:4px;text-decoration:none">Ingresar al sistema</a></p>
      <p style="font-size:13px">O ingresa en: <a href="${link}">${link}</a></p>
      <p style="color:#64748b;font-size:13px">Por seguridad, cambia tu contraseña al ingresar.</p>
    </div>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: correo,
      subject: "Invitación como proveedor - Oliztic",
      html,
    }),
  });
  return res.ok;
}
