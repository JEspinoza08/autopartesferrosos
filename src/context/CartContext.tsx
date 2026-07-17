import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useProducts } from "@/context/ProductsContext";
import type { CartItem } from "@/types";

type Ctx = {
  items: CartItem[];
  add: (productId: number, qty?: number) => void;
  remove: (productId: number) => void;
  setQty: (productId: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon: string | null;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
};
const CartCtx = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useProducts();
  const [items, setItems] = useLocalStorage<CartItem[]>("af_cart", []);
  const [coupon, setCoupon] = useLocalStorage<string | null>("af_coupon", null);

  const add = (productId: number, qty = 1) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        const next = Math.min(existing.quantity + qty, p.stock);
        return prev.map((i) => (i.productId === productId ? { ...i, quantity: next } : i));
      }
      return [...prev, { productId, quantity: Math.min(qty, p.stock) }];
    });
  };
  const remove = (productId: number) => setItems((p) => p.filter((i) => i.productId !== productId));
  const setQty = (productId: number, qty: number) => {
    const p = products.find((x) => x.id === productId);
    if (!p) return;
    const q = Math.max(1, Math.min(qty, p.stock));
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: q } : i)));
  };
  const clear = () => { setItems([]); setCoupon(null); };

  const { subtotal, count } = useMemo(() => {
    let s = 0, c = 0;
    items.forEach((it) => {
      const p = products.find((x) => x.id === it.productId);
      if (p) { s += p.price * it.quantity; c += it.quantity; }
    });
    return { subtotal: s, count: c };
  }, [items]);

  let discount = 0;
  let shipping = subtotal > 0 ? (subtotal >= 800 ? 0 : 25) : 0;
  if (coupon === "FERROSO10") discount = subtotal * 0.1;
  if (coupon === "ENVIOGRATIS") shipping = 0;
  const total = Math.max(0, subtotal - discount + shipping);

  const applyCoupon = (code: string) => {
    const c = code.trim().toUpperCase();
    if (c !== "FERROSO10" && c !== "ENVIOGRATIS") return { ok: false, message: "Cupón inválido" };
    setCoupon(c);
    return { ok: true, message: "Cupón aplicado" };
  };
  const removeCoupon = () => setCoupon(null);

  return (
    <CartCtx.Provider value={{ items, add, remove, setQty, clear, count, subtotal, shipping, discount, total, coupon, applyCoupon, removeCoupon }}>
      {children}
    </CartCtx.Provider>
  );
}
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};
