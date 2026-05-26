"use client";

import { ProductCard } from "./ProductCard";
import { ProductListItem } from "./ProductListItem";
import { badgeForRank } from "@/lib/recommendations";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stockQuantity?: number | null;
  leadTimeDays?: number | null;
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
        ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {[...Array(8)].map((_, i) => (
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
      <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 border border-[var(--border)] rounded-xl flex items-center justify-center">
          <span className="text-[var(--text-muted)] font-mono">?</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-[var(--text-secondary)]">
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id}>
            <ProductListItem {...product} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <div key={product.id}>
          <ProductCard
            {...product}
            stockQuantity={product.stockQuantity ?? null}
            leadTimeDays={product.leadTimeDays ?? null}
            badge={badgeForRank(index + 1)}
          />
        </div>
      ))}
    </div>
  );
}
