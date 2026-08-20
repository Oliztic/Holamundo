// URL base del sitio para enlaces de correos y redirecciones.
// En produccion define NEXT_PUBLIC_SITE_URL (ej. https://oliztic.vercel.app).
export function siteUrl() {
  const env = process.env.NEXT_PUBLIC_SITE_URL;
  if (env) return env.replace(/\/+$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}
