import { ArrowRight, Truck, Upload, Zap } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getCatalog } from "@/lib/catalog";
import { ProductsShell } from "./ProductsShell";

export type ProductSearchParams = Record<string, string | string[] | undefined>;

const PRODUCTS_PER_PAGE = 16;
const DEFAULT_VIEW: "grid" | "list" = "grid";

function getParam(searchParams: ProductSearchParams, key: string) {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

function normalizePage(value: string | undefined) {
  const page = Number(value ?? "1");
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
}

function normalizeSort(value: string | undefined) {
  if (value === "price-low" || value === "price-high" || value === "name") {
    return value;
  }
  return "newest";
}

function normalizeView(value: string | undefined) {
  if (value === "list" || value === "grid") return value;
  return DEFAULT_VIEW;
}

function sortToCatalogParams(sort: string) {
  if (sort === "price-low") return { sortBy: "price", sortOrder: "asc" };
  if (sort === "price-high") return { sortBy: "price", sortOrder: "desc" };
  if (sort === "name") return { sortBy: "name", sortOrder: "asc" };
  return { sortBy: "createdAt", sortOrder: "desc" };
}

export async function ProductIndexPage({
  searchParams,
}: {
  searchParams: ProductSearchParams;
}) {
  const page = normalizePage(getParam(searchParams, "page"));
  const category = getParam(searchParams, "category") ?? "all";
  const search = getParam(searchParams, "search") ?? null;
  const sort = normalizeSort(getParam(searchParams, "sort"));
  const viewMode = normalizeView(getParam(searchParams, "view"));
  const catalogSort = sortToCatalogParams(sort);

  const catalog = await getCatalog({
    page,
    limit: PRODUCTS_PER_PAGE,
    category,
    search,
    sortBy: catalogSort.sortBy,
    sortOrder: catalogSort.sortOrder,
  });

  const products = catalog.products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    category: product.category || "Uncategorized",
    price: product.price ? Number(product.price) : 0,
    description: product.description || product.shortDescription || undefined,
    imageUrl: product.imageUrl || undefined,
  }));

  return (
    <div className="min-h-screen pb-16">
      <div className="border-b border-[var(--border)] bg-[var(--surface-highlight)] pt-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 overflow-hidden px-4 py-2.5 text-center sm:gap-x-6 sm:px-6">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            <Truck className="h-3 w-3" />
            Free shipping · all orders
          </span>
          <span className="hidden h-3 w-px bg-[var(--border-accent)] sm:block" />
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            <Zap className="h-3 w-3" />
            Dispatch within 48 hrs · Jaipur
          </span>
          <span className="hidden h-3 w-px bg-[var(--border-accent)] sm:block" />
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)] sm:inline">
            Limited studio production · order while available
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <ProductsShell
          categories={catalog.categories}
          selectedCategory={category}
          sort={sort}
          viewMode={viewMode}
          page={catalog.pagination.page}
          totalProducts={catalog.pagination.total}
          totalPages={catalog.pagination.totalPages}
          catalogAvailable={catalog.catalogAvailable}
        >
          {!catalog.catalogAvailable ? (
            <EmptyState
              title="Collection unavailable"
              body={catalog.message || "Product data is not configured in this environment yet."}
              href="/quote"
              action="Request a build"
            />
          ) : null}

          {catalog.catalogAvailable && catalog.pagination.total === 0 ? (
            <EmptyState
              title="No products published yet"
              body="Browse again later or send your files directly for a reviewed build recommendation."
              href="/quote"
              action="Submit a custom build"
            />
          ) : null}

          {catalog.catalogAvailable && catalog.pagination.total > 0 ? (
            <ProductGrid products={products} viewMode={viewMode} />
          ) : null}
        </ProductsShell>

        <div className="mt-10 flex flex-col items-center gap-4 rounded-[2rem] border border-[var(--border-accent)] bg-[var(--surface-highlight)] px-6 py-6 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <div>
            <p className="display-font text-2xl text-[var(--text-primary)]">
              Need something specific?
            </p>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Upload your design or describe the part — we review every request personally.
            </p>
          </div>
          <Link
            href="/quote"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
          >
            Start a custom build
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  body,
  href,
  action,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
}) {
  return (
    <div className="luxury-card rounded-[2rem] px-6 py-14 text-center sm:px-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
        <Upload className="h-7 w-7 text-[var(--accent)]" />
      </div>
      <h3 className="display-font mt-6 text-3xl text-[var(--text-primary)]">{title}</h3>
      <p className="mx-auto mt-4 max-w-xl text-[var(--text-secondary)]">{body}</p>
      <Link
        href={href}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-7 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
      >
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
