// Capa de presentación del catálogo para el panel del proveedor.
// Los datos base (claves, tags, vigencias) viven en lib/expediente.
import { CATS, CATALOG_KEYS, DOC_MAXDAYS } from "../../lib/expediente";

const ICONOS = {
  legal: { iconBg: "oklch(95% 0.03 264)", iconFg: "oklch(45% 0.18 264)" },
  fin: { iconBg: "oklch(95% 0.03 300)", iconFg: "oklch(48% 0.16 300)" },
  laft: { iconBg: "oklch(96% 0.04 75)", iconFg: "oklch(52% 0.14 60)" },
  sst: { iconBg: "oklch(94% 0.05 170)", iconFg: "oklch(45% 0.13 170)" },
};

const NOTAS = {
  camara: "Cámara de Comercio · expedición no mayor a 30–60 días. Verifica representante legal y facultades de firma.",
  rut: "Actualizado. Define régimen tributario y actividad económica (código CIIU).",
  cedula: "Documento de identidad del representante legal, ambas caras legibles.",
  accionaria: "Firmada por contador o revisor fiscal. Identifica beneficiarios finales para control de LA/FT.",
  banco: "Expedida por el banco con no más de 30 días. Inscribe la cuenta en la pasarela de pagos.",
  ef: "Balance general y estado de resultados del último año fiscal, con notas explicativas.",
  tp: "Del contador y/o revisor fiscal que firma los estados financieros.",
  origen: "Formato firmado por el representante legal declarando la licitud de los recursos.",
  sagrilaft: "Solo para empresas obligadas a tener sistema de autocontrol y gestión del riesgo LA/FT.",
  antecedentes: "Judiciales, fiscales (Contraloría) y disciplinarios (Procuraduría), de la empresa y del representante legal.",
  parafiscales: "Firmado por revisor fiscal o representante legal: salud, pensión y ARL al día.",
  sgsst: "Certificación del porcentaje de avance en estándares mínimos (Resolución 0312).",
  rce: "Con amparo de predios, labores y operaciones para accidentes dentro de la planta.",
};

export const CATS_UI = CATS.map((cat) => ({
  ...cat,
  ...(ICONOS[cat.id] || {}),
  docs: cat.docs.map((d) => ({ ...d, note: NOTAS[d.key] || "" })),
}));

export { CATALOG_KEYS, DOC_MAXDAYS };
