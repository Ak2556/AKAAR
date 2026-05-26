import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: product } = await supabase
      .from("products")
      .select("id, price")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const { data: variants } = await supabase
      .from("product_variants")
      .select("*")
      .eq("product_id", product.id)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    const basePrice = Number(product.price) || 0;

    return NextResponse.json({
      basePrice,
      variants: (variants ?? []).map((v) => ({
        id: v.id,
        material: v.material,
        color: v.color,
        colorHex: v.color_hex,
        priceModifier: Number(v.price_modifier) || 0,
        finalPrice: basePrice + (Number(v.price_modifier) || 0),
        stockQuantity: v.stock_quantity,
        sku: v.sku,
        isDefault: v.is_default,
      })),
    });
  } catch (error) {
    console.error("Failed to fetch variants:", error);
    return NextResponse.json({ error: "Failed to fetch variants" }, { status: 500 });
  }
}
