import { createClient } from "@/lib/supabase/server";

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | string | null;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
}

export interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

export interface CatalogQueryOptions {
  page?: number;
  limit?: number;
  category?: string | null;
  search?: string | null;
  sortBy?: string | null;
  sortOrder?: string | null;
}

export interface CatalogResult {
  products: CatalogProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: CategoryOption[];
  catalogAvailable: boolean;
  empty: boolean;
  message?: string;
}

const PRODUCT_SELECT =
  "id,name,slug,category,price,description,short_description,image_url,created_at,sort_order";

const validSortCols: Record<string, string> = {
  price: "price",
  name: "name",
  createdAt: "created_at",
  sortOrder: "sort_order",
};

function normalizePositiveInteger(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value) || !value || value < 1) return fallback;
  return Math.floor(value);
}

function normalizeSearch(search: string | null | undefined) {
  const trimmed = search?.trim();
  if (!trimmed) return null;
  return trimmed.replace(/[,%]/g, " ").replace(/\s+/g, " ").slice(0, 80);
}

function emptyCatalog(page: number, limit: number, message?: string): CatalogResult {
  return {
    products: [],
    pagination: { page, limit, total: 0, totalPages: 0 },
    categories: [],
    catalogAvailable: false,
    empty: true,
    message,
  };
}

export async function getCatalog(options: CatalogQueryOptions = {}): Promise<CatalogResult> {
  const page = normalizePositiveInteger(options.page, 1);
  const limit = Math.min(normalizePositiveInteger(options.limit, 12), 48);
  const offset = (page - 1) * limit;
  const category = options.category && options.category !== "all" ? options.category : null;
  const search = normalizeSearch(options.search);
  const sortBy = options.sortBy || "sort_order";
  const sortOrder = options.sortOrder === "desc" ? "desc" : "asc";

  try {
    const supabase = await createClient();

    let query = supabase
      .from("products")
      .select(PRODUCT_SELECT, { count: "exact" })
      .eq("is_active", true);

    if (category) {
      query = query.ilike("category", category);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,short_description.ilike.%${search}%`
      );
    }

    const sortColumn = validSortCols[sortBy] ?? "sort_order";
    query = query.order(sortColumn, { ascending: sortOrder !== "desc" });

    const [{ data: products, count, error }, { data: cats, error: categoryError }] =
      await Promise.all([
        query.range(offset, offset + limit - 1),
        supabase
          .from("products")
          .select("category")
          .eq("is_active", true)
          .not("category", "is", null),
      ]);

    if (error) throw error;
    if (categoryError) throw categoryError;

    const categoryMap: Record<string, number> = {};
    for (const row of cats ?? []) {
      if (row.category) {
        categoryMap[row.category] = (categoryMap[row.category] ?? 0) + 1;
      }
    }

    const categories = Object.entries(categoryMap)
      .map(([label, count]) => ({ id: label.toLowerCase(), label, count }))
      .sort((a, b) => a.label.localeCompare(b.label));

    const mapped = (products ?? []).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: product.category ?? null,
      price: product.price,
      description: product.description ?? null,
      shortDescription: product.short_description ?? null,
      imageUrl: product.image_url ?? null,
    }));

    const total = count ?? 0;

    return {
      products: mapped,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      categories,
      catalogAvailable: true,
      empty: total === 0,
    };
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return emptyCatalog(page, limit, "Catalog unavailable");
  }
}
