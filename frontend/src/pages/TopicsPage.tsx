import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ModeTag } from "../components/ModeTag";
import { ModeToggle } from "../components/ModeToggle";
import { EmptyState, ErrorState, Spinner } from "../components/Status";

export function TopicsPage() {
  const { examLevel = "" } = useParams();
  const level = useQuery({
    queryKey: ["exam-level", examLevel],
    queryFn: () => api.examLevel(examLevel),
    enabled: Boolean(examLevel),
  });
  const topics = useQuery({
    queryKey: ["topics", examLevel],
    queryFn: () => api.topics(examLevel),
    enabled: Boolean(examLevel),
  });
  const name = level.data?.name ?? examLevel;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Levels", to: "/" },
          { label: name, to: `/${examLevel}` },
          { label: "Topics" },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Questions by topic</h1>
        <ModeTag mode="topics" />
      </div>
      <ModeToggle active="topics" />

      {topics.isLoading && <Spinner label="Loading topics" />}
      {topics.isError && <ErrorState message={(topics.error as Error).message} />}
      {topics.data && topics.data.length === 0 && (
        <div className="mt-6">
          <EmptyState title={`No topics yet for ${name}`} body="Topics will appear here once they are added." />
        </div>
      )}
      {topics.data && topics.data.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {topics.data.map((topic) => (
            <li key={topic.id}>
              <Link
                to={`/${examLevel}/topics/${topic.slug}`}
                className="block rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition hover:border-ink-400"
              >
                <p className="text-lg font-semibold text-ink-950">{topic.name}</p>
                <p className="mt-1 text-sm text-ink-500">
                  {topic.subtopic_count} {topic.subtopic_count === 1 ? "subtopic" : "subtopics"}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
