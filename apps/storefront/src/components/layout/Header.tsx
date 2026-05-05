"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingCart,
  User,
  LogOut,
  Package,
  Settings,
  Sun,
  Moon,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchModal } from "@/components/search/SearchModal";
import { useTheme } from "@/hooks/useTheme";

import { useAuthState } from "@/components/providers/AuthProvider";

const navItems = [
  { href: "/products", label: "Collection" },
  { href: "/services", label: "Capabilities" },
  { href: "/about", label: "Studio" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { openCart, totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { session, status, enabled: authEnabled, signOut } = useAuthState();
  const { isDark, toggleMode } = useTheme();
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6"
      >
        <nav className="glass mx-auto max-w-7xl rounded-[1.75rem] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-8">
              <Logo size="md" showTagline={false} />

              <div className="hidden lg:flex items-center gap-7">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium tracking-[0.08em] text-[var(--text-secondary)] uppercase transition-colors hover:text-[var(--text-primary)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="luxury-pill flex items-center gap-2 rounded-full px-4 py-2 text-sm hover:text-[var(--text-primary)]"
              >
                <Search className="h-4 w-4" />
                Search
                <kbd className="hidden rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] lg:inline-flex">
                  Cmd K
                </kbd>
              </button>

              <button
                onClick={toggleMode}
                className="luxury-pill rounded-full p-2.5 hover:text-[var(--text-primary)]"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              <Link
                href="/wishlist"
                className="relative luxury-pill rounded-full p-2.5 hover:text-[var(--text-primary)]"
              >
                <Heart className="h-4 w-4" />
                {wishlistItems > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--text-primary)] px-1 text-[10px] font-semibold text-[var(--bg-primary)]">
                    {wishlistItems > 9 ? "9+" : wishlistItems}
                  </span>
                ) : null}
              </Link>

              <button
                onClick={openCart}
                className="relative luxury-pill rounded-full p-2.5 hover:text-[var(--text-primary)]"
              >
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-[var(--bg-primary)]">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                ) : null}
              </button>

              {authEnabled && status === "loading" ? (
                <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--bg-tertiary)]" />
              ) : session ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen((value) => !value)}
                    className="luxury-pill flex items-center gap-3 rounded-full pl-2 pr-4 py-2 hover:text-[var(--text-primary)]"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--text-primary)] text-sm font-semibold text-[var(--bg-primary)]">
                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="hidden text-sm text-[var(--text-secondary)] xl:inline">
                      {session.user?.name || "Account"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen ? (
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="glass absolute right-0 mt-3 w-64 overflow-hidden rounded-[1.5rem]"
                      >
                        <div className="border-b border-[var(--border)] px-5 py-4">
                          <p className="font-medium text-[var(--text-primary)]">{session.user?.name || "User"}</p>
                          <p className="mt-1 text-sm text-[var(--text-muted)]">{session.user?.email}</p>
                        </div>
                        <div className="p-2">
                          <MenuLink href="/account" label="My Account" icon={User} onClick={() => setIsUserMenuOpen(false)} />
                          <MenuLink href="/account/orders" label="Orders" icon={Package} onClick={() => setIsUserMenuOpen(false)} />
                          <MenuLink href="/settings" label="Settings" icon={Settings} onClick={() => setIsUserMenuOpen(false)} />
                          {isAdmin ? (
                            <MenuLink href="/admin/products" label="Admin Products" icon={ShieldCheck} onClick={() => setIsUserMenuOpen(false)} />
                          ) : null}
                        </div>
                        <div className="border-t border-[var(--border)] p-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              signOut();
                            }}
                            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm text-red-300 transition-colors hover:bg-red-500/10"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="luxury-pill rounded-full px-4 py-2 text-sm hover:text-[var(--text-primary)]"
                >
                  Sign In
                </Link>
              )}

              <Link
                href="/quote"
                className="rounded-full bg-[var(--text-primary)] px-5 py-2.5 text-sm font-medium text-[var(--bg-primary)] shadow-[0_22px_50px_-30px_rgba(255,255,255,0.45)] transition-transform hover:-translate-y-0.5"
              >
                Start a Build
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={toggleMode}
                className="luxury-pill rounded-full p-2.5"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsSearchOpen(true)}
                className="luxury-pill rounded-full p-2.5"
              >
                <Search className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsOpen((value) => !value)}
                className="luxury-pill rounded-full p-2.5"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <AnimatePresence initial={false}>
            {isOpen ? (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden md:hidden"
              >
                <div className="mt-5 border-t border-[var(--border)] pt-5">
                  <div className="grid gap-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="rounded-2xl px-3 py-3 text-sm font-medium uppercase tracking-[0.14em] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                      >
                        {item.label}
                      </Link>
                    ))}

                    <button
                      onClick={() => {
                        setIsOpen(false);
                        openCart();
                      }}
                      className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      <span>Cart</span>
                      <span>{totalItems}</span>
                    </button>

                    <Link
                      href="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                    >
                      <span>Wishlist</span>
                      <span>{wishlistItems}</span>
                    </Link>

                    {session ? (
                      <>
                        <Link
                          href="/account"
                          onClick={() => setIsOpen(false)}
                          className="rounded-2xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                        >
                          Account
                        </Link>
                        {isAdmin ? (
                          <Link
                            href="/admin/products"
                            onClick={() => setIsOpen(false)}
                            className="rounded-2xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                          >
                            Admin Products
                          </Link>
                        ) : null}
                        <button
                          onClick={() => {
                            setIsOpen(false);
                            signOut();
                          }}
                          className="rounded-2xl px-3 py-3 text-left text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsOpen(false)}
                        className="rounded-2xl px-3 py-3 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
                      >
                        Sign In
                      </Link>
                    )}

                    <Link
                      href="/quote"
                      onClick={() => setIsOpen(false)}
                      className="mt-2 rounded-full bg-[var(--text-primary)] px-5 py-3 text-center text-sm font-medium text-[var(--bg-primary)]"
                    >
                      Start a Build
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </nav>
      </motion.header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

function MenuLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: typeof User;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}
