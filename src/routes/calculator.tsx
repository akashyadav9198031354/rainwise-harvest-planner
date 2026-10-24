import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Calculator as CalcIcon, Droplet, Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MetricCard, PageHeader, SafetyNotice } from "@/components/SiteChrome";
import {
  buildEstimate, fmtL, fmtL2, SITE_TYPES, SURFACE_COEFFICIENTS, USES, validateSiteInputs,
  type FormErrors, type IntendedUse, type RainwaterEstimate, type SiteType, type SurfaceType,
} from "@/lib/rainwater";
import { ASSUMPTIONS_HI, SITE_TYPES_HI, SURFACE_HI, USES_HI, useLang } from "@/lib/i18n";
import { uid, useSites } from "@/lib/store";

export const Route = createFileRoute("/calculator")({
  head: () => ({
    meta: [
      { title: "Rainwater Potential Calculator — Rain2Resource" },
      { name: "description", content: "Estimate annual harvestable rainwater, daily average and preliminary storage for your roof." },
      { property: "og:title", content: "Rainwater Potential Calculator — Rain2Resource" },
      { property: "og:description", content: "Transparent rainfall × area × runoff estimate for your site." },
    ],
  }),
  component: CalculatorPage,
});

type FormState = {
  id: string | null; name: string; location: string; siteType: SiteType; annualRainfallMm: string;
  catchmentAreaM2: string; surfaceType: SurfaceType; runoffCoefficient: string; intendedUse: IntendedUse;
  storageDays: string; storageSpace: string; existingSystem: string;
};

const blank: FormState = {
  id: null, name: "", location: "", siteType: "home", annualRainfallMm: "", catchmentAreaM2: "",
  surfaceType: "concrete", runoffCoefficient: "0.75", intendedUse: "gardening", storageDays: "7",
  storageSpace: "", existingSystem: "",
};

const selectCls = "h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs focus-visible:outline-2";

function CalculatorPage() {
  const { sites, active, save, setActive, ready } = useSites();
  const { t, err, pick } = useLang();
  const [f, setF] = useState<FormState>(blank);
  const [errors, setErrors] = useState<FormErrors>({});
  const [result, setResult] = useState<RainwaterEstimate | null>(null);

  useEffect(() => {
    if (ready && active && f.id === null && f.name === "") load(active.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  function load(id: string) {
    const s = sites.find((x) => x.id === id);
    if (!s) return;
    setF({
      id: s.id, name: s.name, location: s.location, siteType: s.siteType, annualRainfallMm: String(s.annualRainfallMm),
      catchmentAreaM2: String(s.catchmentAreaM2), surfaceType: s.surfaceType, runoffCoefficient: String(s.runoffCoefficient),
      intendedUse: s.intendedUse, storageDays: String(s.storageDays), storageSpace: s.storageSpace ?? "", existingSystem: s.existingSystem ?? "",
    });
    setActive(id);
    setErrors({});
    setResult(null);
  }

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setF((p) => ({ ...p, [k]: v }));

  function compute(e?: FormEvent) {
    e?.preventDefault();
    const errs = validateSiteInputs(f);
    setErrors(errs);
    if (Object.keys(errs).length) {
      setResult(null);
      return null;
    }
    const r = buildEstimate({
      annualRainfallMm: Number(f.annualRainfallMm), catchmentAreaM2: Number(f.catchmentAreaM2),
      runoffCoefficient: Number(f.runoffCoefficient), storageDays: Number(f.storageDays),
    });
    setResult(r);
    return r;
  }

  function saveSite() {
    if (!compute()) return;
    const now = new Date().toISOString();
    const existing = sites.find((s) => s.id === f.id);
    const id = f.id ?? uid();
    const ok = save({
      id, name: f.name.trim(), location: f.location.trim(), siteType: f.siteType,
      annualRainfallMm: Number(f.annualRainfallMm), catchmentAreaM2: Number(f.catchmentAreaM2),
      surfaceType: f.surfaceType, runoffCoefficient: Number(f.runoffCoefficient), intendedUse: f.intendedUse,
      storageDays: Number(f.storageDays), storageSpace: f.storageSpace.trim().slice(0, 200),
      existingSystem: f.existingSystem.trim().slice(0, 200), createdAt: existing?.createdAt ?? now, updatedAt: now,
    });
    setF((p) => ({ ...p, id }));
    if (ok) toast.success(t("toast.saveOk"));
    else toast.error(t("toast.saveErr"));
  }

  const surfaceLabel = (k: SurfaceType) => pick(SURFACE_COEFFICIENTS[k].label, SURFACE_HI[k] ?? SURFACE_COEFFICIENTS[k].label);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader eyebrow={t("calc.step")} title={t("calc.title")}>
        {t("calc.sub")}
      </PageHeader>

      {sites.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("calc.savedSites")}</span>
          {sites.map((s) => (
            <Button key={s.id} size="sm" variant={s.id === f.id ? "default" : "outline"} onClick={() => load(s.id)}>{s.name}</Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => { setF(blank); setResult(null); setErrors({}); }}>{t("calc.newSite")}</Button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={compute} noValidate className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-semibold">{t("calc.legendProfile")}</legend>
            <Field id="name" label={t("calc.name")} error={errors.name ? err(errors.name) : undefined}>
              <Input id="name" value={f.name} maxLength={80} placeholder={t("calc.phName")} onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby="name-err" />
            </Field>
            <Field id="location" label={t("calc.location")} error={errors.location ? err(errors.location) : undefined}>
              <Input id="location" value={f.location} maxLength={100} placeholder={t("calc.phLocation")} onChange={(e) => set("location", e.target.value)} aria-invalid={!!errors.location} aria-describedby="location-err" />
            </Field>
            <Field id="siteType" label={t("calc.siteType")}>
              <select id="siteType" className={selectCls} value={f.siteType} onChange={(e) => set("siteType", e.target.value as SiteType)}>
                {Object.entries(SITE_TYPES).map(([k, v]) => <option key={k} value={k}>{pick(v, SITE_TYPES_HI[k] ?? v)}</option>)}
              </select>
            </Field>
            <Field id="storageSpace" label={t("calc.storageSpace")}>
              <Input id="storageSpace" value={f.storageSpace} maxLength={200} placeholder={t("calc.phStorage")} onChange={(e) => set("storageSpace", e.target.value)} />
            </Field>
            <Field id="existingSystem" label={t("calc.existingSystem")} className="sm:col-span-2">
              <Input id="existingSystem" value={f.existingSystem} maxLength={200} placeholder={t("calc.phExisting")} onChange={(e) => set("existingSystem", e.target.value)} />
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-semibold">{t("calc.legendRain")}</legend>
            <Field id="annualRainfallMm" label={t("calc.rainfall")} error={errors.annualRainfallMm ? err(errors.annualRainfallMm) : undefined}>
              <Input id="annualRainfallMm" type="number" inputMode="decimal" min={0} value={f.annualRainfallMm} placeholder={t("calc.phRainfall")} onChange={(e) => set("annualRainfallMm", e.target.value)} aria-invalid={!!errors.annualRainfallMm} aria-describedby="annualRainfallMm-err" />
            </Field>
            <Field id="catchmentAreaM2" label={t("calc.area")} error={errors.catchmentAreaM2 ? err(errors.catchmentAreaM2) : undefined}>
              <Input id="catchmentAreaM2" type="number" inputMode="decimal" min={0} value={f.catchmentAreaM2} placeholder={t("calc.phArea")} onChange={(e) => set("catchmentAreaM2", e.target.value)} aria-invalid={!!errors.catchmentAreaM2} aria-describedby="catchmentAreaM2-err" />
            </Field>
            <Field id="surfaceType" label={t("calc.surface")}>
              <select id="surfaceType" className={selectCls} value={f.surfaceType}
                onChange={(e) => { const s = e.target.value as SurfaceType; setF((p) => ({ ...p, surfaceType: s, runoffCoefficient: String(SURFACE_COEFFICIENTS[s].value) })); }}>
                {Object.entries(SURFACE_COEFFICIENTS).map(([k, v]) => <option key={k} value={k}>{surfaceLabel(k as SurfaceType)} (≈{v.value})</option>)}
              </select>
            </Field>
            <Field id="runoffCoefficient" label={t("calc.runoff")} error={errors.runoffCoefficient ? err(errors.runoffCoefficient) : undefined}>
              <Input id="runoffCoefficient" type="number" step="0.05" min={0} max={1} value={f.runoffCoefficient} onChange={(e) => set("runoffCoefficient", e.target.value)} aria-invalid={!!errors.runoffCoefficient} aria-describedby="runoffCoefficient-err" />
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-semibold">{t("calc.legendUse")}</legend>
            <Field id="intendedUse" label={t("calc.use")}>
              <select id="intendedUse" className={selectCls} value={f.intendedUse} onChange={(e) => set("intendedUse", e.target.value as IntendedUse)}>
                {Object.entries(USES).map(([k, v]) => <option key={k} value={k}>{pick(v, USES_HI[k] ?? v)}</option>)}
              </select>
            </Field>
            <Field id="storageDays" label={t("calc.days")} error={errors.storageDays ? err(errors.storageDays) : undefined}>
              <Input id="storageDays" type="number" min={1} max={120} value={f.storageDays} onChange={(e) => set("storageDays", e.target.value)} aria-invalid={!!errors.storageDays} aria-describedby="storageDays-err" />
            </Field>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button type="submit"><CalcIcon className="mr-1 h-4 w-4" />{t("calc.calculate")}</Button>
            <Button type="button" variant="outline" onClick={saveSite}><Save className="mr-1 h-4 w-4" />{t("calc.save")}</Button>
          </div>
        </form>

        <section aria-live="polite" className="space-y-4">
          {!result ? (
            <div className="grid h-full min-h-64 place-items-center rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <div>
                <Droplet className="mx-auto h-8 w-8 text-primary" aria-hidden />
                <p className="mt-3">{t("calc.emptyPre")}<strong>{t("calc.emptyStrong")}</strong>{t("calc.emptyPost")}</p>
              </div>
            </div>
          ) : (
            <>
              <MetricCard label={t("calc.annual")} value={`${fmtL(result.annualHarvestLitres)}/yr`} hint={t("calc.m3hint", { m3: (result.annualHarvestLitres / 1000).toLocaleString("en-IN", { maximumFractionDigits: 1 }) })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard label={t("calc.daily")} value={`${fmtL2(result.averageDailyLitres)}/day`} hint={t("calc.dailyHint")} />
                <MetricCard label={t("calc.prelim")} value={fmtL(result.preliminaryTankLitres)} hint={t("calc.prelimHint", { days: f.storageDays })} />
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
                <p className="flex items-center gap-2 font-semibold"><Info className="h-4 w-4 text-primary" aria-hidden />{t("calc.formulaTitle")}</p>
                <p className="mt-2 rounded-md bg-secondary px-3 py-2 font-mono text-xs">
                  {f.annualRainfallMm} mm × {f.catchmentAreaM2} m² × {result.runoffCoefficientUsed} ({surfaceLabel(f.surfaceType)}) = {fmtL(result.annualHarvestLitres)}
                </p>
                <p className="mt-1 rounded-md bg-secondary px-3 py-2 font-mono text-xs">
                  {fmtL2(result.averageDailyLitres)}/day × {f.storageDays} = {fmtL(result.preliminaryTankLitres)}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                  {result.assumptions.map((a) => <li key={a}>{pick(a, ASSUMPTIONS_HI[a] ?? a)}</li>)}
                </ul>
              </div>
              <SafetyNotice title={t("calc.planningTitle")}>
                {t("calc.planningText")}
              </SafetyNotice>
              <div className="flex flex-wrap gap-3">
                <Button asChild><Link to="/recommendations">{t("calc.viewRecs")}</Link></Button>
                <Button variant="outline" onClick={saveSite}><Save className="mr-1 h-4 w-4" />{t("calc.save")}</Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ id, label, error, children, className }: { id: string; label: string; error?: string | undefined; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-err`} className="text-xs font-medium text-destructive">⚠ {error}</p>}
    </div>
  );
}
