export type CouponType = "PERCENT" | "FIXED" | "FREE_SHIPPING";

export interface CouponRecord {
  id: string;
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  minOrderTotal: number | null;
  maxDiscount: number | null;
  maxUses: number | null;
  usedCount: number;
  startsAt: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface CouponValidation {
  valid: boolean;
  reason?: string;
  coupon?: CouponRecord;
  discount?: number;
  freeShipping?: boolean;
}

export function evaluateCoupon(
  coupon: CouponRecord | null,
  context: { subtotal: number; shippingCost: number }
): CouponValidation {
  if (!coupon) return { valid: false, reason: "Invalid coupon code" };
  if (!coupon.isActive) return { valid: false, reason: "This coupon is no longer active" };

  const now = Date.now();
  if (coupon.startsAt && new Date(coupon.startsAt).getTime() > now) {
    return { valid: false, reason: "This coupon is not active yet" };
  }
  if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < now) {
    return { valid: false, reason: "This coupon has expired" };
  }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, reason: "This coupon has reached its usage limit" };
  }
  if (coupon.minOrderTotal != null && context.subtotal < coupon.minOrderTotal) {
    return {
      valid: false,
      reason: `Minimum order ₹${coupon.minOrderTotal.toFixed(0)} required for this coupon`,
    };
  }

  let discount = 0;
  let freeShipping = false;

  switch (coupon.type) {
    case "PERCENT": {
      discount = (context.subtotal * coupon.value) / 100;
      if (coupon.maxDiscount != null) discount = Math.min(discount, coupon.maxDiscount);
      break;
    }
    case "FIXED": {
      discount = Math.min(coupon.value, context.subtotal);
      break;
    }
    case "FREE_SHIPPING": {
      discount = context.shippingCost;
      freeShipping = true;
      break;
    }
  }

  discount = Math.max(0, Math.round(discount));

  return {
    valid: true,
    coupon,
    discount,
    freeShipping,
  };
}
