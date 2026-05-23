"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Grid2x2, PackagePlus, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

const tabs = [
  { href: "/", label: "Shop", icon: Grid2x2 },
  { href: "/quote", label: "Quote", icon: PackagePlus },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { totalItems, openCart } = useCart();

  // Don't render on admin pages
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="glass flex items-stretch border-t border-[var(--border)]">
        {tabs.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/products")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium uppercase tracking-[0.12em] transition-colors ${
                isActive
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}

        {/* Cart tab — button not link so it opens the drawer */}
        <button
          onClick={openCart}
          aria-label={`Shopping cart, ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
          className="relative flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--text-secondary)]"
        >
          <span className="relative">
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--accent)] px-0.5 text-[9px] font-bold text-[var(--bg-primary)]">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </span>
          Cart
        </button>
      </div>
    </nav>
  );
}
