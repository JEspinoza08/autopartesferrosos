import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type Toast = { id: number; type: "success" | "error" | "info"; message: string };
type Ctx = { show: (t: Omit<Toast, "id">) => void };
const ToastCtx = createContext<Ctx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { id, ...t }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      <div className="fixed bottom-24 right-4 z-[100] flex flex-col gap-2 md:bottom-6">
        {toasts.map((t) => {
          const Icon = t.type === "success" ? CheckCircle2 : t.type === "error" ? AlertCircle : Info;
          const color = t.type === "success" ? "border-l-green-500" : t.type === "error" ? "border-l-red-500" : "border-l-blue-500";
          return (
            <div key={t.id} className={`flex items-start gap-3 rounded-md border border-border bg-card px-4 py-3 shadow-lg border-l-4 ${color} max-w-sm animate-in slide-in-from-right`}>
              <Icon className="h-5 w-5 shrink-0 text-foreground" />
              <p className="flex-1 text-sm text-foreground">{t.message}</p>
              <button aria-label="Cerrar" onClick={() => setToasts((s) => s.filter((x) => x.id !== t.id))}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
export const useToast = () => {
  const c = useContext(ToastCtx);
  if (!c) throw new Error("ToastProvider missing");
  return c;
};
