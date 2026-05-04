"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  FileQuestion,
  Package,
  Search,
  Wrench,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useSettings } from "@/context/SettingsContext";

const faqs = [
  { question: "What file formats do you accept?", href: "/quote" },
  { question: "How long does a quote review take?", href: "/quote" },
  { question: "Which materials are available today?", href: "/services" },
];

const quickLinks = [
  { name: "3D Printing", href: "/services" },
  { name: "Design for Manufacturing", href: "/services" },
  { name: "Request a Quote", href: "/quote" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProductResult {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | string | null;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { formatPrice } = useSettings();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<ProductResult[]>([]);
  const [catalogAvailable, setCatalogAvailable] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
      setProducts([]);
      setCatalogAvailable(true);
      setLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setProducts([]);
      setCatalogAvailable(true);
      setLoading(false);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `/api/products?search=${encodeURIComponent(trimmed)}&limit=4`,
          { cache: "no-store" }
        );
        const data = await response.json();
        setProducts(data.products || []);
        setCatalogAvailable(Boolean(data.catalogAvailable));
      } catch {
        setProducts([]);
        setCatalogAvailable(false);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [query]);

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(query.toLowerCase())
  );
  const filteredQuickLinks = quickLinks.filter((link) =>
    link.name.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults =
    products.length > 0 ||
    filteredFaqs.length > 0 ||
    filteredQuickLinks.length > 0;

  const handleLinkClick = () => {
    setQuery("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
              <div className="flex items-center gap-4 p-4 border-b border-[var(--border)]">
                <Search className="w-5 h-5 text-[var(--text-muted)]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products and quick links..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="flex-1 bg-transparent text-lg focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {query === "" ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start typing to search the catalog</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {["Bracket", "Enclosure", "Prototype"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1 bg-[var(--bg-secondary)] rounded-full text-sm hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : loading ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    Searching...
                  </div>
                ) : !catalogAvailable && products.length === 0 ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    <p>Catalog search is unavailable in this environment.</p>
                    <Link
                      href="/quote"
                      onClick={handleLinkClick}
                      className="text-[var(--accent)] hover:underline mt-2 inline-block"
                    >
                      Request a reviewed quote instead
                    </Link>
                  </div>
                ) : !hasResults ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    <p>No results found for &quot;{query}&quot;</p>
                    <Link
                      href={`/products?search=${encodeURIComponent(query)}`}
                      onClick={handleLinkClick}
                      className="text-[var(--accent)] hover:underline mt-2 inline-block"
                    >
                      Open catalog search
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 space-y-6">
                    {products.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                          <Package className="w-4 h-4" />
                          <span>Products</span>
                        </div>
                        <div className="space-y-2">
                          {products.map((product) => (
                            <Link
                              key={product.id}
                              href={`/products/${product.slug}`}
                              onClick={handleLinkClick}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors group"
                            >
                              <div>
                                <p className="font-medium group-hover:text-[var(--accent)] transition-colors">
                                  {product.name}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">
                                  {product.category || "Uncategorized"}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[var(--accent)] font-medium">
                                  {formatPrice(Number(product.price) || 0)}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                              </div>
                            </Link>
                          ))}
                          <Link
                            href={`/products?search=${encodeURIComponent(query)}`}
                            onClick={handleLinkClick}
                            className="block text-center text-sm text-[var(--accent)] hover:underline py-2"
                          >
                            View catalog results
                          </Link>
                        </div>
                      </div>
                    )}

                    {filteredQuickLinks.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                          <Wrench className="w-4 h-4" />
                          <span>Quick Links</span>
                        </div>
                        <div className="space-y-2">
                          {filteredQuickLinks.map((service) => (
                            <Link
                              key={service.name}
                              href={service.href}
                              onClick={handleLinkClick}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors group"
                            >
                              <p className="font-medium group-hover:text-[var(--accent)] transition-colors">
                                {service.name}
                              </p>
                              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {filteredFaqs.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                          <FileQuestion className="w-4 h-4" />
                          <span>FAQ</span>
                        </div>
                        <div className="space-y-2">
                          {filteredFaqs.map((faq) => (
                            <Link
                              key={faq.question}
                              href={faq.href}
                              onClick={handleLinkClick}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors group"
                            >
                              <p className="font-medium group-hover:text-[var(--accent)] transition-colors">
                                {faq.question}
                              </p>
                              <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-[var(--border)] bg-[var(--bg-secondary)]">
                <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs">↵</kbd>
                      Select
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <kbd className="px-2 py-0.5 bg-[var(--bg-tertiary)] rounded text-xs">ESC</kbd>
                    Close
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
