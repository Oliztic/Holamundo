"use client";

import { useEffect, useState } from "react";

export default function EquipoSection() {
  const [rows, setRows] = useState([]);
  const [yo, setYo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/equipo");
        const json = await res.json();
        if (!res.ok) setError(json.error || "No se pudo cargar el equipo.");
        else {
          setRows(json.equipo || []);
          setYo(json.yo);
        }
      } catch {
        setError("Error de red.");
      }
      setLoading(false);
    })();
  }, []);

  const fecha = (v) => (v ? new Date(v).toLocaleDateString("es-CO") : "—");

  return (
    <>
      <p className="eq-desc">
        Miembros que comparten el dominio corporativo de tu empresa.
      </p>
      {error && <div className="pv-msg error">{error}</div>}
      <div className="pv-tablewrap">
        <table className="pv-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Teléfono</th>
              <th>Desde</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="pv-empty">Cargando…</td>
              </tr>
            )}
            {!loading && rows.length === 0 && !error && (
              <tr>
                <td colSpan={5} className="pv-empty">Sin miembros.</td>
              </tr>
            )}
            {rows.map((m) => (
              <tr key={m.id}>
                <td>
                  {m.nombre}
                  {m.id === yo && <span className="eq-yo">Tú</span>}
                </td>
                <td>{m.correo}</td>
                <td>
                  <span className={`pv-estado ${m.rol === "admin" ? "ok" : "pend"}`}>
                    {m.rol}
                  </span>
                </td>
                <td>{m.telefono || "—"}</td>
                <td>{fecha(m.desde)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
