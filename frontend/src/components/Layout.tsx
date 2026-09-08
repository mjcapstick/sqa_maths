import { NavLink, Outlet, useParams } from "react-router-dom";
import { BookIcon, DocumentIcon } from "./ModeTag";

const navClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-ink-100 text-ink-950" : "text-ink-700 hover:bg-ink-100 hover:text-ink-950",
  ].join(" ");

export function Layout() {
  const { examLevel } = useParams();

  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-20 border-b border-ink-200/80 bg-ink-50/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold tracking-tight text-ink-950">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-xs font-bold text-white">
              M
            </span>
            SQA Maths
          </NavLink>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            <NavLink to="/" className={navClass} end>
              Levels
            </NavLink>
            {examLevel && (
              <>
                <NavLink to={`/${examLevel}/past-papers`} className={navClass}>
                  Past papers
                </NavLink>
                <NavLink to={`/${examLevel}/topics`} className={navClass}>
                  By topic
                </NavLink>
              </>
            )}
            <NavLink to="/admin" className={navClass}>
              Upload
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-24 pt-8 md:pb-12">
        <Outlet />
      </main>

      <nav
        className="fixed bottom-0 left-0 right-0 z-20 border-t border-ink-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
        aria-label="Mobile"
      >
        <div className="mx-auto grid max-w-5xl grid-cols-3">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? "text-accent" : "text-ink-500"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to={examLevel ? `/${examLevel}/past-papers` : "/"}
            className={({ isActive }) =>
              `flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? "text-accent" : "text-ink-500"
              }`
            }
          >
            <DocumentIcon />
            Papers
          </NavLink>
          <NavLink
            to={examLevel ? `/${examLevel}/topics` : "/"}
            className={({ isActive }) =>
              `flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-xs font-medium ${
                isActive ? "text-accent" : "text-ink-500"
              }`
            }
          >
            <BookIcon />
            Topics
          </NavLink>
        </div>
      </nav>
    </div>
  );
}
