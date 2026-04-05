"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Precision Gears",
    category: "Industrial",
    image: "/products/gear.png",
    price: "From $49",
    description: "High-precision gears for industrial applications",
  },
  {
    id: "2",
    name: "Custom Enclosures",
    category: "Electronics",
    image: "/products/enclosure.png",
    price: "From $29",
    description: "Tailored enclosures for electronic projects",
  },
  {
    id: "3",
    name: "Prototype Parts",
    category: "Prototyping",
    image: "/products/prototype.png",
    price: "From $19",
    description: "Rapid prototype parts with fast turnaround",
  },
  {
    id: "4",
    name: "Medical Components",
    category: "Medical",
    image: "/products/medical.png",
    price: "From $99",
    description: "Certified components for medical devices",
  },
];

export function ProductsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 bg-[var(--bg-secondary)]">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
              Featured
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Our <span className="gradient-text">Products</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[var(--accent)] font-medium mt-6 md:mt-0"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all">
                  {/* Placeholder for product image */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-[var(--accent)]/50 font-mono text-xs">3D</span>
                    </div>
                  </div>

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-[var(--bg-primary)]/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg font-medium">
                      <Eye className="w-4 h-4" />
                      Quick View
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur rounded text-xs font-mono text-[var(--accent)]">
                    {product.category}
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {product.description}
                  </p>
                  <p className="text-[var(--accent)] font-medium mt-2">
                    {product.price}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
