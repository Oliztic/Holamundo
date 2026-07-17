export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "system-ui, sans-serif",
        background: "linear-gradient(135deg, #0f172a, #1e3a8a)",
        color: "white",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1 style={{ fontSize: "3rem", margin: 0 }}>Hola Mundo</h1>
      <p style={{ fontSize: "1.5rem", marginTop: "1rem", opacity: 0.9 }}>
        Bienvenidos a Oliztic
      </p>
      <a
        href="/login"
        style={{
          marginTop: "2rem",
          padding: "0.75rem 1.5rem",
          borderRadius: "8px",
          background: "white",
          color: "#1e3a8a",
          textDecoration: "none",
          fontSize: "1rem",
          fontWeight: 600,
        }}
      >
        Iniciar sesión
      </a>
    </main>
  );
}
