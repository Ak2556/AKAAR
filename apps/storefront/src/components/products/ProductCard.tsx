"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  category,
  price,
  description,
  imageUrl,
}: ProductCardProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const { formatPrice } = useSettings();

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({ id, name, slug, price });
    toast.success(`Added ${name} to cart`);
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="group h-full">
      <Link href={`/products/${slug}`} className="block h-full">
        <article className="luxury-card flex h-full flex-col overflow-hidden rounded-[2.1rem]">
          <div className="luxury-stage relative aspect-[1.05/1] overflow-hidden px-5 py-5 sm:px-6">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-[var(--border-accent)] bg-[rgba(9,9,11,0.42)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur-md">
              {category}
            </div>
            <div className="absolute right-5 top-5 z-10 rounded-full border border-[var(--border-accent)] bg-[rgba(9,9,11,0.48)] px-2.5 py-2 text-[var(--text-secondary)] backdrop-blur-md transition-colors group-hover:text-[var(--text-primary)]">
              <ArrowUpRight className="h-4 w-4" />
            </div>

            <p className="pointer-events-none absolute left-5 right-5 top-14 overflow-hidden text-[clamp(2.8rem,7vw,5rem)] font-semibold uppercase tracking-[-0.09em] text-white/[0.08]">
              {name}
            </p>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="hero-image-shadow absolute inset-x-5 bottom-5 top-20 h-[calc(100%-6.25rem)] w-[calc(100%-2.5rem)] object-contain transition-transform duration-500 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="absolute inset-x-5 bottom-5 top-20 overflow-hidden rounded-[1.7rem] border border-[var(--border)] bg-[linear-gradient(145deg,#14171c_0%,#232a33_52%,#101114_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(214,178,114,0.18),transparent_28%),radial-gradient(circle_at_78%_76%,rgba(125,211,199,0.12),transparent_28%)]" />
                <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <span className="luxury-kicker">Preview stage</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-white/40">Awaiting asset</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-px border-t border-[var(--border)] bg-[var(--border)] sm:grid-cols-[1.2fr_0.82fr_0.72fr_auto]">
            <div className="bg-[var(--bg-secondary)] px-5 py-5">
              <p className="display-font text-[1.65rem] uppercase leading-none text-[var(--text-primary)]">{name}</p>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--text-secondary)]">
                {description || "Configured product geometry staged for preview, fit review, and production planning."}
              </p>
            </div>
            <div className="bg-[var(--bg-secondary)] px-5 py-5">
              <p className="luxury-metric-label">Starting from</p>
              <p className="mt-3 text-lg font-semibold text-[var(--text-primary)]">{formatPrice(price)}</p>
            </div>
            <div className="bg-[var(--bg-secondary)] px-5 py-5">
              <p className="luxury-metric-label">Shipping</p>
              <p className="mt-3 text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Free
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex items-center justify-center gap-2 bg-[var(--bg-secondary)] px-5 py-5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--surface-highlight)]"
            >
              <ShoppingCart className="h-4 w-4" />
              Add
            </button>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
