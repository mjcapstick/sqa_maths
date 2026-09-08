import { Link, useParams, Navigate } from "react-router";
import { getLevel } from "@/data/content";
import Breadcrumbs from "@/components/Breadcrumbs";

export default function LevelPage() {
  const { level: levelSlug } = useParams<{ level: string }>();
  const level = getLevel(levelSlug ?? "");

  if (!level) return <Navigate to="/" replace />;

  const cards = [
    {
      mode: "past-papers" as const,
      label: "Past Papers",
      description: `${level.pastPapers.length} papers from ${Math.min(...level.pastPapers.map((p) => p.year))}–${Math.max(...level.pastPapers.map((p) => p.year))}. Grouped by year with solutions.`,
      tag: "Past Papers",
      tagStyle: {
        backgroundColor: "var(--color-tag-paper)",
        color: "var(--color-tag-paper-ink)",
        borderColor: "var(--color-tag-paper-border)",
      },
      icon: <PaperIcon />,
    },
    {
      mode: "topics" as const,
      label: "Questions by Topic",
      description: `${level.topics.length} topics with focused workbooks and answers.`,
      tag: "By Topic",
      tagStyle: {
        backgroundColor: "var(--color-tag-topic)",
        color: "var(--color-tag-topic-ink)",
        borderColor: "var(--color-tag-topic-border)",
      },
      icon: <TopicIcon />,
    },
  ];

  return (
    <div>
      <Breadcrumbs crumbs={[{ label: "Home", to: "/" }, { label: level.label }]} />

      <div className="mt-8 mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: "var(--color-ink)" }}>
          {level.label} Mathematics
        </h1>
        <p className="mt-2 text-base" style={{ color: "var(--color-ink-muted)" }}>
          Choose how you want to study.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {cards.map((card) => (
          <Link
            key={card.mode}
            to={`/${level.slug}/${card.mode}`}
            className="group flex flex-col p-6 rounded-xl border transition-all hover:shadow-md hover:-translate-y-0.5"
            style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-5">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--color-surface-sunken)", color: "var(--color-ink-muted)" }}
                aria-hidden="true"
              >
                {card.icon}
              </div>
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full border"
                style={card.tagStyle}
              >
                {card.tag}
              </span>
            </div>
            <span className="text-base font-semibold mb-2" style={{ color: "var(--color-ink)" }}>
              {card.label}
            </span>
            <span className="text-sm leading-relaxed flex-1" style={{ color: "var(--color-ink-muted)" }}>
              {card.description}
            </span>
            <span
              className="mt-5 text-xs font-medium flex items-center gap-1"
              style={{ color: "var(--color-accent)" }}
            >
              Browse
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

function PaperIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function TopicIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}
