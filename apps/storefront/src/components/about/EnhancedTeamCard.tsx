"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Users, ArrowRight, Linkedin, Github, Instagram, Mail } from "lucide-react";
import { type TeamMember } from "@/lib/team-data";

interface EnhancedTeamCardProps {
  member: TeamMember;
  index: number;
}

export function EnhancedTeamCard({ member, index }: EnhancedTeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="group perspective-1000"
    >
      <div
        className="relative aspect-[3/4] cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Card container with flip */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
          className="relative w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Front of card */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-blue-600 rounded-2xl opacity-0 group-hover:opacity-70 blur-lg transition-all duration-500" />

            {/* Main Card */}
            <div className="relative h-full rounded-2xl overflow-hidden bg-[var(--bg-primary)] border border-[var(--border)] group-hover:border-[var(--accent)]/50 transition-all duration-300">
              {/* Image */}
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 320px"
                  className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-secondary)]">
                  <Users className="w-20 h-20 text-[var(--border)]" />
                </div>
              )}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <div className="transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 mb-3">
                  <span className="inline-block px-3 py-1 bg-[var(--accent)]/20 backdrop-blur-sm text-[var(--accent)] text-xs font-medium rounded-full border border-[var(--accent)]/30">
                    {member.role.split(" ")[0]}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[var(--accent)] transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-white/80 mb-2 line-clamp-1">{member.role}</p>

                {/* Tap to flip hint */}
                <div className="flex items-center gap-2 mt-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                  <span className="text-sm font-medium text-[var(--accent)]">Tap to flip</span>
                  <ArrowRight className="w-4 h-4 text-[var(--accent)] group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Corner accents */}
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)]/0 group-hover:border-[var(--accent)] transition-colors duration-300 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)]/0 group-hover:border-[var(--accent)] transition-colors duration-300 rounded-bl-lg" />
            </div>
          </div>

          {/* Back of card */}
          <div
            className="absolute inset-0 rounded-2xl overflow-hidden"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          >
            <div className="relative h-full rounded-2xl bg-[var(--bg-primary)] border border-[var(--accent)]/30 p-6 flex flex-col">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-sm text-[var(--accent)]">{member.role}</p>
              </div>

              {/* Domain */}
              <p className="text-sm text-[var(--text-secondary)] text-center mb-4 line-clamp-3">
                {member.domain}
              </p>

              {/* Skills */}
              <div className="flex-1">
                <div className="text-xs text-[var(--text-muted)] mb-2">Skills</div>
                <div className="flex flex-wrap gap-1">
                  {member.skills.slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-xs rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                  {member.skills.length > 6 && (
                    <span className="px-2 py-0.5 bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs rounded-full">
                      +{member.skills.length - 6}
                    </span>
                  )}
                </div>
              </div>

              {/* Social links */}
              <div className="flex justify-center gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                {member.social.linkedin && (
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}
                {member.social.github && (
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}
                {member.social.instagram && (
                  <a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {member.social.email && (
                  <a
                    href={`mailto:${member.social.email}`}
                    className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] flex items-center justify-center hover:bg-[var(--accent)]/20 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* View full profile link */}
              <Link
                href={`/team/${member.slug}`}
                className="mt-4 flex items-center justify-center gap-2 py-2 bg-[var(--accent)] text-[var(--bg-primary)] font-medium rounded-lg hover:opacity-90 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                View Full Profile
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
