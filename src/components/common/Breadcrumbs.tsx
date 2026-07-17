import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({ items }: { items: { label: string; to?: string }[] }) {
  return (
    <nav aria-label="breadcrumb" className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
            {it.to ? (
              <Link to={it.to} className="hover:text-primary">{it.label}</Link>
            ) : (
              <span className="text-foreground font-medium">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
