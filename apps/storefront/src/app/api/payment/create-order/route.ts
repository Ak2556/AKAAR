import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { auth } from "@/lib/auth";
import { hasRazorpayCredentials, isLocalDataMode } from "@/lib/local-runtime";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const { amount, items, shippingAddress, shippingMethod, email } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    // Generate unique receipt ID
    const receipt = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    if (isLocalDataMode() && !hasRazorpayCredentials()) {
      return NextResponse.json({
        orderId: `local_${receipt}`,
        amount: Math.round(amount * 100),
        currency: "INR",
        receipt,
        key: "local-dev-mode",
        paymentMode: "mock",
      });
    }

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder({
      amount: Math.round(amount * 100), // Convert to paise
      currency: "INR",
      receipt,
      notes: {
        userId: session?.user?.id || "guest",
        email: email || session?.user?.email || "",
        itemCount: items?.length?.toString() || "0",
      },
    });

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
      paymentMode: "razorpay",
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
