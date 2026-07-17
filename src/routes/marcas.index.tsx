import { Link } from "react-router-dom";
import { brands } from "@/data/brands";
import { useProducts } from "@/context/ProductsContext";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export function BrandsList() {
  const { products } = useProducts();
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Marcas" }]} />
      <h1 className="mt-4 text-3xl font-black">Marcas</h1>
      <p className="mt-1 text-sm text-muted-foreground">Trabajamos con las principales marcas del rubro.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const c = products.filter((p) => p.brand === b.slug).length;
          return (
            <Link key={b.slug} to={`/marcas/${b.slug}`} className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:shadow-md">
              <img src={b.logo} alt={b.name} className="h-16 w-24 object-contain" />
              <div>
                <p className="font-bold text-lg">{b.name}</p>
                <p className="text-xs text-muted-foreground">{b.country}</p>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{b.description}</p>
                <p className="mt-1 text-xs font-semibold text-primary">{c} productos →</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
