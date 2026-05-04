"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Box, Cog, Truck } from "lucide-react";

const customServices = [
  {
    id: "custom",
    name: "Custom Product Builds",
    icon: Box,
    description: "Single objects and limited runs produced directly from your files, finishes, and performance targets.",
    metrics: ["Any geometry", "Upload-led quoting", "3D preview support"],
  },
  {
    id: "prototype",
    name: "Functional Validation",
    icon: Cog,
    description: "Rapid prototypes tuned for fit, motion, and handling before you commit to tooling or volume.",
    metrics: ["Revision-friendly", "Material guidance", "DFM review"],
  },
  {
    id: "batch",
    name: "Repeatable Production",
    icon: Truck,
    description: "Short-run manufacturing with controlled setup, predictable output, and shipping built into the workflow.",
    metrics: ["Batch consistency", "Pan-India dispatch", "Production reporting"],
  },
];

export function ProductsShowcase() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-4 py-14 sm:px-6 sm:py-18">
      <div className="mx-auto max-w-7xl">
        <div className="luxury-panel rounded-[2.2rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55 }}
              className="max-w-3xl"
            >
              <span className="luxury-kicker">Showroom Workflow</span>
              <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                The collection is curated. The real catalog is what your team needs next.
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.15 }}
            >
              <Link
                href="/quote"
                className="inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent)]"
              >
                Submit a custom build
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          <div className="grid gap-5 xl:grid-cols-3">
            {customServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.08 }}
                className="luxury-stage group overflow-hidden rounded-[1.8rem] border border-[var(--border)] p-7"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1.1rem] border border-[var(--border-accent)] bg-[var(--bg-primary)]/50">
                    <service.icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <span className="luxury-metric-label">{service.id}</span>
                </div>

                <h3 className="display-font mt-8 text-3xl text-[var(--text-primary)]">{service.name}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">{service.description}</p>

                <div className="mt-10 grid gap-px overflow-hidden rounded-[1.2rem] border border-[var(--border)] bg-[var(--border)]">
                  {service.metrics.map((metric) => (
                    <div key={metric} className="bg-[var(--bg-primary)] px-4 py-4">
                      <p className="luxury-metric-label">Spec</p>
                      <p className="mt-2 text-sm text-[var(--text-primary)]">{metric}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
