import { useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle, Search, Menu, X, Heart, User, ShoppingCart, ChevronDown } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { formatPEN, waLink } from "@/lib/format";
import logoFerrosos from "@/assets/logo-autopartes-ferrosos.png";

const navLinks = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/categorias", label: "Categorías" },
  { to: "/marcas", label: "Marcas" },
  { to: "/ofertas", label: "Ofertas" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/sucursales", label: "Sucursales" },
  { to: "/blog", label: "Blog" },
  { to: "/contacto", label: "Contacto" },
] as const;

export function Header() {
  const { products } = useProducts();
  const [q, setQ] = useState("");
  const [showSug, setShowSug] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const navigate = useNavigate();
  const path = useLocation().pathname;
  const { count } = useCart();
  const { ids } = useFavorites();
  const sugRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMobile(false); setMegaOpen(false); }, [path]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sugRef.current && !sugRef.current.contains(e.target as Node)) setShowSug(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const suggestions = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 2) return [];
    return products
      .filter((p) =>
        [p.name, p.sku, p.internalCode, p.brand, p.category, p.description, ...p.compatibility].some((f) =>
          f.toLowerCase().includes(t),
        ),
      )
      .slice(0, 6);
  }, [q]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim().length > 0) navigate("/productos?q=" + encodeURIComponent(q.trim()));
    setShowSug(false);
  };

  return (
    <header className="relative w-full">
      {/* Top bar */}
      <div className="bg-industrial text-white text-[11px] sm:text-xs">
        <div className="container-x flex min-h-9 items-center justify-between gap-2 py-1.5">
          <p className="hidden lg:block opacity-90">Venta de repuestos para transporte pesado · Envíos a todo el Perú</p>
          <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-end lg:gap-4">
            <a href="tel:+5100000000" className="flex shrink-0 items-center gap-1 hover:text-primary"><Phone className="h-3.5 w-3.5" /> <span className="hidden min-[360px]:inline">(01) 000-0000</span><span className="min-[360px]:hidden">Llamar</span></a>
            <a href="mailto:ventas@ferrosos.pe" className="hidden md:flex items-center gap-1 hover:text-primary"><Mail className="h-3.5 w-3.5" /> ventas@ferrosos.pe</a>
            <Link to="/sucursales" className="flex shrink-0 items-center gap-1 hover:text-primary"><MapPin className="h-3.5 w-3.5" /> Sucursales</Link>
            <a href={waLink("Hola, quisiera información.")} target="_blank" rel="noreferrer" className="flex shrink-0 items-center gap-1 rounded bg-[#25D366] px-2 py-1 font-semibold">
              <MessageCircle className="h-3.5 w-3.5" /> <span className="hidden min-[340px]:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* El bloque principal permanece visible; la barra superior desaparece al hacer scroll */}
      <div className={`sticky top-0 z-40 w-full bg-card transition-shadow duration-300 ${scrolled ? "shadow-lg" : "shadow-none"}`}>
      {/* Main header */}
      <div className={`border-b border-border bg-card transition-all duration-300 ${scrolled ? "py-1.5 sm:py-2" : "py-2.5 sm:py-3"}`}>
        <div className="container-x">
          <div className="flex items-center gap-4">
            <button className="grid h-10 w-10 shrink-0 place-items-center rounded-md hover:bg-muted lg:hidden" aria-label="Abrir menú" onClick={() => setMobile(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <Link
  to="/"
  className="flex shrink-0 items-center"
>
  <img
    src={logoFerrosos}
    alt="Autopartes Ferrosos"
    className={`w-auto object-contain transition-all duration-300 ${
      scrolled
        ? "h-9 sm:h-10 md:h-11 lg:h-12"
        : "h-11 sm:h-12 md:h-14 lg:h-16"
    }`}
  />
</Link>

            <form onSubmit={submitSearch} className="relative hidden flex-1 lg:block" ref={sugRef}>
              <div className="flex items-center overflow-hidden rounded-md border border-border bg-background focus-within:border-primary">
                <input value={q} onChange={(e) => { setQ(e.target.value); setShowSug(true); }} onFocus={() => setShowSug(true)} placeholder="Buscar por nombre, código, SKU, marca o compatibilidad..." className="min-w-0 w-full bg-transparent px-3 py-2.5 text-sm outline-none" aria-label="Buscar productos" />
                <button type="submit" className="shrink-0 bg-primary px-4 py-2.5 text-primary-foreground hover:bg-primary-dark" aria-label="Buscar"><Search className="h-4 w-4" /></button>
              </div>
              {showSug && suggestions.length > 0 && (
                <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-96 overflow-y-auto rounded-md border border-border bg-card shadow-xl">
                  {suggestions.map((p) => (
                    <Link key={p.id} to={`/productos/${p.slug}`} onClick={() => setShowSug(false)} className="flex items-center gap-3 border-b border-border/60 px-3 py-2 hover:bg-muted">
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" />
                      <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-foreground">{p.name}</p><p className="text-xs text-muted-foreground">{p.sku} · {p.brand.toUpperCase()}</p></div>
                      <p className="shrink-0 text-sm font-bold text-primary">{formatPEN(p.price)}</p>
                    </Link>
                  ))}
                </div>
              )}
            </form>

            <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
              <Link to="/favoritos" className="relative rounded p-2 hover:bg-muted" aria-label="Favoritos"><Heart className="h-5 w-5" />{ids.length > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-primary px-1 text-center text-[10px] font-bold text-primary-foreground">{ids.length}</span>}</Link>
              <Link to="/mi-cuenta" className="hidden rounded p-2 hover:bg-muted min-[360px]:block" aria-label="Mi cuenta"><User className="h-5 w-5" /></Link>
              <Link to="/carrito" className="relative rounded p-2 hover:bg-muted" aria-label="Carrito"><ShoppingCart className="h-5 w-5" />{count > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-primary px-1 text-center text-[10px] font-bold text-primary-foreground">{count}</span>}</Link>
            </div>
          </div>

          <form onSubmit={submitSearch} className="relative mt-2 lg:hidden" ref={sugRef}>
            <div className="flex min-w-0 items-center overflow-hidden rounded-md border border-border bg-background focus-within:border-primary">
              <Search className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setShowSug(true); }} onFocus={() => setShowSug(true)} placeholder="Buscar productos o códigos..." className="min-w-0 w-full bg-transparent px-2.5 py-2.5 text-sm outline-none" aria-label="Buscar productos" />
              <button type="submit" className="shrink-0 bg-primary px-3.5 py-2.5 text-primary-foreground" aria-label="Buscar"><Search className="h-4 w-4" /></button>
            </div>
            {showSug && suggestions.length > 0 && (
              <div className="absolute inset-x-0 top-full z-20 mt-1 max-h-[55vh] overflow-y-auto rounded-md border border-border bg-card shadow-xl">
                {suggestions.map((p) => (<Link key={p.id} to={`/productos/${p.slug}`} onClick={() => setShowSug(false)} className="flex items-center gap-2 border-b border-border/60 px-3 py-2"><img src={p.images[0]} alt="" className="h-9 w-9 rounded object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{p.name}</p><p className="text-[11px] text-muted-foreground">{p.sku}</p></div><p className="shrink-0 text-xs font-bold text-primary">{formatPEN(p.price)}</p></Link>))}
              </div>
            )}
          </form>
        </div>
      </div>
      {/* Nav */}
      <div className="hidden border-b border-border bg-card lg:block">
        <div className="container-x flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setMegaOpen((v) => !v)}
              className="flex items-center gap-2 bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <Menu className="h-4 w-4" /> Categorías <ChevronDown className="h-4 w-4" />
            </button>
            {megaOpen && (
              <div className="absolute left-0 top-full z-30 mt-0 grid w-[min(720px,calc(100vw-2rem))] grid-cols-3 gap-1 border border-border bg-card p-4 shadow-2xl">
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/categorias/${c.slug}`}
                    onClick={() => setMegaOpen(false)}
                    className="rounded px-2 py-1.5 text-sm hover:bg-muted"
                  >
                    <span className="font-medium text-foreground">{c.name}</span>
                    <p className="text-[11px] text-muted-foreground">{c.subcategories.slice(0, 2).join(" · ")}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <ul className="flex items-center">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === "/"}
                  className={({ isActive }) => `block px-3 py-2.5 text-sm transition hover:text-primary ${isActive ? "font-semibold text-primary" : "font-medium text-foreground/80"}`}
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </div>

      {/* Mobile drawer */}
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobile(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border p-4">
              <p className="font-bold">Menú</p>
              <button aria-label="Cerrar" onClick={() => setMobile(false)}><X className="h-6 w-6" /></button>
            </div>
            <ul className="divide-y divide-border">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="block px-4 py-3 text-sm font-medium">{l.label}</Link>
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Categorías</p>
              <ul className="space-y-1">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link to={`/categorias/${c.slug}`} className="block rounded px-2 py-1.5 text-sm hover:bg-muted">{c.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Marcas</p>
              <ul className="grid grid-cols-2 gap-1">
                {brands.slice(0, 8).map((b) => (
                  <li key={b.slug}><Link to={`/marcas/${b.slug}`} className="block rounded px-2 py-1 text-sm hover:bg-muted">{b.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
