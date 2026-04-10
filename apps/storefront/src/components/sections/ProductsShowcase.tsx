"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Eye } from "lucide-react";

const featuredProducts = [
  {
    id: "1",
    name: "Precision Gears",
    category: "Industrial",
    price: "From ₹1,499",
    description: "High-precision gears for industrial applications",
  },
  {
    id: "2",
    name: "Custom Enclosures",
    category: "Electronics",
    price: "From ₹899",
    description: "Tailored enclosures for electronic projects",
  },
  {
    id: "3",
    name: "Prototype Parts",
    category: "Prototyping",
    price: "From ₹599",
    description: "Rapid prototype parts with fast turnaround",
  },
  {
    id: "4",
    name: "Medical Components",
    category: "Medical",
    price: "From ₹2,999",
    description: "Certified components for medical devices",
  },
];

function ProductCard({
  product,
  index,
  isInView,
}: {
  product: (typeof featuredProducts)[0];
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.12,
        ease: [0.215, 0.61, 0.355, 1],
      }}
      whileHover={{ y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square bg-[var(--bg-tertiary)] rounded-xl overflow-hidden border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-colors duration-300">
          {/* Animated placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.08, 1],
              }}
              transition={{
                rotate: { duration: 20 + index * 3, repeat: Infinity, ease: "linear" },
                scale: { duration: 3 + index * 0.5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="w-24 h-24 border border-[var(--accent)]/20 rounded-lg group-hover:border-[var(--accent)]/60 transition-colors duration-300"
            />
            <motion.span
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2 + index * 0.4, repeat: Infinity }}
              className="absolute text-[var(--accent)]/50 font-mono text-xs"
            >
              3D
            </motion.span>
          </div>

          {/* Corner accent lines */}
          <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-[var(--accent)]/20 group-hover:border-[var(--accent)]/60 transition-colors" />
          <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-[var(--accent)]/20 group-hover:border-[var(--accent)]/60 transition-colors" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-[var(--accent)]/20 group-hover:border-[var(--accent)]/60 transition-colors" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-[var(--accent)]/20 group-hover:border-[var(--accent)]/60 transition-colors" />

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            className="absolute inset-0 bg-[var(--bg-primary)]/80 backdrop-blur-sm flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-[var(--bg-primary)] rounded-lg font-medium"
            >
              <Eye className="w-4 h-4" />
              Quick View
            </motion.div>
          </motion.div>

          {/* Category badge */}
          <div className="absolute top-3 left-3 px-3 py-1 bg-[var(--bg-primary)]/80 backdrop-blur rounded text-xs font-mono text-[var(--accent)]">
            {product.category}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors duration-200">
            {product.name}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-1">
            {product.description}
          </p>
          <p className="text-[var(--accent)] font-medium mt-2">{product.price}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductsShowcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={sectionRef} className="py-32 bg-[var(--bg-secondary)] relative overflow-hidden">
      {/* Subtle parallax background texture */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 grid-overlay opacity-30 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.05em" }}
              animate={isInView ? { opacity: 1, letterSpacing: "0.3em" } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-[var(--accent)] font-mono text-sm uppercase"
            >
              Featured
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              Our <span className="gradient-text">Products</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 text-[var(--accent)] font-medium mt-6 md:mt-0"
            >
              View All Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
