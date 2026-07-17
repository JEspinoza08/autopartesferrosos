import { Link } from "react-router-dom";
import { posts } from "@/data/blog";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export function BlogIndex() {
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Blog" }]} />
      <h1 className="mt-4 text-3xl font-black">Blog técnico</h1>
      <p className="mt-1 text-sm text-muted-foreground">Consejos, novedades y conocimiento del sector.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link key={p.slug} to={`/blog/${p.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card hover:shadow-md">
            <div className="aspect-[16/10] overflow-hidden bg-muted"><img src={p.image} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-105" /></div>
            <div className="p-4">
              <p className="text-[11px] font-bold uppercase text-primary">{p.category}</p>
              <h3 className="mt-1 line-clamp-2 font-bold group-hover:text-primary">{p.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <p className="mt-2 text-xs text-muted-foreground">{p.author} · {p.readingTime}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
