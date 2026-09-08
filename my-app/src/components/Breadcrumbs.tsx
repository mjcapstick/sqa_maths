import { Link } from "react-router";

export type Crumb = {
  label: string;
  to?: string;
};

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--color-ink-faint)" }}
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
            {isLast || !crumb.to ? (
              <span
                className="text-sm font-medium"
                style={{ color: isLast ? "var(--color-ink)" : "var(--color-ink-muted)" }}
                aria-current={isLast ? "page" : undefined}
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                to={crumb.to}
                className="text-sm transition-colors hover:underline underline-offset-2"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {crumb.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
