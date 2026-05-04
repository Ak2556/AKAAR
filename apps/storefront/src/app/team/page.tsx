"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { teamMembers } from "@/lib/team-data";
import { BRAND_TAGLINE } from "@/lib/brand";

export default function TeamPage() {
  const founder = teamMembers.find((member) => member.isFounder);
  const coreTeam = teamMembers.filter((member) => !member.isFounder);
  const founderBioSections = founder ? founder.bio.split("\n\n").slice(0, 2) : [];

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-14">
        <section className="luxury-panel relative overflow-hidden rounded-[2.35rem]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(214,178,114,0.14),transparent_28%),radial-gradient(circle_at_84%_22%,rgba(125,211,199,0.1),transparent_24%)]" />
          <div className="relative z-10 grid gap-10 px-6 py-9 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-11">
            <div className="space-y-5">
              <span className="luxury-kicker">Team AKAAR</span>
              <p className="editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
              <h1 className="display-font max-w-[11ch] text-[clamp(2.9rem,4.8vw,4.9rem)] leading-[0.96] text-[var(--text-primary)]">
                The people building the studio, systems, and production logic behind AKAAR.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                This page keeps the team in one dedicated place: founder context, operating roles, and the individual people responsible for turning ideas into finished output.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                {["Founder-led direction", "Hardware operations", "Design review", "Operations and unit economics"].map((item) => (
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
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
            className="luxury-card overflow-hidden rounded-[2rem]"
          >
            <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.74fr_1.26fr]">
              <div className="relative min-h-[360px] overflow-hidden bg-[var(--bg-secondary)]">
                <img
                  src={founder.image}
                  alt={founder.name}
                  className="h-full w-full object-cover object-center"
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
                <Link href={`/team/${founder.slug}`} className="luxury-link mt-7">
                  Read founder story
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.section>
        ) : null}

        <section>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45 }}
            className="mb-5 max-w-2xl"
          >
            <p className="luxury-kicker">Leadership bench</p>
            <h2 className="display-font mt-4 max-w-[12ch] text-3xl leading-[1.02] text-[var(--text-primary)] sm:text-4xl">
              Each team member gets space to stand on their own.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              Instead of compressing everyone into the About page, the team now reveals here one by one with room for role context, operating focus, and a fuller biography.
            </p>
          </motion.div>

          <div className="space-y-5">
            {coreTeam.map((member, index) => {
              const memberBioSections = member.bio.split("\n\n").slice(0, 2);
              const isHarish = member.slug === "harish-kumar-meena";

              return (
                <motion.div
                  key={member.slug}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.45, delay: index * 0.07 }}
                >
                  <Link href={`/team/${member.slug}`} className="luxury-card group block overflow-hidden rounded-[1.8rem]">
                    <div className="grid gap-px bg-[var(--border)] lg:grid-cols-[0.34fr_0.66fr]">
                      <div className="relative min-h-[320px] overflow-hidden bg-[var(--bg-secondary)]">
                        <img
                          src={member.image}
                          alt=""
                          aria-hidden="true"
                          className={`absolute inset-0 h-full w-full scale-110 object-cover ${isHarish ? "object-center opacity-32 blur-3xl" : "object-center opacity-45 blur-2xl"}`}
                        />
                        <div
                          className={`absolute inset-0 ${
                            isHarish
                              ? "bg-[radial-gradient(circle_at_50%_16%,rgba(255,255,255,0.18),transparent_20%),linear-gradient(180deg,rgba(10,10,12,0.04)_0%,rgba(10,10,12,0.16)_100%)]"
                              : "bg-[linear-gradient(180deg,rgba(10,10,12,0.02)_0%,rgba(10,10,12,0.12)_100%)]"
                          }`}
                        />
                        <img
                          src={member.image}
                          alt={member.name}
                          className={`relative z-10 h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${isHarish ? "object-cover object-top scale-[1.01]" : "object-contain object-bottom"}`}
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
                </motion.div>
              );
            })}
          </div>
        </section>

        <section className="luxury-panel overflow-hidden rounded-[2.1rem] px-6 py-8 text-center sm:px-8 lg:px-10">
          <div className="mx-auto max-w-3xl">
            <span className="luxury-kicker">Next step</span>
            <p className="mt-3 editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
            <h2 className="display-font mt-4 text-4xl text-[var(--text-primary)] sm:text-5xl">
              Build with the team behind the studio.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              If the work, process, and people align with what you need, move into a reviewed build request and we’ll take it from there.
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
