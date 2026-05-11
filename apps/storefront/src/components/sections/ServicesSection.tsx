"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Printer, Cpu, Layers, Zap, Cog, Shield } from "lucide-react";

const services = [
  {
    icon: Printer,
    title: "PLA Prototypes",
    description: "Fast-turn concept prints for enclosure checks, presentation models, and early engineering reviews.",
    features: ["Crisp matte finish", "Fast iteration cycles", "Best for concept validation"],
  },
  {
    icon: Layers,
    title: "ABS Functional Parts",
    description: "Stronger workshop-ready parts for fit checks, utility enclosures, and higher-heat use than PLA.",
    features: ["Better heat tolerance", "Functional housings", "Engineering-use parts"],
  },
  {
    icon: Zap,
    title: "TPU Flexible Builds",
    description: "Flexible parts for grips, pads, sleeves, and compression-friendly pieces that need controlled softness.",
    features: ["Elastic geometries", "Soft-touch utility", "Flexible fit parts"],
  },
  {
    icon: Cpu,
    title: "PETG Utility Prints",
    description: "Durable everyday parts for holders, brackets, fixtures, and repeat-use components that need more resilience.",
    features: ["Utility-grade strength", "Cleaner outdoor tolerance", "Bracket and jig friendly"],
  },
  {
    icon: Cog,
    title: "File and Print Review",
    description: "We review geometry, wall thickness, and print direction before confirming the material and build path.",
    features: ["Wall-thickness check", "Orientation advice", "Material recommendation"],
  },
  {
    icon: Shield,
    title: "Studio Packing and Dispatch",
    description: "Each order is packed from the current studio workflow with tracked delivery and direct handoff context.",
    features: ["Protected packing", "Tracked shipping", "Order photos on request"],
  },
];

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="px-4 py-14 sm:px-6 sm:py-18">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-3xl">
            <span className="luxury-kicker">Capabilities</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              What we print and how we work.
            </h2>
          </div>
          <p className="max-w-xl text-[var(--text-secondary)]">
            PLA, ABS, TPU, and PETG — the four materials we work with every day. File review and tracked dispatch come with every order.
          </p>
        </motion.div>

        <div className="grid gap-5 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.08 }}
              className="luxury-card group rounded-[1.9rem] p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[1.2rem] border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
                  <service.icon className="h-6 w-6 text-[var(--accent)]" />
                </div>
                <span className="luxury-metric-label">0{index + 1}</span>
              </div>

              <h3 className="display-font mt-8 text-2xl text-[var(--text-primary)]">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{service.description}</p>

              <div className="mt-8 space-y-3 border-t border-[var(--border)] pt-6">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-[var(--text-primary)]">{feature}</span>
                    <span className="h-px flex-1 bg-[var(--border)]" />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
