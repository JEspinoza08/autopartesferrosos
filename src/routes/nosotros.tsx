import { Link } from "react-router-dom";
import { Target, Eye, Award, Users, Truck, MapPin, MessageCircle } from "lucide-react";
import { brands } from "@/data/brands";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { waLink } from "@/lib/format";

export function Nosotros() {
  return (
    <div>
      <section className="relative bg-industrial text-white">
        <img src="https://images.unsplash.com/photo-1601758064955-c1907c40db8f?w=1600&q=70" alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="container-x relative py-16">
          <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Nosotros" }]} />
          <h1 className="mt-4 text-4xl font-black md:text-5xl">Especialistas en transporte pesado</h1>
          <p className="mt-3 max-w-2xl opacity-90">Empresa peruana con amplia trayectoria en la comercialización de repuestos y componentes para camiones, remolques y semirremolques.</p>
        </div>
      </section>

      <section className="container-x grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
        <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=70" alt="Nuestra historia" className="rounded-lg" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Nuestra historia</p>
          <h2 className="text-3xl font-black">Trayectoria construida junto al transportista peruano</h2>
          <p className="mt-3 text-muted-foreground">Nacimos con el objetivo de brindar repuestos confiables y asesoría técnica al sector transporte del Perú. Con el pasar de los años, hemos ampliado nuestro portafolio y sucursales para acompañar a empresas, talleres y transportistas independientes en todo el país.</p>
          <p className="mt-2 text-xs italic text-muted-foreground">Contenido referencial editable.</p>
        </div>
      </section>

      <section className="bg-muted py-14">
        <div className="container-x grid gap-6 md:grid-cols-3">
          {[
            { icon: Target, t: "Misión", d: "Proveer soluciones integrales en repuestos y componentes para transporte pesado con calidad, disponibilidad y respaldo técnico." },
            { icon: Eye, t: "Visión", d: "Ser el referente en el mercado peruano de autopartes para camiones y semirremolques, reconocidos por especialización y servicio." },
            { icon: Award, t: "Valores", d: "Compromiso, calidad, responsabilidad, especialización y confianza en cada relación comercial." },
          ].map((v, i) => (
            <div key={i} className="rounded-lg border border-border bg-card p-6">
              <div className="mb-3 inline-flex rounded-md bg-primary/10 p-3 text-primary"><v.icon className="h-6 w-6" /></div>
              <p className="text-lg font-bold">{v.t}</p><p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x py-14">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Línea de tiempo</p>
        <h2 className="text-3xl font-black">Nuestra trayectoria</h2>
        <ol className="mt-6 space-y-6 border-l-2 border-primary/30 pl-6">
          {[
            { y: "2000", t: "Fundación", d: "Iniciamos operaciones enfocados en atender talleres locales." },
            { y: "2008", t: "Expansión al norte", d: "Abrimos nuestra primera sucursal fuera de Lima." },
            { y: "2015", t: "Diversificación", d: "Ampliamos catálogo con marcas europeas y americanas." },
            { y: "2022", t: "E-commerce", d: "Lanzamos nuestra plataforma digital para clientes B2B y B2C." },
          ].map((s, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary" />
              <p className="text-sm font-bold text-primary">{s.y}</p>
              <p className="font-bold">{s.t}</p><p className="text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-muted py-14">
        <div className="container-x">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Cobertura</p>
          <h2 className="text-3xl font-black">Presencia nacional</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            {[
              { icon: Users, t: "Equipo especializado" },
              { icon: MapPin, t: "Sucursales en el país" },
              { icon: Truck, t: "Envíos a todo el Perú" },
              { icon: Award, t: "Marcas reconocidas" },
            ].map((c, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5 text-center">
                <c.icon className="mx-auto h-8 w-8 text-primary" /><p className="mt-2 font-semibold">{c.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-14">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Marcas que comercializamos</p>
        <h2 className="text-3xl font-black">Trabajamos con líderes de la industria</h2>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {brands.map((b) => (
            <div key={b.slug} className="flex items-center justify-center rounded border border-border bg-card p-3">
              <img src={b.logo} alt={b.name} className="max-h-10" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-industrial text-white">
        <div className="container-x py-14 text-center">
          <h2 className="text-3xl font-black">Trabajemos juntos</h2>
          <p className="mt-2 opacity-90">Conversemos sobre las necesidades de tu operación.</p>
          <div className="mt-5 flex justify-center gap-3">
            <a href={waLink("Hola, deseo contactar con Autopartes Ferrosos.")} target="_blank" rel="noreferrer" className="btn-primary"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <Link to="/contacto" className="btn-outline !border-white/30 !bg-white/10 !text-white">Formulario de contacto</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
