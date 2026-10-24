import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Droplets, Filter, Leaf, ShowerHead, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SafetyNotice } from "@/components/SiteChrome";
import { buildEstimate, fmtL, USES, type IntendedUse } from "@/lib/rainwater";
import { MAINT_HI, USES_HI, useLang } from "@/lib/i18n";
import { useMaintenance, useSites } from "@/lib/store";

export const Route = createFileRoute("/recommendations")({
  head: () => ({
    meta: [
      { title: "Collection, Reuse & Maintenance Plan — Rain2Resource" },
      { name: "description", content: "Collection system checklist, safe non-potable reuse, overflow guidance and a maintenance checklist." },
      { property: "og:title", content: "Collection, Reuse & Maintenance Plan — Rain2Resource" },
      { property: "og:description", content: "Practical, safety-first guidance for urban rainwater systems." },
    ],
  }),
  component: Recommendations,
});

const collection: [string, string][] = Array.from({ length: 8 }, (_, i) => [`rec.col${i + 1}t`, `rec.col${i + 1}d`]);

const reuse: { key: IntendedUse | "other"; icon: typeof Leaf; dk: string }[] = [
  { key: "gardening", icon: Leaf, dk: "rec.reuseGardeningD" },
  { key: "cleaning", icon: Sparkles, dk: "rec.reuseCleaningD" },
  { key: "flushing", icon: ShowerHead, dk: "rec.reuseFlushingD" },
  { key: "other", icon: Filter, dk: "rec.reuseOtherD" },
];

function Recommendations() {
  const { active } = useSites();
  const { items, toggle, reset } = useMaintenance();
  const { t, pick } = useLang();
  let est = null;
  try { est = active ? buildEstimate(active) : null; } catch { est = null; }
  const done = items.filter((i) => i.completed).length;
  const focus = active?.intendedUse;

  const reuseTitle = (key: IntendedUse | "other") =>
    key === "other" ? t("rec.reuseOtherTitle") : pick(USES[key as IntendedUse], USES_HI[key] ?? USES[key as IntendedUse]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader eyebrow={t("rec.step")} title={t("rec.title")}>
        {t("rec.sub")}
      </PageHeader>

      {active && est ? (
        <div className="mb-8 rounded-2xl bg-rain p-6 text-primary-foreground">
          <p className="text-sm opacity-80">{t("rec.planFor", { name: active.name, location: active.location })}</p>
          <p className="mt-1 font-display text-2xl font-bold">
            {t("rec.planLine", {
              annual: fmtL(est.annualHarvestLitres),
              tank: fmtL(est.preliminaryTankLitres),
              use: pick(USES[active.intendedUse], USES_HI[active.intendedUse] ?? USES[active.intendedUse]),
            })}
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
          {t("rec.noSitePre")} <Link to="/calculator" className="font-medium text-primary underline">{t("rec.noSiteLink")}</Link> {t("rec.noSitePost")}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Droplets className="h-5 w-5 text-primary" />{t("rec.collectionTitle")}</h2>
          <ol className="mt-4 space-y-3">
            {collection.map(([tk, dk], i) => (
              <li key={tk} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">{i + 1}</span>
                <div><p className="font-medium">{t(tk)}</p><p className="text-sm text-muted-foreground">{t(dk)}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">{t("rec.storageTitle")}</p>
            {t("rec.storageText")}
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold">{t("rec.reuseTitle")}</h2>
            <ul className="mt-4 space-y-3">
              {reuse.map((r) => {
                const highlighted = focus === r.key || (focus === "mixed" && r.key !== "other");
                return (
                  <li key={r.key} className={`flex gap-3 rounded-xl border p-3 ${highlighted ? "border-primary bg-secondary" : "border-border"}`}>
                    <r.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="font-medium">{reuseTitle(r.key)} {highlighted && <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">{t("rec.yourUse")}</span>}</p>
                      <p className="text-sm text-muted-foreground">{t(r.dk)}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <SafetyNotice title={t("safe.waterTitle")}>
            {t("rec.notDrinkPre")}<strong>{t("rec.notDrinkStrong")}</strong>{t("rec.notDrinkPost")}
          </SafetyNotice>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Waves className="h-5 w-5 text-primary" />{t("rec.overflowTitle")}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            <li>{t("rec.ov1")}</li>
            <li>{t("rec.ov2")}</li>
            <li>{t("rec.ov3")}</li>
            <li>{t("rec.ov4")}</li>
          </ul>
          <div className="mt-4">
            <SafetyNotice title={t("rec.rechargeTitle")}>
              {t("rec.rechargeText")}
            </SafetyNotice>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">{t("rec.maintTitle")}</h2>
            <span className="text-sm text-muted-foreground">{t("rec.doneCount", { done, total: items.length })}</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={done} aria-valuemin={0} aria-valuemax={items.length}>
            <div className="h-full bg-success transition-all" style={{ width: `${(done / items.length) * 100}%` }} />
          </div>
          <ul className="mt-4 space-y-2">
            {items.map((i) => (
              <li key={i.id}>
                <button type="button" onClick={() => toggle(i.id)} aria-pressed={i.completed}
                  className="flex w-full gap-3 rounded-lg p-2 text-left hover:bg-secondary">
                  {i.completed ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden /> : <Circle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />}
                  <span>
                    <span className={`font-medium ${i.completed ? "line-through opacity-70" : ""}`}>{pick(i.title, MAINT_HI[i.id]?.title ?? i.title)}</span>
                    <span className="sr-only">{i.completed ? t("rec.srDone") : t("rec.srNotDone")}</span>
                    <span className="block text-sm text-muted-foreground">{pick(i.description, MAINT_HI[i.id]?.description ?? i.description)}</span>
                    {i.completedAt && <span className="block text-xs text-success">{t("rec.doneAt", { date: new Date(i.completedAt).toLocaleDateString() })}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">{t("rec.maintNote")}</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={reset}>{t("rec.reset")}</Button>
        </section>
      </div>

      <div className="mt-10 flex justify-end">
        <Button asChild><Link to="/impact">{t("rec.startTracking")}</Link></Button>
      </div>
    </div>
  );
}
