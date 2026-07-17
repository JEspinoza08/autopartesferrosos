
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { Flame } from "lucide-react";

export function Ofertas() {
  const { products } = useProducts();
  const items = products.filter((p) => p.isOffer);
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Ofertas" }]} />
      <div className="mt-4 flex items-center gap-3">
        <Flame className="h-8 w-8 text-primary" />
        <div><h1 className="text-3xl font-black">Ofertas</h1><p className="text-sm text-muted-foreground">Precios especiales por tiempo limitado.</p></div>
      </div>
      <div className="mt-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
        <b>Vigencia:</b> hasta agotar stock · precios referenciales sujetos a disponibilidad.
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
