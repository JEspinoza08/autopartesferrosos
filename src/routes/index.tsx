import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Truck, ShieldCheck, Headphones, Package, ArrowRight, Search, MapPin, Phone, MessageCircle, Building2, Wrench, Factory, Users } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { branches } from "@/data/branches";
import { posts } from "@/data/blog";
import { ProductCard } from "@/components/products/ProductCard";
import { waLink } from "@/lib/format";
import remolque1 from "@/assets/banners/remolque1.png";
import remolque2 from "@/assets/banners/remolque2.png";
import remolque3 from "@/assets/banners/remolque3.png";
import almacen from "@/assets/almacen.jpg";

const heroSlides = [
  { image: remolque1 },
  { image: remolque2 },
  { image: remolque3 },
];

function useCountUp(target: number, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const t0 = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - t0) / ms); setV(Math.floor(p * target)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

export function HomePage() {
  const { products } = useProducts();
  const [slide, setSlide] = useState(0);
  useEffect(() => { const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 5500); return () => clearInterval(id); }, []);
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const offers = products.filter((p) => p.isOffer).slice(0, 4);
  const s1 = useCountUp(25); const s2 = useCountUp(2000); const s3 = useCountUp(4); const s4 = useCountUp(24);

  return (
    <div>
      <section className="bg-white py-6 lg:py-8">
  <div className="container-x">
    <div className="mx-auto max-w-[1500px] overflow-hidden rounded-2xl shadow-xl">

      <div className="relative h-[180px] sm:h-[260px] md:h-[340px] lg:h-[420px] xl:h-[470px]">

        {heroSlides.map((item, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={item.image}
              alt={`Banner ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setSlide(index)}
              className={`transition-all ${
                slide === index
                  ? "h-2 w-8 rounded-full bg-primary"
                  : "h-2 w-2 rounded-full bg-white/80"
              }`}
            />
          ))}
        </div>

      </div>

    </div>
  </div>
</section>
      {/* Benefits */}
      <section className="container-x py-8 sm:py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Package, title: "Productos especializados", d: "Componentes seleccionados para transporte pesado." },
            { icon: Truck, title: "Envíos a todo el Perú", d: "Coordinamos entregas a nivel nacional." },
            { icon: Headphones, title: "Asesoría técnica", d: "Especialistas que entienden tu operación." },
            { icon: ShieldCheck, title: "Compra segura", d: "Marcas reconocidas y respaldo posventa." },
          ].map((b, i) => (
            <div key={i} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary/40 hover:shadow-md">
              <div className="rounded-md bg-primary/10 p-3 text-primary"><b.icon className="h-6 w-6" /></div>
              <div><p className="font-bold">{b.title}</p><p className="mt-0.5 text-sm text-muted-foreground">{b.d}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Explora por rubro</p>
            <h2 className="text-2xl font-black md:text-3xl">Categorías principales</h2>
          </div>
          <Link to="/categorias" className="hidden text-sm font-semibold text-primary hover:underline sm:block">Ver todas →</Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            const count = products.filter((p) => p.category === c.slug).length;
            return (
              <Link key={c.slug} to={`/categorias/${c.slug}`} className="group relative overflow-hidden rounded-lg border border-border bg-card">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-3">
                  <p className="font-bold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{count} productos</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="container-x py-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Selección de nuestros especialistas</p>
          <h2 className="text-2xl font-black md:text-3xl">Productos destacados</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Brands */}
      <section className="bg-muted py-10">
        <div className="container-x">
          <h2 className="mb-6 text-center text-2xl font-black">Marcas que trabajamos</h2>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {brands.map((b) => (
              <Link key={b.slug} to={`/marcas/${b.slug}`} className="flex items-center justify-center rounded border border-border bg-card p-3 grayscale transition hover:grayscale-0 hover:border-primary">
                <img src={b.logo} alt={b.name} className="max-h-10" loading="lazy" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate */}
      <section className="container-x grid gap-8 py-14 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <img src={almacen} alt="Almacén Autopartes Ferrosos" className="rounded-lg object-cover shadow-lg" />
          <div className="absolute -bottom-6 -right-4 hidden rounded-md bg-primary p-4 text-primary-foreground shadow-xl md:block">
            <p className="text-3xl font-black">+{s1}</p>
            <p className="text-xs uppercase tracking-wider">años de experiencia</p>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Sobre nosotros</p>
          <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">Experiencia y respaldo para el transporte pesado</h2>
          <p className="mt-3 text-muted-foreground">Somos una empresa peruana con amplia trayectoria en la comercialización de repuestos y componentes para camiones, remolques y semirremolques. Trabajamos con marcas reconocidas y ofrecemos atención especializada a empresas de transporte, talleres, flotas y transportistas independientes.</p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div><p className="text-3xl font-black text-primary">+{s1}</p><p className="text-xs uppercase text-muted-foreground">años de experiencia</p></div>
            <div><p className="text-3xl font-black text-primary">+{s2.toLocaleString()}</p><p className="text-xs uppercase text-muted-foreground">productos</p></div>
            <div><p className="text-3xl font-black text-primary">{s3}</p><p className="text-xs uppercase text-muted-foreground">sucursales</p></div>
            <div><p className="text-3xl font-black text-primary">{s4} regiones</p><p className="text-xs uppercase text-muted-foreground">cobertura nacional</p></div>
          </div>
          <p className="mt-3 text-xs italic text-muted-foreground">* Cifras referenciales editables.</p>
        </div>
      </section>

      {/* Solutions by client type */}
      <section className="bg-muted py-12">
        <div className="container-x">
          <div className="mb-6 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Soluciones</p>
            <h2 className="text-2xl font-black md:text-3xl">Atendemos a cada tipo de cliente</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Truck, t: "Empresas de transporte" },
              { icon: Wrench, t: "Talleres mecánicos" },
              { icon: Building2, t: "Propietarios de flotas" },
              { icon: Factory, t: "Fabricantes de remolques" },
              { icon: Package, t: "Distribuidores" },
              { icon: Users, t: "Transportistas independientes" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition hover:border-primary">
                <div className="rounded-md bg-industrial p-3 text-white"><c.icon className="h-6 w-6" /></div>
                <p className="font-bold">{c.t}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Volume banner */}
      <section className="container-x py-12">
        <div className="relative overflow-hidden rounded-lg bg-industrial p-8 text-white md:p-12">
          <div className="absolute inset-0 diag-stripes opacity-30" />
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-30">
            <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1200&q=70" alt="" className="h-full w-full object-cover" />
          </div>
          <div className="relative max-w-2xl">
            <h2 className="text-2xl font-black md:text-4xl">Precios especiales para compras por volumen</h2>
            <p className="mt-3 opacity-90">Solicita una cotización personalizada para tu empresa o flota. Trabajamos con condiciones especiales para empresas y talleres.</p>
            <a href={waLink("Hola, deseo cotización por volumen para mi empresa.")} target="_blank" rel="noreferrer" className="btn-primary mt-5"><MessageCircle className="h-4 w-4" /> Hablar con un asesor</a>
          </div>
        </div>
      </section>

      {/* Offers */}
      <section className="container-x py-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Precios especiales</p>
          <h2 className="text-2xl font-black md:text-3xl">Ofertas de la semana</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {offers.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Branches */}
      <section className="bg-muted py-12">
        <div className="container-x">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Presencia nacional</p>
            <h2 className="text-2xl font-black md:text-3xl">Nuestras sucursales</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {branches.map((b) => (
              <div key={b.id} className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase text-primary">{b.city}</p>
                <p className="font-bold">{b.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{b.address}</p>
                <p className="mt-1 text-xs"><Phone className="mr-1 inline h-3 w-3" /> {b.phone}</p>
                <p className="text-xs">{b.hours}</p>
                <div className="mt-3 flex gap-2">
                  <Link to="/sucursales" className="btn-outline !px-3 !py-1.5 text-xs"><MapPin className="h-3 w-3" /> Ubicación</Link>
                  <a href={waLink(`Hola, deseo contactar con la sucursal ${b.city}.`)} target="_blank" rel="noreferrer" className="btn-primary !px-3 !py-1.5 text-xs"><MessageCircle className="h-3 w-3" /> Contactar</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="container-x py-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">Contenido técnico</p>
            <h2 className="text-2xl font-black md:text-3xl">Blog especializado</h2>
          </div>
          <Link to="/blog" className="text-sm font-semibold text-primary hover:underline">Ver todo →</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {posts.slice(0, 4).map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-md">
              <div className="aspect-[16/10] overflow-hidden bg-muted"><img src={p.image} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" /></div>
              <div className="p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                <h3 className="mt-1 line-clamp-2 text-sm font-bold group-hover:text-primary">{p.title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{p.readingTime} de lectura</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-industrial text-white">
        <div className="container-x py-14 text-center">
          <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">¿No encuentras el repuesto que necesitas?</h2>
          <p className="mx-auto mt-3 max-w-2xl opacity-90">Envíanos el código, una fotografía o las características del repuesto y uno de nuestros especialistas te ayudará.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href={waLink("Hola, necesito ayuda para encontrar un repuesto.")} target="_blank" rel="noreferrer" className="btn-primary"><MessageCircle className="h-4 w-4" /> Consultar por WhatsApp</a>
            <Link to="/contacto" className="btn-outline !border-white/30 !bg-white/10 !text-white hover:!bg-white/20">Enviar solicitud</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
