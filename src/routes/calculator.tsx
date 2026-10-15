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
    const errs = validateSiteInputs(f as unknown as Record<string, string>);
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
    if (ok) toast.success("Site profile saved in this browser");
    else toast.error("Couldn't save — browser storage is unavailable. You can keep using the calculator.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader eyebrow="Step 1" title="Rainwater potential calculator">
        Enter your site details. You supply the annual rainfall — check your local meteorological department for an average.
      </PageHeader>

      {sites.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Saved sites:</span>
          {sites.map((s) => (
            <Button key={s.id} size="sm" variant={s.id === f.id ? "default" : "outline"} onClick={() => load(s.id)}>{s.name}</Button>
          ))}
          <Button size="sm" variant="ghost" onClick={() => { setF(blank); setResult(null); setErrors({}); }}>+ New site</Button>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
        <form onSubmit={compute} noValidate className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-soft">
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-semibold">Site profile</legend>
            <Field id="name" label="Site name" error={errors.name}>
              <Input id="name" value={f.name} maxLength={80} placeholder="e.g. Green Valley School" onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby="name-err" />
            </Field>
            <Field id="location" label="City or location" error={errors.location}>
              <Input id="location" value={f.location} maxLength={100} placeholder="e.g. Pune" onChange={(e) => set("location", e.target.value)} aria-invalid={!!errors.location} aria-describedby="location-err" />
            </Field>
            <Field id="siteType" label="Building / site type">
              <select id="siteType" className={selectCls} value={f.siteType} onChange={(e) => set("siteType", e.target.value as SiteType)}>
                {Object.entries(SITE_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field id="storageSpace" label="Space available for storage (optional)">
              <Input id="storageSpace" value={f.storageSpace} maxLength={200} placeholder="e.g. 2 m × 1.5 m beside garage" onChange={(e) => set("storageSpace", e.target.value)} />
            </Field>
            <Field id="existingSystem" label="Existing rainwater system (optional)" className="sm:col-span-2">
              <Input id="existingSystem" value={f.existingSystem} maxLength={200} placeholder="e.g. none / 500 L barrel on one downpipe" onChange={(e) => set("existingSystem", e.target.value)} />
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-semibold">Rain & catchment</legend>
            <Field id="annualRainfallMm" label="Annual rainfall (mm)" error={errors.annualRainfallMm}>
              <Input id="annualRainfallMm" type="number" inputMode="decimal" min={0} value={f.annualRainfallMm} placeholder="e.g. 800" onChange={(e) => set("annualRainfallMm", e.target.value)} aria-invalid={!!errors.annualRainfallMm} aria-describedby="annualRainfallMm-err" />
            </Field>
            <Field id="catchmentAreaM2" label="Roof / catchment area (m²)" error={errors.catchmentAreaM2}>
              <Input id="catchmentAreaM2" type="number" inputMode="decimal" min={0} value={f.catchmentAreaM2} placeholder="e.g. 100" onChange={(e) => set("catchmentAreaM2", e.target.value)} aria-invalid={!!errors.catchmentAreaM2} aria-describedby="catchmentAreaM2-err" />
            </Field>
            <Field id="surfaceType" label="Surface type">
              <select id="surfaceType" className={selectCls} value={f.surfaceType}
                onChange={(e) => { const s = e.target.value as SurfaceType; setF((p) => ({ ...p, surfaceType: s, runoffCoefficient: String(SURFACE_COEFFICIENTS[s].value) })); }}>
                {Object.entries(SURFACE_COEFFICIENTS).map(([k, v]) => <option key={k} value={k}>{v.label} (≈{v.value})</option>)}
              </select>
            </Field>
            <Field id="runoffCoefficient" label="Runoff coefficient (0–1, editable)" error={errors.runoffCoefficient}>
              <Input id="runoffCoefficient" type="number" step="0.05" min={0} max={1} value={f.runoffCoefficient} onChange={(e) => set("runoffCoefficient", e.target.value)} aria-invalid={!!errors.runoffCoefficient} aria-describedby="runoffCoefficient-err" />
            </Field>
          </fieldset>

          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 font-display text-lg font-semibold">Use & storage</legend>
            <Field id="intendedUse" label="Intended use">
              <select id="intendedUse" className={selectCls} value={f.intendedUse} onChange={(e) => set("intendedUse", e.target.value as IntendedUse)}>
                {Object.entries(USES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </Field>
            <Field id="storageDays" label="Days of storage desired" error={errors.storageDays}>
              <Input id="storageDays" type="number" min={1} max={120} value={f.storageDays} onChange={(e) => set("storageDays", e.target.value)} aria-invalid={!!errors.storageDays} aria-describedby="storageDays-err" />
            </Field>
          </fieldset>

          <div className="flex flex-wrap gap-3">
            <Button type="submit"><CalcIcon className="mr-1 h-4 w-4" />Calculate estimate</Button>
            <Button type="button" variant="outline" onClick={saveSite}><Save className="mr-1 h-4 w-4" />Save site profile</Button>
          </div>
        </form>

        <section aria-live="polite" className="space-y-4">
          {!result ? (
            <div className="grid h-full min-h-64 place-items-center rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              <div>
                <Droplet className="mx-auto h-8 w-8 text-primary" aria-hidden />
                <p className="mt-3">Fill in the form and press <strong>Calculate estimate</strong> to see results.</p>
              </div>
            </div>
          ) : (
            <>
              <MetricCard label="Estimated annual harvest" value={`${fmtL(result.annualHarvestLitres)}/yr`} hint={`≈ ${(result.annualHarvestLitres / 1000).toLocaleString("en-IN", { maximumFractionDigits: 1 })} m³ per year`} />
              <div className="grid gap-4 sm:grid-cols-2">
                <MetricCard label="Average daily harvest" value={`${fmtL2(result.averageDailyLitres)}/day`} hint="Annual ÷ 365" />
                <MetricCard label="Preliminary storage" value={fmtL(result.preliminaryTankLitres)} hint={`Planning estimate for ${f.storageDays} day(s)`} />
              </div>
              <div className="rounded-2xl border border-border bg-card p-5 text-sm shadow-soft">
                <p className="flex items-center gap-2 font-semibold"><Info className="h-4 w-4 text-primary" aria-hidden />Formula & assumptions</p>
                <p className="mt-2 rounded-md bg-secondary px-3 py-2 font-mono text-xs">
                  {f.annualRainfallMm} mm × {f.catchmentAreaM2} m² × {result.runoffCoefficientUsed} ({SURFACE_COEFFICIENTS[f.surfaceType].label}) = {fmtL(result.annualHarvestLitres)}
                </p>
                <p className="mt-1 rounded-md bg-secondary px-3 py-2 font-mono text-xs">
                  {fmtL2(result.averageDailyLitres)}/day × {f.storageDays} days = {fmtL(result.preliminaryTankLitres)}
                </p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-muted-foreground">
                  {result.assumptions.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </div>
              <SafetyNotice title="Planning estimate only">
                Real tank sizing depends on rainfall distribution, demand, space, overflow, tank turnover and engineering requirements.
              </SafetyNotice>
              <div className="flex flex-wrap gap-3">
                <Button asChild><Link to="/recommendations">View recommendations</Link></Button>
                <Button variant="outline" onClick={saveSite}><Save className="mr-1 h-4 w-4" />Save site profile</Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

function Field({ id, label, error, children, className }: { id: string; label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p id={`${id}-err`} className="text-xs font-medium text-destructive">⚠ {error}</p>}
    </div>
  );
}
