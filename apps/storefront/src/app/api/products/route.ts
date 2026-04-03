import { prisma } from "@akaar/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "sortOrder";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Build where clause
    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { shortDescription: { contains: search, mode: "insensitive" } },
      ];
    }

    // Build orderBy
    const orderBy: Record<string, string> = {};
    if (sortBy === "price") {
      orderBy.price = sortOrder;
    } else if (sortBy === "name") {
      orderBy.name = sortOrder;
    } else if (sortBy === "createdAt") {
      orderBy.createdAt = sortOrder;
    } else {
      orderBy.sortOrder = "asc";
    }

    // Execute queries in parallel
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          meshFile: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    // Get unique categories for filtering
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories.map((c) => c.category).filter(Boolean),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
