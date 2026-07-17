import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getPostBySlug, posts } from "@/data/blog";
import { Breadcrumbs } from "@/components/common/Breadcrumbs";

export function PostView() {
  const { slug } = useParams();
  const post = getPostBySlug(slug ?? "");
  if (!post) return <div className="container-x py-16 text-center">Artículo no encontrado · <Link to="/blog" className="text-primary">Volver</Link></div>;
  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Blog", to: "/blog" }, { label: post.title }]} />
      <article className="mt-4 mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase text-primary">{post.category}</p>
        <h1 className="mt-1 text-3xl font-black md:text-4xl">{post.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{post.author} · {new Date(post.date).toLocaleDateString("es-PE")} · {post.readingTime}</p>
        <img src={post.image} alt={post.title} className="mt-5 aspect-[16/9] w-full rounded-lg object-cover" />
        <div className="prose prose-sm mt-6 max-w-none [&>h2]:mt-6 [&>h2]:font-black [&>ul]:list-disc [&>ul]:pl-6 [&>p]:mt-3 [&>p]:leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <section className="mx-auto mt-12 max-w-5xl">
        <h2 className="mb-4 text-xl font-black">Artículos relacionados</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((p) => (
            <Link key={p.slug} to={`/blog/${p.slug}`} className="group overflow-hidden rounded-lg border border-border bg-card">
              <img src={p.image} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="p-3"><p className="font-semibold group-hover:text-primary">{p.title}</p></div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
