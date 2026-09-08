import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { api } from "../api";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type PdfTarget = { fileId: string; title: string };

type PdfContextValue = {
  openPdf: (target: PdfTarget) => void;
};

const PdfContext = createContext<PdfContextValue | null>(null);

export function usePdfModal() {
  const ctx = useContext(PdfContext);
  if (!ctx) throw new Error("usePdfModal must be used within PdfProvider");
  return ctx;
}

export function PdfProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<PdfTarget | null>(null);
  const openPdf = useCallback((next: PdfTarget) => setTarget(next), []);
  return (
    <PdfContext.Provider value={{ openPdf }}>
      {children}
      {target && <PdfModal target={target} onClose={() => setTarget(null)} />}
    </PdfContext.Provider>
  );
}

function PdfModal({ target, onClose }: { target: PdfTarget; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [page, setPage] = useState(1);
  const [width, setWidth] = useState(640);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const measure = () => setWidth(Math.min(720, window.innerWidth - 48));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setUrl(null);
    setError(null);
    setNumPages(0);
    setPage(1);
    api
      .fileUrl(target.fileId)
      .then((signed) => {
        if (!cancelled) setUrl(signed.url);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [target.fileId]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-ink-950/40"
        aria-label="Close PDF preview"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col rounded-t-2xl bg-white shadow-soft sm:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-ink-200 px-4 py-3">
          <h2 id={titleId} className="truncate text-sm font-semibold text-ink-950">
            {target.title}
          </h2>
          <div className="flex shrink-0 items-center gap-2">
            {url && (
              <a
                href={url}
                download
                className="inline-flex min-h-10 items-center rounded-lg bg-accent px-3 text-sm font-medium text-white hover:bg-accent-hover"
              >
                Download
              </a>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-ink-200 text-ink-700 hover:bg-ink-100"
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </div>
        <div className="min-h-[50vh] overflow-auto bg-ink-100 px-3 py-4">
          {error && <p className="text-sm text-red-700">{error}</p>}
          {!error && !url && <p className="text-sm text-ink-500">Fetching a signed link…</p>}
          {url && (
            <div className="mx-auto w-fit overflow-hidden rounded-lg bg-white shadow-soft">
              <Document
                file={url}
                onLoadSuccess={({ numPages: next }) => setNumPages(next)}
                loading={<p className="p-8 text-sm text-ink-500">Rendering PDF…</p>}
                error={<p className="p-8 text-sm text-red-700">Could not render this PDF. Use Download instead.</p>}
              >
                <Page pageNumber={page} width={width} />
              </Document>
            </div>
          )}
        </div>
        {numPages > 1 && (
          <div className="flex items-center justify-between border-t border-ink-200 px-4 py-2 text-sm">
            <button
              type="button"
              className="rounded-lg px-3 py-2 font-medium text-ink-700 disabled:text-ink-400"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>
            <span className="text-ink-500">
              Page {page} of {numPages}
            </span>
            <button
              type="button"
              className="rounded-lg px-3 py-2 font-medium text-ink-700 disabled:text-ink-400"
              disabled={page >= numPages}
              onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
