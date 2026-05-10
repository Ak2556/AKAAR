"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Cog,
  Cpu,
  Layers,
  Printer,
  Shield,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const stats = [
  { value: "48h", label: "Review turnaround" },
  { value: "FDM-first", label: "Production stack" },
  { value: "Pan-India", label: "Delivery network" },
];

const capabilities = [
  {
    icon: Printer,
    title: "FDM Prototyping",
    description:
      "Robust builds for enclosures, fixtures, mechanical trials, and early field testing. Iteration speed without sacrificing review rigour.",
    specs: ["PLA · PETG · ABS", "Enclosed Bambu Lab environment", "Engineering review included"],
    price: "From ₹3 / gram",
  },
  {
    icon: Layers,
    title: "Display & Surface Models",
    description:
      "High-detail presentation parts for investor demos, client approvals, and showpiece placement. Surface quality leads the build strategy.",
    specs: ["Visual quality first", "Smooth-ready finishes", "Low-volume premium runs"],
    price: "By geometry",
  },
  {
    icon: Zap,
    title: "Short-Run Production",
    description:
      "Repeatable production output for functional parts before tooling justification. Consistent batch quality, calibration tracked.",
    specs: ["Batch consistency", "Calibration tracking", "Shipment coordination"],
    price: "Custom quote",
  },
  {
    icon: Cpu,
    title: "Mesh Readiness Review",
    description:
      "Geometry validation before a single gram is printed — wall conditions, support strategy, and likely failure points surfaced early.",
    specs: ["Repair guidance", "Orientation optimisation", "Material-fit notes"],
    price: "Included with quote",
  },
  {
    icon: Cog,
    title: "DFM Consulting",
    description:
      "A focused manufacturing review when the part needs engineering judgement before production. Strength tradeoffs, cost reduction, revision planning.",
    specs: ["Strength tradeoffs", "Cost reduction", "Revision planning"],
    price: "From ₹500 / hour",
  },
  {
    icon: Shield,
    title: "Protected Dispatch",
    description:
      "Parts packed, tracked, and dispatched with the discipline expected of functional hardware shipments — not standard parcel post.",
    specs: ["Pan-India delivery", "Secure packaging", "Post-dispatch support"],
    price: "Calculated at checkout",
  },
];

const flagshipPrograms = [
  {
    kicker: "Prototype velocity",
    title: "FDM built for real engineering loops.",
    body: "When teams need parts fast, the service has to feel decisive — not improvised. AKAAR calibrates print settings, review cadence, and revision pathways so each iteration is informed rather than guessed at. Enclosed machines, material-reviewed settings, rapid turnaround.",
    image: "/showcase/bambu-p1s.jpg",
    imageAlt: "Bambu Lab P1S enclosed FDM printer",
    specs: ["Enclosed machine environment", "Material-fit review", "Rapid revision cycles"],
  },
  {
    kicker: "Presentation quality",
    title: "Display models that hold up under scrutiny.",
    body: "Some parts need to impress before they need to survive. For those builds, surface quality, staging, and finish path matter as much as tolerances. The review tracks surface result, not just dimensional accuracy — because that is what the audience sees.",
    image: "/showcase/bambu-a1-combo.jpg",
    imageAlt: "Bambu Lab A1 Combo multi-material printer",
    specs: ["Investor-ready stage pieces", "Surface-led build strategy", "Low-volume premium runs"],
  },
  {
    kicker: "Production discipline",
    title: "Short-run manufacturing before tooling is justified.",
    body: "This is the in-between space where process matters most. Output has to stay consistent enough for real usage while remaining flexible enough to absorb design updates without wasting momentum or rebuilding from scratch each revision.",
    image: "/showcase/bambu-p1s.webp",
    imageAlt: "Bambu Lab P1S production run",
    specs: ["Repeatable batch output", "Calibration tracked", "Dispatch coordinated"],
  },
];

const process = [
  { step: "01", title: "Upload", description: "Share geometry, tolerances, and use-case context." },
  { step: "02", title: "Review", description: "We assess printability, material fit, and production risk." },
  { step: "03", title: "Quote", description: "A reviewed recommendation — not just an automated number." },
  { step: "04", title: "Produce", description: "Parts move through a controlled print setup and finishing path." },
  { step: "05", title: "Dispatch", description: "Packed, tracked, and shipped nationwide." },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">

        {/* Hero */}
        <section className="luxury-panel relative overflow-hidden rounded-[2.45rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.16),transparent_28%),radial-gradient(circle_at_82%_22%,rgba(125,211,199,0.12),transparent_24%)]" />
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[0.98fr_1.02fr] lg:px-10 lg:py-10">

            <div className="relative z-10 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <span className="luxury-kicker">Capabilities</span>
                <h1 className="display-font text-[clamp(2.9rem,4.9vw,5rem)] leading-[0.95] text-[var(--text-primary)]">
                  Manufacturing built around the geometry — not the other way around.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  Every build at AKAAR moves through a review before production starts. You get a manufacturing recommendation for the part you actually have — not an automated quote based on weight alone.
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Review-led workflow · FDM-first stack · Pan-India delivery
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/quote">
                  <Button size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Request a Quote
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10">
              <div className="luxury-stage relative min-h-[360px] overflow-hidden rounded-[2rem] border border-white/8 p-5 sm:p-7">
                <div className="absolute left-6 top-5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                  Machine context
                </div>
                <div className="absolute inset-x-5 bottom-[4.5rem] top-14">
                  <Image
                    src="/showcase/bambu-p1s.jpg"
                    alt="Bambu Lab P1S enclosed FDM printer"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="hero-image-shadow object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.04)_0%,rgba(7,7,10,0.34)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
                  {stats.map((stat) => (
                    <div key={stat.label} className="bg-[rgba(11,12,15,0.78)] px-5 py-4 backdrop-blur-md">
                      <p className="display-font mt-1 text-2xl text-white">{stat.value}</p>
                      <p className="mt-1 text-xs text-white/60">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capability cards */}
        <section>
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">Service lines</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Choose the manufacturing path that fits the part.
            </h2>
          </div>

          <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((cap, i) => (
              <motion.article
                key={cap.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.06 }}
                className="luxury-card flex flex-col rounded-[2rem] p-6"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
                  <cap.icon className="h-5 w-5 text-[var(--accent)]" />
                </div>
                <h3 className="display-font mt-6 text-3xl text-[var(--text-primary)]">{cap.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-[var(--text-secondary)]">{cap.description}</p>
                <div className="mt-6 space-y-2.5 border-t border-[var(--border)] pt-6">
                  {cap.specs.map((spec) => (
                    <div key={spec} className="flex items-center gap-3">
                      <CheckCircle className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                      <span className="text-sm text-[var(--text-primary)]">{spec}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-sm font-semibold text-[var(--accent)]">{cap.price}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Flagship programs */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <span className="luxury-kicker">Flagship programs</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Three programs. Three distinct production realities.
            </h2>
          </div>

          <div className="space-y-6">
            {flagshipPrograms.map((program, index) => (
              <motion.article
                key={program.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="luxury-card overflow-hidden rounded-[2.2rem]"
              >
                <div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">
                  <div className={`${index % 2 === 0 ? "order-1" : "order-2"} bg-[var(--bg-secondary)] px-6 py-7 sm:px-8 sm:py-8`}>
                    <span className="luxury-kicker">{program.kicker}</span>
                    <h3 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                      {program.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                      {program.body}
                    </p>
                    <div className="mt-8 grid gap-px overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                      {program.specs.map((spec) => (
                        <div key={spec} className="bg-[var(--bg-primary)] px-4 py-4">
                          <p className="luxury-metric-label">Detail</p>
                          <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{spec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${index % 2 === 0 ? "order-2" : "order-1"} luxury-stage relative min-h-[320px] overflow-hidden p-5`}>
                    <div className="absolute left-5 top-5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                      {program.kicker}
                    </div>
                    <div className="absolute inset-x-5 bottom-5 top-14">
                      <Image
                        src={program.image}
                        alt={program.imageAlt}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="hero-image-shadow object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.04)_0%,rgba(7,7,10,0.3)_100%)]" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="luxury-card rounded-[2.2rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">Production sequence</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Five steps. Fewer surprises between upload and delivery.
            </h2>
          </div>

          <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] lg:grid-cols-5">
            {process.map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-[var(--bg-secondary)] px-5 py-6"
              >
                <p className="display-font text-[2.2rem] leading-none text-[var(--accent)]/35">{item.step}</p>
                <h3 className="display-font mt-5 text-2xl text-[var(--text-primary)]">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="luxury-panel overflow-hidden rounded-[2.2rem] px-6 py-10 text-center sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {["Review before production", "FDM-first stack", "Pan-India delivery", "Real studio output"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {item}
                </span>
              ))}
            </div>
            <span className="luxury-kicker">Start a build</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Bring the next part into review.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              Share your files, intended use, and timing. We respond with a production recommendation designed for the part you actually need — not a template.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/quote">
                <Button size="lg">
                  <Upload className="mr-2 h-4 w-4" />
                  Request a Quote
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Talk to AKAAR
                </Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
