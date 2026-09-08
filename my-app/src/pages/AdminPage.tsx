import { useState } from "react";
import type { FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ErrorState, Spinner } from "../components/Status";

async function postForm(path: string, body: FormData | string, json = false) {
  const response = await fetch(path, {
    method: "POST",
    headers: json ? { "Content-Type": "application/json" } : undefined,
    body,
  });
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const data = (await response.json()) as { detail?: string };
      if (typeof data.detail === "string") detail = data.detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail);
  }
}

export function AdminPage() {
  const queryClient = useQueryClient();
  const levels = useQuery({ queryKey: ["exam-levels"], queryFn: api.examLevels });
  const [levelSlug, setLevelSlug] = useState("national-5");
  const topics = useQuery({
    queryKey: ["topics", levelSlug],
    queryFn: () => api.topics(levelSlug),
    enabled: Boolean(levelSlug),
  });
  const [message, setMessage] = useState<string | null>(null);

  const invalidate = () => {
    queryClient.invalidateQueries();
  };

  const notice = (text: string) => {
    setMessage(text);
    invalidate();
  };

  const createLevel = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      await postForm(
        "/api/exam-levels",
        JSON.stringify({
          name: form.get("name"),
          slug: form.get("slug") || undefined,
          sort_order: Number(form.get("sort_order") || 0),
        }),
        true,
      );
    },
    onSuccess: () => notice("Exam level created."),
  });

  const createPaper = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget;
      const data = new FormData(form);
      const slug = String(data.get("exam_level"));
      await postForm(`/api/exam-levels/${slug}/past-papers`, data);
    },
    onSuccess: () => notice("Past paper uploaded."),
  });

  const createTopic = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      await postForm(
        "/api/topics",
        JSON.stringify({
          exam_level_slug: form.get("exam_level_slug"),
          name: form.get("name"),
          slug: form.get("slug") || undefined,
          sort_order: Number(form.get("sort_order") || 0),
        }),
        true,
      );
    },
    onSuccess: () => notice("Topic created."),
  });

  const createSubtopic = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const slug = String(data.get("topic_slug"));
      const exam = String(data.get("exam_level"));
      data.set("exam_level", exam);
      await postForm(`/api/topics/${slug}/subtopics`, data);
    },
    onSuccess: () => notice("Subtopic uploaded."),
  });

  return (
    <div className="max-w-2xl">
      <Breadcrumbs items={[{ label: "Levels", to: "/" }, { label: "Upload" }]} />
      <h1 className="text-3xl font-semibold tracking-tight text-ink-950">Internal upload</h1>
      <p className="mt-2 text-sm text-ink-500">
        Prototype-only. These write routes have no authentication — add an auth dependency later.
      </p>
      {message && <p className="mt-4 rounded-xl bg-accent-soft px-4 py-3 text-sm text-accent">{message}</p>}

      <section className="mt-8 rounded-2xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold">New exam level</h2>
        <form className="mt-4 grid gap-3" onSubmit={(e) => createLevel.mutate(e)}>
          <Field name="name" label="Name" placeholder="Advanced Higher" required />
          <Field name="slug" label="Slug (optional)" placeholder="advanced-higher" />
          <Field name="sort_order" label="Sort order" type="number" placeholder="3" />
          <Submit busy={createLevel.isPending} label="Create level" />
          {createLevel.isError && <ErrorState message={(createLevel.error as Error).message} />}
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold">Upload past paper</h2>
        <form className="mt-4 grid gap-3" onSubmit={(e) => createPaper.mutate(e)}>
          <LevelSelect levels={levels.data} name="exam_level" />
          <Field name="year" label="Year" type="number" placeholder="2024" required />
          <Field name="diet" label="Diet / sitting" placeholder="May" />
          <Field name="paper_number" label="Paper number" type="number" placeholder="1" required />
          <FileField name="paper" label="Paper PDF" />
          <FileField name="solutions" label="Solutions PDF" />
          <Submit busy={createPaper.isPending} label="Upload paper" />
          {createPaper.isError && <ErrorState message={(createPaper.error as Error).message} />}
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold">New topic</h2>
        <form className="mt-4 grid gap-3" onSubmit={(e) => createTopic.mutate(e)}>
          <LevelSelect levels={levels.data} name="exam_level_slug" />
          <Field name="name" label="Name" placeholder="Calculus" required />
          <Field name="slug" label="Slug (optional)" placeholder="calculus" />
          <Field name="sort_order" label="Sort order" type="number" placeholder="5" />
          <Submit busy={createTopic.isPending} label="Create topic" />
          {createTopic.isError && <ErrorState message={(createTopic.error as Error).message} />}
        </form>
      </section>

      <section className="mt-6 rounded-2xl border border-ink-200 bg-white p-5">
        <h2 className="text-base font-semibold">Upload subtopic workbook</h2>
        {topics.isLoading && <Spinner label="Loading topics" />}
        <form className="mt-4 grid gap-3" onSubmit={(e) => createSubtopic.mutate(e)}>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-ink-700">Exam level (for topic lookup)</span>
            <select
              name="exam_level"
              className="min-h-10 rounded-lg border border-ink-200 bg-white px-3"
              value={levelSlug}
              onChange={(e) => setLevelSlug(e.target.value)}
            >
              {(levels.data ?? []).map((level) => (
                <option key={level.id} value={level.slug}>
                  {level.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-ink-700">Topic</span>
            <select name="topic_slug" className="min-h-10 rounded-lg border border-ink-200 bg-white px-3" required>
              {(topics.data ?? []).map((topic) => (
                <option key={topic.id} value={topic.slug}>
                  {topic.name}
                </option>
              ))}
            </select>
          </label>
          <Field name="name" label="Subtopic name" placeholder="Differentiation" required />
          <FileField name="workbook" label="Workbook PDF" />
          <FileField name="answers" label="Answers PDF" />
          <Submit busy={createSubtopic.isPending} label="Upload workbook" />
          {createSubtopic.isError && <ErrorState message={(createSubtopic.error as Error).message} />}
        </form>
      </section>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="min-h-10 rounded-lg border border-ink-200 px-3"
      />
    </label>
  );
}

function FileField({ name, label }: { name: string; label: string }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-ink-700">{label}</span>
      <input name={name} type="file" accept="application/pdf,.pdf" required className="text-sm" />
    </label>
  );
}

function LevelSelect({
  levels,
  name,
}: {
  levels?: { id: string; name: string; slug: string }[];
  name: string;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium text-ink-700">Exam level</span>
      <select name={name} className="min-h-10 rounded-lg border border-ink-200 bg-white px-3" required>
        {(levels ?? []).map((level) => (
          <option key={level.id} value={level.slug}>
            {level.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Submit({ busy, label }: { busy: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={busy}
      className="mt-1 inline-flex min-h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-60"
    >
      {busy ? "Saving…" : label}
    </button>
  );
}
