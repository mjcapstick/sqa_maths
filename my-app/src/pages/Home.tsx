import { Link } from "react-router";
import { levels } from "@/data/content";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Wordmark */}
      <div className="mb-10">
        <p
          className="text-xs font-medium tracking-widest uppercase mb-3"
          style={{ color: "var(--color-ink-faint)" }}
        >
          SQA Scotland
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold tracking-tight mb-3"
          style={{ color: "var(--color-ink)" }}
        >
          Maths Study
        </h1>
        <p className="text-base sm:text-lg max-w-sm mx-auto" style={{ color: "var(--color-ink-muted)" }}>
          Past papers and topic workbooks for Scottish secondary maths.
        </p>
      </div>

      {/* Level cards */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        {levels.map((level) => (
          <Link
            key={level.slug}
            to={`/${level.slug}`}
            className="group flex-1 flex flex-col items-start text-left p-6 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-lg font-bold"
              style={{ backgroundColor: "var(--color-accent-light)", color: "var(--color-accent)" }}
              aria-hidden="true"
            >
              {level.label === "National 5" ? "N5" : "H"}
            </div>
            <span className="text-base font-semibold mb-1" style={{ color: "var(--color-ink)" }}>
              {level.label}
            </span>
            <span className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
              {level.description}
            </span>
            <span
              className="mt-4 text-xs font-medium flex items-center gap-1 transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              Open
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
