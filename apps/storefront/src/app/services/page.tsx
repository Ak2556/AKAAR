"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Printer, Cpu, Layers, Zap, Cog, Shield,
  ArrowRight, Upload, CheckCircle, Clock, Award
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const services = [
  {
    icon: Printer,
    title: "FDM Prototyping",
    description: "PLA, PETG, ABS materials for rapid iterations and structural testing.",
    features: [
      "PLA for eco-friendly prototypes",
      "PETG for strength and flexibility",
      "ABS for heat-resistant parts",
      "Fast turnaround for iterations",
    ],
    price: "From ₹3/gram",
  },
  {
    icon: Layers,
    title: "SLA/Resin Printing",
    description: "High-detail resin printing for complex geometries and surface-finish critical parts.",
    features: [
      "Sub-50 micron layer resolution",
      "Smooth surface finish",
      "Complex geometry support",
      "Ideal for visual prototypes",
    ],
    price: "From ₹8/gram",
  },
  {
    icon: Zap,
    title: "Custom Production Runs",
    description: "Volume manufacturing with automated quoting based on geometry and infill density.",
    features: [
      "Algorithmic pricing engine",
      "Volume-based discounts",
      "Consistent batch quality",
      "Tracked production pipeline",
    ],
    price: "Dynamic quote",
  },
  {
    icon: Cpu,
    title: "Mesh Optimization",
    description: "CAD file validation, mesh repair, and slicing optimization for print integrity.",
    features: [
      "STL/OBJ validation",
      "Manifold repair",
      "Optimal orientation analysis",
      "Support structure planning",
    ],
    price: "Included",
  },
  {
    icon: Cog,
    title: "Design for Manufacturing",
    description: "Expert consultation on optimizing your CAD for additive manufacturing constraints.",
    features: [
      "Wall thickness analysis",
      "Overhang optimization",
      "Material selection guidance",
      "Cost reduction strategies",
    ],
    price: "From ₹500/hour",
  },
  {
    icon: Shield,
    title: "Pan-India Logistics",
    description: "Reliable shipping infrastructure with tracking and delivery guarantees.",
    features: [
      "4-5 business day delivery",
      "Real-time tracking",
      "Secure packaging",
      "Insurance included",
    ],
    price: "Calculated at checkout",
  },
];

const process = [
  { step: 1, title: "Upload", description: "Drop your STL, OBJ, or STEP file into our quoting engine" },
  { step: 2, title: "Quote", description: "Instant algorithmic pricing based on volume and material" },
  { step: 3, title: "Validate", description: "Automated mesh validation and orientation optimization" },
  { step: 4, title: "Print", description: "Production on calibrated print farms with quality tracking" },
  { step: 5, title: "Ship", description: "Pan-India delivery in 4-5 business days" },
];

const stats = [
  { icon: CheckCircle, value: "99.9%", label: "Quality Rate" },
  { icon: Clock, value: "48h", label: "Avg Lead Time" },
  { icon: Award, value: "ISO 9001", label: "Certified" },
];

export default function ServicesPage() {
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
              Materials & Pricing
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
              Deterministic <span className="gradient-text">Pricing</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)] mb-8">
              Transparent, algorithm-driven quotes. Upload your mesh, select your material,
              and get instant pricing. No hidden fees, no manual back-and-forth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/quote">
                <Button variant="primary" size="lg" glow>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload CAD / Get Instant Quote
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Explore Materials
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-8 mt-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-12 h-12 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--accent)]">{stat.value}</div>
                  <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesRef} className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Materials & <span className="gradient-text">Services</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              Production-grade materials with algorithmic pricing for engineers and hardware teams
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-primary)] hover:border-[var(--accent)]/50 transition-all"
              >
                <div className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all">
                  <service.icon className="w-7 h-7 text-[var(--accent)]" />
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-[var(--accent)] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[var(--text-secondary)] mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
                      <span className="w-1 h-1 bg-[var(--accent)] rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  <span className="text-[var(--accent)] font-medium">{service.price}</span>
                  <Link href="/quote" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors flex items-center gap-1 text-sm">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section ref={processRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Process</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              From upload to delivery, we've streamlined every step
            </p>
          </motion.div>

          <div className="relative">
            {/* Connection line */}
            <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--accent)]/30 to-transparent hidden lg:block" />

            <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-8">
              {process.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={processInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="text-center relative"
                >
                  <div className="w-16 h-16 mx-auto mb-4 border border-[var(--accent)] rounded-full flex items-center justify-center bg-[var(--bg-primary)] relative z-10">
                    <span className="text-[var(--accent)] font-mono font-bold text-xl">{item.step}</span>
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--text-secondary)]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Give Your Ideas AKAAR
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              From mesh to physical part. Upload your CAD, get instant pricing, push to production.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/quote">
                <Button variant="primary" size="lg" glow>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload CAD / Get Instant Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Explore Materials
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
