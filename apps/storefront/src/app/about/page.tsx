"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Clock3,
  Layers3,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { teamMembers } from "@/lib/team-data";
import { BRAND_TAGLINE } from "@/lib/brand";

const studioMetrics = [
  { label: "Studio mode", value: "Real desk, real setup" },
  { label: "Output", value: "Functional and decorative" },
  { label: "Workflow", value: "Review before production" },
];

const showcaseProjects = [
  {
    title: "Illuminated planter series",
    category: "Ambient product build",
    description:
      "A soft-lit planter concept built as a product object, not just a print sample. The shape, glow, and desktop placement all matter together.",
    image: "/showcase/studio/planter-lineup.png",
    details: ["Lighting-led form", "Desk-scale object", "Repeatable enclosure geometry"],
  },
  {
    title: "Shiva sculpt study",
    category: "Detail and finish",
    description:
      "A character piece used to show form fidelity, surface handling, and how a dramatic outdoor shot makes the object feel finished rather than raw.",
    image: "/showcase/studio/shiva-outdoor.png",
    mediaMode: "portrait-stage",
    details: ["Fine silhouette retention", "Strong outdoor presentation", "Showpiece-grade staging"],
  },
  {
    title: "Temple pavilion with Ganesha",
    category: "Multi-part composition",
    description:
      "This build demonstrates clean contrast between the pavilion shell and the figure inside, turning the print into a complete scene instead of a single isolated object.",
    image: "/showcase/studio/ganesha-pavilion.png",
    details: ["Two-tone composition", "Architectural detailing", "Gift/display ready output"],
  },
];

const detailFrames = [
  {
    title: "Krishna close-up",
    image: "/showcase/studio/krishna-macro.png",
  },
  {
    title: "Shiva alternate finish",
    image: "/showcase/studio/shiva-back.png",
  },
  {
    title: "Fold lamp study",
    image: "/showcase/studio/fold-lamp.png",
  },
  {
    title: "Ganesha detail frame",
    image: "/showcase/studio/ganesha-closeup.png",
  },
];

const process = [
  {
    icon: Layers3,
    title: "We prototype in context",
    body:
      "The product is judged as an object in a room, on a desk, or in a customer’s hand, not just on the build plate.",
  },
  {
    icon: Shield,
    title: "We review before we promise",
    body:
      "Every part moves through a material and geometry check so the quote reflects the real production path rather than a blind upload.",
  },
  {
    icon: Clock3,
    title: "We keep the loop tight",
    body:
      "Fast iteration matters, but the point is calm progress. The output should be cleaner, more usable, and closer to the intended object each round.",
  },
];

export default function AboutPage() {
  const founder = teamMembers.find((member) => member.isFounder);
  const founderBioSections = founder ? founder.bio.split("\n\n").slice(0, 2) : [];

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <section className="luxury-panel relative overflow-hidden rounded-[2.45rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.14),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(125,211,199,0.12),transparent_24%)]" />
          <div className="grid gap-10 px-6 py-9 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-11">
            <div className="relative z-10 flex flex-col justify-between gap-8">
              <div className="editorial-stage-copy space-y-5">
                <span className="luxury-kicker">About AKAAR</span>
                <p className="editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
                <h1 className="display-font text-[clamp(2.9rem,5vw,5rem)] leading-[0.94] text-[var(--text-primary)]">
                  A working studio turning experimental prints into believable products.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  AKAAR is not a made-up manufacturing brand with placeholder renders. The work comes out of an actual desktop setup, real machines, real lighting experiments, and repeated product studies until the object feels resolved.
                </p>
                <p className="editorial-eyebrow">Jaipur studio · Product studies · Review-led manufacturing</p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/quote">
                  <Button size="lg">
                    Start a Build
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    View Collection
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-5">
              <div className="luxury-stage relative min-h-[390px] overflow-hidden rounded-[2rem] border border-white/8 p-5">
                <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">Studio environment</div>
                <div className="editorial-media-frame absolute inset-x-5 bottom-5 top-16">
                  <img
                    src="/showcase/studio/workspace-setup.png"
                    alt="AKAAR workspace setup"
                    className="hero-image-shadow"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.05)_0%,rgba(7,7,10,0.32)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
                  {studioMetrics.map((metric) => (
                    <div key={metric.label} className="bg-[rgba(11,12,15,0.78)] px-5 py-4 backdrop-blur-md">
                      <p className="luxury-metric-label text-white/42">{metric.label}</p>
                      <p className="mt-2 text-sm font-medium text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="luxury-card rounded-[2rem] p-6 sm:p-7">
            <span className="luxury-kicker">How the brand is built</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              The process starts with objects that deserve to exist outside the slicer.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              AKAAR works from a real desk in Jaipur — not a render farm or a generic print shop. Each product is developed as a physical object that needs to perform in a room, hold up under repeated use, and feel resolved when it arrives.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {process.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-5">
                  <item.icon className="h-5 w-5 text-[var(--accent)]" />
                  <h3 className="display-font mt-4 text-2xl text-[var(--text-primary)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="luxury-card overflow-hidden rounded-[2rem]">
            <div className="grid gap-px bg-[var(--border)]">
              <div className="luxury-stage relative min-h-[280px] overflow-hidden p-5">
                <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">Planter family</div>
                <div className="editorial-media-frame absolute inset-x-5 bottom-5 top-16">
                  <img
                    src="/showcase/studio/planter-lineup.png"
                    alt="AKAAR planter lineup"
                    className="hero-image-shadow"
                  />
                </div>
              </div>
              <div className="bg-[var(--bg-secondary)] px-6 py-6">
                <p className="luxury-kicker">Studio proof</p>
                <h3 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Objects tested on the desk they are meant to live on.</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  This is the difference between “we can print things” and “we are shaping a product language.” The lineup shot proves the work is being developed as a repeatable family, not as a one-off lucky print.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">Real output</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Work built to live in the world, not just to finish printing.
            </h2>
          </div>

          <div className="space-y-6">
            {showcaseProjects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08 }}
                className="luxury-card overflow-hidden rounded-[2.2rem]"
              >
                <div className="grid gap-px bg-[var(--border)] lg:grid-cols-2">
                  <div className={`${index % 2 === 0 ? "order-1" : "order-2"} bg-[var(--bg-secondary)] px-6 py-7 sm:px-8`}>
                    <span className="luxury-kicker">{project.category}</span>
                    <h3 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
                      {project.description}
                    </p>

                    <div className="mt-8 grid gap-px overflow-hidden rounded-[1.6rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                      {project.details.map((detail) => (
                        <div key={detail} className="bg-[var(--bg-primary)] px-4 py-4">
                          <p className="luxury-metric-label">Detail</p>
                          <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${index % 2 === 0 ? "order-2" : "order-1"} luxury-stage relative min-h-[320px] overflow-hidden p-5 ${project.mediaMode === "portrait-stage" ? "flex items-center justify-center" : ""}`}>
                    <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">{project.category}</div>
                    <div
                      className={
                        project.mediaMode === "portrait-stage"
                          ? "editorial-media-frame relative z-10 aspect-[4/5] w-full max-w-[360px] bg-[linear-gradient(180deg,#dfe6f5_0%,#c8d2e8_60%,#b7c3dd_100%)] p-6"
                          : "editorial-media-frame absolute inset-x-5 bottom-5 top-16"
                      }
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`hero-image-shadow ${project.mediaMode === "portrait-stage" ? "object-contain object-center" : ""}`}
                      />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.04)_0%,rgba(7,7,10,0.28)_100%)]" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="luxury-card rounded-[2.1rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">Detail frames</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Smaller shots do the credibility work.
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              Close-ups, alternate angles, and real-environment images make the studio feel trustworthy. These frames show finish, scale, and object character without needing extra explanation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {detailFrames.map((frame) => (
              <article key={frame.title} className="luxury-card overflow-hidden rounded-[1.7rem]">
                <div className="luxury-stage relative aspect-[4/5] overflow-hidden p-4">
                  <div className="editorial-media-frame h-full w-full rounded-[1.35rem]">
                    <img
                      src={frame.image}
                      alt={frame.title}
                      className="hero-image-shadow"
                    />
                  </div>
                </div>
                <div className="border-t border-[var(--border)] px-5 py-4">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{frame.title}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="mb-8 max-w-2xl"
          >
            <span className="luxury-kicker">Leadership</span>
            <h2 className="display-font mt-4 max-w-[12ch] text-3xl leading-[1.02] text-[var(--text-primary)] sm:text-4xl">
              The people behind the studio.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Every project involves direct collaboration with the founder and team. No handoffs, no blind production queues — each build request goes through the same people who designed the output process.
            </p>
          </motion.div>

          {founder ? (
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55 }}
              className="mb-6 luxury-card overflow-hidden rounded-[2rem]"
            >
              <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.74fr_1.26fr]">
                <div className="relative min-h-[320px] overflow-hidden bg-[var(--bg-secondary)] lg:min-h-[100%]">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="bg-[var(--bg-secondary)] px-6 py-7 sm:px-7 lg:px-8">
                  <span className="luxury-kicker">Founder preview</span>
                  <h2 className="display-font mt-3 text-3xl leading-none text-[var(--text-primary)] sm:text-4xl">
                    {founder.name}
                  </h2>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--accent)]">
                    {founder.domain}
                  </p>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    AKAAR exists because Akash set out to remove the friction between ambition and manufacturing. The business model, storefront, quote flow, and product direction all stem from that same founder thesis: hardware creation should feel composed, transparent, and fast enough to keep momentum alive.
                  </p>
                  <div className="mt-6 space-y-4">
                    <p className="rounded-[1.35rem] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      {founder.founderVision}
                    </p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {founderBioSections.map((section) => (
                        <p key={section.slice(0, 32)} className="text-sm leading-7 text-[var(--text-secondary)]">
                          {section}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 grid gap-px overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                    <LeaderMetric label="Leads" value="Product strategy and company direction" />
                    <LeaderMetric label="Built" value="Storefront, quote flow, and platform systems" />
                    <LeaderMetric label="Connects" value="Software discipline with physical production" />
                  </div>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {founder.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[var(--border-accent)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link
                    href="/team"
                    className="luxury-link mt-7"
                  >
                    Open team page
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-3">
            {teamMembers.map((member) => (
              <Link key={member.slug} href={member.isFounder ? "/team" : `/team/${member.slug}`} className="luxury-card rounded-[1.7rem] p-5">
                <p className="luxury-metric-label">{member.isFounder ? "Founder" : "Leadership"}</p>
                <p className="mt-4 display-font text-2xl text-[var(--text-primary)]">{member.name}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--accent)]">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{member.domain}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="luxury-panel overflow-hidden rounded-[2.2rem] px-6 py-8 text-center sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {["Real studio", "Real products", "Review-led production", "Pan-India delivery"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <CheckCircle className="h-4 w-4 text-[var(--accent)]" />
                  {item}
                </span>
              ))}
            </div>
            <span className="luxury-kicker">Next step</span>
            <p className="mt-3 editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Bring the next object into the studio.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              If you already know what the part needs to do, move straight into a reviewed build request. If not, use the collection as a reference and start from there.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/quote">
                <Button size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start a Build
                </Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" size="lg">
                  <Users className="mr-2 h-4 w-4" />
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function LeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--bg-primary)] px-4 py-4">
      <p className="luxury-metric-label">{label}</p>
      <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
