"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Search, Grid, List, SlidersHorizontal, Loader2 } from "lucide-react";
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

interface ApiProduct {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | string | null;
  description: string | null;
  imageUrl: string | null;
}

interface ProductsResponse {
  products: ApiProduct[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  categories: string[];
}

const materials = [
  { id: "pla", label: "PLA" },
  { id: "abs", label: "ABS" },
  { id: "petg", label: "PETG" },
  { id: "nylon", label: "Nylon" },
  { id: "resin", label: "Resin" },
  { id: "metal", label: "Metal" },
];

export default function ProductsPage() {
  const { settings } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: string; label: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">(settings.defaultView);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    materials: [] as string[],
    priceRange: [0, 100000] as [number, number],
  });

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      params.set("limit", settings.productsPerPage.toString());

      if (searchQuery) {
        params.set("search", searchQuery);
      }

      if (filters.categories.length === 1) {
        params.set("category", filters.categories[0]);
      }

      // Map sortBy to API params
      if (sortBy === "price-low") {
        params.set("sortBy", "price");
        params.set("sortOrder", "asc");
      } else if (sortBy === "price-high") {
        params.set("sortBy", "price");
        params.set("sortOrder", "desc");
      } else if (sortBy === "name") {
        params.set("sortBy", "name");
        params.set("sortOrder", "asc");
      } else {
        params.set("sortBy", "createdAt");
        params.set("sortOrder", "desc");
      }

      const response = await fetch(`/api/products?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data: ProductsResponse = await response.json();

      // Transform products for the grid
      const transformedProducts: Product[] = data.products.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price ? Number(p.price) : 0,
        category: p.category || "Uncategorized",
        description: p.description || undefined,
        imageUrl: p.imageUrl || undefined,
      }));

      setProducts(transformedProducts);
      setTotalPages(data.pagination.totalPages);
      setTotalProducts(data.pagination.total);

      // Build categories with counts
      if (data.categories.length > 0) {
        const categoryList = data.categories.map(cat => ({
          id: cat.toLowerCase(),
          label: cat,
          count: transformedProducts.filter(p => p.category?.toLowerCase() === cat.toLowerCase()).length,
        }));
        setCategories(categoryList);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, filters.categories, sortBy, settings.productsPerPage]);

  // Fetch on mount and when dependencies change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Update view mode when settings change
  useEffect(() => {
    setViewMode(settings.defaultView);
  }, [settings.defaultView]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters]);

  // Filter products client-side for price range (API doesn't support this yet)
  const filteredProducts = products.filter(product => {
    const price = product.price ?? 0;
    const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1];
    return matchesPrice;
  });

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
              Catalog
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">
              Our <span className="gradient-text">Products</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl">
              Browse our collection of precision-manufactured parts and components.
              Each product is engineered for excellence.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                categories={categories}
                materials={materials}
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              {/* Search */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] text-sm"
                />
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-[var(--border)] rounded-lg text-sm"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                </button>

                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--accent)]"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${viewMode === "grid" ? "bg-[var(--accent)] text-[var(--bg-primary)]" : "text-[var(--text-secondary)]"}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${viewMode === "list" ? "bg-[var(--accent)] text-[var(--bg-primary)]" : "text-[var(--text-secondary)]"}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showMobileFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden mb-8 p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
              >
                <ProductFilters
                  categories={categories}
                  materials={materials}
                  onFilterChange={setFilters}
                />
              </motion.div>
            )}

            {/* Results count */}
            <p className="text-sm text-[var(--text-muted)] mb-6">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  Showing {filteredProducts.length} of {totalProducts} products
                  {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                </>
              )}
            </p>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="px-6 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg hover:opacity-90"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[var(--text-secondary)]">No products found matching your criteria.</p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && !error && filteredProducts.length > 0 && (
              <ProductGrid products={filteredProducts} viewMode={viewMode} />
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page: number;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg transition-colors ${
                          page === currentPage
                            ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                            : "border border-[var(--border)] hover:border-[var(--accent)]"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
