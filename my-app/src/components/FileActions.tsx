import type { FileMeta } from "../types";
import { usePdfModal } from "./PdfModal";

export function FileActions({
  file,
  previewLabel,
}: {
  file: FileMeta | null;
  previewLabel: string;
}) {
  const { openPdf } = usePdfModal();
  if (!file) {
    return (
      <span className="inline-flex min-h-10 items-center rounded-lg border border-dashed border-ink-200 px-3 text-sm text-ink-400">
        {previewLabel} unavailable
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openPdf({ fileId: file.id, title: previewLabel })}
      className={`inline-flex min-h-10 items-center justify-center rounded-lg px-3.5 text-sm font-medium ${
        previewLabel === "Paper" || previewLabel === "Workbook"
          ? "bg-ink-950 text-white hover:bg-ink-700"
          : "border border-ink-200 bg-white text-ink-900 hover:bg-ink-100"
      }`}
    >
      {previewLabel}
    </button>
  );
}
