import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = buildMetadata(
  "About Our Studio | AKAAR 3D",
  "Learn how AKAAR 3D runs its Jaipur studio, from product design and FDM printing to quote review, finishing, packing, and pan-India delivery.",
  "/about"
);
import {
  ArrowRight,
  CheckCircle,
  Clock3,
  Layers3,
  Shield,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { teamMembers } from "@/lib/team-data";
import { BRAND_TAGLINE } from "@/lib/brand";

const studioMetrics = [
  { label: "Location", value: "Jaipur, Rajasthan" },
  { label: "Focus", value: "Products and custom prints" },
  { label: "Process", value: "Review, print, finish, dispatch" },
];

const principles = [
  {
    icon: Layers3,
    title: "Designed for real use",
    body: "Each part is reviewed for how it will actually be used: display, fit, strength, lighting, handling, or daily wear. That context guides material, orientation, and finish choices.",
  },
  {
    icon: Shield,
    title: "Checked before production",
    body: "We review files, wall thickness, material fit, and print direction before confirming a build. Customers get practical guidance before time or filament is committed.",
  },
  {
    icon: Clock3,
    title: "Clear updates",
    body: "The goal is a smooth path from idea to finished part: clear next steps, realistic timelines, careful packing, and direct support when a design needs adjustment.",
  },
];

const showcaseProjects = [
  {
    title: "Illuminated planter series",
    category: "Ambient product build",
    description:
      "A compact planter with integrated warm lighting, built to sit neatly on a desk or shelf. The enclosure, light position, and planter tray are developed together so the object feels complete.",
    image: "/showcase/studio/planter-lineup.png",
    details: ["Integrated lighting", "Desk-scale footprint", "Repeatable enclosure geometry"],
  },
  {
    title: "Shiva sculpt study",
    category: "Detail and finish",
    description:
      "A detailed sculpt used to test silhouette clarity, visible layer quality, and finishing choices for display pieces.",
    image: "/showcase/studio/shiva-outdoor.png",
    details: ["Clear silhouette", "Display-ready finish", "Surface detail check"],
  },
  {
    title: "Temple pavilion with Ganesha",
    category: "Multi-part composition",
    description:
      "A two-part devotional piece with a printed pavilion and separate Ganesha figure. The contrast, fit, and presentation are checked as one complete object.",
    image: "/showcase/studio/ganesha-pavilion.png",
    details: ["Two-part assembly", "Architectural detailing", "Gift and display ready"],
  },
];

const detailFrames = [
  { title: "Krishna close-up", image: "/showcase/studio/krishna-macro.png" },
  {
    title: "Lord Hanuman side close-up",
    image: "https://mpdjjxkkjuhnqcynclin.supabase.co/storage/v1/object/public/product-assets/images/1778406355498-hanuman-dhyan-mudra-2.jpg",
  },
  { title: "Ganesha detail frame", image: "/showcase/studio/ganesha-closeup.png" },
];

export default function AboutPage() {
  const founder = teamMembers.find((m) => m.isFounder);

  return (
    <div className="min-h-screen animate-fade-in px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">

        {/* Hero */}
        <section className="luxury-panel relative overflow-hidden rounded-[2.45rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.14),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(125,211,199,0.12),transparent_24%)]" />
          <div className="grid gap-10 px-6 py-9 lg:grid-cols-[0.88fr_1.12fr] lg:px-10 lg:py-11">

            <div className="relative z-10 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <span className="luxury-kicker">About AKAAR</span>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">{BRAND_TAGLINE}</p>
                <h1 className="display-font text-[clamp(2.9rem,5vw,5rem)] leading-[0.94] text-[var(--text-primary)]">
                  A Jaipur 3D printing studio for products, prototypes, and custom parts.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  AKAAR designs, prints, checks, and ships FDM parts from a real studio setup in Jaipur. We build ready-to-buy products and review custom requests so customers know what will be printed, how it will be made, and when it can ship.
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Product collection · Custom builds · Pan-India shipping
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/quote">
                  <Button size="lg">
                    Start a Build
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" size="lg">View Collection</Button>
                </Link>
              </div>
            </div>

            <div className="relative z-10">
              <div className="luxury-stage relative min-h-[390px] overflow-hidden rounded-[2rem] border border-white/8 p-5">
                <div className="absolute left-5 top-5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                  Studio environment
                </div>
                <div className="absolute inset-x-5 bottom-[5rem] top-14">
                  <Image
                    src="/showcase/studio/workspace-setup.png"
                    alt="AKAAR studio workspace"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="hero-image-shadow object-contain"
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.04)_0%,rgba(7,7,10,0.30)_100%)]" />
                <div className="absolute bottom-0 left-0 right-0 grid gap-px border-t border-white/10 bg-white/10 sm:grid-cols-3">
                  {studioMetrics.map((metric) => (
                    <div key={metric.label} className="bg-[rgba(11,12,15,0.78)] px-5 py-4 backdrop-blur-md">
                      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-white/42">{metric.label}</p>
                      <p className="mt-2 text-sm font-medium text-white">{metric.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Philosophy + proof */}
        <section className="grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="luxury-card rounded-[2rem] p-6 sm:p-7">
            <span className="luxury-kicker">How the brand is built</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              From CAD file to finished object, every step is reviewed.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              AKAAR combines product design, FDM printing, material selection, finishing checks, and packing in one workflow. The same review process supports both the shop collection and customer-submitted builds.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {principles.map((item) => (
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
                <div className="absolute left-5 top-5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                  Planter family
                </div>
                <div className="absolute inset-x-5 bottom-5 top-14">
                  <Image
                    src="/showcase/studio/planter-lineup.png"
                    alt="AKAAR planter lineup"
                    fill
                    sizes="(max-width: 1024px) 100vw, 48vw"
                    className="hero-image-shadow object-contain"
                  />
                </div>
              </div>
              <div className="bg-[var(--bg-secondary)] px-6 py-6">
                <p className="luxury-kicker">Studio proof</p>
                <h3 className="display-font mt-3 text-3xl text-[var(--text-primary)]">
                  Product ideas are tested as physical objects before they reach the shop.
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  We check size, stability, finish, light placement, and everyday handling before treating a design as a sellable product.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase */}
        <section>
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">Real output</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Studio work that shows the range of what we build.
            </h2>
          </div>

          <div className="space-y-6">
            {showcaseProjects.map((project, index) => (
              <article
                key={project.title}
                className="luxury-card animate-fade-in-up overflow-hidden rounded-[2.2rem]"
                style={{ animationDelay: `${index * 0.08}s` }}
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

                  <div className={`${index % 2 === 0 ? "order-2" : "order-1"} luxury-stage relative min-h-[320px] overflow-hidden p-5`}>
                    <div className="absolute left-5 top-5 text-[10px] font-medium uppercase tracking-[0.18em] text-white/50">
                      {project.category}
                    </div>
                    <div className="absolute inset-x-5 bottom-5 top-14">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="hero-image-shadow object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,7,10,0.04)_0%,rgba(7,7,10,0.28)_100%)]" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Detail gallery */}
        <section className="luxury-card rounded-[2.1rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="mb-8 max-w-3xl">
            <span className="luxury-kicker">Detail frames</span>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Close-up views show finish, scale, and detail.
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              We photograph products from multiple angles so customers can understand surface quality, proportions, and display presence before ordering.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {detailFrames.map((frame, i) => (
              <article
                key={frame.title}
                className="luxury-card animate-fade-in-up overflow-hidden rounded-[1.7rem]"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className="luxury-stage relative aspect-[4/5] overflow-hidden p-4">
                  <div className="absolute inset-4 overflow-hidden rounded-[1.35rem]">
                    <Image
                      src={frame.image}
                      alt={frame.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="hero-image-shadow object-contain"
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

        {/* Founder */}
        <section>
          <div className="mb-8 max-w-2xl">
            <span className="luxury-kicker">Leadership</span>
            <h2 className="display-font mt-4 text-3xl leading-[1.02] text-[var(--text-primary)] sm:text-4xl">
              The people behind the studio.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              AKAAR is a small team, so customers are not passed through a faceless production queue. Product direction, file review, printing, procurement, and dispatch are handled by the people listed here.
            </p>
          </div>

          {founder && (
            <div className="mb-6 luxury-card overflow-hidden rounded-[2rem]">
              <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.74fr_1.26fr]">
                <div className="relative min-h-[320px] overflow-hidden bg-[var(--bg-secondary)] lg:min-h-full">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 30vw"
                    className="object-cover object-center"
                  />
                </div>
                <div className="bg-[var(--bg-secondary)] px-6 py-7 sm:px-7 lg:px-8">
                  <span className="luxury-kicker">Founder</span>
                  <h2 className="display-font mt-3 text-3xl leading-none text-[var(--text-primary)] sm:text-4xl">
                    {founder.name}
                  </h2>
                  <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--accent)]">
                    {founder.role}
                  </p>
                  <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                    AKAAR exists to make 3D printing easier to understand and easier to order. Akash leads the product direction and builds the software systems behind the storefront, quote flow, and customer experience.
                  </p>

                  <div className="mt-5 rounded-[1.35rem] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
                    <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      <span className="text-[var(--text-muted)]">&ldquo;</span>{founder.founderVision}<span className="text-[var(--text-muted)]">&rdquo;</span>
                    </p>
                  </div>

                  <div className="mt-6 grid gap-px overflow-hidden rounded-[1.35rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-3">
                    {[
                      { label: "Leads", value: "Product strategy and company direction" },
                      { label: "Built", value: "Storefront, quote flow, and platform systems" },
                      { label: "Connects", value: "Software discipline with physical production" },
                    ].map((m) => (
                      <div key={m.label} className="bg-[var(--bg-primary)] px-4 py-4">
                        <p className="luxury-metric-label">{m.label}</p>
                        <p className="mt-2 text-sm font-medium text-[var(--text-primary)]">{m.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {founder.skills.slice(0, 5).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-[var(--border-accent)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <Link href="/team" className="luxury-link mt-7">
                    Open team page
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            {teamMembers.map((member) => (
              <Link
                key={member.slug}
                href={member.isFounder ? "/team" : `/team/${member.slug}`}
                className="luxury-card rounded-[1.7rem] p-5"
              >
                <p className="luxury-metric-label">{member.isFounder ? "Founder" : "Leadership"}</p>
                <p className="display-font mt-4 text-2xl text-[var(--text-primary)]">{member.name}</p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">{member.role}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{member.domain}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="luxury-panel overflow-hidden rounded-[2.2rem] px-6 py-10 text-center sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex flex-wrap justify-center gap-3">
              {["Real studio", "Real products", "Review-led production", "Pan-India delivery"].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                >
                  <CheckCircle className="h-3.5 w-3.5 text-[var(--accent)]" />
                  {item}
                </span>
              ))}
            </div>
            <span className="luxury-kicker">Next step</span>
            <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--accent)]">{BRAND_TAGLINE}</p>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Bring the next object into the studio.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              Browse the product collection for ready-to-ship objects, or send a file for a reviewed custom build when you need something specific.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/quote">
                <Button size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start a Build
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="lg">Explore Collection</Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
