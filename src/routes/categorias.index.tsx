import { Link } from "react-router-dom";
import { categories } from "@/data/categories";
import { useProducts } from "@/context/ProductsContext";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export function CatList() {
  const { products } = useProducts();
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Categorías" }]} />
      <h1 className="mt-4 text-3xl font-black">Categorías</h1>
      <p className="mt-1 text-sm text-muted-foreground">Encuentra el rubro que necesitas.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => {
          const count = products.filter((p) => p.category === c.slug).length;
          return (
            <Link key={c.slug} to={`/categorias/${c.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-md">
              <div className="aspect-[16/9] overflow-hidden bg-muted"><img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition group-hover:scale-105" /></div>
              <div className="p-4">
                <p className="text-lg font-bold group-hover:text-primary">{c.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{count} productos</span>
                  <span className="font-semibold text-primary">Ver catálogo →</span>
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">Subcategorías: {c.subcategories.join(", ")}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
