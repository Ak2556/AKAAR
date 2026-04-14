"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
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

// Category colour map — keeps the grid visually varied
const categoryColors: Record<string, string> = {
  Industrial:    "from-orange-500/20 to-orange-900/10",
  Electronics:   "from-blue-500/20   to-blue-900/10",
  Prototyping:   "from-purple-500/20 to-purple-900/10",
  Medical:       "from-green-500/20  to-green-900/10",
  Automotive:    "from-red-500/20    to-red-900/10",
  Aerospace:     "from-cyan-500/20   to-cyan-900/10",
  Robotics:      "from-yellow-500/20 to-yellow-900/10",
};

export function ProductCard({ id, name, slug, category, price, description, imageUrl }: ProductCardProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  const toast = useToast();
  const { formatPrice } = useSettings();
  const [hovered, setHovered] = useState(false);

  const inWishlist = isInWishlist(id);
  const gradientClass = categoryColors[category] ?? "from-[var(--accent)]/15 to-[var(--bg-tertiary)]";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, slug, price });
    toast.success(`${name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeFromWishlist(id);
      toast.info(`${name} removed from wishlist`);
    } else {
      addToWishlist({ id, name, slug, price, category, imageUrl });
      toast.success(`${name} saved to wishlist`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative"
    >
      <Link href={`/products/${slug}`} className="block">
        {/* ── Card shell ── */}
        <div
          className={`
            relative overflow-hidden rounded-2xl border transition-all duration-300
            border-[var(--border)] bg-[var(--bg-secondary)]
            group-hover:border-[var(--accent)]/40 group-hover:shadow-[0_0_30px_-8px_var(--accent-glow)]
          `}
        >
          {/* ── Image / Placeholder ── */}
          <div className={`relative aspect-[4/3] overflow-hidden bg-gradient-to-br ${gradientClass}`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              /* Stylised placeholder — unique per category colour */
              <div className="absolute inset-0 flex items-center justify-center">
                {/* Grid dots */}
                <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`dots-${id}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="currentColor" className="text-[var(--accent)]" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#dots-${id})`} />
                </svg>
                {/* Centre icon */}
                <div className="relative flex flex-col items-center gap-3">
                  <motion.div
                    animate={hovered ? { rotate: 180, scale: 1.1 } : { rotate: 0, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="w-16 h-16 border-2 border-[var(--accent)]/30 rounded-xl flex items-center justify-center group-hover:border-[var(--accent)]/70 transition-colors duration-300"
                  >
                    <div className="w-8 h-8 border border-[var(--accent)]/50 rounded-md" />
                  </motion.div>
                  <span className="font-mono text-[10px] tracking-widest text-[var(--accent)]/50 uppercase group-hover:text-[var(--accent)]/90 transition-colors">
                    {category}
                  </span>
                </div>
              </div>
            )}

            {/* Gradient fade at bottom of image */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg-secondary)] to-transparent" />

            {/* ── Wishlist button — top right, always visible ── */}
            <button
              onClick={handleWishlist}
              aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              className={`
                absolute top-3 right-3 z-10
                w-9 h-9 rounded-full border flex items-center justify-center
                backdrop-blur-sm transition-all duration-200
                ${inWishlist
                  ? "bg-red-500/20 border-red-500/50 text-red-400 hover:bg-red-500/30"
                  : "bg-[var(--bg-primary)]/60 border-[var(--border)] text-[var(--text-muted)] hover:border-red-400/50 hover:text-red-400"
                }
              `}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
            </button>

            {/* ── Category badge — top left ── */}
            <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[var(--bg-primary)]/70 backdrop-blur-sm border border-[var(--border)] text-[10px] font-mono font-medium tracking-wider text-[var(--accent)] uppercase">
              {category}
            </div>
          </div>

          {/* ── Info block ── */}
          <div className="p-5">
            <h3 className="font-semibold text-base leading-snug text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 line-clamp-1">
              {name}
            </h3>

            {description && (
              <p className="mt-1.5 text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                {description}
              </p>
            )}

            {/* ── Price + CTA row ── */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-xl font-bold text-[var(--accent)] tracking-tight">
                  {formatPrice(price)}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] font-mono mt-0.5">+ customization</p>
              </div>

              {/* Add to cart — slides in on hover */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleAddToCart}
                  whileTap={{ scale: 0.93 }}
                  aria-label="Add to cart"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-semibold hover:bg-[var(--accent)]/90 transition-colors duration-150"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <AnimatePresence>
                    {hovered && (
                      <motion.span
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: "auto", opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        Add
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <Link
                  href={`/products/${slug}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-9 h-9 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all duration-150"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
