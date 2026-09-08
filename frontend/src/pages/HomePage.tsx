import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { api } from "../api";
import { EmptyState, ErrorState, Spinner } from "../components/Status";

export function HomePage() {
  const levels = useQuery({ queryKey: ["exam-levels"], queryFn: api.examLevels });

  return (
    <div>
      <p className="text-sm font-medium text-accent">Scottish secondary maths</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink-950">Past papers and topic practice</h1>
      <p className="mt-2 max-w-xl text-sm text-ink-500">
        Choose your exam level to browse SQA-style papers or work through questions by topic.
      </p>

      {levels.isLoading && <Spinner label="Loading exam levels" />}
      {levels.isError && <ErrorState message={(levels.error as Error).message} />}
      {levels.data && levels.data.length === 0 && (
        <EmptyState title="No exam levels yet" body="Add National 5 or Higher from the upload page." />
      )}
      {levels.data && levels.data.length > 0 && (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {levels.data.map((level) => (
            <li key={level.id}>
              <Link
                to={`/${level.slug}`}
                className="block rounded-2xl border border-ink-200 bg-white p-5 shadow-soft transition hover:border-ink-400"
              >
                <p className="text-lg font-semibold text-ink-950">{level.name}</p>
                <p className="mt-1 text-sm text-ink-500">Past papers and questions by topic</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
