"use client";

import { useOptimistic, useTransition, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2,
  Search,
  Package,
  ExternalLink,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  toggleProductActive,
  deleteProduct,
  moveProduct,
} from "@/app/admin/products/actions";

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  imageUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
}

type FilterMode = "all" | "active" | "draft";

export function ProductListTable({
  products: initial,
}: {
  products: AdminProduct[];
}) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [actionError, setActionError] = useState<string | null>(null);

  // ── Optimistic state ──────────────────────────────────────────────────
  const [optimistic, dispatch] = useOptimistic(
    initial,
    (
      state: AdminProduct[],
      action:
        | { kind: "toggle"; id: string; isActive: boolean }
        | { kind: "delete"; id: string }
        | { kind: "move"; id: string; direction: "up" | "down" }
    ) => {
      switch (action.kind) {
        case "toggle":
          return state.map((p) =>
            p.id === action.id ? { ...p, isActive: action.isActive } : p
          );
        case "delete":
          return state.filter((p) => p.id !== action.id);
        case "move": {
          const idx = state.findIndex((p) => p.id === action.id);
          const swapIdx = action.direction === "up" ? idx - 1 : idx + 1;
          if (swapIdx < 0 || swapIdx >= state.length) return state;
          const next = [...state];
          [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
          return next;
        }
      }
    }
  );

  // ── Derived filtered list ─────────────────────────────────────────────
  const visible = useMemo(() => {
    const term = search.toLowerCase();
    return optimistic.filter((p) => {
      const matchSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.slug.toLowerCase().includes(term) ||
        (p.category ?? "").toLowerCase().includes(term);
      const matchFilter =
        filter === "all" ||
        (filter === "active" && p.isActive) ||
        (filter === "draft" && !p.isActive);
      return matchSearch && matchFilter;
    });
  }, [optimistic, search, filter]);

  const activeCount = optimistic.filter((p) => p.isActive).length;
  const draftCount = optimistic.filter((p) => !p.isActive).length;

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleToggle = (id: string, current: boolean) => {
    setActionError(null);
    startTransition(async () => {
      dispatch({ kind: "toggle", id, isActive: !current });
      try {
        await toggleProductActive(id, !current);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Toggle failed");
      }
    });
  };

  const handleDelete = (id: string) => {
    setActionError(null);
    setConfirmDelete(null);
    startTransition(async () => {
      dispatch({ kind: "delete", id });
      try {
        await deleteProduct(id);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Delete failed");
      }
    });
  };

  const handleMove = (id: string, direction: "up" | "down") => {
    setActionError(null);
    startTransition(async () => {
      dispatch({ kind: "move", id, direction });
      try {
        await moveProduct(id, direction);
      } catch (e) {
        setActionError(e instanceof Error ? e.message : "Reorder failed");
      }
    });
  };

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Stats + filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(
            [
              { key: "all",    label: `All (${optimistic.length})`  },
              { key: "active", label: `Live (${activeCount})`  },
              { key: "draft",  label: `Draft (${draftCount})` },
            ] as { key: FilterMode; label: string }[]
          ).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-all ${
                filter === key
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent"
                  : "border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--accent)]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="luxury-input w-full rounded-full py-2 pl-9 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Error banner */}
      {actionError && (
        <div className="flex items-center gap-2 rounded-[var(--rad-md)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {actionError}
          <button
            onClick={() => setActionError(null)}
            aria-label="Dismiss error"
            className="ml-auto text-red-400 hover:text-red-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="luxury-card px-6 py-12 text-center">
          <Package className="mx-auto mb-3 h-10 w-10 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-secondary)]">
            {search || filter !== "all"
              ? "No products match this filter."
              : "No products yet — create your first one below."}
          </p>
        </div>
      )}

      {/* Product list */}
      {visible.length > 0 && (
        <div className="luxury-card overflow-hidden">
          {/* Desktop header */}
          <div className="hidden grid-cols-[2fr_1fr_90px_72px_80px] items-center gap-4 border-b border-[var(--border)] px-5 py-3 sm:grid">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Product</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Category · Price</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Status</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Order</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">Actions</span>
          </div>

          <ul className="divide-y divide-[var(--border)]">
            {visible.map((product, idx) => {
              const isConfirming = confirmDelete === product.id;
              const isFirst = idx === 0;
              const isLast = idx === visible.length - 1;

              return (
                <li
                  key={product.id}
                  className={`group transition-colors ${isConfirming ? "bg-red-500/5" : "hover:bg-[var(--bg-primary)]"}`}
                >
                  {isConfirming ? (
                    /* ── Delete confirmation row ─────────────────────── */
                    <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                      <span className="text-sm text-[var(--text-primary)]">
                        Delete{" "}
                        <strong className="font-semibold">{product.name}</strong>?
                        This is permanent.
                      </span>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-full border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--text-muted)] hover:border-[var(--accent)] transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={isPending}
                          className="inline-flex items-center gap-1.5 rounded-full bg-red-500 px-4 py-1.5 text-xs font-medium text-white transition-opacity hover:bg-red-600 disabled:opacity-50"
                        >
                          {isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Trash2 className="h-3 w-3" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ── Normal product row ──────────────────────────── */
                    <div className="grid grid-cols-1 items-center gap-3 px-5 py-3.5 sm:grid-cols-[2fr_1fr_90px_72px_80px] sm:gap-4">

                      {/* Thumbnail + name */}
                      <div className="flex items-center gap-3">
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-[var(--rad-sm)] border border-[var(--border)] bg-[var(--bg-primary)]">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl}
                              alt={product.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Package className="h-4 w-4 text-[var(--text-muted)]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                            {product.name}
                          </p>
                          <p className="truncate text-[11px] text-[var(--text-muted)]">
                            /{product.slug}
                          </p>
                        </div>
                      </div>

                      {/* Category + price */}
                      <div className="flex flex-wrap items-center gap-1.5 sm:flex-col sm:items-start sm:gap-0.5">
                        {product.category && (
                          <span className="rounded-full bg-[var(--bg-primary)] border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                            {product.category}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {product.price != null
                            ? "₹" + product.price.toLocaleString("en-IN")
                            : "—"}
                        </span>
                      </div>

                      {/* Active toggle */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggle(product.id, product.isActive)
                          }
                          disabled={isPending}
                          title={
                            product.isActive
                              ? "Click to make draft"
                              : "Click to make live"
                          }
                          className="group/toggle flex items-center gap-2 disabled:opacity-60"
                        >
                          {/* Toggle pill */}
                          <span
                            className={`relative inline-flex h-5 w-9 items-center rounded-full border transition-colors ${
                              product.isActive
                                ? "border-emerald-500/40 bg-emerald-500/20"
                                : "border-[var(--border)] bg-[var(--bg-primary)]"
                            }`}
                          >
                            <span
                              className={`absolute h-3.5 w-3.5 rounded-full transition-transform ${
                                product.isActive
                                  ? "translate-x-[18px] bg-emerald-400"
                                  : "translate-x-[2px] bg-[var(--text-muted)]"
                              }`}
                            />
                          </span>
                          <span
                            className={`hidden text-[11px] font-medium sm:block ${
                              product.isActive
                                ? "text-emerald-400"
                                : "text-[var(--text-muted)]"
                            }`}
                          >
                            {product.isActive ? "Live" : "Draft"}
                          </span>
                        </button>
                      </div>

                      {/* Sort order */}
                      <div className="flex items-center gap-0.5">
                        <button
                          onClick={() => handleMove(product.id, "up")}
                          disabled={isPending || isFirst}
                          title="Move up"
                          className="rounded-[var(--rad-xs)] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleMove(product.id, "down")}
                          disabled={isPending || isLast}
                          title="Move down"
                          className="rounded-[var(--rad-xs)] p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] disabled:opacity-20"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        {/* Preview on storefront */}
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="View on storefront"
                          className="rounded-[var(--rad-xs)] p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>

                        {/* Edit */}
                        <Link
                          href={`/admin/products/${product.id}`}
                          title="Edit product"
                          className="rounded-[var(--rad-xs)] p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--accent)]"
                          prefetch
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDelete(product.id)}
                          title="Delete product"
                          className="rounded-[var(--rad-xs)] p-2 text-[var(--text-muted)] transition-colors hover:bg-red-500/10 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
