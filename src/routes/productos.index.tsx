
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LayoutGrid, List, SlidersHorizontal, X, Search } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { categories } from "@/data/categories";
import { brands } from "@/data/brands";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPEN } from "@/lib/format";

type Sort = "recomendados" | "precio-asc" | "precio-desc" | "recientes" | "descuento";

export function CatalogPage() {
  const { products } = useProducts();
  const [searchParams] = useSearchParams();
  const search = { q: searchParams.get("q") ?? undefined, cat: searchParams.get("cat") ?? undefined, brand: searchParams.get("brand") ?? undefined };
  const [sort, setSort] = useState<Sort>("recomendados");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [visible, setVisible] = useState(12);
  const [drawer, setDrawer] = useState(false);

  const [cats, setCats] = useState<string[]>(search.cat ? [search.cat] : []);
  const [bs, setBs] = useState<string[]>(search.brand ? [search.brand] : []);
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [onlyStock, setOnlyStock] = useState(false);
  const [onlyOffer, setOnlyOffer] = useState(false);
  const [q, setQ] = useState(search.q ?? "");

  const filtered = useMemo(() => {
    let r = products.slice();
    if (q.trim()) {
      const t = q.toLowerCase();
      r = r.filter((p) => [p.name, p.sku, p.internalCode, p.brand, p.category, p.description, ...p.compatibility, ...p.tags].some((f) => f.toLowerCase().includes(t)));
    }
    if (cats.length) r = r.filter((p) => cats.includes(p.category));
    if (bs.length) r = r.filter((p) => bs.includes(p.brand));
    r = r.filter((p) => p.price <= priceMax);
    if (onlyStock) r = r.filter((p) => p.stock > 0);
    if (onlyOffer) r = r.filter((p) => p.isOffer);
    switch (sort) {
      case "precio-asc": r.sort((a, b) => a.price - b.price); break;
      case "precio-desc": r.sort((a, b) => b.price - a.price); break;
      case "recientes": r.sort((a, b) => Number(b.isNew) - Number(a.isNew)); break;
      case "descuento": r.sort((a, b) => {
        const da = a.originalPrice ? 1 - a.price / a.originalPrice : 0;
        const db = b.originalPrice ? 1 - b.price / b.originalPrice : 0;
        return db - da;
      }); break;
    }
    return r;
  }, [q, cats, bs, priceMax, onlyStock, onlyOffer, sort]);

  const shown = filtered.slice(0, visible);

  const toggle = <T,>(list: T[], v: T, set: (v: T[]) => void) => set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const filters = (
    <div className="space-y-6">
      <div>
        <p className="mb-2 font-bold uppercase text-xs tracking-wider">Categoría</p>
        <div className="space-y-1.5 text-sm">
          {categories.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={cats.includes(c.slug)} onChange={() => toggle(cats, c.slug, setCats)} className="accent-[oklch(0.52_0.19_27)]" /> {c.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-bold uppercase text-xs tracking-wider">Marca</p>
        <div className="max-h-48 overflow-y-auto space-y-1.5 text-sm">
          {brands.map((b) => (
            <label key={b.slug} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={bs.includes(b.slug)} onChange={() => toggle(bs, b.slug, setBs)} className="accent-[oklch(0.52_0.19_27)]" /> {b.name}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-2 font-bold uppercase text-xs tracking-wider">Precio máximo</p>
        <input type="range" min={50} max={10000} step={50} value={priceMax} onChange={(e) => setPriceMax(Number(e.target.value))} className="w-full accent-[oklch(0.52_0.19_27)]" />
        <p className="mt-1 text-sm">Hasta {formatPEN(priceMax)}</p>
      </div>
      <div className="space-y-1.5 text-sm">
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={onlyStock} onChange={(e) => setOnlyStock(e.target.checked)} className="accent-[oklch(0.52_0.19_27)]" /> Solo disponibles</label>
        <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={onlyOffer} onChange={(e) => setOnlyOffer(e.target.checked)} className="accent-[oklch(0.52_0.19_27)]" /> En oferta</label>
      </div>
      <button onClick={() => { setCats([]); setBs([]); setPriceMax(10000); setOnlyStock(false); setOnlyOffer(false); setQ(""); }} className="btn-outline w-full">Limpiar filtros</button>
    </div>
  );

  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Productos" }]} />
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">Catálogo de productos</h1>
          <p className="text-sm text-muted-foreground">{filtered.length} resultados</p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
          <div className="hidden items-center gap-1 rounded border border-border p-1 sm:flex">
            <button aria-label="Cuadrícula" onClick={() => setView("grid")} className={`rounded p-1.5 ${view === "grid" ? "bg-primary text-primary-foreground" : ""}`}><LayoutGrid className="h-4 w-4" /></button>
            <button aria-label="Lista" onClick={() => setView("list")} className={`rounded p-1.5 ${view === "list" ? "bg-primary text-primary-foreground" : ""}`}><List className="h-4 w-4" /></button>
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="min-w-0 rounded border border-border bg-card px-2.5 py-2 text-sm sm:px-3">
            <option value="recomendados">Recomendados</option>
            <option value="precio-asc">Precio: menor a mayor</option>
            <option value="precio-desc">Precio: mayor a menor</option>
            <option value="recientes">Más recientes</option>
            <option value="descuento">Mayor descuento</option>
          </select>
          <button onClick={() => setDrawer(true)} className="btn-outline lg:hidden !px-3 !py-2 text-sm"><SlidersHorizontal className="h-4 w-4" /> Filtros</button>
        </div>
      </div>

      <div className="mt-4 relative flex items-center overflow-hidden rounded-md border border-border bg-card">
        <Search className="ml-3 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar en el catálogo..." className="w-full bg-transparent px-3 py-2 text-sm outline-none" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>
        <div>
          {shown.length === 0 ? (
            <EmptyState icon={Search} title="Sin resultados" description="Prueba con otros términos o ajusta los filtros." />
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {shown.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {shown.map((p) => (
                <div key={p.id} className="grid grid-cols-[100px_1fr] gap-4 rounded-lg border border-border bg-card p-3 sm:grid-cols-[160px_1fr_auto] sm:items-center">
                  <img src={p.images[0]} alt={p.name} className="h-24 w-full rounded object-cover sm:h-32" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase text-muted-foreground">{p.brand.toUpperCase()}</p>
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{p.shortDescription}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 text-right">
                    {p.originalPrice && <p className="text-xs text-muted-foreground line-through">{formatPEN(p.originalPrice)}</p>}
                    <p className="text-xl font-bold text-primary">{formatPEN(p.price)}</p>
                    <p className="text-xs">{p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {visible < filtered.length && (
            <div className="mt-6 text-center"><button onClick={() => setVisible((v) => v + 12)} className="btn-outline">Mostrar más</button></div>
          )}
        </div>
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawer(false)} />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-card p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between"><p className="font-bold">Filtros</p><button aria-label="Cerrar" onClick={() => setDrawer(false)}><X className="h-5 w-5" /></button></div>
            {filters}
          </div>
        </div>
      )}
    </div>
  );
}
