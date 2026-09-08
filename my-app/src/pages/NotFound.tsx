import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-4">
      <p className="text-6xl font-bold tabular-nums" style={{ color: "var(--color-border)" }}>
        404
      </p>
      <p className="text-base" style={{ color: "var(--color-ink-muted)" }}>
        Page not found.
      </p>
      <Link
        to="/"
        className="text-sm font-medium underline underline-offset-2"
        style={{ color: "var(--color-accent)" }}
      >
        Back to home
      </Link>
    </div>
  );
}
