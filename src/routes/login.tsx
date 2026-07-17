import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const { show } = useToast();
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-black">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-muted-foreground">Accede a tu cuenta para gestionar pedidos y cotizaciones.</p>
        <form onSubmit={async (e) => { e.preventDefault(); const r = await login(email, pw); if (r.ok) { show({ type: "success", message: "¡Bienvenido!" }); nav("/mi-cuenta"); } else setErr(r.message); }} className="mt-5 space-y-3">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Correo</label>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase">Contraseña</label>
            <input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          {err && <p className="rounded bg-destructive/10 p-2 text-sm text-destructive">{err}</p>}
          <button className="btn-primary w-full">Ingresar</button>
        </form>
        <div className="mt-3 flex justify-between text-sm">
          <Link to="/recuperar-contrasena" className="text-primary hover:underline">Olvidé mi contraseña</Link>
          <Link to="/registro" className="text-primary hover:underline">Crear cuenta</Link>
        </div>
        
      </div>
    </div>
  );
}
