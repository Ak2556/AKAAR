"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";
import { getProductCommerceProfile } from "@/lib/product-commerce";

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
  const profile = getProductCommerceProfile({ name, category, description });

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem({ id, name, slug, price, image: imageUrl });
    toast.success(`Added ${name} to cart`);
  };

  const handleAddToWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!isInWishlist(id)) {
      addToWishlist({ id, name, slug, price, category, imageUrl });
      toast.success(`Added ${name} to wishlist`);
    }
  };

  return (
    <Link href={`/products/${slug}`} className="block">
      <article className="luxury-card group overflow-hidden rounded-[var(--rad-xl)]">
        <div className="grid gap-px bg-[var(--border)] xl:grid-cols-[0.95fr_1.05fr]">
          <div className="luxury-stage relative min-h-[320px] overflow-hidden p-6">
            <div className="absolute left-6 top-6 z-10 rounded-full border border-[var(--border-accent)] bg-[rgba(9,9,11,0.42)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur-md">
              {category}
            </div>
            <div className="absolute right-6 top-6 z-10 rounded-full border border-[var(--border-accent)] bg-[rgba(9,9,11,0.48)] px-2.5 py-2 text-[var(--text-secondary)] backdrop-blur-md transition-colors group-hover:text-[var(--text-primary)]">
              <ArrowUpRight className="h-4 w-4" />
            </div>
            <p className="pointer-events-none absolute left-6 right-6 top-18 text-[clamp(3rem,8vw,6.5rem)] font-semibold uppercase tracking-[-0.09em] text-white/[0.08]">
              {name}
            </p>

            {imageUrl ? (
              <div className="absolute inset-x-6 bottom-6 top-18 h-[calc(100%-6rem)]">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 1280px) 100vw, 560px"
                  className="hero-image-shadow object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              <div className="absolute inset-x-6 bottom-6 top-18 overflow-hidden rounded-[var(--rad-lg)] border border-[var(--border)] bg-[linear-gradient(145deg,#15181d_0%,#232a33_50%,#101114_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(214,178,114,0.16),transparent_30%),radial-gradient(circle_at_80%_74%,rgba(125,211,199,0.1),transparent_28%)]" />
              </div>
            )}
          </div>

          <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[1.12fr_0.88fr]">
            <div className="bg-[var(--bg-secondary)] px-6 py-6 sm:px-7">
              <span className="luxury-kicker">Collection entry</span>
              <h3 className="display-font mt-4 text-4xl uppercase leading-none text-[var(--text-primary)] sm:text-5xl">
                {name}
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">
                {description || "Preview-led part listing with production-aware geometry, staging, and configurable finish options."}
              </p>

              <div className="mt-8 grid gap-px overflow-hidden rounded-[var(--rad-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                <SpecCell label="Starting from" value={formatPrice(price)} />
                <SpecCell label="Material" value={profile.material} />
                <SpecCell label="Dispatch" value={profile.dispatch} />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-5 bg-[var(--bg-secondary)] px-6 py-6 sm:px-7">
              <div>
                <p className="luxury-metric-label">{profile.quality}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.cardHighlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--text-primary)] px-5 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>

                <button
                  onClick={handleAddToWishlist}
                  className={`inline-flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3.5 text-sm font-medium transition-colors ${
                    isInWishlist(id)
                      ? "border-red-400/50 bg-red-500/10 text-red-300"
                      : "border-[var(--border-accent)] text-[var(--text-primary)] hover:border-[var(--accent)] hover:bg-[var(--surface-highlight)]"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isInWishlist(id) ? "fill-current" : ""}`} />
                  {isInWishlist(id) ? "Saved" : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}

function SpecCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-primary)] px-4 py-4">
      <p className="luxury-metric-label">{label}</p>
      <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
