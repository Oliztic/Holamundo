import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si no hay sesión, mandamos al login
  if (!user) {
    redirect("/login");
  }

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
      <h1 style={{ fontSize: "2.5rem", margin: 0 }}>Hola Mundo</h1>
      <p style={{ fontSize: "1.3rem", opacity: 0.9 }}>Bienvenidos a Oliztic</p>
      <p style={{ marginTop: "1rem", opacity: 0.8 }}>
        Sesión iniciada como: <strong>{user.email}</strong>
      </p>
      <LogoutButton />
    </main>
  );
}
