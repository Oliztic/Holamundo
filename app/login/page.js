"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  async function iniciarSesion(e) {
    e.preventDefault();
    setCargando(true);
    setMensaje("");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setCargando(false);
    if (error) {
      setMensaje("Error: " + error.message);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function registrarse(e) {
    e.preventDefault();
    if (!email || !password) {
      setMensaje("Escribe correo y contraseña antes de crear la cuenta.");
      return;
    }
    setCargando(true);
    setMensaje("");
    const { error } = await supabase.auth.signUp({ email, password });
    setCargando(false);
    if (error) {
      setMensaje("Error: " + error.message);
    } else {
      setMensaje("Cuenta creada. Revisa tu correo para confirmar (si aplica).");
    }
  }

  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        padding: "1rem",
      }}
    >
      <form
        onSubmit={iniciarSesion}
        style={{
          background: "white",
          padding: "2rem",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "360px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1 style={{ margin: "0 0 0.25rem", color: "#0f172a" }}>Oliztic</h1>
        <p style={{ marginTop: 0, color: "#64748b" }}>Inicia sesión</p>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" disabled={cargando} style={btnPrimary}>
          {cargando ? "..." : "Entrar"}
        </button>
        <button type="button" onClick={registrarse} disabled={cargando} style={btnSecondary}>
          Crear cuenta
        </button>

        {mensaje && (
          <p style={{ marginTop: "1rem", color: "#dc2626", fontSize: "0.9rem" }}>
            {mensaje}
          </p>
        )}
      </form>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "0.75rem",
  margin: "0.5rem 0",
  borderRadius: "8px",
  border: "1px solid #cbd5e1",
  boxSizing: "border-box",
  fontSize: "1rem",
};

const btnPrimary = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.75rem",
  borderRadius: "8px",
  border: "none",
  background: "#1e3a8a",
  color: "white",
  fontSize: "1rem",
  cursor: "pointer",
};

const btnSecondary = {
  width: "100%",
  padding: "0.75rem",
  marginTop: "0.5rem",
  borderRadius: "8px",
  border: "1px solid #1e3a8a",
  background: "white",
  color: "#1e3a8a",
  fontSize: "1rem",
  cursor: "pointer",
};
