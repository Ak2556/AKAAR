"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Search, Grid, List, SlidersHorizontal } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

// Mock data - prices in INR (base currency)
const mockProducts = [
  { id: "1", name: "Precision Gear Assembly", slug: "precision-gear-assembly", category: "Industrial", price: 12499, description: "High-precision gear system for industrial machinery" },
  { id: "2", name: "Custom Electronics Enclosure", slug: "custom-electronics-enclosure", category: "Electronics", price: 6599, description: "Tailored enclosure with cable management" },
  { id: "3", name: "Rapid Prototype Part", slug: "rapid-prototype-part", category: "Prototyping", price: 3999, description: "Fast turnaround prototype components" },
  { id: "4", name: "Medical Device Housing", slug: "medical-device-housing", category: "Medical", price: 24999, description: "FDA-compliant medical device enclosure" },
  { id: "5", name: "Automotive Bracket", slug: "automotive-bracket", category: "Automotive", price: 7499, description: "High-strength automotive mounting bracket" },
  { id: "6", name: "Drone Frame Component", slug: "drone-frame-component", category: "Aerospace", price: 16599, description: "Lightweight carbon-reinforced drone part" },
  { id: "7", name: "Custom Nozzle Design", slug: "custom-nozzle-design", category: "Industrial", price: 10799, description: "Precision-machined custom nozzle" },
  { id: "8", name: "PCB Mounting Plate", slug: "pcb-mounting-plate", category: "Electronics", price: 3299, description: "Anti-static PCB mounting solution" },
  { id: "9", name: "Robotic Gripper", slug: "robotic-gripper", category: "Robotics", price: 20799, description: "Multi-axis robotic gripper mechanism" },
];

const categories = [
  { id: "industrial", label: "Industrial", count: 2 },
  { id: "electronics", label: "Electronics", count: 2 },
  { id: "prototyping", label: "Prototyping", count: 1 },
  { id: "medical", label: "Medical", count: 1 },
  { id: "automotive", label: "Automotive", count: 1 },
  { id: "aerospace", label: "Aerospace", count: 1 },
  { id: "robotics", label: "Robotics", count: 1 },
];

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
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">(settings.defaultView);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    categories: [] as string[],
    materials: [] as string[],
    priceRange: [0, 100000] as [number, number], // INR range
  });

  // Update view mode when settings change
  useEffect(() => {
    setViewMode(settings.defaultView);
  }, [settings.defaultView]);

  // Filter products based on search and filters
  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filters.categories.length === 0 ||
      filters.categories.includes(product.category.toLowerCase());

    const matchesPrice = product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / settings.productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * settings.productsPerPage,
    currentPage * settings.productsPerPage
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters, settings.productsPerPage]);

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
              Showing {paginatedProducts.length} of {filteredProducts.length} products
              {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
            </p>

            {/* Product Grid */}
            <ProductGrid products={paginatedProducts} viewMode={viewMode} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-[var(--border)] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                  ))}
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
