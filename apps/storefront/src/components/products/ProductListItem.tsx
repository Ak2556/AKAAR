"use client";

import Link from "next/link";
import { ShoppingCart, Heart, Eye } from "lucide-react";
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

export function ProductListItem({
  id,
  name,
  slug,
  category,
  price,
  description,
  imageUrl,
}: ProductListItemProps) {
  const { addItem } = useCart();
  const { addItem: addToWishlist, isInWishlist } = useWishlist();
  const toast = useToast();
  const { formatPrice } = useSettings();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, slug, price });
    toast.success(`Added ${name} to cart`);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInWishlist(id)) {
      addToWishlist({ id, name, slug, price, category, imageUrl });
      toast.success(`Added ${name} to wishlist`);
    }
  };

  return (
    <Link href={`/products/${slug}`}>
      <div className="group flex gap-6 p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-all">
        {/* Image */}
        <div className="relative w-32 h-32 flex-shrink-0 bg-[var(--bg-tertiary)] rounded-lg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] transition-all">
                <span className="text-[var(--accent)]/50 font-mono text-xs">3D</span>
              </div>
            </div>
          )}
          {/* Category badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--bg-primary)]/80 backdrop-blur rounded text-xs font-mono text-[var(--accent)]">
            {category}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg group-hover:text-[var(--accent)] transition-colors truncate">
            {name}
          </h3>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2">
              {description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <p className="text-[var(--accent)] font-semibold text-lg">
              {formatPrice(price)}
            </p>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              + customization
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-2">
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg font-medium hover:bg-[var(--accent)]/90 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleAddToWishlist}
              className={`flex-1 p-2 border rounded-lg transition-colors ${
                isInWishlist(id)
                  ? "border-red-500 text-red-500 bg-red-500/10"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              <Heart className={`w-4 h-4 mx-auto ${isInWishlist(id) ? "fill-current" : ""}`} />
            </button>
            <Link
              href={`/products/${slug}`}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 p-2 border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              <Eye className="w-4 h-4 mx-auto" />
            </Link>
          </div>
        </div>
      </div>
    </Link>
  );
}
