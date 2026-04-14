"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

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

const PRICE_MIN = 0;
const PRICE_MAX = 100000;

export function ProductFilters({ categories, materials, onFilterChange }: ProductFiltersProps) {
  const { formatPrice } = useSettings();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [expanded, setExpanded] = useState({ categories: true, materials: true, price: true });

  const activeCount = selectedCategories.length + selectedMaterials.length + (priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX ? 1 : 0);

  const toggleCategory = (id: string) => {
    const next = selectedCategories.includes(id)
      ? selectedCategories.filter((c) => c !== id)
      : [...selectedCategories, id];
    setSelectedCategories(next);
    onFilterChange({ categories: next, materials: selectedMaterials, priceRange });
  };

  const toggleMaterial = (id: string) => {
    const next = selectedMaterials.includes(id)
      ? selectedMaterials.filter((m) => m !== id)
      : [...selectedMaterials, id];
    setSelectedMaterials(next);
    onFilterChange({ categories: selectedCategories, materials: next, priceRange });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedMaterials([]);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    onFilterChange({ categories: [], materials: [], priceRange: [PRICE_MIN, PRICE_MAX] });
  };

  const handlePriceChange = (index: 0 | 1, raw: number) => {
    const value = Math.round(raw / 1000) * 1000;
    const next: [number, number] = index === 0
      ? [Math.min(value, priceRange[1] - 1000), priceRange[1]]
      : [priceRange[0], Math.max(value, priceRange[0] + 1000)];
    setPriceRange(next);
    onFilterChange({ categories: selectedCategories, materials: selectedMaterials, priceRange: next });
  };

  const pct = (v: number) => ((v - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className="space-y-1">
      {/* ── Header ── */}
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-semibold text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-[var(--bg-primary)] text-[10px] font-bold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <AnimatePresence>
          {activeCount > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              onClick={clearFilters}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)] flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear all
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Active filter chips ── */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-1.5 py-3 border-b border-[var(--border)] overflow-hidden"
          >
            {selectedCategories.map((id) => {
              const cat = categories.find((c) => c.id === id);
              return (
                <button
                  key={id}
                  onClick={() => toggleCategory(id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium hover:bg-[var(--accent)]/20 transition-colors"
                >
                  {cat?.label}
                  <X className="w-3 h-3" />
                </button>
              );
            })}
            {selectedMaterials.map((id) => {
              const mat = materials.find((m) => m.id === id);
              return (
                <button
                  key={id}
                  onClick={() => toggleMaterial(id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--accent-secondary)]/40 bg-[var(--accent-secondary)]/10 text-[var(--accent-secondary)] text-xs font-medium hover:bg-[var(--accent-secondary)]/20 transition-colors"
                >
                  {mat?.label}
                  <X className="w-3 h-3" />
                </button>
              );
            })}
            {(priceRange[0] > PRICE_MIN || priceRange[1] < PRICE_MAX) && (
              <button
                onClick={() => {
                  setPriceRange([PRICE_MIN, PRICE_MAX]);
                  onFilterChange({ categories: selectedCategories, materials: selectedMaterials, priceRange: [PRICE_MIN, PRICE_MAX] });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-medium hover:border-[var(--accent)]/40 transition-colors"
              >
                {formatPrice(priceRange[0])}–{formatPrice(priceRange[1])}
                <X className="w-3 h-3" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Categories ── */}
      <FilterSection
        label="Categories"
        open={expanded.categories}
        onToggle={() => setExpanded((s) => ({ ...s, categories: !s.categories }))}
      >
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all duration-150
                  ${active
                    ? "border-[var(--accent)] bg-[var(--accent)]/15 text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent)]/40 hover:text-[var(--text-primary)]"
                  }
                `}
              >
                {cat.label}
                {cat.count !== undefined && (
                  <span className={`text-[10px] ${active ? "text-[var(--accent)]/70" : "text-[var(--text-muted)]"}`}>
                    {cat.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Materials ── */}
      <FilterSection
        label="Material"
        open={expanded.materials}
        onToggle={() => setExpanded((s) => ({ ...s, materials: !s.materials }))}
      >
        <div className="flex flex-wrap gap-2">
          {materials.map((mat) => {
            const active = selectedMaterials.includes(mat.id);
            return (
              <button
                key={mat.id}
                onClick={() => toggleMaterial(mat.id)}
                className={`
                  px-3 py-1.5 rounded-full border text-xs font-mono font-medium transition-all duration-150
                  ${active
                    ? "border-[var(--accent-secondary)] bg-[var(--accent-secondary)]/15 text-[var(--accent-secondary)]"
                    : "border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:border-[var(--accent-secondary)]/40 hover:text-[var(--text-primary)]"
                  }
                `}
              >
                {mat.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* ── Price Range ── */}
      <FilterSection
        label="Price Range"
        open={expanded.price}
        onToggle={() => setExpanded((s) => ({ ...s, price: !s.price }))}
      >
        <div className="space-y-4 px-1">
          {/* Track + thumbs */}
          <div className="relative h-1 rounded-full bg-[var(--bg-tertiary)] mt-4">
            {/* filled segment */}
            <div
              className="absolute h-full rounded-full bg-[var(--accent)]"
              style={{ left: `${pct(priceRange[0])}%`, right: `${100 - pct(priceRange[1])}%` }}
            />
            {/* min thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={1000}
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(0, Number(e.target.value))}
              className="absolute w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--bg-primary)] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:border-none"
              style={{ zIndex: priceRange[0] >= PRICE_MAX - 5000 ? 5 : 3 }}
            />
            {/* max thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={1000}
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(1, Number(e.target.value))}
              className="absolute w-full h-full appearance-none bg-transparent cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-[var(--bg-primary)] [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[var(--accent)] [&::-moz-range-thumb]:border-none"
              style={{ zIndex: 4 }}
            />
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs font-mono">
            <span className="text-[var(--accent)] font-medium">{formatPrice(priceRange[0])}</span>
            <span className="text-[var(--accent)] font-medium">{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </FilterSection>
    </div>
  );
}

function FilterSection({
  label,
  open,
  onToggle,
  children,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--border)] pt-5 pb-1">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full mb-4 group"
      >
        <span className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
          {label}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="pb-3">{children}</div>
      </motion.div>
    </div>
  );
}
