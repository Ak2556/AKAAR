import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { evaluateCoupon, type CouponRecord } from "@/lib/coupons";

export const dynamic = "force-dynamic";

interface Body {
  code?: string;
  subtotal?: number;
  shippingCost?: number;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    const code = (body.code || "").trim().toUpperCase();
    const subtotal = Number(body.subtotal) || 0;
    const shippingCost = Number(body.shippingCost) || 0;

    if (!code) {
      return NextResponse.json({ valid: false, reason: "Enter a coupon code" }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data } = await admin.from("coupons").select("*").eq("code", code).single();
    if (!data) {
      return NextResponse.json({ valid: false, reason: "Coupon not found" }, { status: 404 });
    }

    const coupon: CouponRecord = {
      id: data.id,
      code: data.code,
      description: data.description,
      type: data.type,
      value: Number(data.value) || 0,
      minOrderTotal: data.min_order_total == null ? null : Number(data.min_order_total),
      maxDiscount: data.max_discount == null ? null : Number(data.max_discount),
      maxUses: data.max_uses,
      usedCount: data.used_count ?? 0,
      startsAt: data.starts_at,
      expiresAt: data.expires_at,
      isActive: data.is_active,
    };

    const result = evaluateCoupon(coupon, { subtotal, shippingCost });
    return NextResponse.json({
      ...result,
      coupon: result.valid
        ? { id: coupon.id, code: coupon.code, type: coupon.type, description: coupon.description }
        : undefined,
    });
  } catch (error) {
    console.error("Coupon validation failed:", error);
    return NextResponse.json({ valid: false, reason: "Could not validate coupon" }, { status: 500 });
  }
}
