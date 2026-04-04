"use client";

import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronDown, Calendar, Rocket, Building2, Globe, Zap } from "lucide-react";

interface Milestone {
  year: string;
  title: string;
  description: string;
  details?: string;
  icon: typeof Calendar;
  status: "completed" | "current" | "upcoming";
}

const milestones: Milestone[] = [
  {
    year: "2024",
    title: "Founded",
    description: "Started AKAAR 3D with a vision to democratize manufacturing",
    details: "Akash Thakur founded AKAAR 3D in Jaipur, bringing together a team of passionate engineers and designers with a shared mission: making precision manufacturing accessible to everyone.",
    icon: Rocket,
    status: "completed",
  },
  {
    year: "2024",
    title: "Print Farm Setup",
    description: "Established our first production facility in Jaipur",
    details: "Invested in high-quality FDM printers and built out our production infrastructure. Implemented quality control processes and streamlined our workflow for maximum efficiency.",
    icon: Building2,
    status: "completed",
  },
  {
    year: "2025",
    title: "Platform Launch",
    description: "Launched our digital quoting and ordering platform",
    details: "Built an intelligent software platform that automates the entire quoting process. Upload your CAD file, get instant pricing, and track your order in real-time.",
    icon: Zap,
    status: "current",
  },
  {
    year: "2025",
    title: "Pan-India Shipping",
    description: "Expanded logistics to serve customers across India",
    details: "Partnered with leading logistics providers to ensure fast, reliable delivery across all major cities in India. Average delivery time: 3-5 business days.",
    icon: Globe,
    status: "upcoming",
  },
];

function MilestoneCard({ milestone, index, isExpanded, onToggle }: {
  milestone: Milestone;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = milestone.icon;
  const isLeft = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={`relative lg:w-[calc(50%-2rem)] ${
        isLeft ? "lg:pr-8 lg:ml-0" : "lg:pl-8 lg:ml-auto"
      }`}
    >
      {/* Timeline dot - Desktop */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.2, type: "spring" }}
        className={`hidden lg:flex absolute top-6 w-5 h-5 rounded-full border-4 items-center justify-center z-10 ${
          milestone.status === "completed"
            ? "bg-[var(--accent)] border-[var(--bg-primary)]"
            : milestone.status === "current"
            ? "bg-[var(--accent)] border-[var(--bg-primary)] animate-pulse"
            : "bg-[var(--bg-tertiary)] border-[var(--border)]"
        }`}
        style={{
          [isLeft ? "right" : "left"]: "-2.625rem",
        }}
      >
        {milestone.status === "current" && (
          <span className="absolute w-8 h-8 bg-[var(--accent)]/30 rounded-full animate-ping" />
        )}
      </motion.div>

      {/* Card */}
      <motion.div
        className={`relative overflow-hidden cursor-pointer ${
          milestone.status === "upcoming" ? "opacity-60" : ""
        }`}
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className={`p-6 border rounded-xl transition-all duration-300 ${
          isExpanded
            ? "border-[var(--accent)]/50 bg-[var(--bg-primary)] shadow-lg shadow-[var(--accent)]/10"
            : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--accent)]/30"
        }`}>
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                milestone.status === "upcoming"
                  ? "bg-[var(--bg-tertiary)] border border-[var(--border)]"
                  : "bg-[var(--accent)]/10 border border-[var(--accent)]/30"
              }`}>
                <Icon className={`w-6 h-6 ${
                  milestone.status === "upcoming" ? "text-[var(--text-muted)]" : "text-[var(--accent)]"
                }`} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-sm ${
                    milestone.status === "upcoming" ? "text-[var(--text-muted)]" : "text-[var(--accent)]"
                  }`}>
                    {milestone.year}
                  </span>
                  {milestone.status === "current" && (
                    <span className="px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] text-xs font-medium rounded-full">
                      Now
                    </span>
                  )}
                  {milestone.status === "upcoming" && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-500 text-xs font-medium rounded-full">
                      Coming
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-1">{milestone.title}</h3>
              </div>
            </div>

            {/* Expand indicator */}
            {milestone.details && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="w-5 h-5 text-[var(--text-muted)]" />
              </motion.div>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-[var(--text-secondary)] mt-3 ml-16">
            {milestone.description}
          </p>

          {/* Expanded details */}
          <AnimatePresence>
            {isExpanded && milestone.details && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 pt-4 border-t border-[var(--border)] ml-16">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {milestone.details}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function InteractiveTimeline() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative">
      {/* Animated timeline line - Desktop only */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px hidden lg:block overflow-hidden">
        <motion.div
          initial={{ height: "0%" }}
          animate={isInView ? { height: "100%" } : {}}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full bg-gradient-to-b from-[var(--accent)] via-[var(--accent)]/50 to-[var(--border)]"
        />
      </div>

      {/* Milestones */}
      <div className="space-y-6 lg:space-y-0">
        {milestones.map((milestone, index) => (
          <MilestoneCard
            key={`${milestone.year}-${milestone.title}`}
            milestone={milestone}
            index={index}
            isExpanded={expandedIndex === index}
            onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
          />
        ))}
      </div>

      {/* Future indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="hidden lg:flex justify-center mt-8"
      >
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
          <span className="w-2 h-2 bg-[var(--text-muted)] rounded-full animate-pulse" />
          <span>More milestones coming...</span>
        </div>
      </motion.div>
    </div>
  );
}
