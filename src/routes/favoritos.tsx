import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "@/context/FavoritesContext";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { EmptyState } from "@/components/common/EmptyState";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export function Favs() {
  const { products } = useProducts();
  const { ids } = useFavorites();
  const list = products.filter((p) => ids.includes(p.id));
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Favoritos" }]} />
      <h1 className="mt-4 text-3xl font-black">Mis favoritos</h1>
      {list.length === 0 ? (
        <div className="mt-8"><EmptyState icon={Heart} title="Aún no tienes favoritos" description="Guarda productos para verlos más rápido." action={<Link to="/productos" className="btn-primary mt-2">Explorar productos</Link>} /></div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
