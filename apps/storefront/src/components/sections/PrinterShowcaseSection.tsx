"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState } from "react";
import { BRAND_TAGLINE } from "@/lib/brand";

const printerStories = [
  {
    id: "p1s",
    kicker: "Bambu Lab P1S",
    title: "Enclosed chamber for engineering parts that need to come out right.",
    body: "The P1S runs inside a temperature-controlled enclosure, which matters for ABS, ASA, and any print where warping or layer delamination is a concern. Good for functional parts, tight tolerances, and jobs that run 10+ hours.",
    image: "/showcase/bambu-p1s.webp",
    stats: [
      { label: "Enclosure", value: "Fully enclosed" },
      { label: "Best for", value: "Functional prototypes" },
      { label: "Materials", value: "PLA · ABS · PETG · TPU" },
    ],
  },
  {
    id: "a1-combo",
    kicker: "Bambu Lab A1 Combo",
    title: "Multi-colour printing for models that need to look as good as they work.",
    body: "The A1 Combo handles up to four filament colours in a single print. Useful for presentation models, UI mockups, and early-stage products where the visual needs to communicate before the final design is locked.",
    image: "/showcase/bambu-a1-combo.jpg",
    stats: [
      { label: "Colours", value: "Up to 4 filaments" },
      { label: "Best for", value: "Presentation models" },
      { label: "Materials", value: "PLA · PETG" },
    ],
  },
];

export function PrinterShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const story = useMemo(() => printerStories[activeIndex], [activeIndex]);

  return (
    <section className="px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="luxury-card relative grid overflow-hidden rounded-[2.4rem] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="relative min-h-[360px] overflow-hidden lg:min-h-[580px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(214,178,114,0.18),_transparent_36%),linear-gradient(180deg,rgba(9,9,11,0.1),rgba(9,9,11,0.72))] z-10" />
            {printerStories.map((item, index) => (
              <motion.div
                key={item.id}
                className="absolute inset-0"
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  filter: index === activeIndex ? "saturate(1) brightness(0.96)" : "saturate(0.7) brightness(0.7)",
                }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              >
                <Image
                  src={item.image}
                  alt={item.kicker}
                  fill
                  unoptimized={item.image.endsWith(".webp")}
                  sizes="(max-width: 1024px) 100vw, 620px"
                  className="object-cover"
                />
              </motion.div>
            ))}

            <div className="absolute inset-x-0 bottom-0 z-20 p-6 sm:p-8">
              <div className="max-w-xl">
                <p className="luxury-kicker text-[var(--text-primary)]/80">Printer-led environments</p>
                <p className="mt-3 editorial-eyebrow text-white/62">{BRAND_TAGLINE}</p>
                <h2 className="display-font mt-4 text-4xl text-white sm:text-5xl">
                  Two machines. Different jobs. This is what runs your order.
                </h2>
              </div>
            </div>
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
    </section>
  );
}
