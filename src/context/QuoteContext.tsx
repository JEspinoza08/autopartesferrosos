import { createContext, useContext, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import type { QuoteItem } from "@/types";

type Ctx = {
  items: QuoteItem[];
  add: (productId: number, quantity?: number) => void;
  remove: (productId: number) => void;
  setQty: (productId: number, quantity: number) => void;
  clear: () => void;
  count: number;
};
const QCtx = createContext<Ctx | null>(null);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<QuoteItem[]>("af_quote", []);
  const add = (productId: number, quantity = 1) => {
    setItems((prev) => {
      const e = prev.find((i) => i.productId === productId);
      if (e) return prev.map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i));
      return [...prev, { productId, quantity }];
    });
  };
  const remove = (productId: number) => setItems((p) => p.filter((i) => i.productId !== productId));
  const setQty = (productId: number, quantity: number) =>
    setItems((prev) => prev.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, quantity) } : i)));
  const clear = () => setItems([]);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return <QCtx.Provider value={{ items, add, remove, setQty, clear, count }}>{children}</QCtx.Provider>;
}
export const useQuote = () => {
  const c = useContext(QCtx);
  if (!c) throw new Error("QuoteProvider missing");
  return c;
};
