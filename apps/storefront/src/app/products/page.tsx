"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Grid,
  List,
  Loader2,
  Search,
  SlidersHorizontal,
  Sparkles,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ProductFilters } from "@/components/products/ProductFilters";
import { ProductGrid } from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/Button";
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

const editorialMoments = [
  {
    title: "Planter line",
    body: "Desk-scale lighting and enclosure studies show how decorative products are developed as a family, not as isolated prints.",
    image: "/showcase/studio/planter-lineup.png",
  },
  {
    title: "Sculpt detail",
    body: "Character pieces help test finish, silhouette retention, and how a product reads once it leaves the workbench.",
    image: "/showcase/studio/shiva-outdoor.png",
    mediaMode: "portrait-stage",
  },
  {
    title: "Pavilion study",
    body: "Multi-part work like the pavilion shows how display objects can move beyond single-part prints into complete scenes.",
    image: "/showcase/studio/ganesha-pavilion.png",
  },
];

const shopSignals = [
  {
    label: "Browse",
    value: "Real studio photography, published prices, live inventory",
  },
  {
    label: "Filter",
    value: "By category, material, or name — or search directly",
  },
  {
    label: "Go custom",
    value: "Any listing becomes the starting point for a build request",
  },
];

const shopTrust = [
  "Real studio photos",
  "Quote-ready products",
  "Published categories",
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
    if (trimmed === current) {
      return;
    }

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
      if (search) {
        params.set("search", search);
      }

      if (category !== "all") {
        params.set("category", category);
      }

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

      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: "no-store",
      });
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
    if (loading) return "Loading collection...";
    if (!catalogAvailable) return "Collection unavailable";
    if (totalProducts === 0) return "No products published yet";
    return `${totalProducts} product${totalProducts === 1 ? "" : "s"} available${
      totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""
    }`;
  }, [catalogAvailable, loading, page, totalPages, totalProducts]);

  const featuredProduct = products[0];

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="luxury-panel relative overflow-hidden rounded-[2.45rem]"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.16),transparent_28%),radial-gradient(circle_at_86%_22%,rgba(125,211,199,0.12),transparent_24%)]" />
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-10">
            <div className="relative z-10 flex flex-col justify-between gap-8">
              <div className="editorial-stage-copy space-y-5">
                <span className="luxury-kicker">Shop AKAAR</span>
                <h1 className="display-font max-w-[11ch] text-[clamp(2.9rem,4.45vw,4.8rem)] leading-[0.96] text-[var(--text-primary)]">
                  The live shop for products you can browse, compare, and build from.
                </h1>
                <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  Every item ships from a real studio setup in Jaipur. Compare products, browse by category, and move directly to cart — or start a custom build request from any listing.
                </p>
                <p className="editorial-eyebrow">Published products · Search and filter · Cart or quote</p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="#shop-index">
                  <Button size="lg">
                    Browse products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/quote">
                  <Button variant="outline" size="lg">
                    Request a custom build
                  </Button>
                </Link>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)]">
                {shopSignals.map((signal) => (
                  <div
                    key={signal.label}
                    className="flex items-start justify-between gap-5 bg-[var(--bg-secondary)] px-5 py-5"
                  >
                    <p className="luxury-metric-label">{signal.label}</p>
                    <p className="max-w-sm text-right text-sm leading-6 text-[var(--text-primary)]">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="luxury-stage relative min-h-[420px] overflow-hidden rounded-[2rem] border border-white/8 p-5">
                <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">Shop highlight</div>
                <div className="editorial-media-frame absolute inset-x-5 bottom-5 top-16">
                  <img
                    src={featuredProduct?.imageUrl || "/showcase/studio/planter-lineup.png"}
                    alt={featuredProduct?.name || "AKAAR featured collection"}
                    className="hero-image-shadow"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.04)_0%,rgba(7,7,10,0.3)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="bg-[rgba(11,12,15,0.78)] px-5 py-4 backdrop-blur-md">
                    <p className="display-font text-2xl uppercase text-white">
                      {featuredProduct?.name || "Published collection"}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-white/68">
                      {featuredProduct?.description || "Designed and produced at the AKAAR studio in Jaipur. Browse the full catalog below to find the right fit, or move into a custom build."}
                    </p>
                  </div>
                  <div className="bg-[rgba(11,12,15,0.78)] px-5 py-4 backdrop-blur-md">
                    <p className="luxury-metric-label text-white/42">Catalog status</p>
                    <p className="mt-2 text-sm font-medium text-white">
                      {catalogAvailable ? "Live now" : "Unavailable"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
                <ShowcaseTile
                  title={`${totalProducts || 0} listings`}
                  image="/showcase/studio/ganesha-closeup.png"
                  subtitle="Published products currently in the shop"
                />
                <ShowcaseTile
                  title={`${categories.length || 0} categories`}
                  image="/showcase/studio/workspace-setup.png"
                  subtitle="Browse by product type instead of guessing"
                />
              </div>
            </div>
          </div>
        </motion.section>

        <section id="shop-index" className="mt-10 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="luxury-card rounded-[2rem] p-5 sm:p-6">
              <div className="flex flex-col gap-4">
                <span className="luxury-kicker">Shop controls</span>
                <p className="text-sm leading-7 text-[var(--text-secondary)]">
                  Start with category and search, then use list or grid view depending on whether you’re comparing imagery or reading the details closely.
                </p>
                <div className="flex flex-wrap gap-2">
                  {shopTrust.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

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

            <div className="luxury-panel overflow-hidden rounded-[1.9rem] px-5 py-6">
              <span className="luxury-kicker">Need something custom?</span>
              <p className="mt-4 display-font text-3xl text-[var(--text-primary)]">
                Use the shop as a reference, then switch to quote.
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                If the live listing is close but not exact, move into a reviewed build request and specify scale, finish, material, or geometry changes.
              </p>
              <Link
                href="/quote"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
              >
                Start custom quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="luxury-card rounded-[2rem] p-5 sm:p-6">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search by part name, material, or category"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setShowMobileFilters((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-3 text-sm text-[var(--text-primary)] lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>

                  <select
                    value={sort}
                    onChange={(event) =>
                      updateSearchParams({
                        sort: event.target.value === "newest" ? null : event.target.value,
                        page: null,
                      })
                    }
                    className="luxury-input rounded-full px-4 py-3 text-sm"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
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

              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex gap-3 overflow-x-auto pb-1">
                  <CategoryPill
                    label="All categories"
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
                <div className="text-sm text-[var(--text-muted)]">{resultsLabel}</div>
              </div>
            </div>
            </div>

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

            {featuredProduct ? (
              <div className="luxury-card overflow-hidden rounded-[2rem]">
                <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.9fr_1.1fr]">
                  <div className="luxury-stage relative min-h-[280px] overflow-hidden p-5">
                    <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">Featured listing</div>
                    <div className="editorial-media-frame absolute inset-x-5 bottom-5 top-14">
                      <img
                        src={featuredProduct.imageUrl || "/showcase/studio/planter-lineup.png"}
                        alt={featuredProduct.name}
                        className="hero-image-shadow"
                      />
                    </div>
                  </div>
                  <div className="bg-[var(--bg-secondary)] px-6 py-6 sm:px-7">
                    <span className="luxury-kicker">{featuredProduct.category}</span>
                    <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                      {featuredProduct.name}
                    </h2>
                    <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      {featuredProduct.description || "Use the featured listing as a quick entry point into the shop, then compare it against the rest of the live catalog below."}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link
                        href={`/products/${featuredProduct.slug}`}
                        className="inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-5 py-3 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
                      >
                        View product
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="inline-flex items-center rounded-full border border-[var(--border-accent)] px-4 py-3 text-sm text-[var(--text-secondary)]">
                        Add to cart or request a custom build
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <section>
              <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-3xl">
                  <span className="luxury-kicker">Live inventory</span>
                  <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                    Browse the products first, then decide how custom you need to go.
                  </h2>
                </div>
                <div className="rounded-full border border-[var(--border-accent)] px-4 py-2.5 text-sm text-[var(--text-secondary)]">
                  {featuredProduct ? `Featured listing: ${featuredProduct.name}` : "Published product index"}
                </div>
              </div>

              <div>
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
              </div>

              {!loading && catalogAvailable && totalPages > 1 ? (
                <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
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

                  {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                    let pageNumber: number;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (page <= 3) {
                      pageNumber = index + 1;
                    } else if (page >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = page - 2 + index;
                    }

                    return (
                      <PageButton
                        key={pageNumber}
                        active={pageNumber === page}
                        onClick={() =>
                          updateSearchParams({
                            page: pageNumber > 1 ? String(pageNumber) : null,
                          })
                        }
                      >
                        {pageNumber}
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
            </section>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">From the studio</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Every listing comes out of a real working process.
            </h2>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {editorialMoments.map((moment) => (
              <article key={moment.title} className="luxury-card overflow-hidden rounded-[2rem]">
                <div className={`luxury-stage relative min-h-[250px] overflow-hidden p-5 ${moment.mediaMode === "portrait-stage" ? "flex items-center justify-center" : ""}`}>
                  <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">{moment.title}</div>
                  <div
                    className={
                      moment.mediaMode === "portrait-stage"
                        ? "editorial-media-frame relative z-10 aspect-[4/5] h-[190px] w-full max-w-[190px] bg-[linear-gradient(180deg,#dfe6f5_0%,#c8d2e8_60%,#b7c3dd_100%)] p-4"
                        : "editorial-media-frame absolute inset-x-5 bottom-5 top-14"
                    }
                  >
                    <img
                      src={moment.image}
                      alt={moment.title}
                      className={`hero-image-shadow ${moment.mediaMode === "portrait-stage" ? "object-contain object-center" : ""}`}
                    />
                  </div>
                </div>
                <div className="border-t border-[var(--border)] px-6 py-6">
                  <h3 className="display-font text-3xl text-[var(--text-primary)]">{moment.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{moment.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 luxury-panel overflow-hidden rounded-[2.2rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {["Real photography", "Published inventory", "Configurable listings"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                  {item}
                </span>
              ))}
            </div>
            <span className="luxury-kicker">Need something beyond the catalog?</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Move from shop listing to custom build.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              Use a product page as the starting point, then shift into a reviewed quote when the geometry, finish, scale, or material needs to change.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/quote">
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Start a Custom Build
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  See the Studio Story
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ShowcaseTile({
  title,
  image,
  subtitle,
}: {
  title: string;
  image: string;
  subtitle: string;
}) {
  return (
    <div className="luxury-card overflow-hidden rounded-[1.8rem]">
      <div className="luxury-stage relative min-h-[200px] overflow-hidden p-4">
        <img
          src={image}
          alt={title}
          className="hero-image-shadow h-full w-full rounded-[1.35rem] object-cover"
        />
      </div>
      <div className="border-t border-[var(--border)] px-5 py-4">
        <p className="display-font text-2xl text-[var(--text-primary)]">{title}</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{subtitle}</p>
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
      className={`flex items-center gap-3 whitespace-nowrap rounded-full border px-4 py-3 transition-all ${
        active
          ? "border-[var(--accent)] bg-[var(--surface-highlight)] text-[var(--text-primary)]"
          : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
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
