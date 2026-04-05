"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Printer, Cpu, Layers, Zap, Cog, Shield } from "lucide-react";

const services = [
  {
    icon: Printer,
    title: "FDM Prototyping",
    description: "PLA, PETG, ABS for rapid iterations. Algorithmic pricing from ₹3/gram.",
    features: ["Multi-material", "Structural testing", "Fast iterations"],
  },
  {
    icon: Layers,
    title: "SLA/Resin",
    description: "High-detail resin printing for complex geometries and surface-critical parts.",
    features: ["Sub-50μm layers", "Smooth finish", "Visual prototypes"],
  },
  {
    icon: Zap,
    title: "Production Runs",
    description: "Volume manufacturing with automated quoting based on geometry and infill.",
    features: ["Dynamic pricing", "Batch tracking", "Consistent quality"],
  },
  {
    icon: Cpu,
    title: "Mesh Optimization",
    description: "CAD validation, mesh repair, and slicing optimization for print integrity.",
    features: ["STL validation", "Manifold repair", "Auto-orientation"],
  },
  {
    icon: Cog,
    title: "DFM Consulting",
    description: "Expert consultation on optimizing CAD for additive manufacturing.",
    features: ["Wall analysis", "Cost reduction", "Material guidance"],
  },
  {
    icon: Shield,
    title: "Pan-India Shipping",
    description: "Reliable logistics with 4-5 business day delivery nationwide.",
    features: ["Real-time tracking", "Secure packaging", "Insurance included"],
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-overlay opacity-50" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Capabilities
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Materials & <span className="gradient-text">Services</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Production-grade 3D printing with algorithmic pricing.
            Upload your mesh, select material, get instant quotes.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5, borderColor: "var(--accent)" }}
              className="group relative p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]/50 backdrop-blur transition-all"
            >
              {/* Icon */}
              <div className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all">
                <service.icon className="w-7 h-7 text-[var(--accent)]" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">
                {service.title}
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                    <span className="w-1 h-1 bg-[var(--accent)] rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
