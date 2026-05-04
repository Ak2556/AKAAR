"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import { BRAND_TAGLINE } from "@/lib/brand";

const printerStories = [
  {
    id: "p1s",
    kicker: "Bambu Lab P1S",
    title: "Enclosed speed for serious prototype throughput.",
    body: "Use the P1S stage to signal fast-turn enclosure work, reliable engineering prints, and a workflow that feels finished before the first layer begins.",
    image: "/showcase/bambu-p1s.jpg",
    stats: [
      { label: "Print mode", value: "High-throughput" },
      { label: "Best for", value: "Functional prototypes" },
      { label: "Story role", value: "Launch-stage output" },
    ],
  },
  {
    id: "a1-combo",
    kicker: "Bambu Lab A1 Combo",
    title: "Accessible multi-color presentation for faster approvals.",
    body: "The A1 Combo section frames visual prototypes, communication models, and early-stage products that need to be convincing before they need to be final.",
    image: "/showcase/bambu-a1-combo.jpg",
    stats: [
      { label: "Print mode", value: "Presentation-first" },
      { label: "Best for", value: "Visual approvals" },
      { label: "Story role", value: "Investor-ready prototypes" },
    ],
  },
];

export function PrinterShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [activeIndex, setActiveIndex] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.min(
      printerStories.length - 1,
      Math.max(0, Math.floor(latest * printerStories.length))
    );
    setActiveIndex(index);
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.02]);
  const overlayY = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const story = useMemo(() => printerStories[activeIndex], [activeIndex]);

  return (
    <section ref={ref} className="relative h-[220vh] px-4 py-6 sm:px-6">
      <div className="sticky top-24">
        <div className="mx-auto max-w-7xl">
          <div className="luxury-card relative grid min-h-[calc(100vh-7rem)] overflow-hidden rounded-[2.4rem] lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative min-h-[360px] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(214,178,114,0.18),_transparent_36%),linear-gradient(180deg,rgba(9,9,11,0.1),rgba(9,9,11,0.72))] z-10" />
              {printerStories.map((item, index) => (
                <motion.img
                  key={item.id}
                  src={item.image}
                  alt={item.kicker}
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ scale: imageScale }}
                  animate={{
                    opacity: index === activeIndex ? 1 : 0,
                    filter: index === activeIndex ? "saturate(1) brightness(0.96)" : "saturate(0.7) brightness(0.7)",
                  }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                />
              ))}

              <motion.div style={{ y: overlayY }} className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8">
                <div className="max-w-xl">
                  <p className="luxury-kicker text-[var(--text-primary)]/80">Printer-led environments</p>
                  <p className="mt-3 editorial-eyebrow text-white/62">{BRAND_TAGLINE}</p>
                  <h2 className="display-font mt-4 text-4xl text-white sm:text-5xl">
                    Scroll through the hardware language behind the AKAAR experience.
                  </h2>
                </div>
              </motion.div>
            </div>

            <div className="flex flex-col justify-between bg-[linear-gradient(180deg,rgba(17,18,22,0.98)_0%,rgba(9,9,11,0.98)_100%)] px-6 py-8 sm:px-8 lg:px-10">
              <div>
                <div className="mb-8 flex items-center gap-3">
                  {printerStories.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeIndex ? "w-14 bg-[var(--text-primary)]" : "w-8 bg-[var(--border-accent)]"
                      }`}
                      aria-label={item.kicker}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -24 }}
                    transition={{ duration: 0.45 }}
                  >
                    <span className="luxury-kicker">{story.kicker}</span>
                    <p className="mt-4 max-w-lg text-sm uppercase tracking-[0.16em] text-[var(--accent)]">{BRAND_TAGLINE}</p>
                    <h3 className="display-font mt-4 text-4xl text-[var(--text-primary)]">
                      {story.title}
                    </h3>
                    <p className="mt-5 max-w-xl text-base leading-7 text-[var(--text-secondary)]">
                      {story.body}
                    </p>

                    <div className="mt-10 grid gap-px overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--border)]">
                      {story.stats.map((stat) => (
                        <div key={stat.label} className="bg-[var(--bg-secondary)] px-5 py-5">
                          <p className="luxury-metric-label">{stat.label}</p>
                          <p className="mt-3 text-xl font-semibold text-[var(--text-primary)]">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-8 space-y-4">
                {printerStories.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`flex w-full items-center justify-between rounded-[1.4rem] border px-4 py-4 text-left transition-all ${
                      index === activeIndex
                        ? "border-[var(--text-primary)] bg-[var(--surface-highlight)]"
                        : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-accent)]"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">{item.kicker}</p>
                      <p className="mt-1 text-xs text-[var(--text-muted)]">{item.stats[1]?.value}</p>
                    </div>
                    <span className="luxury-metric-label">{index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
