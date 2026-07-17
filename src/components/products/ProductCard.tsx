import { Link } from "react-router-dom";
import { Heart, ShoppingCart, MessageCircle, Eye } from "lucide-react";
import type { Product } from "@/types";
import { brands } from "@/data/brands";
import { formatPEN, waLink } from "@/lib/format";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/context/ToastContext";

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (p: Product) => void }) {
  const brand = brands.find((b) => b.slug === product.brand);
  const { add } = useCart();
  const { toggle, has } = useFavorites();
  const { show } = useToast();
  const inStock = product.stock > 0;
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Link to={`/productos/${product.slug}`} aria-label={product.name}>
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {product.isNew && <span className="badge-new">Nuevo</span>}
          {product.isOffer && <span className="badge-hot">-{discount}%</span>}
          {!inStock && <span className="badge-warn">Agotado</span>}
        </div>
        <div className="absolute right-1.5 top-1.5 flex flex-col gap-1 opacity-100 transition md:right-2 md:top-2 md:gap-1.5 md:opacity-0 md:group-hover:opacity-100">
          <button
            aria-label="Añadir a favoritos"
            onClick={() => { toggle(product.id); show({ type: "success", message: has(product.id) ? "Eliminado de favoritos" : "Añadido a favoritos" }); }}
            className="rounded-full bg-white p-1.5 shadow-md hover:bg-primary hover:text-primary-foreground md:p-2"
          >
            <Heart className={`h-4 w-4 ${has(product.id) ? "fill-primary text-primary" : ""}`} />
          </button>
          {onQuickView && (
            <button aria-label="Vista rápida" onClick={() => onQuickView(product)} className="rounded-full bg-white p-1.5 shadow-md hover:bg-primary hover:text-primary-foreground md:p-2">
              <Eye className="h-4 w-4" />
            </button>
          )}
          <a aria-label="Consultar por WhatsApp" href={waLink(`Hola, deseo información sobre ${product.name}, código ${product.sku}`)} target="_blank" rel="noreferrer" className="hidden rounded-full bg-white p-1.5 shadow-md hover:bg-[#25D366] hover:text-white min-[420px]:inline-flex md:p-2">
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5 sm:gap-2 sm:p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{brand?.name ?? product.brand}</p>
        <Link to={`/productos/${product.slug}`} className="line-clamp-2 min-h-[2.25rem] text-[13px] font-semibold sm:min-h-[2.5rem] sm:text-sm text-foreground hover:text-primary">
          {product.name}
        </Link>
        <p className="text-[11px] text-muted-foreground">SKU: {product.sku}</p>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div>
            {product.originalPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatPEN(product.originalPrice)}</p>
            )}
            <p className="text-base font-bold text-primary sm:text-lg">{formatPEN(product.price)}</p>
            <p className={`text-[11px] font-medium ${inStock ? "text-green-700" : "text-muted-foreground"}`}>
              {inStock ? `Stock: ${product.stock}` : "Agotado"}
            </p>
          </div>
          <button
            disabled={!inStock}
            onClick={() => { add(product.id, 1); show({ type: "success", message: "Producto añadido al carrito" }); }}
            className="btn-primary shrink-0 !px-2.5 !py-2 text-xs sm:!px-3"
            aria-label="Agregar al carrito"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
