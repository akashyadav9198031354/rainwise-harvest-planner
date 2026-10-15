import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHeader, SafetyNotice } from "@/components/SiteChrome";

export const Route = createFileRoute("/safety")({
  head: () => ({
    meta: [
      { title: "Learn & Safety — Rain2Resource" },
      { name: "description", content: "Plain-language guide to rainwater harvesting, runoff coefficients, first flush, safe reuse and limitations." },
      { property: "og:title", content: "Learn & Safety — Rain2Resource" },
      { property: "og:description", content: "What rainwater harvesting is, how estimates work, and how to stay safe." },
    ],
  }),
  component: Safety,
});

const topics = [
  ["What is rainwater harvesting?", "Collecting rain that falls on a roof or other hard surface, filtering it, and storing it for later use — instead of letting it run into drains."],
  ["Why does catchment area matter?", "Every square metre of roof catches about 1 litre for every millimetre of rain. A bigger catchment means more potential water."],
  ["What is a runoff coefficient?", "The share of rain that actually reaches your tank (0 to 1). Some water splashes, evaporates or soaks into the surface. Smooth metal roofs lose less (≈0.9); rough or porous surfaces lose more."],
  ["Why use first-flush diversion?", "The first rain washes dust, leaves and bird droppings off the roof. A first-flush diverter throws away that dirtiest water so it doesn't enter the tank."],
  ["Which uses need treatment?", "Gardening and outdoor cleaning usually need only basic filtration. Toilet flushing needs separate plumbing and local approval. Drinking or cooking needs proper treatment and regular water-quality testing."],
  ["Why do overflow and maintenance matter?", "In heavy rain a full tank must overflow safely. Without cleaning, screens and gutters clog, water quality drops, and open tanks can breed mosquitoes."],
];

function Safety() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader eyebrow="Learn" title="Rainwater basics & safety">Simple answers to the questions that matter before you build.</PageHeader>
      <Accordion type="multiple" defaultValue={["0"]} className="rounded-2xl border border-border bg-card px-6 shadow-soft">
        {topics.map(([q, a], i) => (
          <AccordionItem key={q} value={String(i)}>
            <AccordionTrigger className="font-display text-base">{q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">What we estimate</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Approximate annual harvestable volume</li>
            <li>Average daily volume</li>
            <li>A preliminary storage planning volume</li>
            <li>General collection, reuse and maintenance guidance</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">What we don't guarantee</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Actual collection — rainfall varies year to year</li>
            <li>Safe drinking water</li>
            <li>Flood prevention or groundwater improvement</li>
            <li>An engineering-grade tank or recharge design</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <SafetyNotice title="Water quality">Harvested rainwater is not automatically safe to drink. Drinking use requires appropriate treatment and water-quality testing.</SafetyNotice>
        <SafetyNotice title="Site assessment">Storage sizing and groundwater recharge need a site-specific assessment covering soil, contamination risk, structure and local permissions.</SafetyNotice>
        <SafetyNotice title="Privacy">Your site profiles, records and checklist stay in this browser's local storage. Nothing is sent to a server. Clearing browser data removes them.</SafetyNotice>
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg"><Link to="/calculator">Calculate My Rainwater</Link></Button>
      </div>
    </div>
  );
}
