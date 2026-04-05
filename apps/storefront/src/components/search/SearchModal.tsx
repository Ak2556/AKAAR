"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight, Package, FileQuestion, Wrench } from "lucide-react";
import Link from "next/link";

// Mock data for search
const products = [
  { id: "1", name: "Precision Gear Assembly", slug: "precision-gear-assembly", category: "Industrial", price: 149 },
  { id: "2", name: "Custom Electronics Enclosure", slug: "custom-electronics-enclosure", category: "Electronics", price: 79 },
  { id: "3", name: "Rapid Prototype Part", slug: "rapid-prototype-part", category: "Prototyping", price: 49 },
  { id: "4", name: "Medical Device Housing", slug: "medical-device-housing", category: "Medical", price: 299 },
  { id: "5", name: "Automotive Bracket", slug: "automotive-bracket", category: "Automotive", price: 89 },
  { id: "6", name: "Drone Frame Component", slug: "drone-frame-component", category: "Aerospace", price: 199 },
];

const faqs = [
  { question: "What file formats do you accept?", category: "ordering" },
  { question: "How long does production take?", category: "shipping" },
  { question: "What materials are available?", category: "materials" },
  { question: "Do you offer volume discounts?", category: "pricing" },
  { question: "What tolerances can you achieve?", category: "technical" },
];

const services = [
  { name: "3D Printing", href: "/services" },
  { name: "CNC Machining", href: "/services" },
  { name: "Rapid Prototyping", href: "/services" },
  { name: "Design Services", href: "/services" },
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredFaqs = faqs.filter((f) =>
    f.question.toLowerCase().includes(query.toLowerCase())
  );

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults =
    filteredProducts.length > 0 || filteredFaqs.length > 0 || filteredServices.length > 0;

  const handleLinkClick = () => {
    setQuery("");
    onClose();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
              {/* Search Input */}
              <div className="flex items-center gap-4 p-4 border-b border-[var(--border)]">
                <Search className="w-5 h-5 text-[var(--text-muted)]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, FAQs, services..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-lg focus:outline-none"
                />
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {query === "" ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Start typing to search...</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {["Gears", "Enclosure", "Prototype", "CNC"].map((term) => (
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
                ) : !hasResults ? (
                  <div className="p-6 text-center text-[var(--text-muted)]">
                    <p>No results found for "{query}"</p>
                    <Link
                      href="/contact"
                      onClick={handleLinkClick}
                      className="text-[var(--accent)] hover:underline mt-2 inline-block"
                    >
                      Contact us for help
                    </Link>
                  </div>
                ) : (
                  <div className="p-4 space-y-6">
                    {/* Products */}
                    {filteredProducts.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                          <Package className="w-4 h-4" />
                          <span>Products</span>
                        </div>
                        <div className="space-y-2">
                          {filteredProducts.slice(0, 4).map((product) => (
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
                                  {product.category}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[var(--accent)] font-medium">
                                  ${product.price}
                                </span>
                                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" />
                              </div>
                            </Link>
                          ))}
                          {filteredProducts.length > 4 && (
                            <Link
                              href={`/products?search=${encodeURIComponent(query)}`}
                              onClick={handleLinkClick}
                              className="block text-center text-sm text-[var(--accent)] hover:underline py-2"
                            >
                              View all {filteredProducts.length} products
                            </Link>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Services */}
                    {filteredServices.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                          <Wrench className="w-4 h-4" />
                          <span>Services</span>
                        </div>
                        <div className="space-y-2">
                          {filteredServices.map((service) => (
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

                    {/* FAQs */}
                    {filteredFaqs.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-3">
                          <FileQuestion className="w-4 h-4" />
                          <span>FAQ</span>
                        </div>
                        <div className="space-y-2">
                          {filteredFaqs.slice(0, 3).map((faq, index) => (
                            <Link
                              key={index}
                              href="/faq"
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

              {/* Footer */}
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
