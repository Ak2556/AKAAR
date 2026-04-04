"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import {
  Target, Eye, Rocket, Users, Award,
  Printer, Cpu, Cog, ArrowRight, CheckCircle, Star
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { teamMembers } from "@/lib/team-data";

// New engagement components
import { AnimatedStats } from "@/components/about/AnimatedStats";
import { InteractiveTimeline } from "@/components/about/InteractiveTimeline";
import { TestimonialsCarousel } from "@/components/about/TestimonialsCarousel";
import { WorkGallery } from "@/components/about/WorkGallery";
import { ScrollProgress } from "@/components/about/ScrollProgress";
import { SectionHeader } from "@/components/about/SectionHeader";
import { EnhancedTeamCard } from "@/components/about/EnhancedTeamCard";
import { EnhancedCTA } from "@/components/about/EnhancedCTA";

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
    items: ["FDM / FFF (PLA, PETG, ABS)", "High-quality prints", "Large build volumes", "Multi-material options"],
    comingSoon: false,
  },
  {
    icon: Cpu,
    title: "CNC Machining",
    items: ["3-axis milling", "5-axis milling", "Turning", "EDM"],
    comingSoon: true,
  },
  {
    icon: Cog,
    title: "Post-Processing",
    items: ["Surface finishing", "Painting", "Assembly", "Quality inspection"],
    comingSoon: false,
  },
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
      {/* Scroll Progress Indicator */}
      <ScrollProgress />

      {/* Hero */}
      <section id="hero" ref={heroRef} className="pt-32 pb-20 relative overflow-hidden">
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

            {/* Animated Stats */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={heroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <AnimatedStats />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section id="mission" className="py-20 bg-[var(--bg-secondary)]">
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
      <section id="values" ref={valuesRef} className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            preText="Our"
            highlightText="Values"
            subtitle="The principles that guide everything we do"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group p-6 border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 transition-all bg-[var(--bg-secondary)]"
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
      <section id="capabilities" ref={capabilitiesRef} className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <SectionHeader
            preText="Our"
            highlightText="Capabilities"
            subtitle="State-of-the-art equipment and expertise"
          />

          <div className="grid md:grid-cols-3 gap-8">
            {capabilities.map((cap, index) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                animate={capabilitiesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`p-8 border rounded-xl bg-[var(--bg-primary)] relative ${
                  cap.comingSoon ? "border-amber-500/30 opacity-75" : "border-[var(--border)]"
                }`}
              >
                {cap.comingSoon && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/20 text-amber-500 text-xs font-semibold rounded-full border border-amber-500/30">
                    Coming Soon
                  </div>
                )}
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
      <section id="journey" className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            preText="Our"
            highlightText="Journey"
            subtitle="Key milestones in our growth - tap to learn more"
          />

          <InteractiveTimeline />
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <SectionHeader
            preText="What Clients"
            highlightText="Say"
            subtitle="Don't just take our word for it"
          />

          <div className="max-w-4xl mx-auto">
            <TestimonialsCarousel />
          </div>
        </div>
      </section>

      {/* Work Gallery */}
      <section id="work" className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeader
            preText="Our"
            highlightText="Work"
            subtitle="A selection of projects we've brought to life"
          />

          <WorkGallery />
        </div>
      </section>

      {/* Founder Section */}
      <section id="team" ref={teamRef} className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <SectionHeader
            preText="Meet the"
            highlightText="Founder"
            subtitle="The visionary who started it all"
          />

          {/* Founder Featured Card */}
          {teamMembers.filter(m => m.isFounder).map((founder) => (
            <motion.div
              key={founder.name}
              initial={{ opacity: 0, y: 30 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="mb-20"
            >
              <Link href={`/team/${founder.slug}`} className="group block">
                <div className="relative">
                  {/* Glow Effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[var(--accent)] via-blue-500 to-purple-600 rounded-3xl opacity-30 group-hover:opacity-70 blur-xl transition-all duration-500" />

                  {/* Main Card */}
                  <div className="relative grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--accent)]/30 group-hover:border-[var(--accent)]/60 transition-all duration-300">
                    {/* Image Side */}
                    <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
                      <img
                        src={founder.image}
                        alt={founder.name}
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[var(--bg-primary)] md:block hidden" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent md:hidden" />

                      {/* Founder Badge */}
                      <div className="absolute top-6 left-6">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--accent)] to-blue-500 text-white text-sm font-bold rounded-full shadow-lg">
                          <Star className="w-4 h-4" />
                          FOUNDER & CEO
                        </span>
                      </div>
                    </div>

                    {/* Content Side */}
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <h3 className="text-4xl md:text-5xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {founder.name}
                      </h3>
                      <p className="text-lg text-[var(--accent)] font-medium mb-6">
                        {founder.domain}
                      </p>

                      {founder.founderVision && (
                        <div className="relative mb-8">
                          <div className="absolute -left-4 -top-2 text-6xl text-[var(--accent)]/20 font-serif">"</div>
                          <p className="text-lg text-[var(--text-secondary)] italic leading-relaxed pl-4 border-l-2 border-[var(--accent)]/50">
                            {founder.founderVision}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 mb-8">
                        {founder.skills.slice(0, 5).map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full border border-[var(--accent)]/20"
                          >
                            {skill}
                          </span>
                        ))}
                        {founder.skills.length > 5 && (
                          <span className="px-3 py-1 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-sm rounded-full">
                            +{founder.skills.length - 5} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-[var(--accent)] font-semibold group-hover:gap-4 transition-all">
                        <span>Read Full Story</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Core Team Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-center mb-12"
          >
            <h3 className="text-2xl md:text-3xl font-bold">
              The Core <span className="gradient-text">Team</span>
            </h3>
            <p className="text-[var(--text-secondary)] mt-3 max-w-xl mx-auto">
              Experts assembled by Akash to execute the vision - tap cards to flip
            </p>
          </motion.div>

          {/* Enhanced Team Cards with flip effect */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.filter(m => !m.isFounder).map((member, index) => (
              <EnhancedTeamCard key={member.slug} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA */}
      <EnhancedCTA />
    </div>
  );
}
