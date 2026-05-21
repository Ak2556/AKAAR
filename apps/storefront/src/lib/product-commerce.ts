export interface ProductCommerceInput {
  name: string;
  category?: string | null;
  description?: string | null;
  shortDescription?: string | null;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductCommerceProfile {
  material: string;
  finish: string;
  useCase: string;
  dispatch: string;
  delivery: string;
  quality: string;
  includedTitle: string;
  includedBody: string;
  customPrompt: string;
  cardHighlights: string[];
  detailSpecs: ProductSpec[];
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function includesTerm(text: string, term: string) {
  const source = escapeRegExp(term.trim()).replace(/\s+/g, "\\s+");
  return new RegExp(`(^|[^a-z0-9])${source}([^a-z0-9]|$)`, "i").test(text);
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => includesTerm(text, term));
}

export function getProductCommerceProfile(product: ProductCommerceInput): ProductCommerceProfile {
  const category = product.category?.toLowerCase() ?? "";
  const searchable = [
    product.name,
    product.category,
    product.description,
    product.shortDescription,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const isLamp =
    category.includes("lamp") ||
    includesAny(searchable, ["lamp", "led", "planter", "grow light", "plant grow"]);
  const isFigurine = category.includes("figurine") || includesAny(searchable, ["ganesha", "hanuman", "krishna", "idol", "figurine"]);
  const mentionsWhitePla = searchable.includes("white pla") || searchable.includes("pla");

  const material = mentionsWhitePla ? "White PLA" : "FDM printed PLA";
  const dispatch = "48h dispatch";
  const delivery = "5-7 day delivery";

  if (isLamp) {
    const profile: ProductCommerceProfile = {
      material: "White PLA body",
      finish: "Warm LED fitted",
      useCase: "Desk / plant shelf",
      dispatch,
      delivery,
      quality: "Light module checked before packing",
      includedTitle: "Assembled light, ready to plug in",
      includedBody:
        "The printed body, fitted LED module, and planter-ready tray arrive as one finished object. No sanding, painting, or assembly step is expected from you.",
      customPrompt:
        "Want a different light color, logo, planter size, or mounting style? Send it through the quote flow and we will review the build before production.",
      cardHighlights: ["Warm LED", "Assembled", "Free shipping"],
      detailSpecs: [
        { label: "Material", value: "White PLA body" },
        { label: "Light", value: "Warm LED fitted" },
        { label: "Dispatch", value: dispatch },
        { label: "Delivery", value: delivery },
      ],
    };
    return profile;
  }

  if (isFigurine) {
    const profile: ProductCommerceProfile = {
      material,
      finish: "Display-ready finish",
      useCase: "Gift / altar / desk",
      dispatch,
      delivery,
      quality: "Fine detail inspected after print",
      includedTitle: "Display-ready piece, packed for gifting",
      includedBody:
        "Your figurine arrives finished and ready to place on a desk, shelf, or altar. The studio checks visible detail, base stability, and surface finish before dispatch.",
      customPrompt:
        "Need a different scale, color, base, or name plate? Move this into a custom quote and we will review the print plan first.",
      cardHighlights: ["Display-ready", material, "Free shipping"],
      detailSpecs: [
        { label: "Material", value: material },
        { label: "Finish", value: "Display-ready" },
        { label: "Dispatch", value: dispatch },
        { label: "Delivery", value: delivery },
      ],
    };
    return profile;
  }

  return {
    material,
    finish: "Reviewed finish",
    useCase: "Home / prototype",
    dispatch,
    delivery,
    quality: "Geometry and finish checked",
    includedTitle: "Finished part from the AKAAR studio",
    includedBody:
      "The part is printed, checked, packed, and shipped from Jaipur with the same studio review used for custom builds.",
    customPrompt:
      "Need alternate dimensions, material, or finish? Use the quote flow so the team can review it before print time.",
    cardHighlights: ["Studio printed", material, "Free shipping"],
    detailSpecs: [
      { label: "Material", value: material },
      { label: "Finish", value: "Reviewed" },
      { label: "Dispatch", value: dispatch },
      { label: "Delivery", value: delivery },
    ],
  };
}
