"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Scene } from "@/components/three/Scene";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useTheme } from "@/hooks/useTheme";

// Typing effect component
function TypeWriter({
  text,
  delay = 0,
  speed = 50,
  className = "",
  onComplete,
}: {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timer);
    } else {
      onComplete?.();
    }
  }, [displayedText, text, speed, started, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {started && displayedText.length < text.length && (
        <span className="animate-pulse text-[var(--accent)]">|</span>
      )}
    </span>
  );
}

export function HeroSection() {
  const { normalizedX, normalizedY } = useMousePosition();
  const { isDark } = useTheme();
  const [line1Complete, setLine1Complete] = useState(false);
  const [line2Complete, setLine2Complete] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Background */}
      <Scene mouseX={normalizedX} mouseY={normalizedY} isDark={isDark} />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)]/50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[var(--accent)]/30 rounded-full bg-[var(--accent)]/5"
          >
            <span className="w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse" />
            <span className="text-sm text-[var(--accent)] font-mono">WE GIVE AKAAR TO IDEAS</span>
          </motion.div>

          {/* Headline with typing effect */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
            <span className="block text-[var(--text-primary)]">
              <TypeWriter
                text="Frictionless"
                delay={800}
                speed={80}
                onComplete={() => setLine1Complete(true)}
              />
            </span>
            <span className="block gradient-text min-h-[1.2em]">
              {line1Complete && (
                <TypeWriter
                  text="3D Printing"
                  delay={200}
                  speed={80}
                  onComplete={() => setLine2Complete(true)}
                />
              )}
            </span>
          </h1>

          {/* Subheadline - fades in after typing completes */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: line2Complete ? 1 : 0 }}
            transition={{ duration: 0.8 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12"
          >
            From CAD to physical part in days. A seamless storefront driven by an
            automated algorithmic quoting engine. Upload your model, get instant pricing,
            and push to production.
          </motion.p>

          {/* CTAs - fade in after typing completes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: line2Complete ? 1 : 0, y: line2Complete ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/quote">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg hover:bg-[var(--accent)]/90 transition-all animate-pulse-glow"
              >
                Upload CAD / Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 border border-[var(--border-accent)] text-[var(--text-primary)] font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <Play className="w-5 h-5" />
                Explore Materials
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
          >
            <span className="text-xs font-mono uppercase tracking-wider">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[var(--accent)] to-transparent" />
          </motion.div>
        </motion.div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-20 left-6 w-20 h-20 border-l border-t border-[var(--accent)]/20" />
      <div className="absolute top-20 right-6 w-20 h-20 border-r border-t border-[var(--accent)]/20" />
      <div className="absolute bottom-20 left-6 w-20 h-20 border-l border-b border-[var(--accent)]/20" />
      <div className="absolute bottom-20 right-6 w-20 h-20 border-r border-b border-[var(--accent)]/20" />
    </section>
  );
}
