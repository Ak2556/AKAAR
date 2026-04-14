"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Search, Grid3X3, List, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

const mockProducts = [
  { id: "1", name: "Precision Gear Assembly",       slug: "precision-gear-assembly",       category: "Industrial",   price: 12499, description: "High-precision gear system for industrial machinery" },
  { id: "2", name: "Custom Electronics Enclosure",  slug: "custom-electronics-enclosure",  category: "Electronics",  price: 6599,  description: "Tailored enclosure with cable management" },
  { id: "3", name: "Rapid Prototype Part",          slug: "rapid-prototype-part",          category: "Prototyping",  price: 3999,  description: "Fast turnaround prototype components" },
  { id: "4", name: "Medical Device Housing",        slug: "medical-device-housing",        category: "Medical",      price: 24999, description: "FDA-compliant medical device enclosure" },
  { id: "5", name: "Automotive Bracket",            slug: "automotive-bracket",            category: "Automotive",   price: 7499,  description: "High-strength automotive mounting bracket" },
  { id: "6", name: "Drone Frame Component",         slug: "drone-frame-component",         category: "Aerospace",    price: 16599, description: "Lightweight carbon-reinforced drone part" },
  { id: "7", name: "Custom Nozzle Design",          slug: "custom-nozzle-design",          category: "Industrial",   price: 10799, description: "Precision-machined custom nozzle" },
  { id: "8", name: "PCB Mounting Plate",            slug: "pcb-mounting-plate",            category: "Electronics",  price: 3299,  description: "Anti-static PCB mounting solution" },
  { id: "9", name: "Robotic Gripper",               slug: "robotic-gripper",               category: "Robotics",     price: 20799, description: "Multi-axis robotic gripper mechanism" },
];

const categories = [
  { id: "industrial",  label: "Industrial",  count: 2 },
  { id: "electronics", label: "Electronics", count: 2 },
  { id: "prototyping", label: "Prototyping", count: 1 },
  { id: "medical",     label: "Medical",     count: 1 },
  { id: "automotive",  label: "Automotive",  count: 1 },
  { id: "aerospace",   label: "Aerospace",   count: 1 },
  { id: "robotics",    label: "Robotics",    count: 1 },
];

const materials = [
  { id: "pla",   label: "PLA" },
  { id: "abs",   label: "ABS" },
  { id: "petg",  label: "PETG" },
  { id: "nylon", label: "Nylon" },
  { id: "resin", label: "Resin" },
  { id: "metal", label: "Metal" },
];

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price-low",  label: "Price ↑" },
  { value: "price-high", label: "Price ↓" },
  { value: "name",       label: "A – Z" },
];

export default function ProductsPage() {
  const { settings, t } = useSettings();
  const [searchQuery, setSearchQuery]         = useState("");
  const [viewMode, setViewMode]               = useState<"grid" | "list">(settings.defaultView);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy]                   = useState("newest");
  const [currentPage, setCurrentPage]         = useState(1);
  const [filters, setFilters]                 = useState({
    categories: [] as string[],
    materials:  [] as string[],
    priceRange: [0, 100000] as [number, number],
  });

  useEffect(() => { setViewMode(settings.defaultView); }, [settings.defaultView]);
  useEffect(() => { setCurrentPage(1); }, [searchQuery, filters, sortBy, settings.productsPerPage]);

  const handleFilterChange = useCallback(
    (f: { categories: string[]; materials: string[]; priceRange: [number, number] }) => setFilters(f),
    [],
  );

  const filteredProducts = mockProducts.filter((p) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q);
    const matchCat    = filters.categories.length === 0 || filters.categories.includes(p.category.toLowerCase());
    const matchPrice  = p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1];
    return matchSearch && matchCat && matchPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-low")  return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "name")       return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(sortedProducts.length / settings.productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * settings.productsPerPage,
    currentPage * settings.productsPerPage,
  );

  return (
    <div className="min-h-screen pt-24 pb-20">

      {/* ─── Page Header ─── */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[var(--accent)] font-mono text-xs uppercase tracking-widest">Catalog</span>
            <h1 className="text-4xl md:text-5xl font-bold mt-3">
              <span className="gradient-text">{t("products.title")}</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-3 max-w-2xl text-sm md:text-base">
              {t("products.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ─── Sidebar ─── */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 p-5 border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)]">
              <ProductFilters
                categories={categories}
                materials={materials}
                onFilterChange={handleFilterChange}
              />
            </div>
          </aside>

          {/* ─── Main ─── */}
          <div className="flex-1 min-w-0">

            {/* ── Toolbar ── */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  placeholder={t("products.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]/60 text-sm transition-colors"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`lg:hidden flex items-center gap-2 px-3.5 py-2.5 border rounded-xl text-sm transition-colors ${
                    showMobileFilters
                      ? "border-[var(--accent)]/60 text-[var(--accent)] bg-[var(--accent)]/10"
                      : "border-[var(--border)] text-[var(--text-secondary)]"
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {(filters.categories.length + filters.materials.length) > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] text-[10px] font-bold flex items-center justify-center">
                      {filters.categories.length + filters.materials.length}
                    </span>
                  )}
                </button>

                {/* Sort pill group */}
                <div className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`px-3 py-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                        sortBy === opt.value
                          ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                          : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* View toggle */}
                <div className="hidden sm:flex items-center border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-secondary)]">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2.5 transition-colors ${viewMode === "grid" ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2.5 transition-colors ${viewMode === "list" ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"}`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Mobile Filters ── */}
            <AnimatePresence>
              {showMobileFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="lg:hidden overflow-hidden mb-5"
                >
                  <div className="p-5 border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)]">
                    <ProductFilters
                      categories={categories}
                      materials={materials}
                      onFilterChange={handleFilterChange}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Result count ── */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-[var(--text-muted)]">
                <span className="text-[var(--text-primary)] font-medium">{sortedProducts.length}</span>
                {" "}product{sortedProducts.length !== 1 ? "s" : ""}
                {searchQuery && (
                  <> for &ldquo;<span className="text-[var(--accent)]">{searchQuery}</span>&rdquo;</>
                )}
                {totalPages > 1 && (
                  <span className="ml-2">· Page {currentPage} of {totalPages}</span>
                )}
              </p>
            </div>

            {/* ── Product Grid ── */}
            <ProductGrid products={paginatedProducts} viewMode={viewMode} />

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-1.5 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-xl disabled:opacity-30 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                      page === currentPage
                        ? "bg-[var(--accent)] text-[var(--bg-primary)] shadow-[0_0_16px_-4px_var(--accent-glow)]"
                        : "border border-[var(--border)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center border border-[var(--border)] rounded-xl disabled:opacity-30 hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
