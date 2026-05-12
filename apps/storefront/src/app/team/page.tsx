import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";

export const metadata: Metadata = buildMetadata(
  "Our Team | AKAAR 3D",
  "Meet the four people running AKAAR 3D from Jaipur — covering engineering, design, manufacturing, and fulfilment.",
  "/team"
);
import { Button } from "@/components/ui/Button";
import { teamMembers } from "@/lib/team-data";
import { BRAND_TAGLINE } from "@/lib/brand";

export default function TeamPage() {
  const founder = teamMembers.find((member) => member.isFounder);
  const coreTeam = teamMembers.filter((member) => !member.isFounder);
  const founderBioSections = founder ? founder.bio.split("\n\n").slice(0, 2) : [];

  return (
    <div className="min-h-screen animate-fade-in px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <section className="luxury-panel relative overflow-hidden rounded-[2.35rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.14),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(125,211,199,0.1),transparent_24%)]" />
          <div className="relative z-10 grid gap-10 px-6 py-9 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-11">
            <div className="space-y-5">
              <span className="luxury-kicker">Team AKAAR</span>
              <p className="editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
              <h1 className="display-font max-w-[11ch] text-[clamp(2.9rem,4.8vw,4.9rem)] leading-[0.96] text-[var(--text-primary)]">
                Four people running one studio in Jaipur.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                Akash, Mohit, Harish, and Tarveen. Between them they cover software, design review, hardware, and operations — everything that goes into getting your part made and shipped.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["Product & software", "CAD & file review", "Hardware & machines", "Operations & fulfillment"].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--border-accent)] px-4 py-2 text-sm text-[var(--text-secondary)]"
                  >
                    <CheckCircle className="h-4 w-4 text-[var(--accent)]" />
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-px overflow-hidden rounded-[1.9rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              {teamMembers.map((member) => (
                <div key={member.slug} className="bg-[var(--bg-secondary)] px-5 py-5">
                  <p className="luxury-metric-label">{member.isFounder ? "Founder" : "Leadership"}</p>
                  <p className="mt-3 display-font text-2xl text-[var(--text-primary)]">{member.name}</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--accent)]">{member.role}</p>
                  <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{member.domain}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {founder ? (
          <section className="luxury-card overflow-hidden rounded-[2rem]">
            <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.74fr_1.26fr]">
              <div className="relative min-h-[360px] overflow-hidden bg-[var(--bg-secondary)]">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>
              <div className="bg-[var(--bg-secondary)] px-6 py-7 sm:px-7 lg:px-8">
                <span className="luxury-kicker">Founder spotlight</span>
                <h2 className="display-font mt-3 text-3xl leading-none text-[var(--text-primary)] sm:text-4xl">
                  {founder.name}
                </h2>
                <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[var(--accent)]">
                  {founder.domain}
                </p>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
                  Akash built the platform you're using — the quote system, the storefront, and the admin tools. He runs product direction and connects the software side of the studio with the physical production side.
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
                <Link href={`/team/${founder.slug}`} className="luxury-link mt-7">
                  Read founder story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <div className="mb-5 max-w-2xl">
            <p className="luxury-kicker">The team</p>
            <h2 className="display-font mt-4 max-w-[12ch] text-3xl leading-[1.02] text-[var(--text-primary)] sm:text-4xl">
              Who handles your order.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Mohit, Harish, and Tarveen each own a distinct part of production. Here's what they do.
            </p>
          </div>

          <div className="space-y-5">
            {coreTeam.map((member, index) => {
              const memberBioSections = member.bio.split("\n\n").slice(0, 2);
              const isHarish = member.slug === "harish-kumar-meena";

              return (
                <div
                  key={member.slug}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.07}s` }}
                >
                  <Link href={`/team/${member.slug}`} className="luxury-card group block overflow-hidden rounded-[1.8rem]">
                    <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.34fr_0.66fr]">
                      <div className="relative min-h-[320px] overflow-hidden bg-[var(--bg-secondary)]">
                        <Image
                          src={member.image}
                          alt=""
                          aria-hidden="true"
                          fill
                          className={`scale-110 object-cover ${isHarish ? "object-center opacity-32 blur-3xl" : "object-center opacity-45 blur-2xl"}`}
                          sizes="(max-width: 1024px) 40vw, 25vw"
                        />
                        <div
                          className={`absolute inset-0 ${
                            isHarish
                              ? "bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,rgba(10,10,12,0.04)_0%,rgba(10,10,12,0.16)_100%)]"
                              : "bg-[linear-gradient(180deg,rgba(10,10,12,0.02)_0%,rgba(10,10,12,0.12)_100%)]"
                          }`}
                        />
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className={`z-10 transition-transform duration-500 group-hover:scale-[1.03] ${isHarish ? "object-cover object-top scale-[1.01]" : "object-contain object-bottom"}`}
                          sizes="(max-width: 1024px) 40vw, 25vw"
                        />
                      </div>
                      <div className="bg-[var(--bg-secondary)] px-5 py-5 sm:px-6 sm:py-6">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="display-font text-2xl text-[var(--text-primary)] sm:text-3xl">{member.name}</p>
                            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[var(--accent)]">{member.role}</p>
                          </div>
                          <span className="luxury-metric-label hidden sm:inline-block">0{index + 1}</span>
                        </div>
                        <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">{member.domain}</p>
                        <div className="mt-5 rounded-[1.3rem] border border-[var(--border)] bg-[var(--bg-primary)] px-5 py-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            {memberBioSections.map((section) => (
                              <p key={section.slice(0, 28)} className="text-sm leading-7 text-[var(--text-secondary)]">
                                {section}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div className="mt-5 grid gap-px overflow-hidden rounded-[1.2rem] border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
                          <div className="bg-[var(--bg-primary)] px-4 py-3">
                            <p className="luxury-metric-label">Owns</p>
                            <p className="mt-2 text-sm text-[var(--text-primary)]">{member.skills.slice(0, 2).join(" and ")}</p>
                          </div>
                          <div className="bg-[var(--bg-primary)] px-4 py-3">
                            <p className="luxury-metric-label">Focus</p>
                            <p className="mt-2 text-sm text-[var(--text-primary)]">{member.skills.slice(2, 4).join(" and ")}</p>
                          </div>
                        </div>
                        <div className="mt-5 flex flex-wrap gap-2">
                          {member.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-[var(--border-accent)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-secondary)]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        <section className="luxury-panel overflow-hidden rounded-[2.1rem] px-6 py-8 text-center sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <span className="luxury-kicker">Next step</span>
            <p className="mt-3 editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Ready to get your part made?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              Upload your file, choose a material, and we'll review it and quote you within 48 hours.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/quote">
                <Button size="lg">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Start a Build
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Return to Studio
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
