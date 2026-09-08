import { useEffect, useRef, useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Props = {
  url: string;
  title: string;
  onClose: () => void;
};

export default function PDFModal({ url, title, onClose }: Props) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Trap scroll on body
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Measure container for responsive page width
  const measureContainer = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth - 32);
    }
  }, []);

  useEffect(() => {
    measureContainer();
    const ro = new ResizeObserver(measureContainer);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [measureContainer]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) onClose();
  };

  return (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(15,23,42,0.6)", backdropFilter: "blur(4px)" }}
      role="dialog"
      aria-modal="true"
      aria-label={`PDF viewer: ${title}`}
    >
      <div
        className="flex flex-col w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl"
        style={{ backgroundColor: "var(--color-surface)", maxHeight: "90vh" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: "var(--color-border)" }}
        >
          <span
            className="text-sm font-medium truncate"
            style={{ color: "var(--color-ink)" }}
          >
            {title}
          </span>
          <div className="flex items-center gap-2 ml-4 shrink-0">
            <a
              href={url}
              download
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "#fff",
              }}
              aria-label={`Download ${title}`}
            >
              <DownloadIcon />
              Download
            </a>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-md transition-colors hover:bg-slate-100"
              style={{ color: "var(--color-ink-muted)" }}
              aria-label="Close PDF viewer"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* PDF area */}
        <div
          ref={containerRef}
          className="overflow-y-auto p-4"
          style={{ backgroundColor: "var(--color-surface-sunken)" }}
        >
          {containerWidth > 0 && (
            <Document
              file={url}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              loading={
                <div className="flex items-center justify-center h-64">
                  <Spinner />
                </div>
              }
              error={
                <div
                  className="flex flex-col items-center justify-center h-64 gap-3"
                  style={{ color: "var(--color-ink-muted)" }}
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm">Could not load PDF. Try the download button.</p>
                </div>
              }
            >
              {Array.from({ length: numPages ?? 0 }, (_, i) => (
                <Page
                  key={i + 1}
                  pageNumber={i + 1}
                  width={containerWidth}
                  className="mb-4 rounded shadow-sm overflow-hidden"
                  renderAnnotationLayer
                  renderTextLayer
                />
              ))}
            </Document>
          )}
        </div>

        {/* Page count footer */}
        {numPages && (
          <div
            className="px-5 py-2 border-t text-xs shrink-0"
            style={{
              borderColor: "var(--color-border)",
              color: "var(--color-ink-faint)",
            }}
          >
            {numPages} {numPages === 1 ? "page" : "pages"}
          </div>
        )}
      </div>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-accent)"
      strokeWidth="2.5"
      aria-label="Loading"
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}
