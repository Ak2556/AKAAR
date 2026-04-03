"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Linkedin, Github, Mail, Twitter, Quote, Sparkles, Code, Wrench, Briefcase } from "lucide-react";
import { TeamMember } from "@/lib/team-data";

// Map skills to categories for visual organization
const skillCategories: Record<string, { icon: typeof Code; label: string }> = {
  technical: { icon: Code, label: "Technical" },
  tools: { icon: Wrench, label: "Tools & Software" },
  business: { icon: Briefcase, label: "Business" },
};

function getSkillCategory(skill: string): string {
  const technicalSkills = ["Python", "Machine Learning", "Next.js", "TypeScript", "API Development", "Cloud Architecture", "Data Engineering", "System Design"];
  const toolSkills = ["CAD Design", "SolidWorks", "Fusion 360", "Slicing Software", "3D Modeling", "Mesh Optimization"];

  if (technicalSkills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) return "technical";
  if (toolSkills.some(s => skill.toLowerCase().includes(s.toLowerCase()))) return "tools";
  return "business";
}

export function TeamMemberClient({ member }: { member: TeamMember }) {
  // Split bio into paragraphs and extract first sentence for highlight
  const bioParagraphs = member.bio.split("\n\n");
  const highlightText = bioParagraphs[0].split('.')[0] + '.';

  return (
    <main className="min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative min-h-[70vh] flex items-end overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover object-top"
            priority
          />
          {/* Multiple Gradient Overlays for Depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/80 via-transparent to-[var(--bg-primary)]/80" />
          <div className="absolute inset-0 bg-[var(--bg-primary)]/20" />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 border border-[var(--accent)]/20 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-20 h-20 border border-[var(--accent)]/30 rotate-45" />
        <div className="absolute bottom-40 left-1/4 w-2 h-2 bg-[var(--accent)] rounded-full animate-ping" />

        {/* Grid Overlay */}
        <div className="absolute inset-0 grid-overlay opacity-20" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 pb-16">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-24 left-6"
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border)] rounded-full text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Team
            </Link>
          </motion.div>

          <div className="max-w-4xl">
            {/* Role Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/20 backdrop-blur-sm text-[var(--accent)] text-sm font-medium rounded-full border border-[var(--accent)]/30 mb-4">
                <Sparkles className="w-4 h-4" />
                {member.role}
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
            >
              {member.name.split(' ').map((word, i) => (
                <span key={i} className={i === member.name.split(' ').length - 1 ? "gradient-text" : ""}>
                  {word}{' '}
                </span>
              ))}
            </motion.h1>

            {/* Domain */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl"
            >
              {member.domain}
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-3 mt-8"
            >
              {member.social.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {member.social.github && (
                <a
                  href={member.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {member.social.twitter && (
                <a
                  href={member.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {member.social.email && (
                <a
                  href={`mailto:${member.social.email}`}
                  className="w-12 h-12 bg-[var(--bg-primary)]/50 backdrop-blur-sm border border-[var(--border)] rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-[var(--bg-primary)]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Bio Section - 2 columns */}
            <div className="lg:col-span-2 space-y-12">
              {/* Highlight Quote */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute -left-4 top-0 text-[var(--accent)]/20">
                  <Quote className="w-16 h-16" />
                </div>
                <blockquote className="pl-12 border-l-4 border-[var(--accent)] py-4">
                  <p className="text-2xl md:text-3xl font-medium leading-relaxed text-[var(--text-primary)]">
                    {highlightText}
                  </p>
                </blockquote>
              </motion.div>

              {/* Full Bio */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-[var(--accent)] rounded-full" />
                  About
                </h2>
                <div className="space-y-6">
                  {bioParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="text-lg text-[var(--text-secondary)] leading-relaxed"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Skills Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="sticky top-24">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="w-8 h-1 bg-[var(--accent)] rounded-full" />
                  Skills & Expertise
                </h2>

                {/* Skills Grid */}
                <div className="space-y-3">
                  {member.skills.map((skill, index) => (
                    <motion.div
                      key={skill}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 transition-all cursor-default">
                        <div className="w-2 h-2 bg-[var(--accent)] rounded-full group-hover:animate-pulse" />
                        <span className="font-medium text-[var(--text-primary)]">{skill}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Contact CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 p-6 bg-gradient-to-br from-[var(--accent)]/10 to-blue-600/10 border border-[var(--accent)]/30 rounded-2xl"
                >
                  <h3 className="font-semibold mb-2">Get in Touch</h3>
                  <p className="text-sm text-[var(--text-secondary)] mb-4">
                    Interested in working together?
                  </p>
                  {member.social.email && (
                    <a
                      href={`mailto:${member.social.email}`}
                      className="inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
                    >
                      <Mail className="w-4 h-4" />
                      {member.social.email}
                    </a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="relative">
              {/* Decorative */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 border border-[var(--accent)]/20 rounded-full" />
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 border border-[var(--accent)]/30 rounded-full" />

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Build Something <span className="gradient-text">Amazing</span>?
              </h2>
              <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
                Our team is ready to help bring your ideas to life. Get an instant quote
                for your 3D printing project today.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-xl hover:bg-[var(--accent)]/90 transition-colors"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 border border-[var(--border)] text-[var(--text-primary)] font-semibold rounded-xl hover:border-[var(--accent)]/50 hover:text-[var(--accent)] transition-all"
                >
                  Meet the Team
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
