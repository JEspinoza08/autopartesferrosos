import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin, CreditCard, Truck, ShieldCheck } from "lucide-react";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { useState } from "react";
import { useToast } from "@/context/ToastContext";

export function Footer() {
  const [email, setEmail] = useState("");
  const { show } = useToast();
  return (
    <footer className="mt-16 bg-industrial text-white">
      <div className="border-b border-white/10 diag-stripes">
        <div className="container-x grid gap-6 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary p-3"><ShieldCheck className="h-6 w-6" /></div>
            <div><p className="font-bold">Compra segura</p><p className="text-xs opacity-80">Productos originales y garantizados</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary p-3"><Truck className="h-6 w-6" /></div>
            <div><p className="font-bold">Envíos a todo el Perú</p><p className="text-xs opacity-80">Coordinamos entregas a nivel nacional</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-md bg-primary p-3"><CreditCard className="h-6 w-6" /></div>
            <div><p className="font-bold">Múltiples formas de pago</p><p className="text-xs opacity-80">Tarjetas, transferencia y contra entrega</p></div>
          </div>
        </div>
      </div>

      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground font-black">AF</div>
            <div><p className="text-base font-black leading-none">AUTOPARTES</p><p className="text-xs font-bold tracking-widest text-primary">FERROSOS</p></div>
          </div>
          <p className="text-sm opacity-80">Empresa peruana especializada en la comercialización de repuestos, componentes y accesorios para transporte pesado, camiones, remolques y semirremolques.</p>
          <div className="mt-4 space-y-1 text-sm">
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" /> (01) 000-0000 <span className="opacity-60">(referencial)</span></p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" /> ventas@ferrosos.pe</p>
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> Av. Argentina 3200, Cercado de Lima</p>
          </div>
          <div className="mt-4 flex gap-2">
            {[Facebook, Instagram, Youtube, Linkedin].map((I, i) => (
              <a key={i} href="#" aria-label="Red social" className="rounded bg-white/10 p-2 hover:bg-primary"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Categorías</p>
          <ul className="space-y-1.5 text-sm opacity-90">
            {categories.slice(0, 8).map((c) => (
              <li key={c.slug}><Link to={`/categorias/${c.slug}`} className="hover:text-primary">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Marcas</p>
          <ul className="space-y-1.5 text-sm opacity-90">
            {brands.slice(0, 8).map((b) => (
              <li key={b.slug}><Link to={`/marcas/${b.slug}`} className="hover:text-primary">{b.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-primary">Ayuda</p>
          <ul className="space-y-1.5 text-sm opacity-90">
            <li><Link to="/nosotros" className="hover:text-primary">Nosotros</Link></li>
            <li><Link to="/contacto" className="hover:text-primary">Contacto</Link></li>
            <li><Link to="/sucursales" className="hover:text-primary">Sucursales</Link></li>
            <li><Link to="/politica-de-envios" className="hover:text-primary">Política de envíos</Link></li>
            <li><Link to="/cambios-y-devoluciones" className="hover:text-primary">Cambios y devoluciones</Link></li>
            <li><Link to="/terminos-y-condiciones" className="hover:text-primary">Términos y condiciones</Link></li>
            <li><Link to="/politica-de-privacidad" className="hover:text-primary">Política de privacidad</Link></li>
            <li><Link to="/libro-de-reclamaciones" className="hover:text-primary">Libro de reclamaciones</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x grid gap-4 py-6 md:grid-cols-2">
          <form onSubmit={(e) => { e.preventDefault(); if (email) { show({ type: "success", message: "¡Gracias por suscribirte!" }); setEmail(""); } }} className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required placeholder="Suscríbete a novedades y ofertas" className="flex-1 rounded-md bg-white/10 px-3 py-2 text-sm placeholder:text-white/60 outline-none focus:bg-white/15" />
            <button className="btn-primary" type="submit">Suscribirme</button>
          </form>
          <div className="flex items-center gap-2 text-xs opacity-80 md:justify-end">
            <span>Aceptamos:</span>
            {["VISA","MASTERCARD","AMEX","YAPE","PLIN"].map((m) => (
              <span key={m} className="rounded bg-white/10 px-2 py-1 font-semibold">{m}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-black/40">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-4 text-xs opacity-80 md:flex-row">
          <p>© {new Date().getFullYear()} Autopartes Ferrosos. Todos los derechos reservados.</p>
          <p>Contenido referencial · sujeto a disponibilidad y verificación técnica.</p>
        </div>
      </div>
    </footer>
  );
}
