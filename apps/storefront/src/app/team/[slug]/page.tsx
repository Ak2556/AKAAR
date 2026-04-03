"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Linkedin, Github, Mail, Twitter } from "lucide-react";
import { getTeamMember, getAllTeamSlugs, TeamMember } from "@/lib/team-data";
import { use } from "react";

export function generateStaticParams() {
  return getAllTeamSlugs().map((slug) => ({ slug }));
}

export default function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const member = getTeamMember(slug);

  if (!member) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Team
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Photo Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover object-center"
                priority
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/80 via-transparent to-transparent" />
            </div>
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Name & Role */}
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{member.name}</h1>
            <p className="text-xl text-[var(--accent)] font-medium mb-4">
              {member.role}
            </p>
            <p className="text-[var(--text-secondary)] mb-8">{member.domain}</p>

            {/* Social Links */}
            <div className="flex gap-3 mb-8">
              {member.social.linkedin && (
                <a
                  href={member.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
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
                  className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
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
                  className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {member.social.email && (
                <a
                  href={`mailto:${member.social.email}`}
                  className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Bio */}
            <div className="prose prose-invert max-w-none mb-8">
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
                About
              </h2>
              {member.bio.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className="text-[var(--text-secondary)] mb-4 leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Skills */}
            <div>
              <h2 className="text-xl font-semibold mb-4 text-[var(--text-primary)]">
                Skills & Expertise
              </h2>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="p-8 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)]">
            <h3 className="text-2xl font-bold mb-4">
              Want to work with our team?
            </h3>
            <p className="text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
              Get in touch with us for your next 3D printing project. We're here
              to help bring your ideas to life.
            </p>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg hover:bg-[var(--accent)]/90 transition-colors"
            >
              Get a Quote
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
