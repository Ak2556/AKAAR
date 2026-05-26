export interface AvailabilityInfo {
  stockQuantity: number | null;
  leadTimeDays: number | null;
}

export type AvailabilityState = "in-stock" | "low-stock" | "made-to-order" | "out-of-stock";

export interface ResolvedAvailability {
  state: AvailabilityState;
  label: string;
  description: string;
  tone: "good" | "warn" | "muted" | "bad";
  canPurchase: boolean;
}

const LOW_STOCK_THRESHOLD = 3;

export function resolveAvailability({
  stockQuantity,
  leadTimeDays,
}: AvailabilityInfo): ResolvedAvailability {
  if (stockQuantity != null) {
    if (stockQuantity <= 0) {
      return {
        state: "out-of-stock",
        label: "Sold out",
        description: leadTimeDays
          ? `Currently out of stock — reorder available, ships in ~${leadTimeDays} days`
          : "Currently out of stock",
        tone: "bad",
        canPurchase: false,
      };
    }
    if (stockQuantity <= LOW_STOCK_THRESHOLD) {
      return {
        state: "low-stock",
        label: `Only ${stockQuantity} left`,
        description: "Ships within 48 hours",
        tone: "warn",
        canPurchase: true,
      };
    }
    return {
      state: "in-stock",
      label: "In stock",
      description: "Ships within 48 hours",
      tone: "good",
      canPurchase: true,
    };
  }

  if (leadTimeDays != null && leadTimeDays > 0) {
    return {
      state: "made-to-order",
      label: "Made to order",
      description: `Printed for you · ships in ~${leadTimeDays} working day${leadTimeDays === 1 ? "" : "s"}`,
      tone: "muted",
      canPurchase: true,
    };
  }

  return {
    state: "in-stock",
    label: "In stock",
    description: "Ships within 48 hours",
    tone: "good",
    canPurchase: true,
  };
}

export function availabilityToneClasses(tone: ResolvedAvailability["tone"]): string {
  switch (tone) {
    case "good":
      return "bg-emerald-500/10 text-emerald-300";
    case "warn":
      return "bg-amber-500/10 text-amber-300";
    case "bad":
      return "bg-rose-500/10 text-rose-300";
    default:
      return "bg-sky-500/10 text-sky-300";
  }
}
