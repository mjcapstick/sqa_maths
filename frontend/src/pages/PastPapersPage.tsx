import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FileActions } from "../components/FileActions";
import { ModeTag } from "../components/ModeTag";
import { ModeToggle } from "../components/ModeToggle";
import { EmptyState, ErrorState, Spinner } from "../components/Status";
import type { PastPaper } from "../types";

function groupByYear(papers: PastPaper[]) {
  const years = new Map<number, PastPaper[]>();
  for (const paper of papers) {
    const list = years.get(paper.year) ?? [];
    list.push(paper);
    years.set(paper.year, list);
  }
  return [...years.entries()];
}

export function PastPapersPage() {
  const { examLevel = "" } = useParams();
  const level = useQuery({
    queryKey: ["exam-level", examLevel],
    queryFn: () => api.examLevel(examLevel),
    enabled: Boolean(examLevel),
  });
  const papers = useQuery({
    queryKey: ["past-papers", examLevel],
    queryFn: () => api.pastPapers(examLevel),
    enabled: Boolean(examLevel),
  });

  const name = level.data?.name ?? examLevel;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Levels", to: "/" },
          { label: name, to: `/${examLevel}` },
          { label: "Past papers" },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Past papers</h1>
        <ModeTag mode="papers" />
      </div>
      <ModeToggle active="papers" />

      {papers.isLoading && <Spinner label="Loading papers" />}
      {papers.isError && <ErrorState message={(papers.error as Error).message} />}
      {papers.data && papers.data.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title={`No past papers yet for ${name}`}
            body="Check back later, or add papers from the upload page."
          />
        </div>
      )}
      {papers.data && papers.data.length > 0 && (
        <div className="mt-8 space-y-8">
          {groupByYear(papers.data).map(([year, list]) => (
            <section key={year}>
              <h2 className="mb-3 text-sm font-semibold text-ink-500">{year}</h2>
              <ul className="divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
                {list.map((paper) => (
                  <li key={paper.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-ink-950">
                        {year} Paper {paper.paper_number}
                      </p>
                      <p className="text-sm text-ink-500">{paper.diet} diet</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <FileActions file={paper.paper_file} previewLabel="Paper" />
                      <FileActions file={paper.solutions_file} previewLabel="Solutions" />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
