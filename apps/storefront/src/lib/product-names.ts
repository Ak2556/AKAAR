const productNameOverrides: Record<string, string> = {
  "plant-grow-light": "The EARTH Lamp",
};

const legacyProductNames: Record<string, string> = {
  "akaar plant grow light": "The EARTH Lamp",
  "akaar plant glow light": "The EARTH Lamp",
  "akaar plant light": "The EARTH Lamp",
};

export function getProductDisplayName(name: string, slug?: string | null): string {
  if (slug && productNameOverrides[slug]) {
    return productNameOverrides[slug];
  }

  const normalizedName = name.trim().toLowerCase();
  return legacyProductNames[normalizedName] ?? name;
}
