import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

interface PostBody {
  rating?: unknown;
  title?: unknown;
  body?: unknown;
}

// ── GET — public list of visible reviews + aggregate stats ───────────────
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const { data: reviews, error } = await supabase
      .from("product_reviews")
      .select("id, rating, title, body, verified_purchase, created_at, user_id, profiles(name)")
      .eq("product_id", product.id)
      .eq("is_visible", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const rows = reviews ?? [];
    const total = rows.length;
    const avg = total === 0 ? 0 : rows.reduce((sum, r) => sum + Number(r.rating), 0) / total;
    const distribution = [1, 2, 3, 4, 5].map((star) => ({
      star,
      count: rows.filter((r) => Number(r.rating) === star).length,
    }));

    let viewerReviewId: string | null = null;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const mine = rows.find((r) => r.user_id === user.id);
      viewerReviewId = mine?.id ?? null;
    }

    return NextResponse.json({
      average: Number(avg.toFixed(2)),
      total,
      distribution,
      viewerReviewId,
      reviews: rows.map((r) => {
        const profile = r.profiles as { name?: string | null } | null;
        return {
          id: r.id,
          rating: Number(r.rating),
          title: r.title,
          body: r.body,
          verifiedPurchase: r.verified_purchase,
          createdAt: r.created_at,
          authorName: profile?.name ?? "Verified customer",
        };
      }),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

// ── POST — auth required; upsert reviewer's own review ───────────────────
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in to leave a review" }, { status: 401 });

    const body = (await request.json()) as PostBody;
    const rating = Number(body.rating);
    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 120) : "";
    const reviewBody = typeof body.body === "string" ? body.body.trim().slice(0, 2000) : "";

    const { data: product } = await supabase
      .from("products")
      .select("id")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const admin = createAdminClient();

    // Verified purchase = user has an order containing this product
    const { data: orderItem } = await admin
      .from("order_items")
      .select("id, order_id, orders!inner(user_id, status)")
      .eq("product_id", product.id)
      .eq("orders.user_id", user.id)
      .in("orders.status", ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"])
      .limit(1)
      .maybeSingle();
    const verifiedPurchase = Boolean(orderItem);

    const { data: review, error } = await admin
      .from("product_reviews")
      .upsert(
        {
          product_id: product.id,
          user_id: user.id,
          order_id:
            orderItem && "order_id" in orderItem ? (orderItem.order_id as string) : null,
          rating: Math.round(rating),
          title: title || null,
          body: reviewBody || null,
          verified_purchase: verifiedPurchase,
          is_visible: true,
        },
        { onConflict: "product_id,user_id" }
      )
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ review });
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}
