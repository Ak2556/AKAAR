"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Upload, Box, Cog, Truck } from "lucide-react";

const customServices = [
  {
    id: "1",
    name: "Custom 3D Prints",
    icon: Box,
    description: "Upload your CAD file and get your custom part printed in PLA, PETG, or ABS",
    features: ["Any geometry", "Multiple materials", "From ₹3/gram"],
  },
  {
    id: "2",
    name: "Functional Prototypes",
    icon: Cog,
    description: "Test your designs with real functional prototypes before mass production",
    features: ["Quick turnaround", "Design validation", "Cost-effective"],
  },
  {
    id: "3",
    name: "Batch Production",
    icon: Truck,
    description: "Need multiple copies? Get volume discounts on batch orders",
    features: ["Consistent quality", "Volume discounts", "Pan-India delivery"],
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
              Custom Manufacturing
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4">
              What We <span className="gradient-text">Print</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              href="/quote"
              className="group inline-flex items-center gap-2 text-[var(--accent)] font-medium mt-6 md:mt-0"
            >
              Get Instant Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {customServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="p-8 bg-[var(--bg-primary)] rounded-xl border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all h-full">
                <div className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all">
                  <service.icon className="w-7 h-7 text-[var(--accent)]" />
                </div>

                <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {service.name}
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <span className="w-1 h-1 bg-[var(--accent)] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link href="/quote">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg hover:bg-[var(--accent)]/90 transition-all"
            >
              <Upload className="w-5 h-5" />
              Upload Your CAD File
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </Link>
          <p className="text-[var(--text-muted)] text-sm mt-4">
            Supports STL, OBJ, STEP, and more formats
          </p>
        </motion.div>
      </div>
    </section>
  );
}
