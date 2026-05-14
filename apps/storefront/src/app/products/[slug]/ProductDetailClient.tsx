"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Zap,
} from "lucide-react";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";

const ProductViewer3D = dynamic(
  () => import("@/components/products/ProductViewer3D").then((mod) => mod.ProductViewer3D),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-square items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)]">
        Loading preview...
      </div>
    ),
  }
);

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  images: string[];
  meshFile?: {
    id: string;
    storagePath?: string | null;
    s3Key?: string | null;
    originalFilename: string;
  } | null;
}

const performanceFacts = [
  { label: "Material", value: "White PLA · FDM printed" },
  { label: "Studio", value: "AKAAR, Jaipur" },
  { label: "Shipping", value: "FREE · Pan-India" },
  { label: "Dispatch", value: "5–7 business days" },
];

export function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: ProductData;
  relatedProducts: ProductData[];
}) {
  const { formatPrice } = useSettings();
  const toast = useToast();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();
  const { items: recentItems, trackView } = useRecentlyViewed();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [isCartButtonVisible, setIsCartButtonVisible] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageError = (src: string) => {
    setFailedImages((prev) => new Set(prev).add(src));
  };

  // Refs for sticky bar IntersectionObserver and swipe gesture
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartX = useRef<number>(0);

  const price = product.price != null ? Number(product.price) : null;
  const isWishlisted = isInWishlist(product.id);

  const allImages = useMemo(() => {
    if (product.images?.length) return product.images;
    return product.imageUrl ? [product.imageUrl] : [];
  }, [product.images, product.imageUrl]);

  const has3D = Boolean(product.meshFile?.storagePath || product.meshFile?.s3Key);

  // Record this product view once on mount
  useEffect(() => {
    trackView({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: price,
      category: product.category,
      imageUrl: allImages[0] ?? null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  // Observe whether the main Add to Cart button is on-screen
  useEffect(() => {
    const button = cartButtonRef.current;
    if (!button) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsCartButtonVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  const handleAddToCart = () => {
    if (price == null) return;
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(6);
    addItem(
      { id: product.id, name: product.name, slug: product.slug, price, image: allImages[0] || undefined },
      quantity
    );
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleToggleWishlist = () => {
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: price ?? 0,
      category: product.category || undefined,
      imageUrl: allImages[0] || undefined,
    });
    toast[isWishlisted ? "info" : "success"](
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  // Swipe gesture handlers for mobile gallery
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) < 40 || allImages.length <= 1) return;
    if (delta < 0) {
      setSelectedImageIdx((i) => Math.min(i + 1, allImages.length - 1));
    } else {
      setSelectedImageIdx((i) => Math.max(i - 1, 0));
    }
    setShowViewer(false);
  };

  const descriptor = product.shortDescription ||
    "Configured geometry staged for visual review, material selection, and production planning.";
  const production = product.description ||
    "Handcrafted in the AKAAR studio, Jaipur. Every part goes through a material and geometry review before production begins.";

  return (
    <div className="min-h-screen pb-32 lg:pb-16">
      {/* Urgency bar */}
      <div className="border-b border-[var(--border)] bg-[var(--surface-highlight)] pt-20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-1 px-4 py-2.5 sm:px-6">
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            <Truck className="h-3 w-3" />
            Free shipping · all orders
          </span>
          <span className="hidden h-3 w-px bg-[var(--border-accent)] sm:block" />
          <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
            <Zap className="h-3 w-3" />
            Ships within 48 hrs · Jaipur
          </span>
          <span className="hidden h-3 w-px bg-[var(--border-accent)] sm:block" />
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-secondary)]">
            Handcrafted · Limited studio production
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 pt-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to collection
          </Link>
        </motion.div>

        <section className="luxury-panel relative overflow-hidden rounded-[2.45rem]">
          {allImages[0] ? (
            <div className="absolute right-[-8%] top-0 hidden h-full w-[48%] opacity-18 blur-[2px] lg:block">
              <Image
                src={allImages[0]}
                alt=""
                aria-hidden
                fill
                sizes="48vw"
                className="object-cover"
              />
            </div>
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(214,178,114,0.16),transparent_28%),radial-gradient(circle_at_86%_28%,rgba(125,211,199,0.12),transparent_26%)]" />

          <div className="relative z-10 grid gap-8 px-6 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10">
            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="luxury-kicker">{product.category || "Uncategorized"}</span>
                <div className="mt-4 space-y-2">
                  <h1 className="display-font text-4xl font-semibold uppercase leading-tight text-[var(--text-primary)] sm:text-5xl">
                    {product.name}
                  </h1>
                  <p className="display-font max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
                    {descriptor}
                  </p>
                </div>
              </div>

              {/* Image gallery — swipe-enabled on mobile */}
              <div className="flex flex-col gap-3">
                <div
                  className="luxury-stage relative overflow-hidden rounded-[2rem] border border-white/8 p-4 sm:p-5"
                  style={{ minHeight: "340px" }}
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* All images in DOM — opacity-toggled for instant switching */}
                  {allImages.map((img, i) => (
                    <div
                      key={img}
                      className={`absolute inset-4 sm:inset-5 rounded-[1rem] transition-opacity duration-150 ${
                        !showViewer && selectedImageIdx === i && !failedImages.has(img)
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={i === 0 ? product.name : ""}
                        fill
                        sizes="(max-width: 1024px) 100vw, 560px"
                        className="object-contain"
                        priority={i === 0}
                        onError={() => handleImageError(img)}
                      />
                    </div>
                  ))}
                  {showViewer ? (
                    <ProductViewer3D
                      name={product.name}
                      imageUrl={allImages[0] ?? null}
                      modelUrl={product.meshFile?.storagePath || product.meshFile?.s3Key}
                    />
                  ) : null}
                  {!showViewer && (allImages.length === 0 || failedImages.has(allImages[selectedImageIdx])) ? (
                    <div className="absolute inset-4 flex items-center justify-center rounded-[1rem] border border-[var(--border)] bg-[var(--bg-tertiary)] text-sm text-[var(--text-secondary)] sm:inset-5">
                      Preview unavailable
                    </div>
                  ) : null}

                  {/* Swipe dot indicators — mobile only */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 sm:hidden">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedImageIdx(i); setShowViewer(false); }}
                          className={`h-1.5 rounded-full transition-all ${
                            selectedImageIdx === i
                              ? "w-4 bg-[var(--accent)]"
                              : "w-1.5 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Thumbnail strip — hidden on mobile (uses swipe + dots instead) */}
                {(allImages.length > 1 || has3D) && (
                  <div className="hidden gap-2 overflow-x-auto pb-1 sm:flex">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => { setSelectedImageIdx(i); setShowViewer(false); }}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                          !showViewer && selectedImageIdx === i
                            ? "border-[var(--accent)]"
                            : "border-transparent hover:border-[var(--border-accent)]"
                        } ${failedImages.has(img) ? "opacity-30" : ""}`}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                          onError={() => handleImageError(img)}
                        />
                      </button>
                    ))}
                    {has3D && (
                      <button
                        onClick={() => setShowViewer(true)}
                        className={`relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 bg-[var(--bg-secondary)] text-xs font-semibold uppercase tracking-wider transition-colors ${
                          showViewer
                            ? "border-[var(--accent)] text-[var(--accent)]"
                            : "border-transparent text-[var(--text-muted)] hover:border-[var(--border-accent)]"
                        }`}
                      >
                        3D
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
                {performanceFacts.map((fact) => (
                  <FactCard key={fact.label} label={fact.label} value={fact.value} />
                ))}
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16 }}
              className="flex flex-col gap-6"
            >
              <div className="luxury-card rounded-[2rem] p-6 sm:p-7">
                <span className="luxury-kicker">Product brief</span>
                <h1 className="display-font mt-4 text-4xl uppercase leading-none text-[var(--text-primary)] sm:text-5xl">
                  {product.name}
                </h1>
                <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">{production}</p>

                <div className="mt-8 grid gap-px overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="bg-[var(--bg-secondary)] px-5 py-5">
                    <p className="luxury-metric-label">Starting price</p>
                    <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
                      {price != null ? formatPrice(price) : "Price on request"}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] px-5 py-5">
                    <p className="luxury-metric-label">Quantity</p>
                    <div className="input-stepper mt-3 inline-flex items-center overflow-hidden rounded-full">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 font-medium text-[var(--text-primary)]">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center px-3 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 rounded-[1.2rem] border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <p className="text-xs font-medium text-emerald-400">
                    Ships within 48 hours of order confirmation
                  </p>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <Button
                    ref={cartButtonRef}
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={price == null}
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleToggleWishlist}
                    className={
                      isWishlisted
                        ? "border-red-400/50 bg-red-500/10 text-red-300 hover:bg-red-500/15"
                        : ""
                    }
                  >
                    <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
                  </Button>
                  <Button variant="outline" size="lg" onClick={handleShare}>
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-4">
                {product.meshFile ? (
                  <InfoPanel
                    kicker="3D Preview"
                    title="Interactive model attached"
                    body={`${product.meshFile.originalFilename} is available as the source preview asset for the interactive viewer.`}
                  />
                ) : null}
                <InfoPanel
                  kicker="What's included"
                  title="Ready to display, straight out of the box"
                  body="Your order arrives fully assembled and ready to place — on a desk, shelf, or altar. No finishing, painting, or post-processing required."
                />
                <InfoPanel
                  kicker="Need modifications?"
                  title="Shift into a reviewed custom build"
                  body="Need a different scale, finish, material, or geometry? Move from this listing into a custom build request — reviewed personally before production."
                  cta={
                    <Link
                      href="/quote"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]"
                    >
                      Request a custom build
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  }
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Recently Viewed — excludes current product */}
        {(() => {
          const recents = recentItems.filter((r) => r.id !== product.id).slice(0, 4);
          if (recents.length === 0) return null;
          return (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36 }}
              className="mt-14"
            >
              <div className="mb-6">
                <span className="luxury-kicker">Your browsing history</span>
                <h2 className="display-font mt-3 text-3xl text-[var(--text-primary)]">
                  Recently viewed
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {recents.map((item) => (
                  <Link
                    key={item.id}
                    href={`/products/${item.slug}`}
                    className="luxury-card group overflow-hidden rounded-[1.6rem]"
                  >
                    <div className="luxury-stage relative min-h-[140px] overflow-hidden p-4">
                      {item.imageUrl ? (
                        <div className="absolute inset-4">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="absolute inset-4 flex items-center justify-center rounded-xl border border-[var(--border)] text-xs text-[var(--text-muted)]">
                          No preview
                        </div>
                      )}
                    </div>
                    <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
                      <p className="truncate text-xs font-medium uppercase tracking-[0.1em] text-[var(--text-muted)]">
                        {item.category || "Uncategorized"}
                      </p>
                      <p className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                        {item.name}
                      </p>
                      {item.price != null && (
                        <p className="mt-1 text-xs text-[var(--text-secondary)]">
                          {formatPrice(item.price)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.section>
          );
        })()}

        {relatedProducts.length > 0 ? (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            className="mt-14"
          >
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <span className="luxury-kicker">Related builds</span>
                <h2 className="display-font mt-3 text-4xl text-[var(--text-primary)] sm:text-5xl">
                  Continue the collection
                </h2>
              </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-3">
              {relatedProducts.slice(0, 3).map((related) => (
                <Link
                  key={related.id}
                  href={`/products/${related.slug}`}
                  className="luxury-card group overflow-hidden rounded-[2rem]"
                >
                  <div className="luxury-stage relative min-h-[250px] overflow-hidden p-5">
                    <p className="pointer-events-none absolute left-5 right-5 top-5 overflow-hidden text-[clamp(2.8rem,7vw,5.5rem)] font-semibold uppercase tracking-[-0.09em] text-white/[0.08]">
                      {related.name}
                    </p>
                    {related.imageUrl ? (
                      <div className="absolute inset-x-5 bottom-5 top-14">
                        <Image
                          src={related.imageUrl}
                          alt={related.name}
                          fill
                          sizes="(max-width: 1280px) 50vw, 33vw"
                          className="hero-image-shadow object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    ) : null}
                  </div>
                  <div className="grid gap-px border-t border-[var(--border)] bg-[var(--border)] sm:grid-cols-[1.2fr_0.8fr]">
                    <div className="bg-[var(--bg-secondary)] px-5 py-5">
                      <p className="luxury-metric-label">{related.category || "Uncategorized"}</p>
                      <h3 className="display-font mt-2 text-2xl uppercase leading-none text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent)]">
                        {related.name}
                      </h3>
                    </div>
                    <div className="bg-[var(--bg-secondary)] px-5 py-5">
                      <p className="luxury-metric-label">Starting from</p>
                      <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                        {related.price != null ? formatPrice(Number(related.price)) : "—"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        ) : null}
      </div>

      {/* Sticky mobile add-to-cart bar — shown when main button is off screen */}
      <div
        className={`fixed bottom-16 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--bg-primary)]/95 px-4 py-3 backdrop-blur-md transition-transform duration-200 lg:hidden [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom,0px))] ${
          isCartButtonVisible ? "translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {product.name}
            </p>
            <p className="mt-0.5 text-base font-semibold text-[var(--text-primary)]">
              {price != null ? formatPrice(price) : "Price on request"}
            </p>
          </div>
          <div className="input-stepper flex shrink-0 items-center overflow-hidden rounded-full">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              −
            </button>
            <span className="px-2 text-sm font-medium text-[var(--text-primary)]">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            >
              +
            </button>
          </div>
          <Button variant="primary" size="sm" onClick={handleAddToCart} disabled={price == null} className="shrink-0">
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}

function FactCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-secondary)] px-5 py-5">
      <p className="luxury-metric-label">{label}</p>
      <p className="mt-3 text-sm font-medium text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

function InfoPanel({
  kicker,
  title,
  body,
  cta,
}: {
  kicker: string;
  title: string;
  body: string;
  cta?: ReactNode;
}) {
  return (
    <div className="luxury-card rounded-[1.8rem] p-6">
      <span className="luxury-kicker">{kicker}</span>
      <h2 className="display-font mt-4 text-3xl text-[var(--text-primary)]">{title}</h2>
      <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{body}</p>
      {cta}
    </div>
  );
}
