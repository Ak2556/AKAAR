"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSettings } from "@/context/SettingsContext";
import { useToast } from "@/context/ToastContext";
import { Button } from "@/components/ui/Button";

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isOpen,
    closeCart,
    totalItems,
    totalPrice,
  } = useCart();
  const { formatPrice } = useSettings();
  const toast = useToast();

  // Focus management — remember which element opened the drawer
  const triggerRef = useRef<Element | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Remember the element that had focus before opening
      triggerRef.current = document.activeElement;
      // Move focus to the drawer
      requestAnimationFrame(() => {
        drawerRef.current?.focus();
      });
    } else {
      // Restore focus to the trigger element when closed
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    }
  }, [isOpen]);

  // Focus trap + Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
        return;
      }

      if (e.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;

      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id);
    toast.info(`${name} removed from cart`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            tabIndex={-1}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[var(--bg-primary)] border-l border-[var(--border)] z-50 flex flex-col outline-none"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                <h2 id="cart-title" className="text-lg font-semibold">Your Cart</h2>
                <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-sm rounded-full" aria-live="polite">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={closeCart}
                aria-label="Close cart"
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl hover:bg-[var(--bg-secondary)] transition-colors"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 mb-6 border border-[var(--border)] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-[var(--text-muted)]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-6">
                    Add some products to get started
                  </p>
                  <Link href="/products" onClick={closeCart}>
                    <Button variant="primary">
                      Browse Products
                      <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={`${item.id}-${item.material}`}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
                    >
                      {/* Product image or fallback */}
                      <div className="relative w-20 h-20 bg-[var(--bg-tertiary)] rounded-xl flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1"
                            sizes="80px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center" aria-hidden="true">
                            <ShoppingBag className="w-8 h-8 text-[var(--text-muted)]" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="font-medium hover:text-[var(--accent)] transition-colors line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        {item.material && (
                          <p className="text-sm text-[var(--text-muted)] mt-1">
                            Material: {item.material}
                          </p>
                        )}
                        <p className="text-[var(--accent)] font-medium mt-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls — 44px touch targets */}
                        <div className="flex items-center justify-between mt-3">
                          <div
                            className="flex items-center border border-[var(--border)] rounded-xl overflow-hidden"
                            role="group"
                            aria-label={`Quantity for ${item.name}`}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              aria-label={`Decrease quantity of ${item.name}`}
                              className="flex min-h-[44px] min-w-[44px] items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <span className="px-3 text-sm font-medium min-w-[2rem] text-center" aria-live="polite">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label={`Increase quantity of ${item.name}`}
                              className="flex min-h-[44px] min-w-[44px] items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                              <Plus className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id, item.name)}
                            aria-label={`Remove ${item.name} from cart`}
                            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-red-500 hover:bg-red-500/10 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear Cart */}
                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-sm text-[var(--text-muted)] hover:text-red-500 transition-colors"
                  >
                    Clear all items
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-[var(--border)] space-y-4">
                {/* Summary */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--text-muted)]">Shipping</span>
                    <span className="text-[var(--accent)]">Calculated at checkout</span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-semibold pt-2 border-t border-[var(--border)]">
                    <span>Total</span>
                    <span className="text-[var(--accent)]">{formatPrice(totalPrice)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Link href="/checkout" onClick={closeCart} className="block">
                    <Button variant="primary" size="lg" className="w-full" glow>
                      Proceed to Checkout
                      <ArrowRight className="w-5 h-5 ml-2" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/quote" onClick={closeCart} className="block">
                    <Button variant="outline" size="lg" className="w-full">
                      Request Custom Quote
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
