"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCountUp } from "@/hooks/useCountUp";

interface Stat {
  value: string;
  label: string;
  numericValue: number;
  suffix: string;
}

const stats: Stat[] = [
  { value: "500+", label: "Parts Produced", numericValue: 500, suffix: "+" },
  { value: "50+", label: "Happy Clients", numericValue: 50, suffix: "+" },
  { value: "99%", label: "Quality Rate", numericValue: 99, suffix: "%" },
  { value: "24h", label: "Avg Response", numericValue: 24, suffix: "h" },
];

function StatCard({ stat, index, isInView }: { stat: Stat; index: number; isInView: boolean }) {
  const { formattedValue, isComplete, startCounting, hasStarted } = useCountUp({
    end: stat.numericValue,
    duration: 2000,
    delay: index * 200,
    suffix: stat.suffix,
    decimals: 0,
  });

  useEffect(() => {
    if (isInView && !hasStarted) {
      startCounting();
    }
  }, [isInView, hasStarted, startCounting]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group"
    >
      {/* Glow effect on complete */}
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] rounded-xl blur-lg transition-opacity duration-500 ${
          isComplete ? "opacity-30" : "opacity-0"
        }`}
      />

      <div className="relative p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] group-hover:border-[var(--accent)]/50 transition-all duration-300">
        {/* Animated value */}
        <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2 tabular-nums">
          {hasStarted ? formattedValue : "0" + stat.suffix}
        </div>

        {/* Label */}
        <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>

        {/* Completion pulse indicator */}
        {isComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute top-3 right-3 w-2 h-2 bg-[var(--accent)] rounded-full"
          >
            <span className="absolute inset-0 bg-[var(--accent)] rounded-full animate-ping opacity-75" />
          </motion.div>
        )}

        {/* Progress bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--border)] rounded-b-xl overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={hasStarted ? { width: "100%" } : {}}
            transition={{ duration: 2, delay: index * 0.2, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)]"
          />
        </div>
      </div>
    </motion.div>
  );
}

export function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} isInView={isInView} />
      ))}
    </div>
  );
}
