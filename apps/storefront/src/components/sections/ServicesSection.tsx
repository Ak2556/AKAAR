"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useCallback } from "react";
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

interface Tilt { x: number; y: number }

function TiltCard({
  service,
  index,
  isInView,
}: {
  service: (typeof services)[0];
  index: number;
  isInView: boolean;
}) {
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width;
    const ny = (e.clientY - rect.top) / rect.height;
    setTilt({ x: (nx - 0.5) * 16, y: -(ny - 0.5) * 16 });
    setSpotlight({ x: nx * 100, y: ny * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(700px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? "transform 0.5s ease" : "transform 0.05s ease",
        transformStyle: "preserve-3d",
      }}
      className="group relative p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]/50 backdrop-blur hover:border-[var(--accent)]/60 transition-colors cursor-default"
    >
      {/* Spotlight glow */}
      <div
        className="card-spotlight group-hover:opacity-100 opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(200px circle at ${spotlight.x}% ${spotlight.y}%, rgba(0,255,245,0.07), transparent 70%)`,
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all"
      >
        <service.icon className="w-7 h-7 text-[var(--accent)]" />
      </motion.div>

      {/* Content */}
      <h3 className="text-xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">
        {service.title}
      </h3>
      <p className="text-[var(--text-secondary)] mb-6">{service.description}</p>

      {/* Features */}
      <ul className="space-y-2">
        {service.features.map((feature, fi) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.4, delay: index * 0.1 + fi * 0.07 + 0.3 }}
            className="flex items-center gap-2 text-sm text-[var(--text-muted)]"
          >
            <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full flex-shrink-0" />
            {feature}
          </motion.li>
        ))}
      </ul>

      {/* Bottom glow line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
}

export function ServicesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-overlay opacity-50" />

      {/* Ambient blobs */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent)]/5 rounded-full blur-[150px] pointer-events-none -translate-y-1/2 translate-x-1/2"
      />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.span
            initial={{ opacity: 0, letterSpacing: "0.05em" }}
            animate={isInView ? { opacity: 1, letterSpacing: "0.3em" } : {}}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-[var(--accent)] font-mono text-sm uppercase"
          >
            Capabilities
          </motion.span>
          <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Materials &amp; <span className="gradient-text">Services</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Production-grade 3D printing with algorithmic pricing. Upload your
            mesh, select material, get instant quotes.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <TiltCard
              key={service.title}
              service={service}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
