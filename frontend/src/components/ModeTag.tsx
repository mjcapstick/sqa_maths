export function ModeTag({ mode }: { mode: "papers" | "topics" }) {
  if (mode === "papers") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-papers-soft px-2.5 py-0.5 text-xs font-medium text-papers">
        <DocumentIcon />
        Past papers
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-topics-soft px-2.5 py-0.5 text-xs font-medium text-topics">
      <BookIcon />
      Questions by topic
    </span>
  );
}

export function DocumentIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function BookIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
