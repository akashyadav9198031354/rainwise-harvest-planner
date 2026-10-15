import { Link } from "@tanstack/react-router";
import { Droplets, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

const links = [
  { to: "/calculator", label: "Calculator" },
  { to: "/recommendations", label: "Plan" },
  { to: "/impact", label: "Impact" },
  { to: "/safety", label: "Learn & Safety" },
] as const;

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Droplets className="h-4 w-4" aria-hidden />
          </span>
          Rain2Resource
        </Link>
        <ul className="flex flex-wrap items-center gap-1 text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary !text-foreground font-medium" }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-display font-semibold text-foreground">Rain2Resource — Catch the Rain. Use It Again.</p>
        <p className="mt-2 max-w-2xl">
          Estimates are planning guidance only. Harvested rainwater is not safe to drink without treatment and testing.
          Your data stays in this browser.
        </p>
      </div>
    </footer>
  );
}

export function SafetyNotice({ children, title = "Safety note" }: { children: ReactNode; title?: string }) {
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="mt-1 text-muted-foreground">{children}</div>
      </div>
    </div>
  );
}

export function MetricCard({ label, value, hint, icon }: { label: string; value: string; hint?: string; icon?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{label}</span>
        {icon}
      </div>
      <p className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PageHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-8">
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-muted-foreground">{children}</div>}
    </div>
  );
}
