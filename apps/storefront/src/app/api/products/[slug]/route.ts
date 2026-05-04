import { prisma } from "@akaar/db";
import { NextResponse } from "next/server";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import {
  getLocalProductBySlug,
  listLocalRelatedProducts,
} from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!getRuntimeCapabilities().catalogAvailable) {
    return NextResponse.json(
      { error: "Catalog unavailable", catalogAvailable: false },
      { status: 503 }
    );
  }

  try {
    const { slug } = await params;

    if (isLocalDataMode()) {
      const product = await getLocalProductBySlug(slug);

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const relatedProducts = await listLocalRelatedProducts(
        product.id,
        product.category,
        4
      );

      return NextResponse.json({
        product,
        relatedProducts,
        catalogAvailable: true,
      });
    }

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
      catalogAvailable: true,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Catalog unavailable", catalogAvailable: false },
      { status: 503 }
    );
  }
}
