import { Breadcrumbs } from "./Breadcrumbs";
export function LegalPage({ title, sections }: { title: string; sections: { h: string; p: string }[] }) {
  return (
    <div className="container-x py-6">
      <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: title }]} />
      <h1 className="mt-4 text-3xl font-black">{title}</h1>
      <p className="mt-1 text-xs text-muted-foreground">Contenido referencial sujeto a revisión legal.</p>
      <article className="prose prose-sm mt-6 max-w-3xl space-y-6">
        {sections.map((s) => (
          <section key={s.h}><h2 className="text-lg font-bold text-foreground">{s.h}</h2><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{s.p}</p></section>
        ))}
      </article>
    </div>
  );
}
