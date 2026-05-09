"use client";

import { motion } from "framer-motion";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  Loader2,
  Share2,
  ShoppingCart,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductViewer3D } from "@/components/products/ProductViewer3D";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";

interface Product {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | null;
  description: string | null;
  shortDescription: string | null;
  imageUrl: string | null;
  meshFile?: {
    id: string;
    storagePath?: string | null;
    s3Key?: string | null;
    originalFilename: string;
  } | null;
}

const performanceFacts = [
  { label: "Preview system", value: "3D-capable viewer" },
  { label: "Review window", value: "48 hours" },
  { label: "Shipping", value: "FREE · Pan-India" },
  { label: "Dispatch", value: "5-7 business days" },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { formatPrice } = useSettings();
  const toast = useToast();
  const { addItem } = useCart();
  const { toggleItem, isInWishlist } = useWishlist();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [catalogAvailable, setCatalogAvailable] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${slug}`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Product not found");
          }
          setCatalogAvailable(Boolean(data.catalogAvailable));
          throw new Error(data.error || "Failed to load product");
        }

        setCatalogAvailable(Boolean(data.catalogAvailable));
        setProduct(data.product);
        setRelatedProducts(data.relatedProducts || []);
      } catch (fetchError) {
        setError(fetchError instanceof Error ? fetchError.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const price = product?.price ? Number(product.price) : 0;
  const isWishlisted = product ? isInWishlist(product.id) : false;

  const handleAddToCart = () => {
    if (!product) return;
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price,
        image: product.imageUrl || undefined,
      },
      quantity
    );
    toast.success(`Added ${quantity} ${product.name} to cart`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    toggleItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price,
      category: product.category || undefined,
      imageUrl: product.imageUrl || undefined,
    });

    toast[isWishlisted ? "info" : "success"](
      isWishlisted ? "Removed from wishlist" : "Added to wishlist"
    );
  };

  const handleShare = async () => {
    if (!product) return;

    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
        return;
      } catch {}
    }

    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  const productNarrative = useMemo(() => {
    if (!product) {
      return {
        descriptor: "",
        production: "",
        preview: "",
      };
    }

    return {
      descriptor:
        product.shortDescription ||
        "Configured geometry staged for visual review, material selection, and production planning.",
      production:
        product.description ||
        "This product page is intended to work like a reviewed spec sheet. Inspect the visual stage, confirm the intended category, then move into cart or use the listing as a quote reference.",
      preview: product.meshFile
        ? `${product.meshFile.originalFilename} is available as the source preview asset for the interactive viewer.`
        : "No mesh asset is attached yet, so the viewer falls back to the prepared visual stage.",
    };
  }, [product]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center pb-16 pt-24">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pb-16 pt-24 sm:px-6">
        <div className="luxury-card w-full max-w-2xl rounded-[2rem] px-8 py-12 text-center">
          <h1 className="display-font text-3xl text-[var(--text-primary)]">
            {catalogAvailable ? error || "Product not found" : "Collection unavailable"}
          </h1>
          <p className="mt-4 text-[var(--text-secondary)]">
            {catalogAvailable
              ? "This product page could not be loaded."
              : "Product data is not configured in this environment yet."}
          </p>
          <Link
            href="/products"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3 text-sm font-medium text-[var(--bg-primary)]"
          >
            Back to Collection
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--text-primary)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to collection
          </Link>
        </motion.div>

        <section className="luxury-panel relative overflow-hidden rounded-[2.45rem]">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute right-[-8%] top-0 hidden h-full w-[48%] object-cover opacity-18 blur-[2px] lg:block"
            />
          ) : null}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(214,178,114,0.16),transparent_28%),radial-gradient(circle_at_86%_28%,rgba(125,211,199,0.12),transparent_26%)]" />
          <div className="relative z-10 grid gap-8 px-6 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08 }}
              className="flex flex-col gap-6"
            >
              <div>
                <span className="luxury-kicker">{product.category || "Uncategorized"}</span>
                <div className="mt-4 space-y-2">
                  <p className="hero-wordmark text-[var(--text-primary)]">{product.name}</p>
                  <p className="display-font max-w-2xl text-lg leading-8 text-[var(--text-secondary)]">
                    {productNarrative.descriptor}
                  </p>
                </div>
              </div>

              <div className="luxury-stage relative overflow-hidden rounded-[2rem] border border-white/8 p-4 sm:p-5">
                <ProductViewer3D
                  name={product.name}
                  imageUrl={product.imageUrl}
                  modelUrl={product.meshFile?.storagePath || product.meshFile?.s3Key}
                />
              </div>

              <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 xl:grid-cols-4">
                {performanceFacts.map((fact) => (
                  <FactCard key={fact.label} label={fact.label} value={fact.value} />
                ))}
              </div>
            </motion.div>

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
                <p className="mt-5 text-base leading-7 text-[var(--text-secondary)]">
                  {productNarrative.production}
                </p>

                <div className="mt-8 grid gap-px overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-[1.2fr_0.8fr]">
                  <div className="bg-[var(--bg-secondary)] px-5 py-5">
                    <p className="luxury-metric-label">Starting price</p>
                    <p className="mt-3 text-3xl font-semibold text-[var(--text-primary)]">
                      {formatPrice(price)}
                    </p>
                  </div>
                  <div className="bg-[var(--bg-secondary)] px-5 py-5">
                    <p className="luxury-metric-label">Quantity</p>
                    <div className="input-stepper mt-3 inline-flex items-center overflow-hidden rounded-full">
                      <button
                        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                        className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                      >
                        -
                      </button>
                      <span className="px-5 py-2 font-medium text-[var(--text-primary)]">{quantity}</span>
                      <button
                        onClick={() => setQuantity((current) => current + 1)}
                        className="px-4 py-2 text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                  <Button variant="primary" size="lg" className="w-full" onClick={handleAddToCart}>
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
                <InfoPanel
                  kicker="Preview notes"
                  title={product.meshFile ? "Interactive asset attached" : "Prepared visual stage"}
                  body={productNarrative.preview}
                />
                <InfoPanel
                  kicker="Production intent"
                  title="Use as a configured reference"
                  body="This listing is a launch point. Move it into the cart when the preset is already close, or use it to anchor a more tailored quote request."
                />
                <InfoPanel
                  kicker="Need modifications?"
                  title="Shift into a reviewed custom build"
                  body="If the material, fit, finish, or geometry needs to change, continue from this page into a quote request instead of forcing a generic purchase path."
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
                      <img
                        src={related.imageUrl}
                        alt={related.name}
                        className="hero-image-shadow absolute inset-x-5 bottom-5 top-14 h-[calc(100%-4.75rem)] w-[calc(100%-2.5rem)] object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      />
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
                        {formatPrice(Number(related.price) || 0)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        ) : null}
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
  cta?: React.ReactNode;
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
