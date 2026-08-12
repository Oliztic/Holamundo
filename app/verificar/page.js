"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../lib/supabase/client";

export default function VerificarPage() {
  const router = useRouter();
  const supabase = createClient();
  const [estado, setEstado] = useState("Verificando tu cuenta…");

  useEffect(() => {
    (async () => {
      // Espera a que el cliente establezca la sesión desde el enlace.
      let user = null;
      for (let i = 0; i < 12 && !user; i++) {
        const { data } = await supabase.auth.getUser();
        user = data?.user || null;
        if (!user) await new Promise((r) => setTimeout(r, 300));
      }
      if (!user) {
        router.replace("/login");
        return;
      }
      await supabase.auth.updateUser({ data: { verificado: true } });
      setEstado("Cuenta verificada. Redirigiendo…");
      setTimeout(() => {
        router.replace("/panel");
        router.refresh();
      }, 1000);
    })();
  }, []);

  return (
    <div className="panel-loading">
      <p>{estado}</p>
    </div>
  );
}
