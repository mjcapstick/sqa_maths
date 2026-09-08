import { useState, lazy, Suspense } from "react";

const PDFModal = lazy(() => import("./PDFModal"));

type Props = {
  url: string;
  label: string;
  variant?: "primary" | "ghost";
  icon?: React.ReactNode;
};

export default function PDFButton({ url, label, variant = "ghost", icon }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all"
        style={
          variant === "primary"
            ? { backgroundColor: "var(--color-accent)", color: "#fff" }
            : {
                backgroundColor: "var(--color-surface-raised)",
                color: "var(--color-ink-muted)",
                border: "1px solid var(--color-border)",
              }
        }
        aria-label={label}
      >
        {icon ?? <FileIcon />}
        {label}
      </button>

      {open && (
        <Suspense fallback={null}>
          <PDFModal url={url} title={label} onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

function FileIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
