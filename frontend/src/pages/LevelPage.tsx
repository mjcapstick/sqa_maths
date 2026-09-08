import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { api } from "../api";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { BookIcon, DocumentIcon, ModeTag } from "../components/ModeTag";
import { ErrorState, Spinner } from "../components/Status";

export function LevelPage() {
  const { examLevel = "" } = useParams();
  const level = useQuery({
    queryKey: ["exam-level", examLevel],
    queryFn: () => api.examLevel(examLevel),
    enabled: Boolean(examLevel),
  });

  if (level.isLoading) return <Spinner label="Loading level" />;
  if (level.isError) return <ErrorState message={(level.error as Error).message} />;
  if (!level.data) return null;

  return (
    <div>
      <Breadcrumbs items={[{ label: "Levels", to: "/" }, { label: level.data.name }]} />
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">{level.data.name}</h1>
      <p className="mt-2 text-sm text-ink-500">Pick how you want to practise.</p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/${examLevel}/past-papers`}
          className="rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition hover:border-ink-400"
        >
          <div className="flex items-center gap-2 text-papers">
            <DocumentIcon />
            <ModeTag mode="papers" />
          </div>
          <p className="mt-3 text-lg font-semibold text-ink-950">Past papers</p>
          <p className="mt-1 text-sm text-ink-500">Full exam papers and solutions, grouped by year.</p>
        </Link>
        <Link
          to={`/${examLevel}/topics`}
          className="rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition hover:border-ink-400"
        >
          <div className="flex items-center gap-2 text-topics">
            <BookIcon />
            <ModeTag mode="topics" />
          </div>
          <p className="mt-3 text-lg font-semibold text-ink-950">Questions by topic</p>
          <p className="mt-1 text-sm text-ink-500">Workbooks and answers organised by topic and subtopic.</p>
        </Link>
      </div>
    </div>
  );
}
