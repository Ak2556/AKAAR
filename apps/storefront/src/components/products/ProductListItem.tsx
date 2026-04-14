"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";

interface ProductListItemProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

const categoryColors: Record<string, string> = {
  Industrial:  "from-orange-500/20 to-orange-900/10",
  Electronics: "from-blue-500/20   to-blue-900/10",
  Prototyping: "from-purple-500/20 to-purple-900/10",
  Medical:     "from-green-500/20  to-green-900/10",
  Automotive:  "from-red-500/20    to-red-900/10",
  Aerospace:   "from-cyan-500/20   to-cyan-900/10",
  Robotics:    "from-yellow-500/20 to-yellow-900/10",
};

export function ProductListItem({ id, name, slug, category, price, description, imageUrl }: ProductListItemProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist, removeItem: removeFromWishlist } = useWishlist();
  const toast = useToast();
  const { formatPrice } = useSettings();

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
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="group"
    >
      <Link href={`/products/${slug}`} className="block">
        <div className="flex gap-5 p-4 border border-[var(--border)] rounded-2xl bg-[var(--bg-secondary)] hover:border-[var(--accent)]/40 hover:shadow-[0_0_24px_-8px_var(--accent-glow)] transition-all duration-300">

          {/* ── Thumbnail ── */}
          <div className={`relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br ${gradientClass}`}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="112px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)]/70 transition-colors duration-300">
                  <div className="w-5 h-5 border border-[var(--accent)]/40 rounded" />
                </div>
              </div>
            )}
          </div>

          {/* ── Info ── */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <div className="flex items-start gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded-full border border-[var(--border)] bg-[var(--bg-tertiary)] text-[10px] font-mono font-medium tracking-wider text-[var(--accent)] uppercase">
                {category}
              </span>
            </div>
            <h3 className="mt-2 font-semibold text-base text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors duration-200 truncate">
              {name}
            </h3>
            {description && (
              <p className="mt-1 text-sm text-[var(--text-muted)] line-clamp-1 leading-relaxed">
                {description}
              </p>
            )}
            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--accent)]">{formatPrice(price)}</span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">+ customization</span>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex flex-col justify-center gap-2 flex-shrink-0">
            <motion.button
              onClick={handleAddToCart}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] text-sm font-semibold hover:bg-[var(--accent)]/90 transition-colors duration-150 whitespace-nowrap"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </motion.button>

            <div className="flex gap-2">
              <button
                onClick={handleWishlist}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className={`
                  flex-1 py-2 rounded-xl border flex items-center justify-center transition-all duration-150
                  ${inWishlist
                    ? "border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    : "border-[var(--border)] text-[var(--text-muted)] hover:border-red-400/50 hover:text-red-400"
                  }
                `}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
              </button>

              <Link
                href={`/products/${slug}`}
                onClick={(e) => e.stopPropagation()}
                className="flex-1 py-2 rounded-xl border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all duration-150"
              >
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
