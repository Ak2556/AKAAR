"use client";

import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  Grid,
  List,
  MessageCircle,
  PackageCheck,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { ProductFilters } from "@/components/products/ProductFilters";
import { useSettings } from "@/context/SettingsContext";
import type { CategoryOption } from "@/lib/catalog";

const sortOptions = [
  { value: "newest", label: "Newest arrivals" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
  { value: "name", label: "Name" },
];

const confidenceItems = [
  { icon: BadgeCheck, title: "Studio checked", body: "Finish and packing reviewed before dispatch." },
  { icon: Clock3, title: "48h dispatch", body: "Ready listings leave the Jaipur studio quickly." },
  { icon: PackageCheck, title: "Free standard shipping", body: "No surprise shipping line on ready products." },
  { icon: MessageCircle, title: "Custom fallback", body: "Need changes? Move any item into quote review." },
];

interface ProductsShellProps {
  categories: CategoryOption[];
  selectedCategory: string;
  sort: string;
  viewMode: "grid" | "list";
  page: number;
  totalProducts: number;
  totalPages: number;
  catalogAvailable: boolean;
  children: React.ReactNode;
}

export function ProductsShell({
  categories,
  selectedCategory,
  sort,
  viewMode,
  page,
  totalProducts,
  totalPages,
  catalogAvailable,
  children,
}: ProductsShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { settings } = useSettings();
  const [isPending, startTransition] = useTransition();
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const currentSearch = searchParams.get("search") ?? "";

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
      startTransition(() => {
        router.replace(nextUrl, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const resultsLabel = useMemo(() => {
    if (isPending) return "Updating...";
    if (!catalogAvailable) return "Unavailable";
    if (totalProducts === 0) return "No products";
    return `${totalProducts} product${totalProducts === 1 ? "" : "s"}${
      totalPages > 1 ? ` · page ${page} of ${totalPages}` : ""
    }`;
  }, [catalogAvailable, isPending, page, totalPages, totalProducts]);

  return (
    <>
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

      <div id="shop-index" className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="hidden lg:block">
            <ProductFilters
              categories={categories}
              selectedCategory={selectedCategory}
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

        <div className={`space-y-5 ${isPending ? "opacity-70 transition-opacity" : ""}`}>
          <div className="luxury-card rounded-[1.8rem] p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <SearchInput
                  key={currentSearch}
                  initialValue={currentSearch}
                  onSearchChange={(value) =>
                    updateSearchParams({ search: value || null, page: null })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
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
                    type="button"
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
                    aria-label="Grid view"
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
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
                    aria-label="List view"
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
                active={selectedCategory === "all"}
                onClick={() => updateSearchParams({ category: null, page: null })}
              />
              {categories.map((item) => (
                <CategoryPill
                  key={item.id}
                  label={item.label}
                  count={item.count}
                  active={selectedCategory === item.id}
                  onClick={() => updateSearchParams({ category: item.id, page: null })}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
            {confidenceItems.map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[var(--bg-secondary)] px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
                    <Icon className="h-4 w-4 text-[var(--accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
                    <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {showMobileFilters ? (
            <div className="lg:hidden">
              <ProductFilters
                categories={categories}
                selectedCategory={selectedCategory}
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
          ) : null}

          {children}

          {catalogAvailable && totalPages > 1 ? (
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

              {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                let pageNumber: number;
                if (totalPages <= 5) pageNumber = index + 1;
                else if (page <= 3) pageNumber = index + 1;
                else if (page >= totalPages - 2) pageNumber = totalPages - 4 + index;
                else pageNumber = page - 2 + index;

                return (
                  <PageButton
                    key={pageNumber}
                    active={pageNumber === page}
                    onClick={() =>
                      updateSearchParams({ page: pageNumber > 1 ? String(pageNumber) : null })
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
        </div>
      </div>
    </>
  );
}

function SearchInput({
  initialValue,
  onSearchChange,
}: {
  initialValue: string;
  onSearchChange: (value: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const trimmed = value.trim();
    if (trimmed === initialValue) return;

    const timeout = window.setTimeout(() => {
      onSearchChange(trimmed);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [initialValue, onSearchChange, value]);

  return (
    <input
      type="text"
      placeholder="Search products..."
      value={value}
      onChange={(event) => setValue(event.target.value)}
      className="luxury-input w-full rounded-full py-3 pl-11 pr-4 text-sm"
    />
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
      type="button"
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
      type="button"
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
