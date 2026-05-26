import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { fetchPaymentDetails, verifyPaymentSignature } from "@/lib/razorpay";

export const dynamic = "force-dynamic";

interface Body {
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  shippingAddress?: Record<string, string>;
  phone?: string;
}

interface PaymentDetails {
  order_id?: string;
  amount?: number | string;
  currency?: string;
  status?: string;
  captured?: boolean;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = (await request.json()) as Body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment fields" }, { status: 400 });
    }

    if (!verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: quote } = await admin
      .from("quote_requests")
      .select("id, quote_number, status, quoted_price, name, email, phone, user_id, material")
      .eq("id", id)
      .single();
    if (!quote) return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    if (quote.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (quote.status !== "QUOTED") {
      return NextResponse.json({ error: "Quote already converted" }, { status: 400 });
    }

    const price = Number(quote.quoted_price);
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: "Quote has no valid price" }, { status: 400 });
    }

    const payment = (await fetchPaymentDetails(razorpay_payment_id)) as PaymentDetails;
    if (payment.order_id !== razorpay_order_id) {
      return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
    }
    if (payment.status !== "captured" && payment.captured !== true) {
      return NextResponse.json({ error: "Payment not captured" }, { status: 400 });
    }
    if (Number(payment.amount) !== Math.round(price * 100)) {
      return NextResponse.json({ error: "Paid amount does not match quote" }, { status: 400 });
    }

    const orderNumber = `ORD-${nanoid(10).toUpperCase()}`;
    const shippingAddress =
      body.shippingAddress && typeof body.shippingAddress === "object" ? body.shippingAddress : {};
    const phone =
      typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : quote.phone ?? null;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        quote_id: quote.id,
        subtotal: price,
        shipping_cost: 0,
        tax: 0,
        total: price,
        status: "CONFIRMED",
        payment_status: "CAPTURED",
        shipping_method: "Standard Shipping",
        shipping_address: shippingAddress,
        email: quote.email,
        phone,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      })
      .select()
      .single();
    if (orderError || !order) throw orderError;

    // Single synthetic line item describing the quote-based build.
    await admin.from("order_items").insert({
      order_id: order.id,
      product_id: null,
      name: `Custom build · Quote ${quote.quote_number}`,
      material: quote.material,
      quantity: 1,
      unit_price: price,
      total_price: price,
    });

    await admin
      .from("quote_requests")
      .update({ status: "ACCEPTED", responded_at: new Date().toISOString() })
      .eq("id", quote.id);

    return NextResponse.json({ success: true, orderId: order.id, orderNumber });
  } catch (error) {
    console.error("Quote payment confirm failed:", error);
    return NextResponse.json({ error: "Could not confirm payment" }, { status: 500 });
  }
}
