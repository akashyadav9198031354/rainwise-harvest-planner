import { Link } from "@tanstack/react-router";
import { Droplets, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";
import { useLang } from "@/lib/i18n";

const links = [
  { to: "/calculator", key: "nav.calculator" },
  { to: "/recommendations", key: "nav.plan" },
  { to: "/impact", key: "nav.impact" },
  { to: "/safety", key: "nav.safety" },
] as const;

export function Navbar() {
  const { t, lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold text-foreground">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Droplets className="h-4 w-4" aria-hidden />
          </span>
          Rain2Resource
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <ul className="flex flex-wrap items-center gap-1 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="rounded-full px-3 py-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  activeProps={{ className: "bg-secondary !text-foreground font-medium" }}
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex overflow-hidden rounded-full border border-border text-sm" role="group" aria-label={t("nav.langLabel")}>
            <button
              type="button"
              onClick={() => setLang("en")}
              aria-pressed={lang === "en"}
              className={`px-3 py-1.5 transition-colors ${lang === "en" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary"}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("hi")}
              aria-pressed={lang === "hi"}
              className={`px-3 py-1.5 transition-colors ${lang === "hi" ? "bg-primary text-primary-foreground font-medium" : "text-muted-foreground hover:bg-secondary"}`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  const { t } = useLang();
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        <p className="font-display font-semibold text-foreground">{t("footer.tagline")}</p>
        <p className="mt-2 max-w-2xl">
          {t("footer.disclaimer")} {t("footer.privacy")}
        </p>
      </div>
    </footer>
  );
}

export function SafetyNotice({ children, title }: { children: ReactNode; title?: string }) {
  const { t } = useLang();
  return (
    <div role="note" className="flex gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-foreground">
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-warning" aria-hidden />
      <div>
        <p className="font-semibold">{title ?? t("note.default")}</p>
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
