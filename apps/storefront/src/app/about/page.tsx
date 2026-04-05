"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Target, Eye, Rocket, Users, Award, Globe,
  Printer, Cpu, Cog, ArrowRight, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "10K+", label: "Parts Produced" },
  { value: "500+", label: "Happy Clients" },
  { value: "99.9%", label: "Quality Rate" },
  { value: "24h", label: "Avg Response" },
];

const values = [
  {
    icon: Target,
    title: "Precision",
    description: "Every part we produce meets exact specifications with tolerances as tight as ±0.05mm.",
  },
  {
    icon: Rocket,
    title: "Innovation",
    description: "We continuously adopt cutting-edge technologies to deliver better results faster.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We work closely with clients, treating every project as a collaboration.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "ISO 9001 certified processes ensure consistent quality in everything we do.",
  },
];

const capabilities = [
  {
    icon: Printer,
    title: "3D Printing",
    items: ["FDM / FFF", "SLA / Resin", "SLS / Powder Bed", "Multi-material"],
  },
  {
    icon: Cpu,
    title: "CNC Machining",
    items: ["3-axis milling", "5-axis milling", "Turning", "EDM"],
  },
  {
    icon: Cog,
    title: "Post-Processing",
    items: ["Surface finishing", "Painting", "Plating", "Assembly"],
  },
];

const team = [
  { name: "Akash Thakur", role: "AI/ML Engineer & Systems Architect", domain: "Core software infrastructure, automated quoting engine algorithms, and the digital storefront", image: null },
  { name: "Mohit", role: "Lead Industrial Designer", domain: "CAD optimization, mesh validation, and model slicing for structural integrity", image: null },
  { name: "Harish", role: "Head of Hardware Infrastructure", domain: "Print farm operations, electronics maintenance, and machine uptime maximization", image: null },
  { name: "Tarveen", role: "Head of Operations & Unit Economics", domain: "Supply chain logistics, material procurement, and cost-margin optimization", image: null },
];

const milestones = [
  { year: "2018", title: "Founded", description: "Started with a single 3D printer and a vision" },
  { year: "2019", title: "First Facility", description: "Opened our first production facility" },
  { year: "2020", title: "ISO Certified", description: "Achieved ISO 9001:2015 certification" },
  { year: "2021", title: "CNC Expansion", description: "Added CNC machining capabilities" },
  { year: "2022", title: "Global Reach", description: "Expanded to serve international clients" },
  { year: "2023", title: "Innovation Hub", description: "Launched R&D center for new materials" },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const teamRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const capabilitiesInView = useInView(capabilitiesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
                We Give AKAAR to Ideas
              </span>
              <h1 className="text-5xl md:text-6xl font-bold mt-4 mb-6">
                Engineering the <span className="gradient-text">Bottlenecks Out</span>
              </h1>
              <p className="text-lg text-[var(--text-secondary)] mb-8">
                Local manufacturing and rapid prototyping are bottlenecked by manual, opaque
                quoting processes, inconsistent print quality, and severe friction. We engineered
                those bottlenecks out of existence. By merging intelligent software automation with
                high-fidelity 3D print farms, we give creators, hardware startups, and engineers
                a deterministic, zero-friction pipeline from digital mesh to physical product.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href="/quote">
                  <Button variant="primary" size="lg" glow>
                    Start a Project
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline" size="lg">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 gap-6"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]"
                >
                  <div className="text-4xl font-bold text-[var(--accent)] mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-primary)]"
            >
              <div className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center">
                <Target className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">The Problem</h2>
              <p className="text-[var(--text-secondary)]">
                Local manufacturing and rapid prototyping are bottlenecked by manual,
                opaque quoting processes, inconsistent print quality, and severe friction
                that slows down innovation cycles for engineers and hardware teams.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-primary)]"
            >
              <div className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center">
                <Eye className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl font-bold mb-4">The Akaar Solution</h2>
              <p className="text-[var(--text-secondary)]">
                We engineered those bottlenecks out of existence. By merging intelligent
                software automation with high-fidelity 3D print farms, we deliver a
                deterministic, zero-friction pipeline from digital mesh to physical product.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group p-6 border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 transition-all"
              >
                <div className="w-12 h-12 mb-4 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all">
                  <value.icon className="w-6 h-6 text-[var(--accent)]" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section ref={capabilitiesRef} className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Capabilities</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              State-of-the-art equipment and expertise
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-primary)]"
              >
                <div className="w-14 h-14 mb-6 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center">
                  <cap.icon className="w-7 h-7 text-[var(--accent)]" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{cap.title}</h3>
                <ul className="space-y-3">
                  {cap.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-[var(--text-secondary)]">
                      <CheckCircle className="w-4 h-4 text-[var(--accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              Key milestones in our growth
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[var(--border)] hidden lg:block" />

            <div className="space-y-8 lg:space-y-0">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative lg:w-1/2 ${
                    index % 2 === 0 ? "lg:pr-12 lg:ml-0" : "lg:pl-12 lg:ml-auto"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute top-6 w-4 h-4 bg-[var(--accent)] rounded-full border-4 border-[var(--bg-primary)] ${index % 2 === 0 ? 'right-0 translate-x-1/2' : 'left-0 -translate-x-1/2'}"
                    style={{ [index % 2 === 0 ? 'right' : 'left']: '-8px' }}
                  />

                  <div className="p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)]">
                    <span className="text-[var(--accent)] font-mono text-sm">
                      {milestone.year}
                    </span>
                    <h3 className="text-lg font-semibold mt-2">{milestone.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mt-1">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={teamRef} className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              The Founding <span className="gradient-text">Team</span>
            </h2>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              Engineers and operators building the infrastructure for frictionless manufacturing
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="aspect-square mb-4 border border-[var(--border)] rounded-xl bg-[var(--bg-primary)] overflow-hidden relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="w-16 h-16 text-[var(--border)]" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-[var(--accent)] mb-2">{member.role}</p>
                <p className="text-xs text-[var(--text-muted)]">{member.domain}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <Globe className="w-16 h-16 text-[var(--accent)] mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Give Your Ideas AKAAR?
            </h2>
            <p className="text-[var(--text-secondary)] mb-8">
              From concept to physical part. Upload your CAD, get instant pricing,
              and let us bring your ideas to life.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/quote">
                <Button variant="primary" size="lg" glow>
                  Get a Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
