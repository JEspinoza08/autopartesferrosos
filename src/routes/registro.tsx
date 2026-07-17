import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

export function RegisterPage() {
  const { register } = useAuth();
  const nav = useNavigate();
  const { show } = useToast();
  const [f, setF] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-6">
        <h1 className="text-2xl font-black">Crear cuenta</h1>
        <form onSubmit={async (e) => { e.preventDefault(); const r = await register(f); if (r.ok) { show({ type: "success", message: "Cuenta creada" }); nav("/mi-cuenta"); } else setErr(r.message); }} className="mt-5 space-y-3">
          {(["name","email","phone","password"] as const).map((k) => (
            <div key={k}>
              <label className="mb-1 block text-xs font-semibold uppercase">{k === "name" ? "Nombre completo" : k === "email" ? "Correo" : k === "phone" ? "Celular" : "Contraseña"}</label>
              <input required type={k === "password" ? "password" : k === "email" ? "email" : "text"} value={(f as any)[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="w-full rounded border border-border bg-background px-3 py-2 text-sm" />
            </div>
          ))}
          {err && <p className="rounded bg-destructive/10 p-2 text-sm text-destructive">{err}</p>}
          <button className="btn-primary w-full">Registrarme</button>
        </form>
        <p className="mt-3 text-sm text-muted-foreground">¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link></p>
      </div>
    </div>
  );
}
