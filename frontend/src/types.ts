export type ExamLevel = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type FileMeta = {
  id: string;
  original_filename: string;
  content_type: string;
  size_bytes: number;
  uploaded_at: string;
};

export type PastPaper = {
  id: string;
  year: number;
  diet: string;
  paper_number: number;
  paper_file: FileMeta | null;
  solutions_file: FileMeta | null;
};

export type Topic = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  exam_level_slug: string;
  subtopic_count: number;
};

export type Subtopic = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  workbook_file: FileMeta | null;
  answers_file: FileMeta | null;
};

export type SignedUrl = {
  url: string;
  expires_in: number;
  filename: string;
  content_type: string;
};
