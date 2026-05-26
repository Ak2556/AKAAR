import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createRazorpayOrder } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { data: quote, error } = await supabase
      .from("quote_requests")
      .select("id, quote_number, status, quoted_price, name, email, phone, user_id")
      .eq("id", id)
      .single();
    if (error || !quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }
    if (quote.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (quote.status !== "QUOTED") {
      return NextResponse.json(
        { error: "This quote is not ready for payment yet" },
        { status: 400 }
      );
    }
    const price = Number(quote.quoted_price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Quote has no price set" }, { status: 400 });
    }

    const amountPaise = Math.round(price * 100);
    const razorpayOrder = await createRazorpayOrder({
      amount: amountPaise,
      currency: "INR",
      receipt: `qt_${quote.quote_number}`.slice(0, 40),
      notes: {
        quoteId: quote.id,
        quoteNumber: quote.quote_number,
        userId: user.id,
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      quoteNumber: quote.quote_number,
      verifiedTotal: price,
      customer: {
        name: quote.name,
        email: quote.email,
        phone: quote.phone,
      },
    });
  } catch (error) {
    console.error("Quote payment init failed:", error);
    return NextResponse.json({ error: "Could not start payment" }, { status: 500 });
  }
}
