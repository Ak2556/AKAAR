import { prisma } from "@akaar/db";
import { NextResponse } from "next/server";
import { getRuntimeCapabilities } from "@/lib/runtime-capabilities";
import { listLocalProducts } from "@/lib/local-data-store";
import { isLocalDataMode } from "@/lib/local-runtime";

function buildSearchWhere(search: string | null) {
  if (!search) {
    return undefined;
  }

  return [
    { name: { contains: search, mode: "insensitive" as const } },
    { description: { contains: search, mode: "insensitive" as const } },
    { shortDescription: { contains: search, mode: "insensitive" as const } },
  ];
}

export async function GET(request: Request) {
  const capabilities = getRuntimeCapabilities();

  if (!capabilities.catalogAvailable) {
    return NextResponse.json(
      {
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        },
        categories: [],
        catalogAvailable: false,
        empty: true,
        message: "Catalog unavailable",
      },
      { status: 503 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const sortBy = searchParams.get("sortBy") || "sortOrder";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    if (isLocalDataMode()) {
      const { products, total, categories } = await listLocalProducts({
        page,
        limit,
        category,
        search,
        sortBy,
        sortOrder,
      });

      return NextResponse.json({
        products,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
        categories,
        catalogAvailable: true,
        empty: total === 0,
      });
    }

    // Build where clause
    const searchWhere = buildSearchWhere(search);

    const where: Record<string, unknown> = {
      isActive: true,
    };

    if (category && category !== "all") {
      where.category = {
        equals: category,
        mode: "insensitive",
      };
    }

    if (searchWhere) {
      where.OR = searchWhere;
    }

    const categoryWhere: Record<string, unknown> = { isActive: true };
    if (searchWhere) {
      categoryWhere.OR = searchWhere;
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
    const [products, total, categories] = await Promise.all([
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
      prisma.product.groupBy({
        by: ["category"],
        where: categoryWhere,
        _count: {
          category: true,
        },
        orderBy: {
          category: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories
        .filter((entry) => Boolean(entry.category))
        .map((entry) => ({
          id: entry.category!.toLowerCase(),
          label: entry.category!,
          count: entry._count.category,
        })),
      catalogAvailable: true,
      empty: total === 0,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
        },
        categories: [],
        catalogAvailable: false,
        empty: true,
        message: "Catalog unavailable",
      },
      { status: 503 }
    );
  }
}
