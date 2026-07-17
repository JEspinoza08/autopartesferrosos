import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { waLink } from "@/lib/format";

export function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      {open && (
        <div className="mb-3 w-72 overflow-hidden rounded-lg border border-border bg-card shadow-2xl">
          <div className="bg-[#25D366] p-4 text-white">
            <p className="text-sm font-semibold">Autopartes Ferrosos</p>
            <p className="text-xs opacity-90">Atención: Lun-Vie 8:00-18:00</p>
          </div>
          <div className="flex flex-col gap-2 p-3">
            <p className="text-sm text-foreground">¡Hola! ¿En qué podemos ayudarte?</p>
            <a href={waLink("Hola, deseo hablar con ventas.")} target="_blank" rel="noreferrer" className="btn-outline w-full !justify-start">Hablar con ventas</a>
            <a href={waLink("Hola, quiero consultar por un producto.")} target="_blank" rel="noreferrer" className="btn-outline w-full !justify-start">Consultar un producto</a>
            <a href={waLink("Hola, quiero solicitar una cotización empresarial.")} target="_blank" rel="noreferrer" className="btn-outline w-full !justify-start">Solicitar cotización</a>
          </div>
        </div>
      )}
      <button
        aria-label={open ? "Cerrar chat WhatsApp" : "Abrir chat WhatsApp"}
        onClick={() => setOpen((v) => !v)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-110"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
