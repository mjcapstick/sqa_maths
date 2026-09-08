import { useParams, Navigate } from "react-router";
import { getLevel, getTopic } from "@/data/content";
import Breadcrumbs from "@/components/Breadcrumbs";
import PDFButton from "@/components/PDFButton";

export default function SubtopicPage() {
  const { level: levelSlug, topic: topicSlug } = useParams<{ level: string; topic: string }>();
  const level = getLevel(levelSlug ?? "");
  const topic = getTopic(levelSlug ?? "", topicSlug ?? "");

  if (!level || !topic) return <Navigate to="/" replace />;

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { label: "Home", to: "/" },
          { label: level.label, to: `/${level.slug}` },
          { label: "Topics", to: `/${level.slug}/topics` },
          { label: topic.name },
        ]}
      />

      <div className="mt-8 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-semibold"
            style={{
              backgroundColor: "var(--color-accent-light)",
              color: "var(--color-accent)",
            }}
            aria-hidden="true"
          >
            {topic.icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
            {topic.name}
          </h1>
        </div>
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          {level.label} · {topic.subtopics.length} subtopics
        </p>
      </div>

      {topic.subtopics.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="flex flex-col gap-2">
          {topic.subtopics.map((sub, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-4 rounded-lg border"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="text-xs font-medium tabular-nums w-6 text-right shrink-0"
                  style={{ color: "var(--color-ink-faint)" }}
                  aria-hidden="true"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm font-medium truncate" style={{ color: "var(--color-ink)" }}>
                  {sub.name}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                <PDFButton
                  url={sub.workbookUrl}
                  label="Workbook"
                  variant="ghost"
                />
                <PDFButton
                  url={sub.answersUrl}
                  label="Answers"
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
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center py-20 gap-3 rounded-xl border"
      style={{ borderColor: "var(--color-border)", color: "var(--color-ink-faint)" }}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
      <p className="text-sm">No subtopics available yet.</p>
    </div>
  );
}
