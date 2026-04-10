"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Upload, MessageSquare } from "lucide-react";

interface StatConfig {
  numeric: number;
  suffix: string;
  label: string;
  duration?: number;
}

const stats: StatConfig[] = [
  { numeric: 10000, suffix: "+", label: "Parts Delivered", duration: 1800 },
  { numeric: 99.9, suffix: "%", label: "Quality Rate", duration: 1400 },
  { numeric: 48, suffix: "h", label: "Avg. Lead Time", duration: 1000 },
  { numeric: 500, suffix: "+", label: "Happy Clients", duration: 1500 },
];

function AnimatedStat({ stat, isInView }: { stat: StatConfig; isInView: boolean }) {
  const [displayed, setDisplayed] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!isInView || started.current) return;
    started.current = true;

    const target = stat.numeric;
    const duration = stat.duration ?? 1600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out expo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = target * eased;
      setDisplayed(current);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [isInView, stat.numeric, stat.duration]);

  const formatted =
    stat.numeric % 1 === 0
      ? Math.round(displayed).toLocaleString()
      : displayed.toFixed(1);

  return (
    <span className="stat-number animate">
      {formatted}
      {stat.suffix}
    </span>
  );
}

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--accent)]/5 to-[var(--bg-primary)]" />
      <div className="absolute inset-0 grid-overlay opacity-30" />

      {/* Floating blobs */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[var(--accent)]/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[var(--accent-secondary)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
      />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: "backOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[var(--accent)]/30 rounded-full bg-[var(--accent)]/5"
          >
            <span className="text-sm text-[var(--accent)] font-mono tracking-widest">
              WE GIVE AKAAR TO IDEAS
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Zero-Friction
            <span className="block gradient-text">Manufacturing</span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-12"
          >
            Upload your mesh, get instant algorithmic pricing, and push to production.
            From digital file to physical part in days, not weeks.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/quote">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px var(--accent), 0 0 60px rgba(0,255,245,0.15)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg transition-all"
              >
                <Upload className="w-5 h-5" />
                Upload CAD / Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 border border-[var(--border-accent)] text-[var(--text-primary)] font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <MessageSquare className="w-5 h-5" />
                Explore Materials
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats — count-up */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  <AnimatedStat stat={stat} isInView={isInView} />
                </div>
                <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
