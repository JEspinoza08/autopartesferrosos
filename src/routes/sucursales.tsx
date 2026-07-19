
import { branches } from "@/data/branches";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/format";

export function Sucursales() {
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Sucursales" }]} />
      <h1 className="mt-4 text-3xl font-black">Sucursales</h1>
      <p className="mt-1 text-sm text-muted-foreground">Direcciones referenciales · consulta stock antes de acercarte.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {branches.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="h-56 overflow-hidden">
  <iframe
    src={b.mapEmbedUrl}
    title={b.name}
    className="h-full w-full border-0"
    loading="lazy"
    allowFullScreen
    referrerPolicy="no-referrer-when-downgrade"
  />
</div>
            <div className="p-4">
              <p className="font-bold text-lg">{b.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>
              <div className="mt-3 space-y-1 text-sm">
                <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> {b.phone}</p>
                <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> {b.email}</p>
                <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-primary" /> {b.hours}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
  href={b.mapUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="btn-outline !py-2 !px-3 text-sm"
>
  <MapPin className="h-4 w-4" />
  Ver ubicación
</a>
                <a href={waLink(`Hola, deseo contactar con la sucursal ${b.city}.`)} target="_blank" rel="noreferrer" className="btn-primary !py-2 !px-3 text-sm"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
