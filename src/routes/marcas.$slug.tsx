import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { brands } from "@/data/brands";
import { useProducts } from "@/context/ProductsContext";
import { ProductCard } from "@/components/products/ProductCard";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export function BrandDetail() {
  const { products } = useProducts();
  const { slug } = useParams();
  const brand = brands.find((x) => x.slug === slug);
  if (!brand) return <div className="container-x py-16 text-center">Marca no encontrada · <Link to="/marcas" className="text-primary">Ver todas</Link></div>;
  const items = products.filter((p) => p.brand === brand.slug);
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Marcas", to: "/marcas" }, { label: brand.name }]} />
      <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
        <img src={brand.logo} alt={brand.name} className="h-16 w-32 object-contain" />
        <div className="flex-1"><h1 className="text-2xl font-black">{brand.name}</h1><p className="text-sm text-muted-foreground">{brand.description}</p></div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  );
}
