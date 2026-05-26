import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ items: [] });

    const { data } = await supabase
      .from("carts")
      .select("items, updated_at")
      .eq("user_id", user.id)
      .maybeSingle();
    return NextResponse.json({
      items: data?.items ?? [],
      updatedAt: data?.updated_at ?? null,
    });
  } catch (error) {
    console.error("Failed to load cart:", error);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];

    const { error } = await supabase
      .from("carts")
      .upsert(
        { user_id: user.id, items },
        { onConflict: "user_id" }
      );
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save cart:", error);
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await supabase.from("carts").delete().eq("user_id", user.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to clear cart:", error);
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
