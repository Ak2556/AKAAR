import { NextRequest, NextResponse } from "next/server";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { prisma } from "@akaar/db";
import { auth } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    // Verify payment signature
    const isValid = await verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    // Generate order number
    const orderNumber = `AKR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Create order in database
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: session?.user?.id || null,
        status: "CONFIRMED",
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        tax: orderData.tax,
        total: orderData.total,
        shippingMethod: orderData.shippingMethod,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: "razorpay",
        paymentStatus: "CAPTURED",
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        email: orderData.email,
        phone: orderData.phone || null,
        notes: orderData.notes || null,
        items: {
          create: orderData.items.map((item: any) => ({
            productId: item.productId || null,
            name: item.name,
            slug: item.slug || null,
            material: item.material || null,
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Send confirmation email
    try {
      await sendOrderConfirmationEmail({
        to: orderData.email,
        orderNumber: order.orderNumber,
        items: order.items,
        total: Number(order.total),
        shippingAddress: orderData.shippingAddress,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the order if email fails
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
