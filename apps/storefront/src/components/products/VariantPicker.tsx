"use client";

import { useEffect, useState } from "react";

export interface Variant {
  id: string;
  material: string;
  color: string | null;
  colorHex: string | null;
  priceModifier: number;
  finalPrice: number;
  stockQuantity: number | null;
  sku: string | null;
  isDefault: boolean;
}

interface VariantPickerProps {
  productSlug: string;
  basePrice: number;
  onSelect: (variant: Variant | null) => void;
}

export function VariantPicker({ productSlug, basePrice, onSelect }: VariantPickerProps) {
  const [variants, setVariants] = useState<Variant[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/products/${productSlug}/variants`);
        if (!res.ok) {
          setVariants([]);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        const list: Variant[] = data.variants ?? [];
        setVariants(list);
        const initial = list.find((v) => v.isDefault) ?? list[0] ?? null;
        if (initial) {
          setSelectedId(initial.id);
          onSelect(initial);
        } else {
          onSelect(null);
        }
      } catch {
        setVariants([]);
        onSelect(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productSlug]);

  if (loading) return null;
  if (!variants || variants.length === 0) return null;

  return (
    <div className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--bg-secondary)] p-5">
      <p className="luxury-metric-label">Material &amp; finish</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {variants.map((variant) => {
          const selected = variant.id === selectedId;
          const soldOut = variant.stockQuantity != null && variant.stockQuantity <= 0;
          return (
            <button
              key={variant.id}
              type="button"
              disabled={soldOut}
              onClick={() => {
                setSelectedId(variant.id);
                onSelect(variant);
              }}
              className={`flex items-center gap-3 rounded-[1.2rem] border px-3.5 py-3 text-left transition-colors ${
                selected
                  ? "border-[var(--accent)] bg-[var(--accent)]/8"
                  : "border-[var(--border)] hover:border-[var(--border-accent)]"
              } ${soldOut ? "opacity-50" : ""}`}
            >
              {variant.colorHex ? (
                <span
                  className="h-7 w-7 shrink-0 rounded-full border border-white/15"
                  style={{ background: variant.colorHex }}
                  aria-hidden
                />
              ) : (
                <span className="h-7 w-7 shrink-0 rounded-full border border-white/15 bg-[var(--bg-tertiary)]" aria-hidden />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {variant.material}
                  {variant.color ? ` · ${variant.color}` : ""}
                </p>
                <p className="text-[11px] text-[var(--text-muted)]">
                  {variant.priceModifier === 0
                    ? `Same as base · ₹${basePrice.toLocaleString("en-IN")}`
                    : variant.priceModifier > 0
                    ? `+₹${variant.priceModifier.toLocaleString("en-IN")} = ₹${variant.finalPrice.toLocaleString("en-IN")}`
                    : `−₹${Math.abs(variant.priceModifier).toLocaleString("en-IN")} = ₹${variant.finalPrice.toLocaleString("en-IN")}`}
                  {soldOut ? " · Sold out" : ""}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
