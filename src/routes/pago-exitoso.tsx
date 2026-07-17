import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { waLink } from "@/lib/format";
export function Success() {
  const [params] = useSearchParams();
  const number = params.get("order") || localStorage.getItem("af_last_order_number") || "";
  return (
    <div className="container-x py-10">
      <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-4 text-3xl font-black">¡Pago confirmado!</h1>
        <p className="mt-2 text-muted-foreground">
          Tu pedido fue registrado y el pago fue procesado por Culqi.
        </p>
        {number && <p className="mt-5 rounded bg-muted p-4 text-lg font-bold">Pedido {number}</p>}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link to="/mi-cuenta" className="btn-primary">
            Ver mis pedidos
          </Link>
          <Link to="/productos" className="btn-outline">
            Seguir comprando
          </Link>
          <a
            href={waLink(`Hola, acabo de realizar el pedido ${number}`)}
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
