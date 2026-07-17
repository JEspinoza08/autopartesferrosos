import { Link, useLocation } from "react-router-dom";
import { Home, LayoutGrid, Search, User, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";

const tabs = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/categorias", label: "Categorías", icon: LayoutGrid },
  { to: "/productos", label: "Buscar", icon: Search },
  { to: "/mi-cuenta", label: "Cuenta", icon: User },
  { to: "/carrito", label: "Carrito", icon: ShoppingCart },
] as const;

export function MobileBottomNav() {
  const path = useLocation().pathname;
  const { count } = useCart();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card md:hidden" aria-label="Navegación móvil">
      <ul className="grid grid-cols-5">
        {tabs.map((t) => {
          const active = path === t.to || (t.to !== "/" && path.startsWith(t.to));
          const Icon = t.icon;
          return (
            <li key={t.to}>
              <Link to={t.to} className={`relative flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
                {t.label}
                {t.to === "/carrito" && count > 0 && (
                  <span className="absolute right-4 top-1 min-w-[18px] rounded-full bg-primary px-1 text-center text-[10px] font-bold text-primary-foreground">{count}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
