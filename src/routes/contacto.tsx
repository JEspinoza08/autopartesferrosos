
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useToast } from "@/context/ToastContext";
import { waLink } from "@/lib/format";
import { supabase } from "@/lib/supabase";

export function Contacto() {
  const { show } = useToast();
  const [form, setForm] = useState({ nombre: "", empresa: "", ruc: "", correo: "", celular: "", tipo: "Consulta general", producto: "", mensaje: "" });
  const upd = (k: string, v: string) => setForm({ ...form, [k]: v });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("contact_messages").insert({
      name: form.nombre, company: form.empresa || null, ruc: form.ruc || null,
      email: form.correo, phone: form.celular, inquiry_type: form.tipo,
      product_code: form.producto || null, message: form.mensaje,
    });
    if (error) return show({ type: "error", message: error.message });
    show({ type: "success", message: "¡Mensaje enviado! Te contactaremos pronto." });
    setForm({ nombre: "", empresa: "", ruc: "", correo: "", celular: "", tipo: "Consulta general", producto: "", mensaje: "" });
  };
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Contacto" }]} />
      <h1 className="mt-4 text-3xl font-black">Contáctanos</h1>
      <p className="mt-1 text-sm text-muted-foreground">Escríbenos y un especialista te responderá a la brevedad.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <form onSubmit={submit} className="rounded-lg border border-border bg-card p-5 space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Nombre *" value={form.nombre} onChange={(v) => upd("nombre", v)} required />
            <Input label="Empresa" value={form.empresa} onChange={(v) => upd("empresa", v)} />
            <Input label="RUC" value={form.ruc} onChange={(v) => upd("ruc", v)} />
            <Input label="Correo *" type="email" value={form.correo} onChange={(v) => upd("correo", v)} required />
            <Input label="Celular *" value={form.celular} onChange={(v) => upd("celular", v)} required />
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">Tipo de consulta</label>
              <select value={form.tipo} onChange={(e) => upd("tipo", e.target.value)} className="w-full rounded border border-border bg-background px-3 py-2 text-sm">
                <option>Consulta general</option><option>Cotización</option><option>Soporte técnico</option><option>Postventa</option>
              </select>
            </div>
          </div>
          <Input label="Producto o código" value={form.producto} onChange={(v) => upd("producto", v)} />
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">Mensaje *</label>
            <textarea required value={form.mensaje} onChange={(e) => upd("mensaje", e.target.value)} rows={5} className="w-full rounded border border-border bg-background px-3 py-2 text-sm" />
          </div>
          <button className="btn-primary w-full">Enviar mensaje</button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-bold">Datos de contacto</p>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex gap-2"><Phone className="h-4 w-4 text-primary mt-0.5" /> (01) 000-0000 <span className="text-muted-foreground">(referencial)</span></li>
              <li className="flex gap-2"><Mail className="h-4 w-4 text-primary mt-0.5" /> ventas@ferrosos.pe</li>
              <li className="flex gap-2"><MapPin className="h-4 w-4 text-primary mt-0.5" /> Av. Argentina 3200, Cercado de Lima</li>
              <li className="flex gap-2"><Clock className="h-4 w-4 text-primary mt-0.5" /> Lun-Vie 8:00-18:00 · Sáb 8:00-13:00</li>
            </ul>
            <a href={waLink("Hola, tengo una consulta.")} target="_blank" rel="noreferrer" className="btn-primary mt-4 w-full"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
function Input({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">{label}</label>
      <input required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
    </div>
  );
}
