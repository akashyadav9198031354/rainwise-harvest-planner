export type SiteType = "home" | "school" | "apartment" | "office" | "other";
export type SurfaceType = "concrete" | "metal" | "tile" | "other";
export type IntendedUse = "gardening" | "cleaning" | "flushing" | "mixed";

export type SiteProfile = {
  id: string;
  name: string;
  location: string;
  siteType: SiteType;
  annualRainfallMm: number;
  catchmentAreaM2: number;
  surfaceType: SurfaceType;
  runoffCoefficient: number;
  intendedUse: IntendedUse;
  storageDays: number;
  storageSpace?: string | undefined;
  existingSystem?: string | undefined;
  createdAt: string;
  updatedAt: string;
};

export type RainwaterEstimate = {
  annualHarvestLitres: number;
  averageDailyLitres: number;
  preliminaryTankLitres: number;
  runoffCoefficientUsed: number;
  assumptions: string[];
  calculatedAt: string;
};

export type ImpactRecord = {
  id: string;
  siteId: string;
  date: string;
  actualCollectedLitres: number;
  actualReusedLitres: number;
  notes?: string | undefined;
  isDemoData: boolean;
  createdAt: string;
};

export type MaintenanceItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  completedAt?: string | undefined;
};

export const SURFACE_COEFFICIENTS: Record<SurfaceType, { label: string; value: number }> = {
  metal: { label: "Metal sheet roof", value: 0.9 },
  tile: { label: "Tiled roof", value: 0.8 },
  concrete: { label: "Concrete / flat roof", value: 0.75 },
  other: { label: "Other surface", value: 0.6 },
};

export const SITE_TYPES: Record<SiteType, string> = {
  home: "Home",
  school: "School / college",
  apartment: "Apartment / housing society",
  office: "Office / commercial",
  other: "Other",
};

export const USES: Record<IntendedUse, string> = {
  gardening: "Gardening & landscaping",
  cleaning: "Outdoor cleaning",
  flushing: "Toilet flushing",
  mixed: "Mixed non-drinking uses",
};

export function estimateAnnualHarvest(rainfallMm: number, catchmentAreaM2: number, runoffCoefficient: number): number {
  if (!Number.isFinite(rainfallMm) || rainfallMm < 0) throw new Error("Enter a valid annual rainfall value.");
  if (!Number.isFinite(catchmentAreaM2) || catchmentAreaM2 <= 0) throw new Error("Catchment area must be greater than zero.");
  if (!Number.isFinite(runoffCoefficient) || runoffCoefficient < 0 || runoffCoefficient > 1)
    throw new Error("Runoff coefficient must be between 0 and 1.");
  return rainfallMm * catchmentAreaM2 * runoffCoefficient;
}

export function estimateDailyAverage(annualLitres: number): number {
  return annualLitres / 365;
}

export function estimatePreliminaryTank(dailyAverageLitres: number, storageDays: number): number {
  if (storageDays <= 0) throw new Error("Storage days must be greater than zero.");
  return dailyAverageLitres * storageDays;
}

export function buildEstimate(p: Pick<SiteProfile, "annualRainfallMm" | "catchmentAreaM2" | "runoffCoefficient" | "storageDays">): RainwaterEstimate {
  const annual = estimateAnnualHarvest(p.annualRainfallMm, p.catchmentAreaM2, p.runoffCoefficient);
  const daily = estimateDailyAverage(annual);
  return {
    annualHarvestLitres: annual,
    averageDailyLitres: daily,
    preliminaryTankLitres: estimatePreliminaryTank(daily, p.storageDays),
    runoffCoefficientUsed: p.runoffCoefficient,
    assumptions: [
      "1 mm of rain on 1 m² ≈ 1 litre before losses.",
      "Annual rainfall is the figure you entered — it is not fetched or verified.",
      "The runoff coefficient accounts for splash, evaporation and absorption losses.",
      "Rain is spread evenly across the year for the daily average; real rainfall is seasonal.",
      "Storage size is preliminary planning guidance, not an engineering design.",
    ],
    calculatedAt: new Date().toISOString(),
  };
}

export type FormErrors = Partial<Record<"name" | "location" | "annualRainfallMm" | "catchmentAreaM2" | "runoffCoefficient" | "storageDays", string>>;

export type SiteInputStrings = { name: string; location: string; annualRainfallMm: string; catchmentAreaM2: string; runoffCoefficient: string; storageDays: string };

export function validateSiteInputs(v: SiteInputStrings): FormErrors {
  const e: FormErrors = {};
  const num = (s: string) => (s.trim() === "" ? NaN : Number(s));
  if (!v.name?.trim()) e.name = "Give this site a name.";
  else if (v.name.length > 80) e.name = "Keep the name under 80 characters.";
  if (!v.location?.trim()) e.location = "Enter a city or location.";
  else if (v.location.length > 100) e.location = "Keep the location under 100 characters.";
  const r = num(v.annualRainfallMm);
  if (v.annualRainfallMm.trim() === "") e.annualRainfallMm = "Enter your annual rainfall in mm.";
  else if (!Number.isFinite(r) || r < 0) e.annualRainfallMm = "Rainfall must be zero or more.";
  else if (r > 15000) e.annualRainfallMm = "That seems too high — check the value (mm per year).";
  const a = num(v.catchmentAreaM2);
  if (v.catchmentAreaM2.trim() === "") e.catchmentAreaM2 = "Enter the catchment area in m².";
  else if (!Number.isFinite(a) || a <= 0) e.catchmentAreaM2 = "Catchment area must be greater than zero.";
  else if (a > 1_000_000) e.catchmentAreaM2 = "That area seems too large — check the value.";
  const c = num(v.runoffCoefficient);
  if (!Number.isFinite(c) || c < 0 || c > 1) e.runoffCoefficient = "Runoff coefficient must be between 0 and 1.";
  const d = num(v.storageDays);
  if (!Number.isFinite(d) || d <= 0) e.storageDays = "Storage days must be greater than zero.";
  else if (d > 120) e.storageDays = "Choose 120 days or fewer.";
  return e;
}

export function validateImpact(v: { date: string; collected: string; reused: string; notes: string }) {
  const e: Partial<Record<"date" | "collected" | "reused" | "notes", string>> = {};
  if (!v.date) e.date = "Choose a date.";
  const c = v.collected.trim() === "" ? NaN : Number(v.collected);
  const r = v.reused.trim() === "" ? NaN : Number(v.reused);
  if (!Number.isFinite(c) || c < 0) e.collected = "Enter litres collected (0 or more).";
  if (!Number.isFinite(r) || r < 0) e.reused = "Enter litres reused (0 or more).";
  if (v.notes.length > 300) e.notes = "Keep notes under 300 characters.";
  return e;
}

export const fmtL = (n: number) =>
  Number.isFinite(n) ? `${Math.round(n).toLocaleString("en-IN")} L` : "—";
export const fmtL2 = (n: number) =>
  Number.isFinite(n) ? `${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })} L` : "—";

export const DEFAULT_MAINTENANCE: MaintenanceItem[] = [
  { id: "roof", title: "Clean roof and gutters", description: "Remove leaves, dust and debris before the rainy season starts.", completed: false },
  { id: "flush", title: "Check first-flush diversion", description: "Empty and clean the diverter so the dirtiest first rain is discarded.", completed: false },
  { id: "filter", title: "Inspect filters", description: "Rinse or replace mesh and filter media; look for clogging.", completed: false },
  { id: "cover", title: "Keep storage covered", description: "Lids should be tight and opaque to block light and debris.", completed: false },
  { id: "overflow", title: "Check overflow routes", description: "Make sure overflow flows to a safe outlet, not onto neighbours or into blocked drains.", completed: false },
  { id: "leaks", title: "Look for leaks and mosquito entry points", description: "Check joints, screens and vents for gaps.", completed: false },
  { id: "tank", title: "Clean the tank", description: "Clean as recommended for your system, usually before monsoon.", completed: false },
];
