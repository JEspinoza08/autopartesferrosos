import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { categories } from "@/data/categories";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";
import { EmptyState } from "@/components/common/EmptyState";
import { Package } from "lucide-react";

export function CatDetail() {
  const { products } = useProducts();
  const { slug } = useParams();
  const category = categories.find((x) => x.slug === slug);
  if (!category) return <div className="container-x py-16 text-center">Categoría no encontrada · <Link to="/categorias" className="text-primary">Ver todas</Link></div>;
  const items = products.filter((p) => p.category === category.slug);
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Categorías", to: "/categorias" }, { label: category.name }]} />
      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_auto]">
        <div>
          <h1 className="text-3xl font-black">{category.name}</h1>
          <p className="mt-2 text-muted-foreground">{category.description}</p>
          <p className="mt-2 text-sm">Subcategorías: <span className="font-medium">{category.subcategories.join(", ")}</span></p>
        </div>
        <img src={category.image} alt="" className="hidden h-32 w-56 rounded-lg object-cover md:block" />
      </div>
      <div className="mt-6">
        {items.length === 0 ? <EmptyState icon={Package} title="Sin productos" description="Pronto añadiremos productos en esta categoría." />
          : <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div>}
      </div>
    </div>
  );
}
