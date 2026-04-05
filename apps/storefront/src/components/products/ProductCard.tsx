"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
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

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id,
      name,
      slug,
      price,
    });
    toast.success(`Added ${name} to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link href={`/products/${slug}`}>
        <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all">
          {/* Product image or placeholder */}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--accent)] transition-all">
                <span className="text-[var(--accent)]/50 font-mono text-sm">3D</span>
              </div>
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-[var(--bg-primary)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg font-medium"
            >
              <Eye className="w-4 h-4" />
              View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2 border border-[var(--accent)] text-[var(--accent)] rounded-lg font-medium hover:bg-[var(--accent)]/10"
            >
              <ShoppingCart className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur rounded text-xs font-mono text-[var(--accent)]">
            {category}
          </div>

          {/* Scanline effect */}
          <div className="absolute inset-0 scanlines pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg group-hover:text-[var(--accent)] transition-colors">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center justify-between mt-3">
            <p className="text-[var(--accent)] font-semibold text-lg">
              {formatPrice(price)}
            </p>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              + customization
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
