export const SHIPPING_METHODS = [
  { id: "standard", name: "Standard Shipping", price: 0, time: "5-7 business days", badge: "FREE" },
  { id: "express", name: "Express Shipping", price: 149, time: "2-3 business days", badge: null },
  { id: "overnight", name: "Priority Shipping", price: 299, time: "1-2 business days", badge: null },
] as const;

export type ShippingMethod = (typeof SHIPPING_METHODS)[number];
export type ShippingMethodId = ShippingMethod["id"];

export function isShippingMethodId(value: unknown): value is ShippingMethodId {
  return typeof value === "string" && SHIPPING_METHODS.some((method) => method.id === value);
}

export function getShippingMethod(value: unknown): ShippingMethod {
  if (isShippingMethodId(value)) {
    return SHIPPING_METHODS.find((method) => method.id === value) ?? SHIPPING_METHODS[0];
  }

  return SHIPPING_METHODS[0];
}
