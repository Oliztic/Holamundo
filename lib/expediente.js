// Catalogo del expediente de cumplimiento del proveedor.
// Fuente unica compartida entre el panel del proveedor y la vista de la empresa.

export const CATS = [
  {
    id: "legal",
    num: 1,
    title: "Documentos legales y de identificación",
    short: "Legales e identificación",
    sub: "Existencia legal de la empresa y facultades del representante",
    docs: [
      { key: "camara", name: "Certificado de Existencia y Representación Legal", tag: "Obligatorio", date: true, maxDays: 60 },
      { key: "rut", name: "RUT / Tax ID", tag: "Obligatorio" },
      { key: "cedula", name: "Cédula de ciudadanía o pasaporte", tag: "Obligatorio" },
      { key: "accionaria", name: "Certificación de composición accionaria", tag: "Obligatorio" },
    ],
  },
  {
    id: "fin",
    num: 2,
    title: "Cumplimiento financiero y bancario",
    short: "Financiero y bancario",
    sub: "Liquidez de la empresa y configuración de la cuenta de pagos",
    docs: [
      { key: "banco", name: "Certificación bancaria", tag: "Obligatorio", date: true, maxDays: 30 },
      { key: "ef", name: "Estados financieros auditados", tag: "Obligatorio" },
      { key: "tp", name: "Tarjeta profesional y cédula del contador", tag: "Obligatorio" },
    ],
  },
  {
    id: "laft",
    num: 3,
    title: "Anti-lavado de activos y anticorrupción",
    short: "SAGRILAFT / LA-FT",
    sub: "Exigido a proveedores de riesgo medio y alto (SAGRILAFT · PTEE)",
    docs: [
      { key: "origen", name: "Formulario de vinculación y declaración de origen de fondos", tag: "Obligatorio" },
      { key: "sagrilaft", name: "Certificación SAGRILAFT / PTEE", tag: "Condicional" },
      { key: "antecedentes", name: "Certificados de antecedentes", tag: "Obligatorio", date: true, maxDays: 30 },
    ],
  },
  {
    id: "sst",
    num: 4,
    title: "Seguridad y Salud en el Trabajo",
    short: "SST / contratistas",
    sub: "Requerido cuando el proveedor envía personal a planta",
    conditional: "personnel",
    docs: [
      { key: "parafiscales", name: "Certificado de aportes a seguridad social y parafiscales", tag: "Obligatorio", date: true, maxDays: 30 },
      { key: "sgsst", name: "Evaluación del SG-SST", tag: "Obligatorio" },
      { key: "rce", name: "Póliza de Responsabilidad Civil Extracontractual", tag: "Obligatorio", date: true, maxDays: 365 },
    ],
  },
];

export const CATALOG_KEYS = new Set(CATS.flatMap((c) => c.docs.map((d) => d.key)));

export const DOC_MAXDAYS = {};
CATS.forEach((c) => c.docs.forEach((d) => { if (d.date) DOC_MAXDAYS[d.key] = d.maxDays; }));

// Construye el resumen de avance a partir de las filas de proveedor_documentos.
export function buildResumen(docRows, personnel) {
  const rows = docRows || [];
  const byKey = {};
  rows.forEach((r) => { byKey[r.doc_key] = r; });

  const cats = CATS.map((cat) => {
    const applies = cat.conditional !== "personnel" || personnel;
    const extras = rows
      .filter((r) => r.categoria === cat.id && !CATALOG_KEYS.has(r.doc_key))
      .map((r) => ({ key: r.doc_key, name: r.nombre, tag: "Adicional", custom: true }));
    const list = cat.docs.concat(extras);
    const docs = list.map((d) => {
      const f = byKey[d.key];
      return {
        key: d.key,
        name: d.name || f?.nombre || "Documento",
        tag: d.tag,
        hasFile: !!f,
        estado: f ? f.estado : "pendiente",
        fileName: f?.file_name || null,
        fecha: f?.fecha_expedicion || null,
      };
    });
    const done = docs.filter((d) => d.hasFile).length;
    return { id: cat.id, num: cat.num, title: cat.title, short: cat.short, sub: cat.sub, applies, docs, done, count: list.length };
  });

  const applicable = cats.filter((c) => c.applies);
  const total = applicable.reduce((n, c) => n + c.count, 0);
  const uploaded = applicable.reduce((n, c) => n + c.done, 0);
  const valid = applicable.reduce((n, c) => n + c.docs.filter((d) => d.estado === "validado").length, 0);
  const pct = total ? Math.round((uploaded / total) * 100) : 0;
  return { cats, total, uploaded, valid, pct };
}
