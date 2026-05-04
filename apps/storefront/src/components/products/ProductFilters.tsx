"use client";

import { Filter, X } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  categories: FilterOption[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onClear: () => void;
}

export function ProductFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  onClear,
}: ProductFiltersProps) {
  const hasActiveFilters = selectedCategory !== "all";

  return (
    <div className="luxury-card rounded-[1.8rem] p-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
            <Filter className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <div>
            <p className="display-font text-xl text-[var(--text-primary)]">Filters</p>
            <p className="text-sm text-[var(--text-muted)]">Refine the current collection</p>
          </div>
        </div>
        {hasActiveFilters ? (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-3 py-2 text-xs uppercase tracking-[0.18em] text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        ) : null}
      </div>

      <div className="mt-7 space-y-3">
        <FilterButton
          label="All categories"
          active={selectedCategory === "all"}
          count={undefined}
          onClick={() => onCategoryChange("all")}
        />
        {categories.map((category) => (
          <FilterButton
            key={category.id}
            label={category.label}
            active={selectedCategory === category.id}
            count={category.count}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>
    </div>
  );
}

function FilterButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-[1.15rem] border px-4 py-3 text-left transition-all ${
        active
          ? "border-[var(--accent)] bg-[var(--surface-highlight)] text-[var(--text-primary)]"
          : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]"
      }`}
    >
      <span className="text-sm font-medium">{label}</span>
      {count !== undefined ? (
        <span className="luxury-metric-label">{count}</span>
      ) : null}
    </button>
  );
}
