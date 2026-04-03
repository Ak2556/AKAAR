"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Filter, X, ChevronDown } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  categories: FilterOption[];
  materials: FilterOption[];
  onFilterChange: (filters: { categories: string[]; materials: string[]; priceRange: [number, number] }) => void;
}

export function ProductFilters({ categories, materials, onFilterChange }: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    materials: true,
    price: true,
  });

  const toggleCategory = (id: string) => {
    const updated = selectedCategories.includes(id)
      ? selectedCategories.filter((c) => c !== id)
      : [...selectedCategories, id];
    setSelectedCategories(updated);
    onFilterChange({ categories: updated, materials: selectedMaterials, priceRange });
  };

  const toggleMaterial = (id: string) => {
    const updated = selectedMaterials.includes(id)
      ? selectedMaterials.filter((m) => m !== id)
      : [...selectedMaterials, id];
    setSelectedMaterials(updated);
    onFilterChange({ categories: selectedCategories, materials: updated, priceRange });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setPriceRange([0, 1000]);
    onFilterChange({ categories: [], materials: [], priceRange: [0, 1000] });
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedMaterials.length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-[var(--accent)]" />
          <span className="font-semibold">Filters</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Categories */}
      <div className="border-t border-[var(--border)] pt-6">
        <button
          onClick={() => setExpandedSections((s) => ({ ...s, categories: !s.categories }))}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="font-medium">Categories</span>
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
              expandedSections.categories ? "rotate-180" : ""
            }`}
          />
        </button>
        <motion.div
          initial={false}
          animate={{ height: expandedSections.categories ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="space-y-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${
                    selectedCategories.includes(category.id)
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "border-[var(--border)] group-hover:border-[var(--accent)]"
                  }`}
                >
                  {selectedCategories.includes(category.id) && (
                    <svg className="w-3 h-3 text-[var(--bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {category.label}
                </span>
                {category.count !== undefined && (
                  <span className="text-xs text-[var(--text-muted)] ml-auto">
                    ({category.count})
                  </span>
                )}
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Materials */}
      <div className="border-t border-[var(--border)] pt-6">
        <button
          onClick={() => setExpandedSections((s) => ({ ...s, materials: !s.materials }))}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="font-medium">Materials</span>
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
              expandedSections.materials ? "rotate-180" : ""
            }`}
          />
        </button>
        <motion.div
          initial={false}
          animate={{ height: expandedSections.materials ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="space-y-3">
            {materials.map((material) => (
              <label
                key={material.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={`w-5 h-5 border rounded flex items-center justify-center transition-all ${
                    selectedMaterials.includes(material.id)
                      ? "bg-[var(--accent)] border-[var(--accent)]"
                      : "border-[var(--border)] group-hover:border-[var(--accent)]"
                  }`}
                >
                  {selectedMaterials.includes(material.id) && (
                    <svg className="w-3 h-3 text-[var(--bg-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                  {material.label}
                </span>
                <input
                  type="checkbox"
                  checked={selectedMaterials.includes(material.id)}
                  onChange={() => toggleMaterial(material.id)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Price Range */}
      <div className="border-t border-[var(--border)] pt-6">
        <button
          onClick={() => setExpandedSections((s) => ({ ...s, price: !s.price }))}
          className="flex items-center justify-between w-full mb-4"
        >
          <span className="font-medium">Price Range</span>
          <ChevronDown
            className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${
              expandedSections.price ? "rotate-180" : ""
            }`}
          />
        </button>
        <motion.div
          initial={false}
          animate={{ height: expandedSections.price ? "auto" : 0 }}
          className="overflow-hidden"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Min</label>
                <input
                  type="number"
                  value={priceRange[0]}
                  onChange={(e) => {
                    const newRange: [number, number] = [Number(e.target.value), priceRange[1]];
                    setPriceRange(newRange);
                    onFilterChange({ categories: selectedCategories, materials: selectedMaterials, priceRange: newRange });
                  }}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-[var(--text-muted)] mb-1 block">Max</label>
                <input
                  type="number"
                  value={priceRange[1]}
                  onChange={(e) => {
                    const newRange: [number, number] = [priceRange[0], Number(e.target.value)];
                    setPriceRange(newRange);
                    onFilterChange({ categories: selectedCategories, materials: selectedMaterials, priceRange: newRange });
                  }}
                  className="w-full px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border)] rounded text-sm focus:outline-none focus:border-[var(--accent)]"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
