"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ShoppingCart, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";
import { getProductCommerceProfile } from "@/lib/product-commerce";
import {
  availabilityToneClasses,
  resolveAvailability,
} from "@/lib/availability";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  badge?: string;
  stockLabel?: string;
  stockQuantity?: number | null;
  leadTimeDays?: number | null;
}

const badgeStyles: Record<string, string> = {
  Bestseller: "bg-[var(--accent)] text-[var(--bg-primary)]",
  Popular: "bg-blue-500/80 text-white",
  "Limited run": "bg-red-500/80 text-white",
};

export function ProductCard({
  id,
  name,
  slug,
  category,
  price,
  description,
  imageUrl,
  badge,
  stockLabel,
  stockQuantity = null,
  leadTimeDays = null,
}: ProductCardProps) {
  const { addItem } = useCart();
  const toast = useToast();
  const { formatPrice } = useSettings();
  const profile = getProductCommerceProfile({ name, category, description });
  const availability = resolveAvailability({ stockQuantity, leadTimeDays });

  const handleAddToCart = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!availability.canPurchase) {
      toast.error("This product is currently sold out");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(6);
    addItem({ id, name, slug, price, image: imageUrl });
    toast.success(`Added ${name} to cart`);
  };

  return (
    <div className="group h-full transition-transform duration-300 hover:-translate-y-1">
      <Link href={`/products/${slug}`} className="block h-full">
        <article className="luxury-card flex h-full flex-col overflow-hidden rounded-[var(--rad-xl)]">
          <div className="luxury-stage relative aspect-[1.05/1] overflow-hidden px-5 py-5 sm:px-6">
            <div className="absolute left-5 top-5 z-10 rounded-full border border-[var(--border-accent)] bg-[rgba(9,9,11,0.42)] px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[var(--text-secondary)] backdrop-blur-md">
              {category}
            </div>

            {badge ? (
              <div
                className={`absolute right-5 top-5 z-10 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] backdrop-blur-md ${
                  badgeStyles[badge] ?? "bg-[var(--accent)] text-[var(--bg-primary)]"
                }`}
              >
                {badge}
              </div>
            ) : (
              <div className="absolute right-5 top-5 z-10 rounded-full border border-[var(--border-accent)] bg-[rgba(9,9,11,0.48)] px-2.5 py-2 text-[var(--text-secondary)] backdrop-blur-md transition-colors group-hover:text-[var(--text-primary)]">
                <ArrowUpRight className="h-4 w-4" />
              </div>
            )}

            <p className="pointer-events-none absolute left-5 right-5 top-14 overflow-hidden text-[clamp(2.8rem,7vw,5rem)] font-semibold uppercase tracking-[-0.09em] text-white/[0.08]">
              {name}
            </p>

            {imageUrl ? (
              <div className="absolute inset-x-5 bottom-5 top-20">
                <Image
                  src={imageUrl}
                  alt={name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="hero-image-shadow object-contain transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
            ) : (
              <div className="absolute inset-x-5 bottom-5 top-20 overflow-hidden rounded-[var(--rad-lg)] border border-[var(--border)] bg-[linear-gradient(145deg,#14171c_0%,#232a33_52%,#101114_100%)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(214,178,114,0.18),transparent_28%),radial-gradient(circle_at_78%_76%,rgba(125,211,199,0.12),transparent_28%)]" />
                <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <span className="luxury-kicker">Preview stage</span>
                  <span className="text-xs uppercase tracking-[0.22em] text-white/40">Awaiting asset</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-[1fr_auto] gap-px border-t border-[var(--border)] bg-[var(--border)]">
            <div className="bg-[var(--bg-secondary)] px-4 py-4 sm:px-5 sm:py-5">
              <p className="display-font min-h-[3rem] text-xl uppercase leading-tight tracking-tight text-[var(--text-primary)] line-clamp-2">
                {name}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="text-sm font-semibold text-[var(--text-primary)]">{formatPrice(price)}</span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${availabilityToneClasses(availability.tone)}`}
                  title={availability.description}
                >
                  {availability.label}
                </span>
                {stockLabel ? (
                  <span className="text-xs font-medium text-amber-400">{stockLabel}</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <Truck className="h-3 w-3" />
                    Free shipping
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.cardHighlights.slice(0, 2).map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)]"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={!availability.canPurchase}
              className="flex flex-col items-center justify-center gap-1 bg-[var(--bg-secondary)] px-4 py-4 sm:px-5 transition-colors hover:bg-[var(--surface-highlight)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[var(--bg-secondary)]"
            >
              <ShoppingCart className="h-4 w-4 text-[var(--text-primary)]" />
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--text-primary)]">{availability.canPurchase ? "Add" : "Sold out"}</span>
            </button>
          </div>
        </article>
      </Link>
    </div>
  );
}
