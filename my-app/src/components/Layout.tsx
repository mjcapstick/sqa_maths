import { Link } from "react-router";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {children}
      </main>
      <footer
        className="border-t py-6 text-center text-xs"
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-ink-faint)",
        }}
      >
        SQA Maths Study · prototype
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold text-sm tracking-tight"
          style={{ color: "var(--color-ink)" }}
          aria-label="SQA Maths Study home"
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg text-sm font-bold"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
            aria-hidden="true"
          >
            ∑
          </span>
          SQA Maths
        </Link>

        <nav className="flex items-center gap-1" aria-label="Site">
          <Link
            to="/about"
            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{ color: "var(--color-ink-muted)" }}
          >
            About Us
          </Link>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            ☕ Buy Us A Coffee
          </a>
        </nav>
      </div>
    </header>
  );
}
