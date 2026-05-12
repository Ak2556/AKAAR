"use client";

import { useState } from "react";
import { Plus, ChevronDown } from "lucide-react";
import { ProductCreateForm } from "./ProductCreateForm";

export function ProductCreatePanel() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center gap-3 rounded-[1.4rem] border px-6 py-4 text-left transition-all ${
          open
            ? "border-[var(--accent)]/40 bg-[var(--bg-secondary)]"
            : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/40"
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[0.7rem] bg-[var(--accent)]/15">
          <Plus className="h-4 w-4 text-[var(--accent)]" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-[var(--text-primary)]">
            New Product
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Add images, set price, attach a 3D model
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[var(--text-muted)] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="mt-4">
          {/* Pass empty existingProducts — the list is now handled by ProductListTable */}
          <ProductCreateForm existingProducts={[]} />
        </div>
      )}
    </div>
  );
}
