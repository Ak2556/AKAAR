"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, Trash2, ShoppingCart, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = (item: typeof items[0]) => {
    addItem({
      id: item.id,
      name: item.name,
      slug: item.slug,
      price: item.price,
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const handleAddAllToCart = () => {
    items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        slug: item.slug,
        price: item.price,
      });
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

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-6 h-6 text-red-500" />
              <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
                Saved Items
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              Your <span className="gradient-text">Wishlist</span>
            </h1>
            {items.length > 0 && (
              <p className="text-[var(--text-secondary)] mt-4">
                {items.length} {items.length === 1 ? "item" : "items"} saved for later
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 border border-[var(--border)] rounded-full flex items-center justify-center">
              <Heart className="w-10 h-10 text-[var(--text-muted)]" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-[var(--text-secondary)] mb-8">
              Save items you love by clicking the heart icon on any product.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Browse Products
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Actions Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
            >
              <p className="text-sm text-[var(--text-muted)]">
                Total value: <span className="text-[var(--accent)] font-semibold">
                  ${items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </span>
              </p>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All
                </Button>
                <Button variant="primary" onClick={handleAddAllToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add All to Cart
                </Button>
              </div>
            </motion.div>

            {/* Wishlist Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group border border-[var(--border)] rounded-xl overflow-hidden bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-all"
                >
                  {/* Product Image Placeholder */}
                  <Link href={`/products/${item.slug}`}>
                    <div className="aspect-square bg-[var(--bg-tertiary)] flex items-center justify-center relative">
                      <Package className="w-16 h-16 text-[var(--text-muted)]" />
                      {item.category && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur rounded text-xs font-mono text-[var(--accent)]">
                          {item.category}
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-6">
                    <Link href={`/products/${item.slug}`}>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {item.name}
                      </h3>
                    </Link>
                    <p className="text-2xl font-bold text-[var(--accent)] mb-6">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        variant="primary"
                        className="flex-1"
                        onClick={() => handleAddToCart(item)}
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleRemove(item.id, item.name)}
                        className="text-red-500 border-red-500/30 hover:bg-red-500/10 hover:border-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Continue Shopping */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-12 text-center"
            >
              <Link
                href="/products"
                className="text-[var(--accent)] hover:underline inline-flex items-center gap-2"
              >
                Continue Shopping
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
