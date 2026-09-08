export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 py-10 text-ink-500" role="status" aria-live="polite">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-200 border-t-accent" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
      role="alert"
    >
      {message}
    </div>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-5 py-10 text-center">
      <p className="text-base font-medium text-ink-900">{title}</p>
      <p className="mt-1 text-sm text-ink-500">{body}</p>
    </div>
  );
}
