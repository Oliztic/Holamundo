"use client";

import { useEffect, useState } from "react";
import { buildResumen } from "../../lib/expediente";

const COLS = [
  { key: "nit", label: "NIT" },
  { key: "nombre", label: "Nombre Empresa" },
  { key: "created_at", label: "Fecha de Invitación" },
  { key: "correo", label: "Correo Corporativo" },
  { key: "estado", label: "Estado" },
];

const ESTADOS = ["Todos", "Invitado", "Registrado"];

export default function ProveedoresSection({ supabase }) {
  const [vista, setVista] = useState("listado"); // listado | invitar | detalle
  const [sel, setSel] = useState(null);

  return (
    <>
      <div className="pv-tabs">
        <button
          className={vista === "listado" ? "active" : ""}
          onClick={() => setVista("listado")}
        >
          Listado Proveedores
        </button>
        <button
          className={vista === "invitar" ? "active" : ""}
          onClick={() => setVista("invitar")}
        >
          Invitar Proveedor
        </button>
      </div>

      {vista === "invitar" && <Invitar supabase={supabase} />}
      {vista === "listado" && (
        <Listado
          supabase={supabase}
          onVer={(p) => {
            setSel(p);
            setVista("detalle");
          }}
        />
      )}
      {vista === "detalle" && (
        <Detalle proveedor={sel} onVolver={() => setVista("listado")} />
      )}
    </>
  );
}

function Invitar({ supabase }) {
  const [nit, setNit] = useState("");
  const [correo, setCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [msg, setMsg] = useState(null);

  async function enviar(e) {
    e.preventDefault();
    setCargando(true);
    setMsg(null);
    try {
      const res = await fetch("/api/proveedores/invitar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nit, correo }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg({ tipo: "error", texto: json.error || "No se pudo invitar." });
      } else if (json.emailSent) {
        setMsg({ tipo: "ok", texto: "Invitación enviada al correo del proveedor." });
        setNit("");
        setCorreo("");
      } else {
        setMsg({
          tipo: "ok",
          texto:
            "Proveedor registrado. Correo no configurado; contraseña temporal: " +
            json.tempPassword,
        });
        setNit("");
        setCorreo("");
      }
    } catch {
      setMsg({ tipo: "error", texto: "Error de red." });
    }
    setCargando(false);
  }

  return (
    <form className="pv-form" onSubmit={enviar}>
      <label className="pv-label">NIT del proveedor</label>
      <input
        className="pv-input"
        value={nit}
        onChange={(e) => setNit(e.target.value)}
        placeholder="901.234.567-8"
        required
      />
      <label className="pv-label">Correo corporativo</label>
      <input
        className="pv-input"
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        placeholder="contacto@proveedor.com"
        required
      />
      {msg && <div className={`pv-msg ${msg.tipo}`}>{msg.texto}</div>}
      <button className="pv-btn" type="submit" disabled={cargando}>
        {cargando ? "Enviando…" : "Enviar Invitación"}
      </button>
    </form>
  );
}

function Listado({ supabase, onVer }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState({ col: "created_at", dir: "desc" });
  const [filtro, setFiltro] = useState("Todos");
  const [reenviandoId, setReenviandoId] = useState(null);
  const [msg, setMsg] = useState(null);

  async function reenviar(row) {
    setReenviandoId(row.id);
    setMsg(null);
    try {
      const res = await fetch("/api/proveedores/reenviar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: row.correo }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMsg({ tipo: "error", texto: json.error || "No se pudo reenviar." });
      } else if (json.emailSent) {
        setMsg({ tipo: "ok", texto: `Invitación reenviada a ${row.correo}.` });
      } else {
        setMsg({
          tipo: "ok",
          texto: `Nueva contraseña temporal para ${row.correo}: ${json.tempPassword}`,
        });
      }
    } catch {
      setMsg({ tipo: "error", texto: "Error de red." });
    }
    setReenviandoId(null);
  }

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("proveedores")
        .select("id, nit, nombre, correo, estado, created_at, user_id");
      setRows(data || []);
      setLoading(false);
    })();
  }, []);

  function ordenarPor(col) {
    setSort((s) =>
      s.col === col
        ? { col, dir: s.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" }
    );
  }

  const filtradas = rows.filter(
    (r) => filtro === "Todos" || r.estado === filtro
  );
  const ordenadas = [...filtradas].sort((a, b) => {
    const av = a[sort.col] ?? "";
    const bv = b[sort.col] ?? "";
    if (av < bv) return sort.dir === "asc" ? -1 : 1;
    if (av > bv) return sort.dir === "asc" ? 1 : -1;
    return 0;
  });

  const fecha = (v) => (v ? new Date(v).toLocaleDateString("es-CO") : "—");

  return (
    <>
      <div className="pv-toolbar">
        <label className="pv-filtro">
          Estado
          <select value={filtro} onChange={(e) => setFiltro(e.target.value)}>
            {ESTADOS.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </label>
      </div>

      {msg && <div className={`pv-msg ${msg.tipo}`}>{msg.texto}</div>}

      <div className="pv-tablewrap">
        <table className="pv-table">
          <thead>
            <tr>
              {COLS.map((c) => (
                <th key={c.key} onClick={() => ordenarPor(c.key)}>
                  {c.label}
                  {sort.col === c.key && (
                    <span className="pv-sort">
                      {sort.dir === "asc" ? " ▲" : " ▼"}
                    </span>
                  )}
                </th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="pv-empty">Cargando…</td>
              </tr>
            )}
            {!loading && ordenadas.length === 0 && (
              <tr>
                <td colSpan={6} className="pv-empty">Sin proveedores.</td>
              </tr>
            )}
            {ordenadas.map((r) => (
              <tr key={r.id}>
                <td>{r.nit || "—"}</td>
                <td>{r.nombre || "—"}</td>
                <td>{fecha(r.created_at)}</td>
                <td>{r.correo || "—"}</td>
                <td>
                  <span className={`pv-estado ${r.estado === "Registrado" ? "ok" : "pend"}`}>
                    {r.estado}
                  </span>
                </td>
                <td className="pv-acciones">
                  <button className="pv-ver" onClick={() => onVer(r)}>
                    Ver
                  </button>
                  <button
                    className="pv-ver"
                    onClick={() => reenviar(r)}
                    disabled={reenviandoId === r.id}
                  >
                    {reenviandoId === r.id ? "Enviando…" : "Reenviar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

const EST_META = {
  pendiente: { label: "Pendiente", cls: "pend" },
  en_revision: { label: "En revisión", cls: "rev" },
  validado: { label: "Validado", cls: "ok" },
};

function Detalle({ proveedor, onVolver }) {
  const p = proveedor || {};
  const fecha = p.created_at ? new Date(p.created_at).toLocaleString("es-CO") : "—";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState(null);
  const [info, setInfo] = useState({ personnel: true, enviado: false });

  useEffect(() => {
    (async () => {
      if (!p.user_id) { setError("Este proveedor aún no tiene cuenta de acceso."); setLoading(false); return; }
      try {
        const res = await fetch("/api/proveedores/expediente", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ proveedorUserId: p.user_id }),
        });
        const json = await res.json();
        if (!res.ok) { setError(json.error || "No se pudo cargar el expediente."); }
        else {
          setInfo({ personnel: json.personnel, enviado: json.enviado });
          setResumen(buildResumen(json.docs, json.personnel));
        }
      } catch {
        setError("Error de red.");
      }
      setLoading(false);
    })();
  }, [p.user_id]);

  const fmtFecha = (v) => (v ? new Date(v).toLocaleDateString("es-CO") : null);

  return (
    <div className="exp-detalle">
      <button className="pv-volver" onClick={onVolver}>← Volver al listado</button>

      <div className="exp-cabecera">
        <div>
          <h3>{p.nombre || "Proveedor"}</h3>
          <div className="exp-meta">
            <span>NIT {p.nit || "—"}</span>
            <span>{p.correo || "—"}</span>
            <span>Invitado {fecha}</span>
          </div>
        </div>
        {resumen && (
          <div className="exp-progreso">
            <div className="exp-pct">{resumen.pct}%</div>
            <div className="exp-progreso-info">
              <div className="exp-bar"><div style={{ width: resumen.pct + "%" }} /></div>
              <span>{resumen.uploaded}/{resumen.total} cargados · {resumen.valid} validados</span>
            </div>
          </div>
        )}
      </div>

      {info.enviado && (
        <div className="exp-enviado">El proveedor marcó su expediente como enviado para revisión.</div>
      )}

      {loading && <div className="exp-cargando">Cargando expediente…</div>}
      {error && <div className="pv-msg error">{error}</div>}

      {resumen && resumen.cats.map((cat) => (
        <div key={cat.id} className="exp-cat">
          <div className="exp-cat-head">
            <span className="exp-cat-num">{cat.num}</span>
            <div className="exp-cat-titulo">
              <strong>{cat.short}</strong>
              <span>{cat.sub}</span>
            </div>
            <span className={`pv-estado ${!cat.applies ? "pend" : cat.done === cat.count ? "ok" : "pend"}`}>
              {cat.applies ? `${cat.done}/${cat.count}` : "No aplica"}
            </span>
          </div>
          {cat.applies ? (
            <div className="exp-docs">
              {cat.docs.map((d) => {
                const est = EST_META[d.estado] || EST_META.pendiente;
                return (
                  <div key={d.key} className="exp-doc">
                    <div className="exp-doc-info">
                      <span className="exp-doc-nombre">{d.name}</span>
                      {d.fileName && (
                        <span className="exp-doc-file">
                          {d.fileName}{fmtFecha(d.fecha) ? ` · exp. ${fmtFecha(d.fecha)}` : ""}
                        </span>
                      )}
                    </div>
                    <span className={`pv-estado ${est.cls}`}>{est.label}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="exp-noaplica">No aplica: el proveedor indicó que no envía personal a las instalaciones.</div>
          )}
        </div>
      ))}
    </div>
  );
}
