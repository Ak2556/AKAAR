"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { MessageSquare, Upload } from "lucide-react";
import { BRAND_TAGLINE } from "@/lib/brand";

const stats = [
  { value: "48h", label: "quote review window" },
  { value: "4", label: "core materials" },
  { value: "FDM", label: "print technology" },
  { value: "Jaipur", label: "studio location" },
];

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65 }}
          className="luxury-card rounded-[2.35rem] px-6 py-8 sm:px-8 lg:px-10"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <span className="luxury-kicker">Move from file to part</span>
              <p className="mt-3 editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
              <h2 className="display-font mt-4 max-w-3xl text-4xl text-[var(--text-primary)] sm:text-5xl">
                Upload your file. Tell us what it needs to do. We’ll send you a real quote.
              </h2>
              <p className="mt-5 max-w-2xl text-[var(--text-secondary)]">
                Attach your CAD file, choose a material, and describe what the part is for. We review every request and reply with pricing, production guidance, and a clear next step.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--text-primary)] px-7 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
                >
                  <Upload className="h-4 w-4" />
                  Request a Quote
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border-accent)] px-7 py-3.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-highlight)]"
                >
                  <MessageSquare className="h-4 w-4" />
                  Explore Capabilities
                </Link>
              </div>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-[var(--bg-secondary)] px-5 py-6">
                  <p className="display-font text-4xl text-[var(--text-primary)]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
