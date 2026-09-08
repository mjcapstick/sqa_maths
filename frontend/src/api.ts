import type { ExamLevel, PastPaper, SignedUrl, Subtopic, Topic } from "./types";

const API = "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, init);
  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = (await response.json()) as { detail?: string };
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
      /* ignore */
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  examLevels: () => request<ExamLevel[]>("/api/exam-levels"),
  examLevel: (slug: string) => request<ExamLevel>(`/api/exam-levels/${slug}`),
  pastPapers: (slug: string) => request<PastPaper[]>(`/api/exam-levels/${slug}/past-papers`),
  topics: (slug: string) => request<Topic[]>(`/api/exam-levels/${slug}/topics`),
  topic: (slug: string, examLevel: string) =>
    request<Topic>(`/api/topics/${slug}?exam_level=${encodeURIComponent(examLevel)}`),
  subtopics: (slug: string, examLevel: string) =>
    request<Subtopic[]>(`/api/topics/${slug}/subtopics?exam_level=${encodeURIComponent(examLevel)}`),
  fileUrl: (fileId: string) => request<SignedUrl>(`/api/files/${fileId}/url`),
};
