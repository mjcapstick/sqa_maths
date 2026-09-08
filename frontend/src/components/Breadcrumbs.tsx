import { Link } from "react-router-dom";

export type Crumb = { label: string; to?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="px-1 text-ink-400">
                  /
                </span>
              )}
              {item.to && !last ? (
                <Link to={item.to} className="rounded hover:text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-ink-900" aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
