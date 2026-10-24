import { createFileRoute, Link } from "@tanstack/react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PageHeader, SafetyNotice } from "@/components/SiteChrome";
import { useLang } from "@/lib/i18n";

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

const topics = [1, 2, 3, 4, 5, 6].map((n) => ({ qk: `safe.q${n}`, ak: `safe.a${n}` }));

function Safety() {
  const { t } = useLang();
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <PageHeader eyebrow={t("safe.eyebrow")} title={t("safe.title")}>{t("safe.sub")}</PageHeader>
      <Accordion type="multiple" defaultValue={["0"]} className="rounded-2xl border border-border bg-card px-6 shadow-soft">
        {topics.map((topic, i) => (
          <AccordionItem key={topic.qk} value={String(i)}>
            <AccordionTrigger className="font-display text-base">{t(topic.qk)}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">{t(topic.ak)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">{t("safe.estTitle")}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>{t("safe.est1")}</li>
            <li>{t("safe.est2")}</li>
            <li>{t("safe.est3")}</li>
            <li>{t("safe.est4")}</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-semibold">{t("safe.noTitle")}</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>{t("safe.no1")}</li>
            <li>{t("safe.no2")}</li>
            <li>{t("safe.no3")}</li>
            <li>{t("safe.no4")}</li>
          </ul>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <SafetyNotice title={t("safe.waterTitle")}>{t("safe.waterText")}</SafetyNotice>
        <SafetyNotice title={t("safe.assessTitle")}>{t("safe.assessText")}</SafetyNotice>
        <SafetyNotice title={t("safe.privacyTitle")}>{t("safe.privacyText")}</SafetyNotice>
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg"><Link to="/calculator">{t("safe.cta")}</Link></Button>
      </div>
    </div>
  );
}
