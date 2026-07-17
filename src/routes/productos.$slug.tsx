import { Link } from "react-router-dom";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, ShoppingCart, MessageCircle, Truck, ShieldCheck, Download, Minus, Plus } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { brands } from "@/data/brands";
import { categories } from "@/data/categories";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { ProductCard } from "@/components/products/ProductCard";
import { formatPEN, waLink } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useQuote } from "@/context/QuoteContext";
import { useToast } from "@/context/ToastContext";

export function ProductDetail() {
  const { products } = useProducts();
  const { slug } = useParams();
  const product = products.find((p) => p.slug === (slug ?? ""));
  if (!product) return <div className="container-x py-16 text-center"><h1 className="text-2xl font-bold">Producto no encontrado</h1><Link to="/productos" className="btn-primary mt-4 inline-flex">Volver al catálogo</Link></div>;
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState<"desc" | "esp" | "comp" | "app" | "env">("desc");
  const { add } = useCart();
  const { toggle, has } = useFavorites();
  const { add: addQuote } = useQuote();
  const { show } = useToast();
  const brand = brands.find((b) => b.slug === product.brand);
  const category = categories.find((c) => c.slug === product.category);
  const related = products.filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand)).slice(0, 4);
  const inStock = product.stock > 0;
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Productos", to: "/productos" }, ...(category ? [{ label: category.name }] : []), { label: product.name }]} />

      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-lg border border-border bg-muted">
            <img src={product.images[img]} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="mt-3 flex gap-2">
            {product.images.map((src: string, i: number) => (
              <button key={i} onClick={() => setImg(i)} className={`h-16 w-16 overflow-hidden rounded border-2 ${i === img ? "border-primary" : "border-border"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          {brand && <Link to={`/marcas/${brand.slug}`} className="text-xs font-bold uppercase tracking-wider text-primary hover:underline">{brand.name}</Link>}
          <h1 className="mt-1 text-2xl font-black md:text-3xl">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <span>SKU: <b className="text-foreground">{product.sku}</b></span>
            <span>Cód. interno: <b className="text-foreground">{product.internalCode}</b></span>
          </div>

          <div className="mt-4 flex items-end gap-3">
            {product.originalPrice && <span className="text-lg text-muted-foreground line-through">{formatPEN(product.originalPrice)}</span>}
            <span className="text-4xl font-black text-primary">{formatPEN(product.price)}</span>
            {discount > 0 && <span className="badge-hot">-{discount}%</span>}
          </div>

          <div className="mt-2">
            {inStock
              ? <p className="text-sm font-semibold text-green-700">Disponible · Stock: {product.stock}</p>
              : <p className="text-sm font-semibold text-muted-foreground">Agotado — consulta disponibilidad</p>}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded border border-border">
              <button aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))} className="p-2 hover:bg-muted"><Minus className="h-4 w-4" /></button>
              <input value={qty} onChange={(e) => setQty(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))} className="w-14 border-x border-border bg-transparent px-2 py-2 text-center text-sm outline-none" />
              <button aria-label="Más" onClick={() => setQty((q) => Math.min(product.stock, q + 1))} className="p-2 hover:bg-muted"><Plus className="h-4 w-4" /></button>
            </div>
            <button disabled={!inStock} onClick={() => { add(product.id, qty); show({ type: "success", message: "Añadido al carrito" }); }} className="btn-primary flex-1 sm:flex-none">
              <ShoppingCart className="h-4 w-4" /> Agregar al carrito
            </button>
            <button disabled={!inStock} onClick={() => { add(product.id, qty); show({ type: "info", message: "Redirigiendo al carrito..." }); setTimeout(() => (window.location.href = "/carrito"), 400); }} className="btn-dark">Comprar ahora</button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={() => { toggle(product.id); show({ type: "success", message: has(product.id) ? "Eliminado de favoritos" : "Añadido a favoritos" }); }} className="btn-outline !py-2 !px-3 text-sm">
              <Heart className={`h-4 w-4 ${has(product.id) ? "fill-primary text-primary" : ""}`} /> Favorito
            </button>
            <button onClick={() => { addQuote(product.id, qty); show({ type: "success", message: "Añadido a cotización" }); }} className="btn-outline !py-2 !px-3 text-sm">Agregar a cotización</button>
            <a href={waLink(`Hola, deseo información sobre ${product.name}, código ${product.sku}`)} target="_blank" rel="noreferrer" className="btn-outline !py-2 !px-3 text-sm text-[#25D366]"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
            <a href={product.technicalSheet ?? "#"} className="btn-outline !py-2 !px-3 text-sm"><Download className="h-4 w-4" /> Ficha técnica</a>
          </div>

          <div className="mt-5 grid gap-2 rounded-lg border border-border bg-muted/40 p-3 text-sm sm:grid-cols-2">
            <p className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> Envíos a todo el Perú</p>
            <p className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Producto garantizado</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-10">
        <div className="flex flex-wrap gap-1 border-b border-border">
          {([
            ["desc", "Descripción"], ["esp", "Especificaciones"], ["comp", "Compatibilidad"], ["app", "Aplicaciones"], ["env", "Envíos y devoluciones"],
          ] as const).map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`border-b-2 px-4 py-2 text-sm font-semibold ${tab === k ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{l}</button>
          ))}
        </div>
        <div className="py-5 text-sm leading-relaxed text-foreground/90">
          {tab === "desc" && <p>{product.description}</p>}
          {tab === "esp" && (
            <table className="w-full text-sm"><tbody>
              {product.specifications.map((s: {label:string;value:string}, i: number) => (
                <tr key={i} className="border-b border-border"><td className="py-2 font-semibold w-1/3">{s.label}</td><td className="py-2">{s.value}</td></tr>
              ))}
            </tbody></table>
          )}
          {tab === "comp" && <ul className="list-disc pl-6">{product.compatibility.map((c: string) => <li key={c}>{c}</li>)}</ul>}
          {tab === "app" && <ul className="list-disc pl-6">{product.applications.map((a: string) => <li key={a}>{a}</li>)}</ul>}
          {tab === "env" && <p>Coordinamos envíos a todo el Perú a través de agencias. También ofrecemos recojo en nuestras sucursales. Para políticas de devolución, revisa la sección <Link to="/cambios-y-devoluciones" className="text-primary underline">Cambios y devoluciones</Link>.</p>}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-black">Productos relacionados</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
