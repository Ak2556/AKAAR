"use client";

import { motion } from "framer-motion";
import { PackageSearch } from "lucide-react";
import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  viewMode?: "grid" | "list";
}

export function ProductGrid({ products, loading = false, viewMode = "grid" }: ProductGridProps) {
  /* ── Loading skeletons ── */
  if (loading) {
    return viewMode === "grid" ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-[var(--border)] overflow-hidden bg-[var(--bg-secondary)]">
            <div className="aspect-[4/3] bg-[var(--bg-tertiary)]" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-[var(--bg-tertiary)] rounded-full w-3/4" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded-full w-full" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded-full w-2/3" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-[var(--bg-tertiary)] rounded-full w-1/3" />
                <div className="h-8 bg-[var(--bg-tertiary)] rounded-xl w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse flex gap-5 p-4 border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)]">
            <div className="w-28 h-28 bg-[var(--bg-tertiary)] rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2.5 py-1">
              <div className="h-3.5 bg-[var(--bg-tertiary)] rounded-full w-1/3" />
              <div className="h-4 bg-[var(--bg-tertiary)] rounded-full w-2/3" />
              <div className="h-3 bg-[var(--bg-tertiary)] rounded-full w-full" />
              <div className="h-5 bg-[var(--bg-tertiary)] rounded-full w-1/4" />
            </div>
            <div className="w-28 space-y-2 py-1 flex-shrink-0">
              <div className="h-8 bg-[var(--bg-tertiary)] rounded-xl" />
              <div className="h-8 bg-[var(--bg-tertiary)] rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ── Empty state ── */
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-28 text-center"
      >
        <div className="w-20 h-20 mb-6 border border-dashed border-[var(--accent)]/30 rounded-2xl flex items-center justify-center">
          <PackageSearch className="w-9 h-9 text-[var(--accent)]/40" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No products found</h3>
        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
          Try a different search term or adjust the active filters.
        </p>
      </motion.div>
    );
  }

  /* ── List view ── */
  if (viewMode === "list") {
    return (
      <div className="space-y-3">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
          >
            <ProductListItem {...product} />
          </motion.div>
        ))}
      </div>
    );
  }

  /* ── Grid view ── */
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {products.map((product, i) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
        >
          <ProductCard {...product} />
        </motion.div>
      ))}
    </div>
  );
}
