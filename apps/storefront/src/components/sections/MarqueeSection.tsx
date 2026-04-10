"use client";

const KEYWORDS = [
  "FDM Printing",
  "SLA Resin",
  "PETG · PLA · ABS",
  "Nylon & TPU",
  "Production Runs",
  "Rapid Prototyping",
  "Instant Quote",
  "48h Delivery",
  "Mesh Optimization",
  "DFM Consulting",
  "Pan-India Shipping",
  "Algorithmic Pricing",
];

function MarqueeTrack({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  return (
    <div className="flex overflow-hidden" aria-hidden>
      <div className={`flex whitespace-nowrap gap-0 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {[...items, ...items].map((kw, i) => (
          <span key={i} className="inline-flex items-center gap-4 px-6 text-sm font-mono">
            <span className="text-[var(--text-muted)]">{kw}</span>
            <span className="text-[var(--accent)]/40">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export function MarqueeSection() {
  return (
    <div className="relative overflow-hidden py-5 border-y border-[var(--accent)]/10 bg-[var(--bg-secondary)]/40 backdrop-blur-sm">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-10 pointer-events-none" />

      <MarqueeTrack items={KEYWORDS} />
    </div>
  );
}
