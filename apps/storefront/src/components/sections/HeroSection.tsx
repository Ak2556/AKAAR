"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { BRAND_TAGLINE } from "@/lib/brand";

const metrics = [
  { label: "Lead time", value: "48h review" },
  { label: "Core materials", value: "PLA, ABS, TPU" },
  { label: "Studio coverage", value: "Local build, shipped across India" },
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.14]);

  return (
    <section ref={ref} className="luxury-shell overflow-hidden px-4 pt-28 pb-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="luxury-card overflow-hidden rounded-[var(--rad-xl)]"
        >
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[1.12fr_0.88fr] lg:px-10 lg:py-10">
            <div className="flex flex-col justify-between gap-8">
              <div className="editorial-stage-copy space-y-6">
                <span className="luxury-kicker">AKAAR Product Atelier</span>
                <p className="editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
                <h1 className="display-font max-w-[11ch] text-[clamp(2.9rem,4.35vw,4.8rem)] leading-[0.98] text-[var(--text-primary)]">
                  3D printing studio in Jaipur. Your file, finished parts, shipped across India.
                </h1>
                <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  Upload your CAD file, pick a material, and we&rsquo;ll review it and send you a quote within 48 hours. PLA, ABS, TPU, and PETG — from concept prints to functional parts ready for the field.
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-3 rounded-full bg-[var(--text-primary)] px-7 py-3.5 text-sm font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5"
                >
                  Start a Build
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-3 rounded-full border border-[var(--border-accent)] px-7 py-3.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--surface-highlight)]"
                >
                  View Collection
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="luxury-stage relative flex min-h-[340px] items-end overflow-hidden rounded-[var(--rad-lg)] px-5 pt-10 sm:px-8">
                <motion.div className="absolute inset-0 opacity-54" style={{ y: imageY, scale: imageScale }}>
                  <Image
                    src="/showcase/bambu-p1s.webp"
                    alt="Bambu Lab P1S"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 560px"
                    className="object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.16)_0%,rgba(7,7,10,0.56)_58%,rgba(7,7,10,0.74)_100%)]" />
                <div className="absolute inset-x-6 top-6 h-px bg-gradient-to-r from-transparent via-[var(--text-primary)]/12 to-transparent" />
                <div className="absolute left-6 top-6 editorial-eyebrow">
                  Bambu Lab P1S
                </div>

                <div className="relative z-10 w-full pb-6">
                  <div className="mx-auto max-w-[360px] rounded-[var(--rad-lg)] border border-white/10 bg-[rgba(10,10,12,0.58)] px-5 py-5 backdrop-blur-md sm:max-w-[420px]">
                    <p className="luxury-metric-label text-white/56">Machine environment</p>
                    <p className="mt-3 text-2xl font-semibold text-white">Bambu Lab P1S enclosed chamber</p>
                    <p className="mt-3 text-sm leading-6 text-white/72">
                      Temperature-controlled enclosure for consistent results across long prints. Reliable for engineering parts, tight tolerances, and multi-layer builds.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-px overflow-hidden rounded-[var(--rad-lg)] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="bg-[var(--bg-secondary)] px-5 py-5">
                    <p className="luxury-metric-label">{metric.label}</p>
                    <p className="mt-3 text-xl font-semibold text-[var(--text-primary)]">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
