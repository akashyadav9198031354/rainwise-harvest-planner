import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Droplets, Filter, Leaf, ShowerHead, Sparkles, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, SafetyNotice } from "@/components/SiteChrome";
import { buildEstimate, fmtL, USES, type IntendedUse } from "@/lib/rainwater";
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

const collection = [
  ["Suitable roof and gutters", "Clean, non-toxic roofing; gutters sloped toward downpipes."],
  ["Downpipe", "Carries water from gutters to the filter and tank."],
  ["First-flush diversion", "Discards the first, dirtiest rain that washes dust and droppings off the roof."],
  ["Appropriate filtration", "Leaf screens and mesh / sand filters before the tank."],
  ["Covered storage tank", "Opaque, tightly-lidded tank to block light, algae and debris."],
  ["Mosquito-proof screens", "Fine mesh on every inlet, vent and overflow."],
  ["Overflow pipe", "Sized to carry heavy rain to a safe outlet."],
  ["Safe cleaning access", "A manhole or lid that allows safe inspection and cleaning."],
];

const reuse: { key: IntendedUse | "other"; icon: typeof Leaf; title: string; text: string }[] = [
  { key: "gardening", icon: Leaf, title: "Gardening & landscaping", text: "Lowest-risk use. Water at soil level; avoid spraying edible leaves just before harvest." },
  { key: "cleaning", icon: Sparkles, title: "Outdoor cleaning", text: "Washing paths, vehicles and outdoor surfaces. Basic filtration is usually enough." },
  { key: "flushing", icon: ShowerHead, title: "Toilet flushing", text: "Only where plumbing and local rules permit. Needs a separate, clearly labelled pipe network with no cross-connection to drinking water." },
  { key: "other", icon: Filter, title: "Other non-drinking uses", text: "Possible after appropriate treatment for the specific use." },
];

function Recommendations() {
  const { active } = useSites();
  const { items, toggle, reset } = useMaintenance();
  let est = null;
  try { est = active ? buildEstimate(active) : null; } catch { est = null; }
  const done = items.filter((i) => i.completed).length;
  const focus = active?.intendedUse;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <PageHeader eyebrow="Step 2" title="Your collection & reuse plan">
        General guidance — it does not replace a professional site assessment.
      </PageHeader>

      {active && est ? (
        <div className="mb-8 rounded-2xl bg-rain p-6 text-primary-foreground">
          <p className="text-sm opacity-80">Plan for {active.name} · {active.location}</p>
          <p className="mt-1 font-display text-2xl font-bold">
            {fmtL(est.annualHarvestLitres)}/yr potential · {fmtL(est.preliminaryTankLitres)} preliminary storage · {USES[active.intendedUse]}
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
          No site saved yet — guidance below is general. <Link to="/calculator" className="font-medium text-primary underline">Calculate and save a site</Link> to personalise it.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Droplets className="h-5 w-5 text-primary" />Collection system checklist</h2>
          <ol className="mt-4 space-y-3">
            {collection.map(([t, d], i) => (
              <li key={t} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-secondary text-xs font-bold text-primary">{i + 1}</span>
                <div><p className="font-medium">{t}</p><p className="text-sm text-muted-foreground">{d}</p></div>
              </li>
            ))}
          </ol>
          <div className="mt-5 text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Storage & mosquito prevention</p>
            Keep tanks sealed and screened, check for standing water around the tank, and use water regularly so it turns over.
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-semibold">Safe reuse planner</h2>
            <ul className="mt-4 space-y-3">
              {reuse.map((r) => {
                const highlighted = focus === r.key || (focus === "mixed" && r.key !== "other");
                return (
                  <li key={r.title} className={`flex gap-3 rounded-xl border p-3 ${highlighted ? "border-primary bg-secondary" : "border-border"}`}>
                    <r.icon className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
                    <div>
                      <p className="font-medium">{r.title} {highlighted && <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">Your use</span>}</p>
                      <p className="text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <SafetyNotice title="Not drinking water">
            Harvested rainwater is <strong>not automatically safe to drink</strong>. Drinking use requires appropriate treatment and water-quality testing.
          </SafetyNotice>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="flex items-center gap-2 font-display text-xl font-semibold"><Waves className="h-5 w-5 text-primary" />Overflow & recharge</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
            <li>Give the tank a suitable overflow route for heavy rain.</li>
            <li>Don't direct water onto neighbouring property or unsafe areas.</li>
            <li>Never block public stormwater drains.</li>
            <li>Consider infiltration or groundwater recharge only after a site assessment.</li>
          </ul>
          <div className="mt-4">
            <SafetyNotice title="Recharge needs assessment">
              Check soil, groundwater quality, contamination risk, local permissions and site suitability before any recharge pit or well.
            </SafetyNotice>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold">Maintenance checklist</h2>
            <span className="text-sm text-muted-foreground">{done}/{items.length} done</span>
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
                    <span className={`font-medium ${i.completed ? "line-through opacity-70" : ""}`}>{i.title}</span>
                    <span className="sr-only">{i.completed ? " (completed)" : " (not completed)"}</span>
                    <span className="block text-sm text-muted-foreground">{i.description}</span>
                    {i.completedAt && <span className="block text-xs text-success">Done {new Date(i.completedAt).toLocaleDateString()}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">This checklist is saved in your browser. It does not send reminders.</p>
          <Button variant="ghost" size="sm" className="mt-2" onClick={reset}>Reset checklist</Button>
        </section>
      </div>

      <div className="mt-10 flex justify-end">
        <Button asChild><Link to="/impact">Start tracking impact →</Link></Button>
      </div>
    </div>
  );
}
