import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { CreditCard, Landmark, Package, Building2 } from "lucide-react";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { useAuth } from "@/context/AuthContext";
import { formatPEN } from "@/lib/format";
import { peruLocations } from "@/data/peru-locations";
import { useToast } from "@/context/ToastContext";
import { openCulqiCheckout } from "@/lib/culqi";
import { createNonCardOrder, payWithCulqi } from "@/services/orders";

const STEPS = ["Cliente", "Dirección", "Pago", "Confirmación"] as const;

export function Checkout() {
  const nav = useNavigate();
  const { items, subtotal, discount, shipping, total, coupon, clear } = useCart();
  const { products, refresh: refreshProducts } = useProducts();
  const { user, profile } = useAuth();
  const { show } = useToast();
  const [step, setStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [cust, setCust] = useState({
    firstName: profile?.first_name ?? "",
    lastName: profile?.last_name ?? "",
    email: user?.email ?? "",
    phone: profile?.phone ?? "",
    docType: "DNI",
    docNumber: "",
    razonSocial: "",
  });
  const [addr, setAddr] = useState({
    department: "Lima",
    province: "Lima",
    district: "Miraflores",
    address: "",
    reference: "",
    deliveryType: "domicilio" as "domicilio" | "sucursal",
  });
  const [payMethod, setPayMethod] = useState<
    "tarjeta" | "transferencia" | "contra-entrega" | "cotizacion"
  >("tarjeta");

  const lineItems = useMemo(
    () =>
      items
        .map((it) => {
          const p = products.find((x) => x.id === it.productId);
          return p ? { product_id: p.id, quantity: it.quantity } : null;
        })
        .filter(Boolean),
    [items, products],
  );

  if (items.length === 0 && !processing)
    return <div className="container-x py-12 text-center">Tu carrito está vacío.</div>;
  const provinces = Object.keys(peruLocations[addr.department] ?? {});
  const districts = peruLocations[addr.department]?.[addr.province] ?? [];

  const next = () => {
    if (
      step === 0 &&
      (!cust.firstName || !cust.lastName || !cust.email || !cust.phone || !cust.docNumber)
    )
      return show({ type: "error", message: "Completa los datos del cliente." });
    if (step === 1 && addr.deliveryType === "domicilio" && (!addr.address || !addr.district))
      return show({ type: "error", message: "Completa la dirección de entrega." });
    setStep((s) => Math.min(s + 1, 3));
  };

  const payloadBase = {
    items: lineItems,
    coupon_code: coupon,
    customer: cust,
    address: addr,
    invoice: { invoiceType: "boleta", ruc: "", razonSocial: "", direccion: "" },
    payment_method: payMethod,
  };

  const confirm = async () => {
    if (!user) {
      show({ type: "info", message: "Inicia sesión para completar tu compra." });
      nav("/login");
      return;
    }
    setProcessing(true);
    try {
      let result: any;
      if (payMethod === "tarjeta") {
        const token = await openCulqiCheckout({
          amount: total,
          email: cust.email,
          description: `Compra de ${items.length} producto(s)`,
        });
        result = await payWithCulqi({
          ...payloadBase,
          token_id: token.token,
          token_email: token.email,
          installments: token.installments,
        });
      } else {
        result = await createNonCardOrder(payloadBase);
      }
      localStorage.setItem("af_last_order_number", result.order_number);

      // La orden ya descontó el stock en Supabase. Refrescamos el catálogo
      // antes de navegar para que todas las vistas muestren el valor nuevo
      // sin necesitar F5 o Ctrl+F5.
      await refreshProducts();
      clear();
      nav(
        payMethod === "tarjeta"
          ? `/pago-exitoso?order=${encodeURIComponent(result.order_number)}`
          : `/pago-pendiente?order=${encodeURIComponent(result.order_number)}`,
      );
    } catch (error: any) {
      show({ type: "error", message: error?.message ?? "No se pudo completar el pedido." });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-x py-6">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Carrito", to: "/carrito" },
          { label: "Checkout" },
        ]}
      />
      <h1 className="mt-4 text-3xl font-black">Finalizar compra</h1>
      <div className="mt-5">
        <div className="grid grid-cols-4 gap-1 sm:flex">
          {STEPS.map((s, i) => (
            <div key={s} className="flex min-w-0 flex-col items-center gap-1 sm:flex-1 sm:flex-row sm:gap-0">
              <div
                className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${i <= step ? "bg-primary text-primary-foreground" : "bg-muted"}`}
              >
                {i + 1}
              </div>
              <span className="text-center text-[10px] font-semibold leading-tight sm:ml-2 sm:text-xs">{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`mx-2 hidden h-0.5 flex-1 sm:block ${i < step ? "bg-primary" : "bg-muted"}`} />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-4 sm:p-5">
          {step === 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="Nombres *"
                value={cust.firstName}
                onChange={(v) => setCust({ ...cust, firstName: v })}
              />
              <Field
                label="Apellidos *"
                value={cust.lastName}
                onChange={(v) => setCust({ ...cust, lastName: v })}
              />
              <Field
                label="Correo *"
                type="email"
                value={cust.email}
                onChange={(v) => setCust({ ...cust, email: v })}
              />
              <Field
                label="Celular *"
                value={cust.phone}
                onChange={(v) => setCust({ ...cust, phone: v.replace(/\D/g, "").slice(0, 9) })}
              />
              <div>
                <Label>Tipo de documento</Label>
                <select
                  className="input-x"
                  value={cust.docType}
                  onChange={(e) => setCust({ ...cust, docType: e.target.value })}
                >
                  <option>DNI</option>
                  <option>CE</option>
                  <option>RUC</option>
                </select>
              </div>
              <Field
                label="Número de documento *"
                value={cust.docNumber}
                onChange={(v) => setCust({ ...cust, docNumber: v.replace(/\D/g, "").slice(0, 11) })}
              />
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <Choice
                  active={addr.deliveryType === "domicilio"}
                  onClick={() => setAddr({ ...addr, deliveryType: "domicilio" })}
                  icon={Package}
                  title="Envío a domicilio"
                />
                <Choice
                  active={addr.deliveryType === "sucursal"}
                  onClick={() => setAddr({ ...addr, deliveryType: "sucursal" })}
                  icon={Building2}
                  title="Recojo en sucursal"
                />
              </div>
              {addr.deliveryType === "domicilio" && (
                <>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Select
                      label="Departamento"
                      value={addr.department}
                      options={Object.keys(peruLocations)}
                      onChange={(v) => {
                        const p = Object.keys(peruLocations[v])[0];
                        setAddr({
                          ...addr,
                          department: v,
                          province: p,
                          district: peruLocations[v][p][0],
                        });
                      }}
                    />
                    <Select
                      label="Provincia"
                      value={addr.province}
                      options={provinces}
                      onChange={(v) =>
                        setAddr({
                          ...addr,
                          province: v,
                          district: peruLocations[addr.department][v][0],
                        })
                      }
                    />
                    <Select
                      label="Distrito"
                      value={addr.district}
                      options={districts}
                      onChange={(v) => setAddr({ ...addr, district: v })}
                    />
                  </div>
                  <Field
                    label="Dirección *"
                    value={addr.address}
                    onChange={(v) => setAddr({ ...addr, address: v })}
                    full
                  />
                  <Field
                    label="Referencia"
                    value={addr.reference}
                    onChange={(v) => setAddr({ ...addr, reference: v })}
                    full
                  />
                </>
              )}
            </div>
          )}
          {step === 2 && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Choice
                active={payMethod === "tarjeta"}
                onClick={() => setPayMethod("tarjeta")}
                icon={CreditCard}
                title="Tarjeta con Culqi"
              />
              <Choice
                active={payMethod === "transferencia"}
                onClick={() => setPayMethod("transferencia")}
                icon={Landmark}
                title="Transferencia bancaria"
              />
              <Choice
                active={payMethod === "contra-entrega"}
                onClick={() => setPayMethod("contra-entrega")}
                icon={Package}
                title="Pago contra entrega"
              />
              <Choice
                active={payMethod === "cotizacion"}
                onClick={() => setPayMethod("cotizacion")}
                icon={Building2}
                title="Cotización empresarial"
              />
              <p className="sm:col-span-2 rounded bg-muted p-3 text-sm text-muted-foreground">
                Los datos de tarjeta se capturan en el Checkout seguro de Culqi y nunca pasan por
                este servidor.
              </p>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-3 text-sm">
              <h2 className="text-xl font-bold">Confirma tu pedido</h2>
              <p>
                <b>Cliente:</b> {cust.firstName} {cust.lastName} · {cust.email}
              </p>
              <p>
                <b>Entrega:</b>{" "}
                {addr.deliveryType === "domicilio"
                  ? `${addr.address}, ${addr.district}`
                  : "Recojo en sucursal"}
              </p>
              <p>
                <b>Pago:</b> {payMethod === "tarjeta" ? "Tarjeta mediante Culqi" : payMethod}
              </p>
              <button disabled={processing} onClick={confirm} className="btn-primary w-full">
                {processing
                  ? "Procesando..."
                  : payMethod === "tarjeta"
                    ? "Pagar con Culqi"
                    : "Confirmar pedido"}
              </button>
            </div>
          )}
          {step < 3 && (
            <div className="mt-6 flex justify-between">
              <button
                className="btn-outline"
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                Atrás
              </button>
              <button className="btn-primary" onClick={next}>
                Continuar
              </button>
            </div>
          )}
        </section>
        <aside className="h-fit rounded-lg border border-border bg-card p-5">
          <h2 className="text-lg font-bold">Resumen</h2>
          <div className="mt-3 max-h-72 space-y-3 overflow-auto">
            {items.map((it) => {
              const p = products.find((x) => x.id === it.productId);
              if (!p) return null;
              return (
                <div key={it.productId} className="flex gap-2 text-sm">
                  <img src={p.images[0]} className="h-12 w-12 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {it.quantity} × {formatPEN(p.price)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-1 border-t pt-3 text-sm">
            <Row a="Subtotal" b={formatPEN(subtotal)} />
            {discount > 0 && <Row a="Descuento" b={`- ${formatPEN(discount)}`} />}
            <Row a="Envío" b={shipping === 0 ? "Gratis" : formatPEN(shipping)} />
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-primary">{formatPEN(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-1 block text-xs font-semibold uppercase tracking-wider">{children}</label>
  );
}
function Field({
  label,
  value,
  onChange,
  type = "text",
  full = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  full?: boolean;
}) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <Label>{label}</Label>
      <input
        className="input-x"
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select className="input-x" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((x) => (
          <option key={x}>{x}</option>
        ))}
      </select>
    </div>
  );
}
function Choice({
  active,
  onClick,
  title,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  icon?: any;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md border-2 p-4 text-left ${active ? "border-primary bg-primary/5" : "border-border"}`}
    >
      {Icon && <Icon className="h-5 w-5 text-primary" />}
      <span className="font-semibold">{title}</span>
    </button>
  );
}
function Row({ a, b }: { a: string; b: string }) {
  return (
    <div className="flex justify-between">
      <span>{a}</span>
      <span>{b}</span>
    </div>
  );
}
