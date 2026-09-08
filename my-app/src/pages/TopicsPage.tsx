import { Link, useParams, Navigate } from "react-router";
import { getLevel } from "@/data/content";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function TopicsPage() {
  const { level: levelSlug } = useParams<{ level: string }>();
  const level = getLevel(levelSlug ?? "");

  if (!level) return <Navigate to="/" replace />;

  return (
    <div>
      <Breadcrumbs
        crumbs={[
          { label: "Home", to: "/" },
          { label: level.label, to: `/${level.slug}` },
          { label: "Topics" },
        ]}
      />

      <div className="mt-8 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
            Questions by Topic
          </h1>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full border"
            style={{
              backgroundColor: "var(--color-tag-topic)",
              color: "var(--color-tag-topic-ink)",
              borderColor: "var(--color-tag-topic-border)",
            }}
          >
            By Topic
          </span>
        </div>
        <p className="text-sm" style={{ color: "var(--color-ink-muted)" }}>
          {level.label} · {level.topics.length} topics
        </p>
      </div>

      {level.topics.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {level.topics.map((topic) => (
            <Link
              key={topic.slug}
              to={`/${level.slug}/topics/${topic.slug}`}
              className="group flex items-center gap-4 px-5 py-4 rounded-xl border transition-all hover:shadow-sm hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center text-xl shrink-0 font-semibold"
                style={{
                  backgroundColor: "var(--color-accent-light)",
                  color: "var(--color-accent)",
                }}
                aria-hidden="true"
              >
                {topic.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: "var(--color-ink)" }}>
                  {topic.name}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-ink-faint)" }}>
                  {topic.subtopics.length} subtopics
                </p>
              </div>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                style={{ color: "var(--color-ink-faint)" }}
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
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
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
      <p className="text-sm">No topics available yet.</p>
    </div>
  );
}
