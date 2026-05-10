import Image from "next/image";
import Link from "next/link";
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
  { label: "Studio mode", value: "Real desk, real setup" },
  { label: "Output", value: "Functional and decorative" },
  { label: "Workflow", value: "Review before production" },
];

const principles = [
  {
    icon: Layers3,
    title: "Prototyped in context",
    body: "The product is judged as an object in a room — on a desk, shelf, or in a customer's hand. Context shapes every geometry decision before production begins.",
  },
  {
    icon: Shield,
    title: "Reviewed before promised",
    body: "Every part moves through a material and geometry check so the quote reflects the real production path, not a blind estimate from a file weight.",
  },
  {
    icon: Clock3,
    title: "Fast loops, calm output",
    body: "Fast iteration matters, but the point is calm progress. Each revision should be cleaner, more usable, and closer to the intended object.",
  },
];

const showcaseProjects = [
  {
    title: "Illuminated planter series",
    category: "Ambient product build",
    description:
      "A soft-lit planter built as a product object — not a print sample. Shape, glow, and desktop placement are resolved together, not as separate decisions.",
    image: "/showcase/studio/planter-lineup.png",
    details: ["Lighting-led form", "Desk-scale object", "Repeatable enclosure geometry"],
  },
  {
    title: "Shiva sculpt study",
    category: "Detail and finish",
    description:
      "A character piece demonstrating form fidelity, surface handling, and how a strong presentation shot makes the object feel finished rather than raw.",
    image: "/showcase/studio/shiva-outdoor.png",
    details: ["Fine silhouette retention", "Strong outdoor staging", "Showpiece-grade finish"],
  },
  {
    title: "Temple pavilion with Ganesha",
    category: "Multi-part composition",
    description:
      "Clean contrast between the pavilion shell and the figure inside — turning the print into a complete scene rather than a single isolated object.",
    image: "/showcase/studio/ganesha-pavilion.png",
    details: ["Two-tone composition", "Architectural detailing", "Gift and display ready"],
  },
];

const detailFrames = [
  { title: "Krishna close-up", image: "/showcase/studio/krishna-macro.png" },
  { title: "Shiva alternate angle", image: "/showcase/studio/shiva-back.png" },
  { title: "Fold lamp study", image: "/showcase/studio/fold-lamp.png" },
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
                  A working studio turning experimental prints into believable products.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                  AKAAR is not a made-up manufacturing brand with placeholder renders. The work comes out of an actual desktop setup in Jaipur — real machines, real lighting experiments, and repeated product studies until the object feels resolved.
                </p>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  Jaipur studio · Product studies · Review-led manufacturing
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/quote">
                  <Button size="lg">
                    Start a Build
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/products">
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
              Objects that deserve to exist outside the slicer.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--text-secondary)]">
              AKAAR works from a real desk in Jaipur — not a render farm or a generic print shop. Each product is developed as a physical object that needs to perform in a room, hold up under repeated use, and feel resolved when it arrives.
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
                  Objects tested on the desk they are meant to live on.
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">
                  The lineup shot proves the work is being developed as a repeatable family — not as one-off lucky prints. This is the difference between "we can print things" and "we are shaping a product language."
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
              Built to live in the world, not just to finish printing.
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
              Smaller shots do the credibility work.
            </h2>
            <p className="mt-4 text-[var(--text-secondary)]">
              Close-ups, alternate angles, and real-environment shots show finish, scale, and object character without needing explanation.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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
              Every build involves direct collaboration with the founder and team. No handoffs, no blind production queues — each request goes through the same people who designed the output process.
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
                    AKAAR exists because Akash set out to remove the friction between ambition and manufacturing. The storefront, quote flow, and product direction all stem from the same thesis: hardware creation should feel transparent, reviewed, and fast enough to keep momentum alive.
                  </p>

                  <div className="mt-5 rounded-[1.35rem] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
                    <p className="text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                      <span className="text-[var(--text-muted)]">"</span>{founder.founderVision}<span className="text-[var(--text-muted)]">"</span>
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
                <Button variant="outline" size="lg">Explore Collection</Button>
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
