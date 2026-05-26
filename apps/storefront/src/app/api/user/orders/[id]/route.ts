import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(
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
    if (!id) return NextResponse.json({ error: "Order id is required" }, { status: 400 });

    const { data: order, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, status, payment_status, subtotal, shipping_cost, tax, total, shipping_method, shipping_address, email, phone, tracking_number, tracking_url, created_at, updated_at, order_items(id, product_id, name, slug, material, quantity, unit_price, total_price)"
      )
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        paymentStatus: order.payment_status,
        subtotal: Number(order.subtotal) || 0,
        shippingCost: Number(order.shipping_cost) || 0,
        tax: Number(order.tax) || 0,
        total: Number(order.total) || 0,
        shippingMethod: order.shipping_method,
        shippingAddress: order.shipping_address,
        email: order.email,
        phone: order.phone,
        trackingNumber: order.tracking_number,
        trackingUrl: order.tracking_url,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: (order.order_items ?? []).map((item) => ({
          id: item.id,
          productId: item.product_id,
          name: item.name,
          slug: item.slug,
          material: item.material,
          quantity: item.quantity,
          unitPrice: Number(item.unit_price) || 0,
          totalPrice: Number(item.total_price) || 0,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching order detail:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}
