"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

const FONT_BODY = "var(--font-inter), sans-serif";
const FONT_HEAD = "var(--font-manrope), sans-serif";

// ---------------------------------------------------------------------
// Catalogo de documentos del expediente (estatico)
// ---------------------------------------------------------------------
const CATS = [
  {
    id: "legal",
    num: 1,
    title: "Documentos legales y de identificación",
    short: "Legales e identificación",
    sub: "Existencia legal de la empresa y facultades del representante",
    iconBg: "oklch(95% 0.03 264)",
    iconFg: "oklch(45% 0.18 264)",
    docs: [
      { key: "camara", name: "Certificado de Existencia y Representación Legal", note: "Cámara de Comercio · expedición no mayor a 30–60 días. Verifica representante legal y facultades de firma.", tag: "Obligatorio", date: true, maxDays: 60 },
      { key: "rut", name: "RUT / Tax ID", note: "Actualizado. Define régimen tributario y actividad económica (código CIIU).", tag: "Obligatorio" },
      { key: "cedula", name: "Cédula de ciudadanía o pasaporte", note: "Documento de identidad del representante legal, ambas caras legibles.", tag: "Obligatorio" },
      { key: "accionaria", name: "Certificación de composición accionaria", note: "Firmada por contador o revisor fiscal. Identifica beneficiarios finales para control de LA/FT.", tag: "Obligatorio" },
    ],
  },
  {
    id: "fin",
    num: 2,
    title: "Cumplimiento financiero y bancario",
    short: "Financiero y bancario",
    sub: "Liquidez de la empresa y configuración de la cuenta de pagos",
    iconBg: "oklch(95% 0.03 300)",
    iconFg: "oklch(48% 0.16 300)",
    docs: [
      { key: "banco", name: "Certificación bancaria", note: "Expedida por el banco con no más de 30 días. Inscribe la cuenta en la pasarela de pagos.", tag: "Obligatorio", date: true, maxDays: 30 },
      { key: "ef", name: "Estados financieros auditados", note: "Balance general y estado de resultados del último año fiscal, con notas explicativas.", tag: "Obligatorio" },
      { key: "tp", name: "Tarjeta profesional y cédula del contador", note: "Del contador y/o revisor fiscal que firma los estados financieros.", tag: "Obligatorio" },
    ],
  },
  {
    id: "laft",
    num: 3,
    title: "Anti-lavado de activos y anticorrupción",
    short: "SAGRILAFT / LA-FT",
    sub: "Exigido a proveedores de riesgo medio y alto (SAGRILAFT · PTEE)",
    iconBg: "oklch(96% 0.04 75)",
    iconFg: "oklch(52% 0.14 60)",
    docs: [
      { key: "origen", name: "Formulario de vinculación y declaración de origen de fondos", note: "Formato firmado por el representante legal declarando la licitud de los recursos.", tag: "Obligatorio" },
      { key: "sagrilaft", name: "Certificación SAGRILAFT / PTEE", note: "Solo para empresas obligadas a tener sistema de autocontrol y gestión del riesgo LA/FT.", tag: "Condicional" },
      { key: "antecedentes", name: "Certificados de antecedentes", note: "Judiciales, fiscales (Contraloría) y disciplinarios (Procuraduría), de la empresa y del representante legal.", tag: "Obligatorio", date: true, maxDays: 30 },
    ],
  },
  {
    id: "sst",
    num: 4,
    title: "Seguridad y Salud en el Trabajo",
    short: "SST / contratistas",
    sub: "Requerido cuando el proveedor envía personal a planta",
    iconBg: "oklch(94% 0.05 170)",
    iconFg: "oklch(45% 0.13 170)",
    conditional: "personnel",
    docs: [
      { key: "parafiscales", name: "Certificado de aportes a seguridad social y parafiscales", note: "Firmado por revisor fiscal o representante legal: salud, pensión y ARL al día.", tag: "Obligatorio", date: true, maxDays: 30 },
      { key: "sgsst", name: "Evaluación del SG-SST", note: "Certificación del porcentaje de avance en estándares mínimos (Resolución 0312).", tag: "Obligatorio" },
      { key: "rce", name: "Póliza de Responsabilidad Civil Extracontractual", note: "Con amparo de predios, labores y operaciones para accidentes dentro de la planta.", tag: "Obligatorio", date: true, maxDays: 365 },
    ],
  },
];

const CATALOG_KEYS = new Set(CATS.flatMap((c) => c.docs.map((d) => d.key)));
const DOC_MAXDAYS = {};
CATS.forEach((c) => c.docs.forEach((d) => { if (d.date) DOC_MAXDAYS[d.key] = d.maxDays; }));

const TAGS = {
  Obligatorio: { bg: "oklch(95% 0.03 264)", fg: "oklch(45% 0.18 264)" },
  Condicional: { bg: "oklch(96% 0.04 75)", fg: "oklch(48% 0.13 60)" },
  Adicional: { bg: "oklch(95% 0.01 260)", fg: "oklch(45% 0.02 265)" },
};

const STATUS = {
  pending: { label: "Pendiente", bg: "oklch(95.5% 0.01 260)", fg: "oklch(52% 0.02 265)" },
  review: { label: "En revisión", bg: "oklch(96% 0.05 80)", fg: "oklch(52% 0.13 65)" },
  ok: { label: "Validado", bg: "oklch(95% 0.04 170)", fg: "oklch(45% 0.13 170)" },
  na: { label: "No aplica", bg: "oklch(96% 0.005 260)", fg: "oklch(62% 0.02 265)" },
};

const ICON_DOC = "M12 2.5H6A1.5 1.5 0 004.5 4v12A1.5 1.5 0 006 17.5h8a1.5 1.5 0 001.5-1.5V6zM12 2.5V6h3.5";
const ICON_OK = "M4 10.5l4 4 8-9";

// Navegacion lateral del panel
const NAV = [
  {
    id: "documentos",
    label: "Documentos",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <path d="M14 2v6h6" />
      </svg>
    ),
  },
  {
    id: "config",
    label: "Configuración",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    id: "perfil",
    label: "Mi perfil",
    icon: (
      <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function Placeholder({ title, subtitle }) {
  return (
    <div>
      <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 30, lineHeight: 1.15, letterSpacing: "-0.03em", margin: "0 0 10px", color: "oklch(19% 0.03 265)" }}>{title}</h1>
      <p style={{ fontSize: 15, color: "oklch(46% 0.02 265)", margin: "0 0 24px" }}>{subtitle}</p>
      <div style={{ padding: 40, borderRadius: 18, background: "white", border: "1px dashed oklch(88% 0.01 260)", textAlign: "center", color: "oklch(55% 0.02 265)", fontSize: 14 }}>
        Módulo en construcción.
      </div>
    </div>
  );
}
const BUCKET = "documentos";
const MAX_BYTES = 10 * 1024 * 1024;

function fmtSize(b) {
  if (b < 1024) return b + " B";
  if (b < 1048576) return Math.round(b / 1024) + " KB";
  return (b / 1048576).toFixed(1) + " MB";
}

function expiry(key, val) {
  const maxDays = DOC_MAXDAYS[key];
  if (!val) return { hint: "Requerida para calcular vigencia", fg: "oklch(58% 0.02 265)" };
  const days = Math.floor((Date.now() - new Date(val).getTime()) / 86400000);
  if (days < 0) return { hint: "Fecha futura inválida", fg: "oklch(55% 0.17 25)" };
  const left = maxDays - days;
  if (left < 0) return { hint: "Vencido · expedición hace " + days + " días", fg: "oklch(55% 0.17 25)" };
  if (left <= Math.max(5, maxDays * 0.2)) return { hint: "Vence en " + left + " días", fg: "oklch(52% 0.14 65)" };
  return { hint: "Vigente · " + left + " días restantes", fg: "oklch(45% 0.13 170)" };
}

export default function PanelProveedorPage() {
  const router = useRouter();
  const supabase = createClient();
  const fileRef = useRef(null);
  const pendingRef = useRef(null); // { cat, doc } al abrir el selector de archivos

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState("");
  const [companyNit, setCompanyNit] = useState("");

  const [docs, setDocs] = useState({});        // doc_key -> fila de BD
  const [extras, setExtras] = useState({});     // categoria -> [{ key, name }]
  const [open, setOpen] = useState({ legal: true });
  const [personnel, setPersonnel] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [view, setView] = useState("documentos"); // documentos | config | perfil

  const [uploadingKey, setUploadingKey] = useState(null);
  const [dragKey, setDragKey] = useState(null);
  const [toast, setToast] = useState(null);

  function notify(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user;
      if (!u) { router.replace("/login-proveedores"); return; }
      if (u.user_metadata?.rol !== "proveedor") { router.replace("/panel"); return; }
      if (u.user_metadata?.must_change_password) { router.replace("/cambiar-clave"); return; }

      const meta = u.user_metadata || {};
      setUser(u);
      setCompanyName(meta.company_name || u.email?.split("@")[0] || "Proveedor");
      setCompanyNit(meta.company_nit || "");
      setPersonnel(meta.sends_personnel !== false);
      setSubmitted(!!meta.expediente_enviado);

      const { data: rows } = await supabase
        .from("proveedor_documentos")
        .select("*")
        .eq("proveedor_user_id", u.id);

      const d = {};
      const ex = {};
      (rows || []).forEach((r) => {
        d[r.doc_key] = r;
        if (!CATALOG_KEYS.has(r.doc_key)) {
          (ex[r.categoria] = ex[r.categoria] || []).push({ key: r.doc_key, name: r.nombre });
        }
      });
      setDocs(d);
      setExtras(ex);
      setLoading(false);
    })();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    router.push("/login-proveedores");
    router.refresh();
  }

  function applies(cat) {
    return cat.conditional !== "personnel" || personnel;
  }

  function listForCat(cat) {
    const ex = (extras[cat.id] || []).map((e) => ({ key: e.key, name: e.name, tag: "Adicional", custom: true }));
    return cat.docs.concat(ex);
  }

  function pick(cat, doc) {
    pendingRef.current = { cat, doc };
    if (fileRef.current) { fileRef.current.value = ""; fileRef.current.click(); }
  }

  async function onFileChange(e) {
    const file = e.target.files && e.target.files[0];
    const pend = pendingRef.current;
    if (!file || !pend) return;
    await uploadFile(pend.cat, pend.doc, file);
  }

  async function uploadFile(cat, doc, file) {
    if (file.size > MAX_BYTES) { notify("El archivo supera el máximo de 10 MB"); setDragKey(null); return; }
    setUploadingKey(doc.key);
    setDragKey(null);

    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const path = `${user.id}/${doc.key}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: true });
    if (upErr) { notify("No se pudo subir el archivo: " + upErr.message); setUploadingKey(null); return; }

    const prev = docs[doc.key];
    if (prev?.storage_path && prev.storage_path !== path) {
      await supabase.storage.from(BUCKET).remove([prev.storage_path]);
    }

    const row = {
      proveedor_user_id: user.id,
      nit: companyNit || null,
      categoria: cat.id,
      doc_key: doc.key,
      nombre: doc.custom ? (doc.name || "Documento adicional") : doc.name,
      tag: doc.tag,
      storage_path: path,
      file_name: file.name,
      file_size: file.size,
      estado: "en_revision",
      updated_at: new Date().toISOString(),
    };
    const { data: saved, error: dbErr } = await supabase
      .from("proveedor_documentos")
      .upsert(row, { onConflict: "proveedor_user_id,doc_key" })
      .select()
      .single();
    if (dbErr) { notify("Se subió el archivo pero falló el registro: " + dbErr.message); setUploadingKey(null); return; }

    setDocs((p) => ({ ...p, [doc.key]: saved }));
    if (submitted) { setSubmitted(false); supabase.auth.updateUser({ data: { expediente_enviado: false } }); }
    setUploadingKey(null);
  }

  async function removeDoc(doc) {
    const cur = docs[doc.key];
    if (cur?.storage_path) await supabase.storage.from(BUCKET).remove([cur.storage_path]);
    if (cur?.id) await supabase.from("proveedor_documentos").delete().eq("id", cur.id);
    setDocs((p) => { const c = { ...p }; delete c[doc.key]; return c; });
  }

  async function setDate(doc, val) {
    setDocs((p) => ({ ...p, [doc.key]: { ...p[doc.key], fecha_expedicion: val } }));
    if (docs[doc.key]?.id) {
      await supabase.from("proveedor_documentos").update({ fecha_expedicion: val || null }).eq("id", docs[doc.key].id);
    }
  }

  function renameExtra(catId, key, val) {
    setExtras((p) => ({ ...p, [catId]: (p[catId] || []).map((x) => (x.key === key ? { ...x, name: val } : x)) }));
    if (docs[key]?.id) supabase.from("proveedor_documentos").update({ nombre: val || "Documento adicional" }).eq("id", docs[key].id);
  }

  function addExtra(catId) {
    setExtras((p) => {
      const cur = p[catId] || [];
      const key = `${catId}-extra-${cur.length + 1}-${Date.now().toString(36)}`;
      return { ...p, [catId]: cur.concat([{ key, name: "" }]) };
    });
  }

  async function togglePersonnel() {
    const val = !personnel;
    setPersonnel(val);
    await supabase.auth.updateUser({ data: { sends_personnel: val } });
  }

  function toggleCat(catId) {
    setOpen((s) => ({ ...s, [catId]: !s[catId] }));
  }

  function focusCat(catId) {
    setOpen((s) => ({ ...s, [catId]: true }));
    const el = document.getElementById("bloque-" + catId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---- Metricas globales ----
  const allApplicable = CATS.filter(applies).flatMap((c) => listForCat(c));
  const uploadedCount = allApplicable.filter((d) => docs[d.key]).length;
  const validCount = allApplicable.filter((d) => docs[d.key]?.estado === "validado").length;
  const totalCount = allApplicable.length;
  const pct = totalCount ? Math.round((uploadedCount / totalCount) * 100) : 0;
  const missing = totalCount - uploadedCount;
  const initials = (companyName || "").trim().slice(0, 2).toUpperCase();

  async function submit() {
    if (missing !== 0) return;
    setSubmitted(true);
    await supabase.auth.updateUser({ data: { expediente_enviado: true, expediente_enviado_at: new Date().toISOString() } });
    notify("Expediente enviado a Compras y Riesgo");
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_BODY, color: "oklch(46% 0.02 265)", background: "oklch(98.5% 0.003 260)" }}>
        Cargando expediente…
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", color: "oklch(21% 0.03 265)", paddingBottom: view === "documentos" ? 120 : 40, fontFamily: FONT_BODY, background: "oklch(98.5% 0.003 260)" }}>
      <style>{`
        @keyframes pvSlideDown { from { opacity:0; transform:translateY(-6px);} to { opacity:1; transform:translateY(0);} }
        @keyframes pvPulseDot { 0%,100%{opacity:1;} 50%{opacity:0.35;} }
        @keyframes pvSpin { to { transform: rotate(360deg);} }
        .pv-acc-body { animation: pvSlideDown 260ms ease both; }
        .pv-hover-blue:hover { border-color: oklch(54% 0.20 264) !important; color: oklch(54% 0.20 264) !important; }
        .pv-cat-card:hover { border-color: oklch(54% 0.20 264 / 0.5) !important; }
        .pv-cat-header:hover { background: oklch(98.5% 0.004 264); }
        .pv-upload-btn:hover { background: oklch(94% 0.04 264) !important; }
        .pv-add-btn:hover { border-color: oklch(54% 0.20 264) !important; color: oklch(54% 0.20 264) !important; background: oklch(98% 0.01 264) !important; }
        .pv-remove:hover { background: oklch(95% 0.03 25) !important; }
        .pv-spin { animation: pvSpin 0.7s linear infinite; }
      `}</style>

      {toast && (
        <div style={{ position: "fixed", top: 74, left: "50%", transform: "translateX(-50%)", zIndex: 90, padding: "11px 18px", borderRadius: 12, background: "oklch(21% 0.03 265)", color: "white", fontSize: 13.5, fontWeight: 600, boxShadow: "0 12px 30px oklch(21% 0.03 265 / 0.25)" }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <header style={{ position: "sticky", top: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, padding: "14px 40px", background: "oklch(99% 0.002 260 / 0.88)", backdropFilter: "blur(14px)", borderBottom: "1px solid oklch(91% 0.01 260)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: "conic-gradient(from 210deg, oklch(56% 0.18 300), oklch(54% 0.20 264), oklch(60% 0.15 170), oklch(56% 0.18 300))" }} />
          <span style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17, letterSpacing: "-0.02em" }}>OLIZTIC</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 14px", borderRadius: 999, background: "oklch(96.5% 0.01 260)", border: "1px solid oklch(91% 0.01 260)", fontSize: 13, fontWeight: 600, color: "oklch(38% 0.02 265)" }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: "oklch(54% 0.20 264)", color: "white", fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{initials}</span>
            {companyName}
          </div>
          <button type="button" onClick={cerrarSesion} className="pv-hover-blue" style={{ padding: "10px 18px", borderRadius: 10, border: "1px solid oklch(88% 0.01 260)", background: "white", fontSize: 13.5, fontWeight: 700, color: "oklch(30% 0.02 265)", cursor: "pointer", fontFamily: "inherit" }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div style={{ display: "flex", alignItems: "flex-start" }}>
        {/* Sidebar */}
        <aside style={{ position: "sticky", top: 58, flexShrink: 0, width: 240, height: "calc(100vh - 58px)", padding: "22px 14px", borderRight: "1px solid oklch(91% 0.01 260)", background: "oklch(99% 0.002 260)", display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "oklch(66% 0.02 265)", padding: "0 12px", marginBottom: 8 }}>Panel</span>
          {NAV.map((n) => {
            const active = view === n.id;
            return (
              <button key={n.id} type="button" onClick={() => setView(n.id)} style={{ display: "flex", alignItems: "center", gap: 11, width: "100%", padding: "10px 12px", borderRadius: 10, border: "none", background: active ? "oklch(96% 0.03 264)" : "none", color: active ? "oklch(45% 0.18 264)" : "oklch(40% 0.02 265)", fontSize: 14, fontWeight: active ? 700 : 600, cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                {n.icon}
                {n.label}
              </button>
            );
          })}
        </aside>

        {/* Contenido */}
        <div style={{ flex: "1 1 auto", minWidth: 0 }}>
          <div style={{ maxWidth: 940, margin: "0 auto", padding: "40px 40px 0" }}>
            {view === "config" && (
              <Placeholder title="Configuración" subtitle="Ajustes de la cuenta del proveedor y preferencias de notificación." />
            )}
            {view === "perfil" && (
              <Placeholder title="Mi perfil" subtitle="Datos de la empresa y del usuario de acceso." />
            )}
            {view === "documentos" && (
              <>
        {/* Hero + progreso */}
        <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap", marginBottom: 34 }}>
          <div style={{ flex: "1 1 460px", minWidth: 320 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "oklch(54% 0.20 264)", marginBottom: 12 }}>Vinculación de proveedores</div>
            <h1 style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 36, lineHeight: 1.12, letterSpacing: "-0.03em", margin: "0 0 12px", color: "oklch(19% 0.03 265)" }}>Expediente de cumplimiento</h1>
            <p style={{ fontSize: 15.5, lineHeight: 1.6, color: "oklch(46% 0.02 265)", maxWidth: 520, margin: "0 0 22px" }}>Sube los documentos legales, financieros, de prevención de LA/FT y de SST. Cada archivo queda con vigencia trazable y en revisión por la empresa que te invitó.</p>
            <label style={{ display: "inline-flex", alignItems: "center", gap: 11, padding: "11px 16px", borderRadius: 12, background: "white", border: "1px solid oklch(90% 0.01 260)", fontSize: 14, fontWeight: 600, color: "oklch(32% 0.02 265)", cursor: "pointer" }}>
              <input type="checkbox" checked={personnel} onChange={togglePersonnel} style={{ accentColor: "oklch(54% 0.20 264)", width: 16, height: 16 }} />
              Enviaremos personal a las instalaciones del cliente
            </label>
          </div>

          <div style={{ flex: "0 0 280px", padding: 26, borderRadius: 18, background: "white", border: "1px solid oklch(91% 0.01 260)", boxShadow: "0 12px 32px oklch(54% 0.05 264 / 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
                <svg viewBox="0 0 88 88" style={{ width: 88, height: 88, transform: "rotate(-90deg)" }}>
                  <circle cx="44" cy="44" r="38" fill="none" stroke="oklch(93% 0.01 260)" strokeWidth="9" />
                  <circle cx="44" cy="44" r="38" fill="none" stroke="oklch(54% 0.20 264)" strokeWidth="9" strokeLinecap="round" strokeDasharray="238.76" strokeDashoffset={238.76 - (238.76 * pct) / 100} style={{ transition: "stroke-dashoffset 500ms ease" }} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 20, color: "oklch(21% 0.03 265)" }}>{pct}%</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 19, lineHeight: 1 }}>{uploadedCount}<span style={{ fontSize: 13, fontWeight: 600, color: "oklch(58% 0.02 265)" }}>/{totalCount}</span></div>
                  <div style={{ fontSize: 12, color: "oklch(52% 0.02 265)" }}>Documentos cargados</div>
                </div>
                <div>
                  <div style={{ fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 19, lineHeight: 1, color: "oklch(50% 0.14 170)" }}>{validCount}</div>
                  <div style={{ fontSize: 12, color: "oklch(52% 0.02 265)" }}>Validados</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen por categoria */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 30 }}>
          {CATS.map((cat) => {
            const ap = applies(cat);
            const list = listForCat(cat);
            const done = list.filter((d) => docs[d.key]).length;
            const cpct = list.length ? Math.round((done / list.length) * 100) : 0;
            const complete = ap && done === list.length;
            const pill = !ap ? STATUS.na : complete ? STATUS.ok : done ? STATUS.review : STATUS.pending;
            return (
              <button key={cat.id} type="button" onClick={() => focusCat(cat.id)} className="pv-cat-card" style={{ textAlign: "left", padding: "16px 18px", borderRadius: 14, background: "white", border: "1px solid oklch(91% 0.01 260)", cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", color: "oklch(66% 0.02 265)" }}>0{cat.num}</span>
                  <span style={{ fontSize: 11.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: pill.bg, color: pill.fg }}>{ap ? done + "/" + list.length : "No aplica"}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: "oklch(24% 0.03 265)", lineHeight: 1.35 }}>{cat.short}</div>
                <div style={{ height: 5, borderRadius: 999, background: "oklch(94% 0.01 260)", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 999, width: (ap ? cpct : 0) + "%", background: complete ? "oklch(60% 0.15 170)" : "oklch(54% 0.20 264)", transition: "width 400ms ease" }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Acordeones */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {CATS.map((cat) => {
            const ap = applies(cat);
            const list = listForCat(cat);
            const done = list.filter((d) => docs[d.key]).length;
            const complete = ap && done === list.length;
            const pill = !ap ? STATUS.na : complete ? STATUS.ok : done ? STATUS.review : STATUS.pending;
            const isOpen = !!open[cat.id];
            return (
              <div key={cat.id} id={"bloque-" + cat.id} style={{ borderRadius: 18, background: "white", border: "1px solid oklch(91% 0.01 260)", overflow: "hidden", boxShadow: "0 8px 24px oklch(54% 0.05 264 / 0.04)" }}>
                <button type="button" onClick={() => toggleCat(cat.id)} className="pv-cat-header" style={{ width: "100%", display: "flex", alignItems: "center", gap: 18, padding: "22px 24px", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textAlign: "left" }}>
                  <span style={{ flexShrink: 0, width: 42, height: 42, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 15, background: cat.iconBg, color: cat.iconFg }}>{cat.num}</span>
                  <span style={{ flex: "1 1 auto", minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: FONT_HEAD, fontWeight: 800, fontSize: 17.5, letterSpacing: "-0.02em", color: "oklch(20% 0.03 265)" }}>{cat.title}</span>
                    <span style={{ display: "block", fontSize: 13.5, color: "oklch(50% 0.02 265)", marginTop: 3 }}>{cat.sub}</span>
                  </span>
                  <span style={{ flexShrink: 0, fontSize: 12.5, fontWeight: 700, padding: "6px 12px", borderRadius: 999, background: pill.bg, color: pill.fg }}>{ap ? done + "/" + list.length : "No aplica"}</span>
                  <span style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: "oklch(96% 0.01 260)", display: "flex", alignItems: "center", justifyContent: "center", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 250ms ease" }}>
                    <svg viewBox="0 0 16 16" style={{ width: 14, height: 14 }}><path d="M3 6l5 5 5-5" fill="none" stroke="oklch(40% 0.02 265)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="pv-acc-body" style={{ padding: "0 24px 22px" }}>
                    <div style={{ height: 1, background: "oklch(93% 0.01 260)", marginBottom: 18 }} />

                    {!ap && (
                      <div style={{ padding: "18px 20px", borderRadius: 14, background: "oklch(97% 0.008 264)", border: "1px dashed oklch(88% 0.01 260)", fontSize: 13.5, color: "oklch(48% 0.02 265)", lineHeight: 1.55 }}>
                        Este bloque queda <strong>no aplicable</strong> porque indicaste que no enviarás personal a las instalaciones del cliente. Actívalo arriba si eres contratista con personal en planta.
                      </div>
                    )}

                    {ap && (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {list.map((doc) => {
                          const f = docs[doc.key];
                          const status = f ? (f.estado === "validado" ? STATUS.ok : STATUS.review) : STATUS.pending;
                          const dragging = dragKey === doc.key;
                          const uploading = uploadingKey === doc.key;
                          const tag = TAGS[doc.tag] || TAGS.Adicional;
                          const isOk = f && f.estado === "validado";
                          const showDate = !!DOC_MAXDAYS[doc.key] && !!f;
                          const ex = showDate ? expiry(doc.key, f?.fecha_expedicion) : null;
                          return (
                            <div
                              key={doc.key}
                              onDragOver={(e) => { e.preventDefault(); if (dragKey !== doc.key) setDragKey(doc.key); }}
                              onDragLeave={() => setDragKey((k) => (k === doc.key ? null : k))}
                              onDrop={(e) => { e.preventDefault(); const f2 = e.dataTransfer?.files?.[0]; if (f2) uploadFile(cat, doc, f2); else setDragKey(null); }}
                              style={{ display: "flex", gap: 16, alignItems: "flex-start", padding: "16px 18px", borderRadius: 14, border: "1px solid " + (dragging ? "oklch(54% 0.20 264)" : f ? "oklch(92% 0.02 264)" : "oklch(93% 0.01 260)"), background: dragging ? "oklch(97% 0.03 264)" : f ? "oklch(99.3% 0.004 264)" : "white", transition: "border-color 180ms ease, background 180ms ease" }}
                            >
                              <span style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: isOk ? "oklch(94% 0.05 170)" : f ? "oklch(96% 0.05 80)" : "oklch(96% 0.01 260)" }}>
                                <svg viewBox="0 0 20 20" style={{ width: 16, height: 16 }}><path d={isOk ? ICON_OK : ICON_DOC} fill="none" stroke={isOk ? "oklch(45% 0.13 170)" : f ? "oklch(52% 0.13 65)" : "oklch(58% 0.02 265)"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                              </span>

                              <div style={{ flex: "1 1 auto", minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap", marginBottom: 5 }}>
                                  {doc.custom ? (
                                    <input value={doc.name} onChange={(e) => renameExtra(cat.id, doc.key, e.target.value)} placeholder="Nombre del documento adicional" style={{ fontSize: 14.5, fontWeight: 700, color: "oklch(22% 0.03 265)", border: "none", borderBottom: "1px dashed oklch(80% 0.01 260)", background: "none", padding: "2px 0", fontFamily: "inherit", outline: "none", minWidth: 240 }} />
                                  ) : (
                                    <span style={{ fontSize: 14.5, fontWeight: 700, color: "oklch(22% 0.03 265)", lineHeight: 1.35 }}>{doc.name}</span>
                                  )}
                                  <span style={{ fontSize: 10.5, fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", padding: "3px 8px", borderRadius: 6, background: tag.bg, color: tag.fg }}>{doc.tag}</span>
                                </div>
                                {!doc.custom && <div style={{ fontSize: 13, lineHeight: 1.5, color: "oklch(50% 0.02 265)" }}>{doc.note}</div>}

                                {f && (
                                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 13px", borderRadius: 10, background: "oklch(97% 0.006 264)", border: "1px solid oklch(92% 0.01 260)", maxWidth: "100%" }}>
                                      <svg viewBox="0 0 20 20" style={{ width: 15, height: 15, flexShrink: 0 }}><path d="M11.5 2.5H5.5A1.5 1.5 0 004 4v12a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0016 16V7z M11.5 2.5V7H16" fill="none" stroke="oklch(54% 0.20 264)" strokeWidth="1.6" strokeLinejoin="round" /></svg>
                                      <span style={{ fontSize: 12.5, fontWeight: 600, color: "oklch(30% 0.02 265)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 220 }}>{f.file_name}</span>
                                      <span style={{ fontSize: 11.5, color: "oklch(58% 0.02 265)", whiteSpace: "nowrap" }}>{fmtSize(f.file_size || 0)}</span>
                                    </div>
                                    <button type="button" onClick={() => pick(cat, doc)} disabled={uploading} className="pv-hover-blue" style={{ padding: "8px 13px", borderRadius: 9, border: "1px solid oklch(89% 0.01 260)", background: "white", fontSize: 12.5, fontWeight: 700, color: "oklch(35% 0.02 265)", cursor: "pointer", fontFamily: "inherit" }}>Reemplazar</button>
                                    <button type="button" onClick={() => removeDoc(doc)} className="pv-remove" style={{ padding: "8px 13px", borderRadius: 9, border: "1px solid transparent", background: "none", fontSize: 12.5, fontWeight: 700, color: "oklch(58% 0.16 25)", cursor: "pointer", fontFamily: "inherit" }}>Eliminar</button>
                                  </div>
                                )}

                                {!f && (
                                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                                    <button type="button" onClick={() => pick(cat, doc)} disabled={uploading} className="pv-upload-btn" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 15px", borderRadius: 10, border: "1px solid oklch(54% 0.20 264 / 0.35)", background: "oklch(97% 0.02 264)", fontSize: 13, fontWeight: 700, color: "oklch(45% 0.18 264)", cursor: uploading ? "default" : "pointer", fontFamily: "inherit" }}>
                                      {uploading ? (
                                        <svg className="pv-spin" viewBox="0 0 16 16" style={{ width: 14, height: 14 }}><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" /></svg>
                                      ) : (
                                        <svg viewBox="0 0 16 16" style={{ width: 14, height: 14 }}><path d="M8 11V3m0 0L5 6m3-3l3 3M2.5 11.5v1A1.5 1.5 0 004 14h8a1.5 1.5 0 001.5-1.5v-1" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                      )}
                                      {uploading ? "Subiendo…" : "Subir archivo"}
                                    </button>
                                    <span style={{ fontSize: 12, color: "oklch(60% 0.02 265)" }}>o arrastra el PDF aquí · máx. 10 MB</span>
                                  </div>
                                )}

                                {showDate && (
                                  <div style={{ marginTop: 11, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                                    <label style={{ fontSize: 12, fontWeight: 600, color: "oklch(45% 0.02 265)" }}>Fecha de expedición</label>
                                    <input type="date" value={f?.fecha_expedicion || ""} onChange={(e) => setDate(doc, e.target.value)} style={{ padding: "7px 10px", borderRadius: 9, border: "1px solid oklch(89% 0.01 260)", fontSize: 12.5, fontFamily: "inherit", color: "oklch(28% 0.02 265)" }} />
                                    <span style={{ fontSize: 12, fontWeight: 600, color: ex?.fg }}>{ex?.hint}</span>
                                  </div>
                                )}
                              </div>

                              <span style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 7, padding: "6px 11px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, background: status.bg, color: status.fg }}>
                                <span style={{ width: 6, height: 6, borderRadius: "50%", background: status.fg, animation: f && f.estado !== "validado" ? "pvPulseDot 1.1s ease-in-out infinite" : "none" }} />
                                {status.label}
                              </span>
                            </div>
                          );
                        })}

                        <button type="button" onClick={() => addExtra(cat.id)} className="pv-add-btn" style={{ marginTop: 2, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 16px", borderRadius: 12, border: "1px dashed oklch(85% 0.01 260)", background: "none", fontSize: 13, fontWeight: 700, color: "oklch(45% 0.02 265)", cursor: "pointer", fontFamily: "inherit" }}>
                          <svg viewBox="0 0 16 16" style={{ width: 14, height: 14 }}><path d="M8 3.5v9M3.5 8h9" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                          Añadir documento adicional
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
              </>
            )}
          </div>
        </div>
      </div>

      <input ref={fileRef} type="file" onChange={onFileChange} accept=".pdf,.png,.jpg,.jpeg" style={{ display: "none" }} />

      {/* Footer fijo (solo en Documentos) */}
      {view === "documentos" && (
      <div style={{ position: "fixed", bottom: 0, left: 240, right: 0, zIndex: 70, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", padding: "16px 40px", background: "oklch(99% 0.002 260 / 0.92)", backdropFilter: "blur(14px)", borderTop: "1px solid oklch(91% 0.01 260)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ width: 180, height: 7, borderRadius: 999, background: "oklch(93% 0.01 260)", overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 999, width: pct + "%", background: "linear-gradient(90deg, oklch(54% 0.20 264), oklch(60% 0.15 170))", transition: "width 450ms ease" }} />
          </div>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: "oklch(40% 0.02 265)" }}>{missing === 0 ? "Expediente completo — listo para enviar" : missing + (missing === 1 ? " documento pendiente" : " documentos pendientes")}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {submitted && (
            <span style={{ fontSize: 13, fontWeight: 700, color: "oklch(45% 0.14 170)", padding: "9px 14px", borderRadius: 10, background: "oklch(95% 0.04 170)" }}>Expediente enviado a Compras y Riesgo</span>
          )}
          <button type="button" onClick={submit} disabled={missing !== 0} style={{ padding: "13px 26px", borderRadius: 11, border: "none", fontSize: 14.5, fontWeight: 700, fontFamily: "inherit", cursor: missing === 0 ? "pointer" : "default", color: "white", background: missing === 0 ? "oklch(54% 0.20 264)" : "oklch(78% 0.03 264)", boxShadow: "0 8px 22px oklch(54% 0.20 264 / 0.22)" }}>Enviar para revisión</button>
        </div>
      </div>
      )}
    </div>
  );
}
