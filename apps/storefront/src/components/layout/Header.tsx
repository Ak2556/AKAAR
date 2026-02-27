"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Box, Layers, Wrench, ShoppingCart, Search, Heart, User, LogOut, Package, Settings } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { SearchModal } from "@/components/search/SearchModal";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { href: "/products", label: "Products", icon: Box },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/about", label: "About", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { openCart, totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const { data: session, status } = useSession();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/logo.svg"
                alt="Akaar 3D Printing Solutions"
                width={160}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  <span className="h-px w-0 bg-[var(--accent)] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-all"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
                <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-xs bg-[var(--bg-tertiary)] rounded">
                  ⌘K
                </kbd>
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistItems > 9 ? "9+" : wishlistItems}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>

              {/* User Menu */}
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] animate-pulse" />
              ) : session ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full border border-[var(--border)]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[var(--accent)] flex items-center justify-center text-[var(--bg-primary)] font-semibold text-sm">
                        {session.user?.name?.[0]?.toUpperCase() || session.user?.email?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 glass rounded-lg shadow-xl border border-[var(--border)] overflow-hidden"
                      >
                        <div className="p-3 border-b border-[var(--border)]">
                          <p className="font-medium truncate">{session.user?.name || "User"}</p>
                          <p className="text-sm text-[var(--text-tertiary)] truncate">{session.user?.email}</p>
                        </div>
                        <div className="p-2">
                          <Link
                            href="/account"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Account
                          </Link>
                          <Link
                            href="/account/orders"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          >
                            <Package className="w-4 h-4" />
                            Orders
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            Settings
                          </Link>
                        </div>
                        <div className="p-2 border-t border-[var(--border)]">
                          <button
                            onClick={() => { setIsUserMenuOpen(false); signOut(); }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center gap-2 px-4 py-2 text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-all"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              <Link
                href="/quote"
                className="px-6 py-2 bg-[var(--accent)] text-[var(--bg-primary)] font-medium rounded hover:bg-[var(--accent)]/90 transition-colors ml-2"
              >
                Get Quote
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-[var(--text-secondary)]"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-[var(--text-secondary)]"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isOpen ? "auto" : 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-[var(--border)] space-y-3">
                <Link
                  href="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 w-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Wishlist</span>
                  {wishlistItems > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                      {wishlistItems}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => { setIsOpen(false); openCart(); }}
                  className="flex items-center gap-3 w-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">Cart</span>
                  {totalItems > 0 && (
                    <span className="ml-auto px-2 py-0.5 bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold rounded-full">
                      {totalItems}
                    </span>
                  )}
                </button>
                {session ? (
                  <>
                    <Link
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 w-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span className="font-medium">My Account</span>
                    </Link>
                    <button
                      onClick={() => { setIsOpen(false); signOut(); }}
                      className="flex items-center gap-3 w-full text-red-400 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 w-full text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Sign In</span>
                  </Link>
                )}
                <Link
                  href="/quote"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-medium rounded"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </motion.div>
        </nav>
      </motion.header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
