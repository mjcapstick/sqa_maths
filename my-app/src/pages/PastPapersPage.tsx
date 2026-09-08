import { useParams, Navigate } from "react-router";
import { getLevel, type PastPaper } from "@/data/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import PDFButton from "@/components/PDFButton";

export default function PastPapersPage() {
  const { level: levelSlug } = useParams<{ level: string }>();
  const level = getLevel(levelSlug ?? "");

  if (!level) return <Navigate to="/" replace />;

  // Group papers by year
  const byYear = level.pastPapers.reduce<Record<number, PastPaper[]>>((acc, p) => {
    (acc[p.year] ??= []).push(p);
    return acc;
  }, {});

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { label: "Home", to: "/" },
          { label: level.label, to: `/${level.slug}` },
          { label: "Past Papers" },
        ]}
      />

      <div className="mt-8 mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
              Past Papers
            </h1>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full border"
              style={{
                backgroundColor: "var(--color-tag-paper)",
                color: "var(--color-tag-paper-ink)",
                borderColor: "var(--color-tag-paper-border)",
              }}
            >
              Past Papers
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
            {level.label} · {level.pastPapers.length} papers
          </p>
        </div>
      </div>

      {years.length === 0 ? (
        <EmptyState message="No past papers available yet." />
      ) : (
        <div className="flex flex-col gap-6">
          {years.map((year) => (
            <YearGroup key={year} year={year} papers={byYear[year]} levelSlug={level.slug} />
          ))}
        </div>
      )}
    </div>
  );
}

function YearGroup({ year, papers, levelSlug }: { year: number; papers: PastPaper[]; levelSlug: string }) {
  const sorted = [...papers].sort((a, b) => a.paperNumber - b.paperNumber);

  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-ink)" }}>
          {year}
        </h2>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
      </div>

      <div className="flex flex-col gap-2">
        {sorted.map((paper) => (
          <div
            key={paper.paperNumber}
            className="flex items-center justify-between px-4 py-3.5 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border)",
            }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
                {year} — Paper {paper.paperNumber}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-faint)" }}>
                {levelSlug === "higher" ? "Higher" : "National 5"} Mathematics
              </p>
            </div>
            <div className="flex items-center gap-2">
              <PDFButton
                url={paper.paperUrl}
                label="Paper"
                variant="ghost"
              />
              <PDFButton
                url={paper.solutionsUrl}
                label="Solutions"
                variant="primary"
                icon={
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </svg>
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-3 rounded-xl border"
      style={{ borderColor: "var(--color-border)", color: "var(--color-ink-faint)" }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <p className="text-sm">{message}</p>
    </div>
  );
}
