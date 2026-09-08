import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { FileActions } from "../components/FileActions";
import { ModeTag } from "../components/ModeTag";
import { ModeToggle } from "../components/ModeToggle";
import { EmptyState, ErrorState, Spinner } from "../components/Status";

export function SubtopicsPage() {
  const { examLevel = "", topic = "" } = useParams();
  const level = useQuery({
    queryKey: ["exam-level", examLevel],
    queryFn: () => api.examLevel(examLevel),
    enabled: Boolean(examLevel),
  });
  const topicQuery = useQuery({
    queryKey: ["topic", examLevel, topic],
    queryFn: () => api.topic(topic, examLevel),
    enabled: Boolean(examLevel && topic),
  });
  const subtopics = useQuery({
    queryKey: ["subtopics", examLevel, topic],
    queryFn: () => api.subtopics(topic, examLevel),
    enabled: Boolean(examLevel && topic),
  });

  const levelName = level.data?.name ?? examLevel;
  const topicName = topicQuery.data?.name ?? topic;

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Levels", to: "/" },
          { label: levelName, to: `/${examLevel}` },
          { label: "Topics", to: `/${examLevel}/topics` },
          { label: topicName },
        ]}
      />
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight text-ink-950">{topicName}</h1>
        <ModeTag mode="topics" />
      </div>
      <ModeToggle active="topics" />
      <p className="mt-4 text-sm text-ink-500">Workbook and answers for each subtopic.</p>

      {(topicQuery.isLoading || subtopics.isLoading) && <Spinner label="Loading subtopics" />}
      {topicQuery.isError && <ErrorState message={(topicQuery.error as Error).message} />}
      {subtopics.isError && <ErrorState message={(subtopics.error as Error).message} />}
      {subtopics.data && subtopics.data.length === 0 && (
        <div className="mt-6">
          <EmptyState title={`No subtopics yet for ${topicName}`} body="Add a workbook from the upload page." />
        </div>
      )}
      {subtopics.data && subtopics.data.length > 0 && (
        <ul className="mt-8 divide-y divide-ink-200 overflow-hidden rounded-2xl border border-ink-200 bg-white">
          {subtopics.data.map((item) => (
            <li key={item.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-medium text-ink-950">{item.name}</p>
                <p className="text-sm text-ink-500">
                  {topicName} · {item.slug}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FileActions file={item.workbook_file} previewLabel="Workbook" />
                <FileActions file={item.answers_file} previewLabel="Answers" />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
