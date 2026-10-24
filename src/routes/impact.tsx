import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MetricCard, PageHeader } from "@/components/SiteChrome";
import { buildEstimate, fmtL, validateImpact, type ImpactRecord } from "@/lib/rainwater";
import { useLang } from "@/lib/i18n";
import { uid, useRecords, useSites } from "@/lib/store";

export const Route = createFileRoute("/impact")({
  head: () => ({
    meta: [
      { title: "Impact Tracker — Rain2Resource" },
      { name: "description", content: "Record rainwater actually collected and reused, and compare it with your estimate." },
      { property: "og:title", content: "Impact Tracker — Rain2Resource" },
      { property: "og:description", content: "Measured collection and reuse, kept separate from estimates." },
    ],
  }),
  component: Impact,
});

const today = () => new Date().toISOString().slice(0, 10);

function Impact() {
  const { sites, active, setActive } = useSites();
  const { records, add, addMany, remove, clearDemo } = useRecords();
  const { t, err } = useLang();
  const [f, setF] = useState({ date: today(), collected: "", reused: "", notes: "" });
  const [errors, setErrors] = useState<ReturnType<typeof validateImpact>>({});

  if (!active) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <PageHeader eyebrow={t("imp.step")} title={t("imp.title")} />
        <p className="text-muted-foreground">{t("imp.noSite")}</p>
        <Button asChild className="mt-6"><Link to="/calculator">{t("imp.create")}</Link></Button>
      </div>
    );
  }

  const siteRecords = records.filter((r) => r.siteId === active.id).sort((a, b) => a.date.localeCompare(b.date));
  const real = siteRecords.filter((r) => !r.isDemoData);
  const hasDemo = siteRecords.some((r) => r.isDemoData);
  const collected = real.reduce((a, r) => a + r.actualCollectedLitres, 0);
  const reused = real.reduce((a, r) => a + r.actualReusedLitres, 0);
  let estimate = 0;
  try { estimate = buildEstimate(active).annualHarvestLitres; } catch { estimate = 0; }

  const year = new Date().getFullYear().toString();
  const ytd = real.filter((r) => r.date.startsWith(year)).reduce((a, r) => a + r.actualCollectedLitres, 0);
  const monthsSoFar = new Date().getMonth() + 1;
  const proratedEstimate = (estimate * monthsSoFar) / 12;

  const byMonth = new Map<string, { month: string; collected: number; reused: number }>();
  for (const r of siteRecords) {
    const m = r.date.slice(0, 7);
    const row = byMonth.get(m) ?? { month: m, collected: 0, reused: 0 };
    row.collected += r.actualCollectedLitres;
    row.reused += r.actualReusedLitres;
    byMonth.set(m, row);
  }
  const chart = [...byMonth.values()];

  function submit(e: FormEvent) {
    e.preventDefault();
    const errs = validateImpact(f);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    const ok = add({
      id: uid(), siteId: active!.id, date: f.date, actualCollectedLitres: Number(f.collected),
      actualReusedLitres: Number(f.reused), notes: f.notes.trim() || undefined, isDemoData: false, createdAt: new Date().toISOString(),
    });
    if (ok) {
      toast.success(t("imp.saved"));
      setF({ date: today(), collected: "", reused: "", notes: "" });
    } else toast.error(t("imp.saveErr"));
  }

  function loadDemo() {
    const y = new Date().getFullYear() - 1;
    const demo: ImpactRecord[] = [6, 7, 8, 9].map((m, i) => ({
      id: uid(), siteId: active!.id, date: `${y}-0${m}-15`, actualCollectedLitres: [4200, 9800, 8600, 3100][i]!,
      actualReusedLitres: [3500, 7200, 7900, 3400][i]!, notes: "Demo data — not a real measurement", isDemoData: true,
      createdAt: new Date().toISOString(),
    }));
    addMany(demo);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader eyebrow={t("imp.step")} title={t("imp.title")}>
        {t("imp.sub")}
      </PageHeader>

      {sites.length > 1 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("imp.siteLabel")}</span>
          {sites.map((s) => (
            <Button key={s.id} size="sm" variant={s.id === active.id ? "default" : "outline"} onClick={() => setActive(s.id)}>{s.name}</Button>
          ))}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label={t("imp.m1")} value={fmtL(estimate)} hint={t("imp.m1hint")} />
        <MetricCard label={t("imp.m2")} value={fmtL(collected)} hint={t("imp.m2hint", { n: real.length })} />
        <MetricCard label={t("imp.m3")} value={fmtL(reused)} hint={collected > 0 ? t("imp.m3ok", { pct: Math.round((reused / collected) * 100) }) : t("imp.m3none")} />
        <MetricCard
          label={t("imp.m4", { year })}
          value={ytd > 0 ? `${ytd >= proratedEstimate ? "+" : "−"}${fmtL(Math.abs(ytd - proratedEstimate))}` : "—"}
          hint={ytd > 0 ? t("imp.m4hint", { ytd: fmtL(ytd), pror: fmtL(proratedEstimate) }) : t("imp.m4wait")}
        />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <form onSubmit={submit} noValidate className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">{t("imp.formTitle")}</h2>
          <div className="space-y-1.5">
            <Label htmlFor="date">{t("imp.date")}</Label>
            <Input id="date" type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} aria-invalid={!!errors.date} />
            {errors.date && <p className="text-xs font-medium text-destructive">⚠ {err(errors.date)}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="collected">{t("imp.collected")}</Label>
              <Input id="collected" type="number" min={0} value={f.collected} onChange={(e) => setF({ ...f, collected: e.target.value })} aria-invalid={!!errors.collected} />
              {errors.collected && <p className="text-xs font-medium text-destructive">⚠ {err(errors.collected)}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="reused">{t("imp.reused")}</Label>
              <Input id="reused" type="number" min={0} value={f.reused} onChange={(e) => setF({ ...f, reused: e.target.value })} aria-invalid={!!errors.reused} />
              {errors.reused && <p className="text-xs font-medium text-destructive">⚠ {err(errors.reused)}</p>}
            </div>
          </div>
          {Number(f.reused) > Number(f.collected) && f.collected !== "" && (
            <p className="text-xs text-muted-foreground">
              {t("imp.reuseHigher")}
            </p>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="notes">{t("imp.notes")}</Label>
            <Textarea id="notes" maxLength={300} value={f.notes} placeholder={t("imp.notesPh")} onChange={(e) => setF({ ...f, notes: e.target.value })} />
            {errors.notes && <p className="text-xs font-medium text-destructive">⚠ {err(errors.notes)}</p>}
          </div>
          <Button type="submit">{t("imp.saveRecord")}</Button>
        </form>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-display text-xl font-semibold">{t("imp.trend")}</h2>
            {hasDemo ? (
              <Button size="sm" variant="outline" onClick={() => clearDemo(active.id)}>{t("imp.removeDemo")}</Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={loadDemo}>{t("imp.loadDemo")}</Button>
            )}
          </div>
          {hasDemo && <p className="mt-2 rounded-md bg-warning/15 px-3 py-1.5 text-xs font-medium">{t("imp.demoBanner")}</p>}
          {chart.length === 0 ? (
            <div className="mt-6 grid h-64 place-items-center rounded-xl border border-dashed border-border text-center text-sm text-muted-foreground">
              <div>{t("imp.emptyChart1")}<br />{t("imp.emptyChart2")}</div>
            </div>
          ) : (
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chart}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="month" fontSize={12} stroke="var(--color-muted-foreground)" />
                  <YAxis fontSize={12} stroke="var(--color-muted-foreground)" />
                  <Tooltip formatter={(v: number) => fmtL(v)} />
                  <Legend />
                  <Bar dataKey="collected" name={t("imp.legendCollected")} fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="reused" name={t("imp.legendReused")} fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      {siteRecords.length > 0 && (
        <section className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead className="bg-secondary text-left">
              <tr><th className="p-3">{t("imp.thDate")}</th><th className="p-3">{t("imp.thCollected")}</th><th className="p-3">{t("imp.thReused")}</th><th className="p-3">{t("imp.thNotes")}</th><th className="p-3">{t("imp.thType")}</th><th className="p-3"><span className="sr-only">{t("imp.thActions")}</span></th></tr>
            </thead>
            <tbody>
              {[...siteRecords].reverse().map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{r.date}</td>
                  <td className="p-3">{fmtL(r.actualCollectedLitres)}</td>
                  <td className="p-3">{fmtL(r.actualReusedLitres)}</td>
                  <td className="p-3 text-muted-foreground">{r.notes ?? "—"}</td>
                  <td className="p-3">{r.isDemoData ? <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-semibold">DEMO</span> : <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold">{t("imp.badgeRecorded")}</span>}</td>
                  <td className="p-3 text-right">
                    <Button size="icon" variant="ghost" aria-label={t("imp.deleteAria", { date: r.date })} onClick={() => remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
