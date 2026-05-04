"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyStatePanel, MetricTile } from "@/components/ui/storefront-primitives";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import { useSettings } from "@/context/SettingsContext";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const { formatPrice } = useSettings();
  const toast = useToast();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({ id: item.id, name: item.name, slug: item.slug, price: item.price });
    toast.success(`Added ${item.name} to cart`);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({ id: item.id, name: item.name, slug: item.slug, price: item.price });
    });
    toast.success(`Added ${items.length} items to cart`);
  };

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    toast.info(`Removed ${name} from wishlist`);
  };

  const handleClearAll = () => {
    clearWishlist();
    toast.info("Wishlist cleared");
  };

  const totalValue = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <section className="luxury-panel rounded-[2.3rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-red-300" />
                <span className="luxury-kicker">Saved items</span>
              </div>
              <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                Your shortlist for future builds and purchases.
              </h1>
              <p className="mt-4 max-w-2xl text-[var(--text-secondary)]">
                Keep promising parts close, compare them later, or move everything into the cart when you are ready to proceed.
              </p>
            </div>
            <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3 lg:self-end">
              <StatCard label="Saved" value={`${items.length}`} />
              <StatCard label="Total value" value={items.length ? formatPrice(totalValue) : "--"} />
              <StatCard label="Status" value={items.length ? "Ready" : "Empty"} />
            </div>
          </div>
        </section>

        {items.length === 0 ? (
          <div className="mt-10">
            <EmptyStatePanel
              icon={Heart}
              title="Your wishlist is empty"
              description="Save parts you want to revisit by using the wishlist action across the collection."
              action={
                <Link href="/products">
                  <Button size="lg">
                    Browse Products
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                Total value <span className="text-[var(--text-primary)]">{formatPrice(totalValue)}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={handleClearAll}>Clear All</Button>
                <Button onClick={handleAddAllToCart}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add All to Cart
                </Button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="luxury-card overflow-hidden rounded-[1.9rem]"
                >
                  <Link href={`/products/${item.slug}`} className="block">
                    <div className="luxury-stage relative aspect-[5/4] p-5">
                      {item.category ? (
                        <span className="absolute left-5 top-5 rounded-full border border-[var(--border-accent)] px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[var(--text-secondary)]">
                          {item.category}
                        </span>
                      ) : null}
                      <div className="flex h-full items-center justify-center">
                        <Package className="h-16 w-16 text-[var(--text-muted)]" />
                      </div>
                    </div>
                  </Link>

                  <div className="border-t border-[var(--border)] px-6 py-6">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="display-font text-3xl uppercase text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="mt-3 text-sm font-medium text-[var(--text-secondary)]">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-6 flex gap-3">
                      <Button className="flex-1" onClick={() => handleAddToCart(item)}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(item.id, item.name)}
                        className="border-red-400/30 text-red-300 hover:bg-red-500/10 hover:border-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return <MetricTile label={label} value={value} className="py-6" />;
}
