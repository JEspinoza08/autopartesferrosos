import { Link } from "react-router-dom";
import { useState } from "react";
import { ShoppingCart, Trash2, Minus, Plus, Tag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";
import { formatPEN } from "@/lib/format";
import { useToast } from "@/context/ToastContext";

export function CartPage() {
  const { products } = useProducts();
  const { items, setQty, remove, clear, subtotal, discount, shipping, total, coupon, applyCoupon, removeCoupon } = useCart();
  const [code, setCode] = useState("");
  const { show } = useToast();

  if (items.length === 0) {
    return (
      <div className="container-x py-10">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Carrito" }]} />
        <div className="mt-6"><EmptyState icon={ShoppingCart} title="Tu carrito está vacío" description="Añade productos para comenzar tu compra." action={<Link to="/productos" className="btn-primary mt-2">Ver catálogo</Link>} /></div>
      </div>
    );
  }

  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Carrito" }]} />
      <h1 className="mt-4 text-3xl font-black">Tu carrito</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3">
          {items.map((it) => {
            const p = products.find((x) => x.id === it.productId)!;
            return (
              <div key={it.productId} className="grid grid-cols-[80px_1fr] gap-3 rounded-lg border border-border bg-card p-3 sm:grid-cols-[100px_1fr_auto] sm:items-center">
                <img src={p.images[0]} alt="" className="h-20 w-20 rounded object-cover sm:h-24 sm:w-24" />
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase text-muted-foreground">{p.brand.toUpperCase()}</p>
                  <Link to={`/productos/${p.slug}`} className="font-semibold hover:text-primary">{p.name}</Link>
                  <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                  <p className="text-sm font-bold text-primary sm:hidden">{formatPEN(p.price * it.quantity)}</p>
                </div>
                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:gap-2">
                  <div className="flex items-center rounded border border-border">
                    <button aria-label="Menos" onClick={() => setQty(it.productId, it.quantity - 1)} className="p-1.5"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="px-3 text-sm font-semibold">{it.quantity}</span>
                    <button aria-label="Más" onClick={() => setQty(it.productId, it.quantity + 1)} className="p-1.5"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <p className="hidden text-sm font-bold text-primary sm:block">{formatPEN(p.price * it.quantity)}</p>
                  <button aria-label="Eliminar" onClick={() => remove(it.productId)} className="rounded p-1.5 text-muted-foreground hover:text-primary"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            );
          })}
          <button onClick={clear} className="text-sm text-muted-foreground hover:text-primary">Vaciar carrito</button>
        </div>

        <aside className="h-fit space-y-3 rounded-lg border border-border bg-card p-5">
          <p className="text-lg font-bold">Resumen</p>
          <div className="flex items-center gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Cupón" className="flex-1 rounded border border-border bg-background px-3 py-2 text-sm" />
            <button onClick={() => { const r = applyCoupon(code); show({ type: r.ok ? "success" : "error", message: r.message }); if (r.ok) setCode(""); }} className="btn-primary !px-3 !py-2 text-sm"><Tag className="h-4 w-4" /></button>
          </div>
          {coupon && <p className="text-xs text-green-700">Cupón <b>{coupon}</b> aplicado · <button onClick={removeCoupon} className="underline">quitar</button></p>}
          <div className="space-y-1 border-t border-border pt-3 text-sm">
            <Row label="Subtotal" value={formatPEN(subtotal)} />
            {discount > 0 && <Row label="Descuento" value={`- ${formatPEN(discount)}`} accent />}
            <Row label="Envío" value={shipping === 0 ? "Gratis" : formatPEN(shipping)} />
            <div className="mt-2 flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span className="text-primary">{formatPEN(total)}</span></div>
          </div>
          <Link to="/checkout" className="btn-primary w-full">Ir al checkout</Link>
          <Link to="/productos" className="btn-outline w-full">Seguir comprando</Link>
          <p className="text-[11px] text-muted-foreground">Envío gratis en compras mayores a S/ 800 · o con cupón ENVIOGRATIS.</p>
        </aside>
      </div>
    </div>
  );
}
function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{label}</span><span className={accent ? "text-green-700 font-semibold" : "font-semibold"}>{value}</span></div>;
}
