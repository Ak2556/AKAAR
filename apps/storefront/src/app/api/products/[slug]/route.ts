import { prisma } from "@akaar/db";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        meshFile: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Get related products (same category, excluding current)
    const relatedProducts = await prisma.product.findMany({
      where: {
        isActive: true,
        category: product.category,
        NOT: { id: product.id },
      },
      include: {
        meshFile: true,
      },
      take: 4,
    });

    return NextResponse.json({
      product,
      relatedProducts,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
