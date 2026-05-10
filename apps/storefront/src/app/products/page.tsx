"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Grid,
  List,
  Loader2,
  Search,
  SlidersHorizontal,
  Truck,
  Upload,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { useSettings } from "@/context/SettingsContext";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface CategoryOption {
  id: string;
  label: string;
  count: number;
}

interface ProductsResponse {
  products: Array<{
    id: string;
    name: string;
    slug: string;
    category: string | null;
    price: number | string | null;
    description: string | null;
    imageUrl: string | null;
  }>;
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

const sortOptions = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

export default function ProductsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogAvailable, setCatalogAvailable] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get("search") ?? "");

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const category = searchParams.get("category") ?? "all";
  const sort = searchParams.get("sort") ?? "newest";
  const viewParam = searchParams.get("view");
  const viewMode =
    viewParam === "list" || viewParam === "grid" ? viewParam : settings.defaultView;

  const updateSearchParams = useCallback(
    (updates: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === "all") {
          next.delete(key);
        } else {
          next.set(key, value);
        }
      }

      if (!updates.page) {
        next.delete("page");
      }

      const nextUrl = next.toString() ? `${pathname}?${next.toString()}` : pathname;
      router.replace(nextUrl, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    const trimmed = searchInput.trim();
    const current = searchParams.get("search") ?? "";
    if (trimmed === current) return;

    const timeout = window.setTimeout(() => {
      updateSearchParams({ search: trimmed || null, page: null });
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [searchInput, searchParams, updateSearchParams]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", settings.productsPerPage.toString());

      const search = searchParams.get("search");
      if (search) params.set("search", search);
      if (category !== "all") params.set("category", category);

      if (sort === "price-low") {
        params.set("sortBy", "price");
        params.set("sortOrder", "asc");
      } else if (sort === "price-high") {
        params.set("sortBy", "price");
        params.set("sortOrder", "desc");
      } else if (sort === "name") {
        params.set("sortBy", "name");
        params.set("sortOrder", "asc");
      } else {
        params.set("sortBy", "createdAt");
        params.set("sortOrder", "desc");
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data: ProductsResponse = await response.json();

      setCatalogAvailable(data.catalogAvailable);
      setMessage(data.message ?? null);
      setProducts(
        data.products.map((product) => ({
          id: product.id,
          name: product.name,
          slug: product.slug,
          category: product.category || "Uncategorized",
          price: product.price ? Number(product.price) : 0,
          description: product.description || undefined,
          imageUrl: product.imageUrl || undefined,
        }))
      );
      setCategories(data.categories || []);
      setTotalPages(data.pagination?.totalPages ?? 0);
      setTotalProducts(data.pagination?.total ?? 0);
    } catch {
      setCatalogAvailable(false);
      setMessage("Catalog unavailable");
      setProducts([]);
      setCategories([]);
      setTotalPages(0);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  }, [category, page, searchParams, settings.productsPerPage, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const resultsLabel = useMemo(() => {
    if (loading) return "Loading...";
    if (!catalogAvailable) return "Unavailable";
    if (totalProducts === 0) return "No products";
    return `${totalProducts} product${totalProducts === 1 ? "" : "s"}${
      totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""
    }`;
  }, [catalogAvailable, loading, page, totalPages, totalProducts]);

  return (
    <div className="min-h-screen pb-16">
      {/* Urgency bar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface-highlight)] pt-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2.5 sm:px-6">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            <Truck className="h-3 w-3" />
            Free shipping · all orders
          </span>
          <span className="hidden h-3 w-px bg-[var(--border-accent)] sm:block" />
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            <Zap className="h-3 w-3" />
            Ships within 48 hrs · Jaipur
          </span>
          <span className="hidden h-3 w-px bg-[var(--border-accent)] sm:block" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Limited studio production · order while available
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Compact page header */}
        <div className="flex flex-col gap-3 pb-6 pt-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="luxury-kicker">AKAAR Collection</span>
            <h1 className="display-font mt-2 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Shop the Studio
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Live inventory
            </span>
            <span className="text-sm text-[var(--text-muted)]">{resultsLabel}</span>
          </div>
        </div>

        {/* Main shop layout */}
        <div id="shop-index" className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* Sidebar */}
          <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <div className="hidden lg:block">
              <ProductFilters
                categories={categories}
                selectedCategory={category}
                onCategoryChange={(nextCategory) =>
                  updateSearchParams({
                    category: nextCategory === "all" ? null : nextCategory,
                    page: null,
                  })
                }
                onClear={() =>
                  updateSearchParams({
                    category: null,
                    search: null,
                    sort: null,
                    view: null,
                    page: null,
                  })
                }
              />
            </div>

            <Link
              href="/quote"
              className="flex items-center justify-between rounded-[1.6rem] border border-[var(--border-accent)] px-5 py-4 text-sm text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span>Need a custom build?</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Product area */}
          <div className="space-y-5">
            {/* Controls */}
            <div className="luxury-card rounded-[1.8rem] p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowMobileFilters((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-3 text-sm text-[var(--text-primary)] lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  <select
                    value={sort}
                    onChange={(e) =>
                      updateSearchParams({
                        sort: e.target.value === "newest" ? null : e.target.value,
                        page: null,
                      })
                    }
                    className="luxury-input rounded-full px-4 py-3 text-sm"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>

                  <div className="hidden overflow-hidden rounded-full border border-[var(--border-accent)] sm:flex">
                    <button
                      onClick={() =>
                        updateSearchParams({
                          view: settings.defaultView === "grid" ? null : "grid",
                        })
                      }
                      className={`px-4 py-3 ${
                        viewMode === "grid"
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() =>
                        updateSearchParams({
                          view: settings.defaultView === "list" ? null : "list",
                        })
                      }
                      className={`px-4 py-3 ${
                        viewMode === "list"
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
                          : "text-[var(--text-secondary)]"
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-0.5">
                <CategoryPill
                  label="All"
                  count={totalProducts}
                  active={category === "all"}
                  onClick={() => updateSearchParams({ category: null, page: null })}
                />
                {categories.map((item) => (
                  <CategoryPill
                    key={item.id}
                    label={item.label}
                    count={item.count}
                    active={category === item.id}
                    onClick={() => updateSearchParams({ category: item.id, page: null })}
                  />
                ))}
              </div>
            </div>

            {/* Mobile filters */}
            {showMobileFilters ? (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="lg:hidden"
              >
                <ProductFilters
                  categories={categories}
                  selectedCategory={category}
                  onCategoryChange={(nextCategory) =>
                    updateSearchParams({
                      category: nextCategory === "all" ? null : nextCategory,
                      page: null,
                    })
                  }
                  onClear={() =>
                    updateSearchParams({
                      category: null,
                      search: null,
                      sort: null,
                      view: null,
                      page: null,
                    })
                  }
                />
              </motion.div>
            ) : null}

            {/* Product grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
              </div>
            ) : null}

            {!loading && !catalogAvailable ? (
              <EmptyState
                title="Collection unavailable"
                body={message || "Product data is not configured in this environment yet."}
                href="/quote"
                action="Request a build"
              />
            ) : null}

            {!loading && catalogAvailable && totalProducts === 0 ? (
              <EmptyState
                title="No products published yet"
                body="Browse again later or send your files directly for a reviewed build recommendation."
                href="/quote"
                action="Submit a custom build"
              />
            ) : null}

            {!loading && catalogAvailable && totalProducts > 0 ? (
              <ProductGrid products={products} viewMode={viewMode} />
            ) : null}

            {/* Pagination */}
            {!loading && catalogAvailable && totalPages > 1 ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
                <PageButton
                  disabled={page === 1}
                  onClick={() =>
                    updateSearchParams({
                      page: page > 2 ? String(page - 1) : page === 2 ? "1" : null,
                    })
                  }
                >
                  Previous
                </PageButton>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let p: number;
                  if (totalPages <= 5) p = i + 1;
                  else if (page <= 3) p = i + 1;
                  else if (page >= totalPages - 2) p = totalPages - 4 + i;
                  else p = page - 2 + i;

                  return (
                    <PageButton
                      key={p}
                      active={p === page}
                      onClick={() =>
                        updateSearchParams({ page: p > 1 ? String(p) : null })
                      }
                    >
                      {p}
                    </PageButton>
                  );
                })}

                <PageButton
                  disabled={page === totalPages}
                  onClick={() =>
                    updateSearchParams({
                      page: String(Math.min(totalPages, page + 1)),
                    })
                  }
                >
                  Next
                </PageButton>
              </div>
            ) : null}
          </div>
        </div>

        {/* Footer CTA strip */}
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

function CategoryPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-all ${
        active
          ? "border-[var(--accent)] bg-[var(--surface-highlight)] text-[var(--text-primary)]"
          : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="luxury-metric-label">{count}</span>
    </button>
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

function PageButton({
  children,
  onClick,
  disabled,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-4 py-2.5 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-[var(--text-primary)] text-[var(--bg-primary)]"
          : "border border-[var(--border-accent)] text-[var(--text-primary)] hover:border-[var(--accent)]"
      }`}
    >
      {children}
    </button>
  );
}
