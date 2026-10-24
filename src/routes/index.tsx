import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, CloudRain, Droplets, LineChart, Recycle, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafetyNotice } from "@/components/SiteChrome";
import { useRecords, useSites } from "@/lib/store";
import { buildEstimate, fmtL } from "@/lib/rainwater";
import { useLang } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Rain2Resource — Catch the Rain. Use It Again." },
      { name: "description", content: "Estimate how much rainwater your roof can capture, plan storage and safe reuse, and track real impact." },
      { property: "og:title", content: "Rain2Resource — Catch the Rain. Use It Again." },
      { property: "og:description", content: "Site-specific urban rainwater planning: estimate, store, reuse safely, and track impact." },
    ],
  }),
  component: Home,
});

const steps = [
  { icon: CloudRain, tk: "home.step1t", dk: "home.step1d" },
  { icon: Calculator, tk: "home.step2t", dk: "home.step2d" },
  { icon: Recycle, tk: "home.step3t", dk: "home.step3d" },
  { icon: LineChart, tk: "home.step4t", dk: "home.step4d" },
] as const;

function Home() {
  const { sites, active } = useSites();
  const { records } = useRecords();
  const { t } = useLang();
  const est = active ? safeEstimate(active) : null;
  const real = records.filter((r) => !r.isDemoData);
  const collected = real.reduce((a, r) => a + r.actualCollectedLitres, 0);
  const reused = real.reduce((a, r) => a + r.actualReusedLitres, 0);

  return (
    <>
      <section className="bg-rain text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.3fr_1fr] md:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-background/15 px-3 py-1 text-sm">
              <Droplets className="h-4 w-4" aria-hidden /> {t("home.badge")}
            </p>
            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl">
              {t("home.h1a")}
              <br />
              {t("home.h1b")}
            </h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">{t("home.sub")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="secondary">
                <Link to="/calculator">
                  {t("home.cta1")} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-background/15 hover:text-primary-foreground">
                <Link to="/safety">{t("home.cta2")}</Link>
              </Button>
            </div>
          </div>
          <div className="self-end rounded-3xl bg-background/10 p-6 backdrop-blur">
            <p className="text-sm opacity-80">{t("home.exampleLabel")}</p>
            <p className="mt-2 font-mono text-sm opacity-90">800 mm × 100 m² × 0.80</p>
            <p className="mt-1 font-display text-4xl font-bold">64,000 L / year</p>
            <p className="mt-3 text-sm opacity-80">{t("home.exampleNote")}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold">{t("home.summary")}</h2>
        {sites.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
            {t("home.noSitePre")}{" "}
            <Link to="/calculator" className="font-medium text-primary underline">{t("home.noSiteLink")}</Link>{" "}
            {t("home.noSitePost")}
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Summary label={t("home.potential", { name: active?.name ?? "" })} value={est ? `${fmtL(est.annualHarvestLitres)}/yr` : "—"} />
            <Summary label={t("home.collected")} value={fmtL(collected)} />
            <Summary label={t("home.reused")} value={fmtL(reused)} />
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <h2 className="font-display text-2xl font-bold">{t("home.how")}</h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.tk} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="font-display text-sm font-bold text-primary">0{i + 1}</span>
                <s.icon className="h-5 w-5 text-primary" aria-hidden />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{t(s.tk)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(s.dk)}</p>
            </li>
          ))}
        </ol>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild variant="outline"><Link to="/recommendations"><Wrench className="mr-1 h-4 w-4" />{t("home.maintLink")}</Link></Button>
          <Button asChild variant="outline"><Link to="/impact"><LineChart className="mr-1 h-4 w-4" />{t("home.impactLink")}</Link></Button>
        </div>
        <div className="mt-10">
          <SafetyNotice title={t("home.limitsTitle")}>
            {t("home.limitsText")}
          </SafetyNotice>
        </div>
      </section>
    </>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-3xl font-bold">{value}</p>
    </div>
  );
}

function safeEstimate(s: Parameters<typeof buildEstimate>[0]) {
  try {
    return buildEstimate(s);
  } catch {
    return null;
  }
}
