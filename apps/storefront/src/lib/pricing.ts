// Instant-quote pricing engine for FDM/SLA prints.
//
// Final price = max(MIN_ORDER, setupFee + materialCost × finishMultiplier)
// where:
//   materialCost = volumeCm3 × infillFactor × ratePerCm3
//   infillFactor = clamp(infill%, 10, 100) / 100 mapped through a non-linear
//                  curve (very low infill still needs perimeter, very high
//                  is denser solid)

export interface MaterialOption {
  id: string;
  label: string;
  ratePerCm3: number;   // ₹/cm³ at 100% infill
  defaultInfillPct: number;
  description: string;
}

export interface FinishOption {
  id: string;
  label: string;
  multiplier: number;
  description: string;
}

export const MATERIALS: MaterialOption[] = [
  { id: "pla",   label: "PLA",   ratePerCm3:  8, defaultInfillPct: 20, description: "Default for prototypes & display pieces" },
  { id: "petg",  label: "PETG",  ratePerCm3: 12, defaultInfillPct: 25, description: "Stronger + outdoor-tolerant" },
  { id: "abs",   label: "ABS",   ratePerCm3: 14, defaultInfillPct: 25, description: "Heat-resistant functional parts" },
  { id: "tpu",   label: "TPU",   ratePerCm3: 22, defaultInfillPct: 30, description: "Flexible / rubbery" },
  { id: "resin", label: "Resin", ratePerCm3: 38, defaultInfillPct: 100, description: "SLA · highest detail (no infill — solid)" },
];

export const FINISHES: FinishOption[] = [
  { id: "standard",     label: "Standard layer lines", multiplier: 1.00, description: "As-printed surface" },
  { id: "sanded",       label: "Sanded smooth",        multiplier: 1.35, description: "Manual sanding to 400 grit" },
  { id: "primed",       label: "Sanded + primed",      multiplier: 1.65, description: "Ready for paint" },
  { id: "painted",      label: "Sanded + painted",     multiplier: 2.10, description: "Single-color base coat" },
];

export const PRINTER_BUILD_VOLUME_MM = { x: 220, y: 220, z: 250 };

export const SETUP_FEE = 80;            // ₹ per part (slicing, setup, peeling)
export const MIN_ORDER = 199;           // ₹ minimum line price
const VOLUME_LIMIT_CM3 = 8000;          // ~20cm cube — sanity guard
const QTY_DISCOUNTS: { minQty: number; discount: number }[] = [
  { minQty: 50, discount: 0.20 },
  { minQty: 20, discount: 0.12 },
  { minQty: 10, discount: 0.07 },
  { minQty: 5,  discount: 0.03 },
];

export interface PriceBreakdown {
  unitPrice: number;
  lineTotal: number;
  setupFee: number;
  materialCost: number;
  finishMultiplier: number;
  effectiveInfill: number;
  buildTimeHours: number;
  quantity: number;
  bulkDiscountPct: number;
  warnings: string[];
}

export interface QuoteInputs {
  volumeMm3: number;
  surfaceAreaMm2?: number;
  boundingBoxMm: { x: number; y: number; z: number };
  materialId: string;
  finishId: string;
  infillPct: number;     // 10-100
  quantity: number;
}

export function priceFromGeometry(input: QuoteInputs): PriceBreakdown {
  const material = MATERIALS.find((m) => m.id === input.materialId) ?? MATERIALS[0];
  const finish = FINISHES.find((f) => f.id === input.finishId) ?? FINISHES[0];
  const quantity = Math.max(1, Math.round(input.quantity));
  const volumeCm3 = input.volumeMm3 / 1000;

  const warnings: string[] = [];
  const bb = input.boundingBoxMm;
  if (
    bb.x > PRINTER_BUILD_VOLUME_MM.x ||
    bb.y > PRINTER_BUILD_VOLUME_MM.y ||
    bb.z > PRINTER_BUILD_VOLUME_MM.z
  ) {
    warnings.push(
      `Part is larger than our 220 × 220 × 250 mm build volume (${bb.x.toFixed(0)} × ${bb.y.toFixed(0)} × ${bb.z.toFixed(0)} mm). We will split it into sub-parts and the final price may change.`
    );
  }
  if (volumeCm3 > VOLUME_LIMIT_CM3) {
    warnings.push("Part is unusually large — please confirm units are millimetres before submitting.");
  }
  if (input.volumeMm3 <= 0) {
    warnings.push("Could not compute volume — mesh may not be closed.");
  }

  // Resin is always 100% solid; FDM materials respect the slider.
  const effectiveInfill = material.id === "resin"
    ? 100
    : Math.max(10, Math.min(100, Math.round(input.infillPct)));
  // Below ~25% infill, the perimeter dominates, so we use a curve rather
  // than a straight linear factor.
  const infillFactor = 0.35 + 0.65 * Math.pow(effectiveInfill / 100, 0.85);

  const materialCost = volumeCm3 * infillFactor * material.ratePerCm3;
  const setupFee = SETUP_FEE;
  const unitPriceRaw = (setupFee + materialCost) * finish.multiplier;
  const unitPrice = Math.max(MIN_ORDER, Math.round(unitPriceRaw));

  const bulkDiscountPct =
    QTY_DISCOUNTS.find((band) => quantity >= band.minQty)?.discount ?? 0;
  const lineTotal = Math.round(unitPrice * quantity * (1 - bulkDiscountPct));

  // Rough build-time proxy: 18 cm³/hr at 20% infill on PLA.
  const baseRate = 18;
  const buildTimeHours = volumeCm3 / baseRate * infillFactor;

  return {
    unitPrice,
    lineTotal,
    setupFee,
    materialCost: Math.round(materialCost),
    finishMultiplier: finish.multiplier,
    effectiveInfill,
    buildTimeHours,
    quantity,
    bulkDiscountPct,
    warnings,
  };
}

export function formatBuildTime(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "—";
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${hours.toFixed(hours < 5 ? 1 : 0)} hrs`;
  return `${Math.round(hours / 24)} days`;
}

export function formatVolume(mm3: number): string {
  const cm3 = mm3 / 1000;
  if (cm3 < 1) return `${mm3.toFixed(0)} mm³`;
  return `${cm3.toFixed(2)} cm³`;
}
