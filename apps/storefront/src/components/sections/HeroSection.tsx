"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { Scene } from "@/components/three/Scene";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useRef } from "react";

function SplitText({ text, delay = 0, className = "" }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 60, rotateX: -90 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{
            duration: 0.6,
            delay: delay + i * 0.035,
            ease: [0.215, 0.61, 0.355, 1],
          }}
          style={{ display: "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { normalizedX, normalizedY } = useMousePosition();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const rawOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const y = useSpring(rawY, { stiffness: 60, damping: 20 });
  const opacity = useSpring(rawOpacity, { stiffness: 60, damping: 20 });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 3D Background */}
      <Scene mouseX={normalizedX} mouseY={normalizedY} />

      {/* Floating ambient orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/5 w-[500px] h-[500px] bg-[var(--accent)]/8 rounded-full blur-[120px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -35, 0], y: [0, 25, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] bg-[var(--accent-secondary)]/8 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, 20, -20, 0], y: [0, -15, 15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-1/2 right-1/4 w-[300px] h-[300px] bg-[var(--accent)]/5 rounded-full blur-[80px] pointer-events-none"
      />

      {/* Grid overlay */}
      <div className="absolute inset-0 grid-overlay pointer-events-none" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--bg-primary)] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-primary)]/50 via-transparent to-[var(--bg-primary)]/50 pointer-events-none" />

      {/* Parallax content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-10 container mx-auto px-6 text-center"
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "backOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-[var(--accent)]/30 rounded-full bg-[var(--accent)]/5"
          >
            <motion.span
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[var(--accent)] rounded-full"
            />
            <span className="text-sm text-[var(--accent)] font-mono tracking-widest">
              WE GIVE AKAAR TO IDEAS
            </span>
          </motion.div>

          {/* Headline — character-by-character reveal */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
            style={{ perspective: "1200px" }}
          >
            <span className="block text-[var(--text-primary)]">
              <SplitText text="Frictionless" delay={0.25} />
            </span>
            <span className="block gradient-text">
              <SplitText text="3D Printing" delay={0.6} />
            </span>
          </h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.15 }}
            className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-12"
          >
            From CAD to physical part in days. A seamless storefront driven by an
            automated algorithmic quoting engine. Upload your model, get instant
            pricing, and push to production.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/quote">
              <motion.button
                whileHover={{
                  scale: 1.06,
                  boxShadow: "0 0 32px var(--accent), 0 0 64px rgba(0,255,245,0.2)",
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 bg-[var(--accent)] text-[var(--bg-primary)] font-semibold rounded-lg transition-all animate-pulse-glow"
              >
                Upload CAD / Get Instant Quote
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-200" />
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center gap-3 px-8 py-4 border border-[var(--border-accent)] text-[var(--text-primary)] font-semibold rounded-lg hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
              >
                <Play className="w-5 h-5" />
                Explore Materials
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-[var(--text-muted)]"
          >
            <span className="text-xs font-mono uppercase tracking-widest">Scroll</span>
            <div className="w-px h-10 bg-gradient-to-b from-[var(--accent)] to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Corner accents — animated in */}
      {[
        "top-20 left-6 border-l border-t",
        "top-20 right-6 border-r border-t",
        "bottom-20 left-6 border-l border-b",
        "bottom-20 right-6 border-r border-b",
      ].map((cls, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.15, ease: "backOut" }}
          className={`absolute w-20 h-20 ${cls} border-[var(--accent)]/20`}
        />
      ))}
    </section>
  );
}
