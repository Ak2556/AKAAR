"use client";

import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { motion } from "framer-motion";

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
  if (loading) {
    return (
      <div className={viewMode === "grid"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        : "space-y-4"
      }>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            {viewMode === "grid" ? (
              <>
                <div className="aspect-square bg-[var(--bg-tertiary)] rounded-xl" />
                <div className="mt-4 space-y-2">
                  <div className="h-5 bg-[var(--bg-tertiary)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/2" />
                </div>
              </>
            ) : (
              <div className="flex gap-4 p-4 border border-[var(--border)] rounded-xl">
                <div className="w-32 h-32 bg-[var(--bg-tertiary)] rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-[var(--bg-tertiary)] rounded w-1/2" />
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded w-3/4" />
                  <div className="h-4 bg-[var(--bg-tertiary)] rounded w-1/4" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="w-20 h-20 mx-auto mb-6 border border-[var(--border)] rounded-xl flex items-center justify-center">
          <span className="text-[var(--text-muted)] font-mono">?</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-[var(--text-secondary)]">
          Try adjusting your filters or search terms
        </p>
      </motion.div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <ProductListItem {...product} />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <ProductCard {...product} />
        </motion.div>
      ))}
    </div>
  );
}
