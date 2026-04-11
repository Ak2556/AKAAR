"use client";

import { useParams } from "next/navigation";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Quote, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { team, getTeamMemberBySlug } from "../../team-data";

export default function TeamMemberPage() {
  const params = useParams();
  const slug = params.slug as string;
  const member = getTeamMemberBySlug(slug);

  const heroRef = useRef(null);
  const bioRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const bioInView = useInView(bioRef, { once: true, margin: "-80px" });
  const [imgError, setImgError] = useState(false);

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Member Not Found</h1>
          <p className="text-[var(--text-secondary)] mb-8">
            The team member you're looking for doesn't exist.
          </p>
          <Link href="/about">
            <Button variant="primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to About
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Find other team members for the "Meet the rest" section
  const otherMembers = team.filter((m) => m.slug !== member.slug);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-30" />
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-6 relative z-10">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={heroInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-12 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-mono">Back to About</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
              className="relative group"
            >
              <div className="relative aspect-[3/4] max-w-md mx-auto rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-secondary)]">
                {imgError ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)]">
                    <span className="text-7xl font-bold text-[var(--accent)]/40 font-mono select-none">
                      {member.initials}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    onError={() => setImgError(true)}
                  />
                )}

                {/* Corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-[var(--accent)]/40" />
                <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-[var(--accent)]/40" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-[var(--accent)]/40" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-[var(--accent)]/40" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
                {member.role}
              </span>
              <h1 className="text-4xl md:text-5xl font-bold mt-3 mb-6">
                {member.name}
              </h1>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                {member.domain}
              </p>

              {/* Quote */}
              <div className="mt-8 p-6 border-l-2 border-[var(--accent)] bg-[var(--bg-secondary)] rounded-r-xl">
                <Quote className="w-5 h-5 text-[var(--accent)] mb-3" />
                <p className="text-[var(--text-primary)] italic leading-relaxed">
                  "{member.quote}"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio & Expertise */}
      <section ref={bioRef} className="py-20 bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={bioInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6">
                About <span className="gradient-text">{member.name.split(" ")[0]}</span>
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-base">
                {member.bio}
              </p>
            </motion.div>

            {/* Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={bioInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-2"
            >
              <h3 className="text-xl font-bold mb-6">Areas of Expertise</h3>
              <div className="space-y-3">
                {member.expertise.map((skill, i) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, x: 20 }}
                    animate={bioInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-3 p-3 border border-[var(--border)] rounded-lg bg-[var(--bg-primary)] hover:border-[var(--accent)]/50 transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                    <span className="text-sm text-[var(--text-secondary)]">
                      {skill}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Other team members */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold">
              Meet the Rest of the{" "}
              <span className="gradient-text">Team</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {otherMembers.map((other, index) => (
              <OtherMemberCard key={other.slug} member={other} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function OtherMemberCard({
  member,
  index,
}: {
  member: (typeof team)[0];
  index: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/about/team/${member.slug}`} className="group block">
        <div className="relative aspect-square mb-4 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] overflow-hidden group-hover:border-[var(--accent)]/50 transition-colors duration-300">
          {imgError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-tertiary)]">
              <span className="text-3xl font-bold text-[var(--accent)]/60 font-mono select-none">
                {member.initials}
              </span>
            </div>
          ) : (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, 33vw"
              onError={() => setImgError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold group-hover:text-[var(--accent)] transition-colors">
              {member.name}
            </h3>
            <p className="text-sm text-[var(--accent)] font-mono">
              {member.role}
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-1 transition-all" />
        </div>
      </Link>
    </motion.div>
  );
}
