import { Link, useParams } from "react-router-dom";

export function ModeToggle({ active }: { active: "papers" | "topics" }) {
  const { examLevel = "" } = useParams();
  const base = "flex-1 min-h-11 rounded-lg px-3 text-sm font-medium text-center inline-flex items-center justify-center";
  return (
    <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-ink-100 p-1" role="tablist" aria-label="Content mode">
      <Link
        role="tab"
        aria-selected={active === "papers"}
        to={`/${examLevel}/past-papers`}
        className={`${base} ${active === "papers" ? "bg-white text-ink-950 shadow-soft" : "text-ink-500"}`}
      >
        Past papers
      </Link>
      <Link
        role="tab"
        aria-selected={active === "topics"}
        to={`/${examLevel}/topics`}
        className={`${base} ${active === "topics" ? "bg-white text-ink-950 shadow-soft" : "text-ink-500"}`}
      >
        By topic
      </Link>
    </div>
  );
}
