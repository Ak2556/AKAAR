"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Upload, MessageSquare } from "lucide-react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--accent)]/5 to-[var(--bg-primary)]" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--accent)]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[var(--accent-secondary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[var(--accent)]/30 rounded-full bg-[var(--accent)]/5"
          >
            <span className="text-sm text-[var(--accent)] font-mono">WE GIVE AKAAR TO IDEAS</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Zero-Friction
            <span className="block gradient-text">Manufacturing</span>
          </h2>

          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
            Upload your mesh, get instant algorithmic pricing, and push to production.
            From digital file to physical part in days, not weeks.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/quote">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg hover:bg-[var(--accent)]/90 transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload CAD / Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 border border-[var(--border-accent)] text-[var(--text-primary)] font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Explore Materials
              </motion.button>
            </Link>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: "10K+", label: "Parts Delivered" },
              { value: "99.9%", label: "Quality Rate" },
              { value: "48h", label: "Avg. Lead Time" },
              { value: "500+", label: "Happy Clients" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[var(--accent)]">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)] mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
