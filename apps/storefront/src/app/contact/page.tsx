"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FieldBlock, MetricTile, SummaryRow } from "@/components/ui/storefront-primitives";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Project briefs, quote follow-up, and product questions",
    value: "akaar3d.printing@gmail.com",
    href: "mailto:akaar3d.printing@gmail.com",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Best for urgent order coordination during business hours",
    value: "+91 7300431301",
    href: "tel:+917300431301",
  },
  {
    icon: MapPin,
    title: "Studio",
    description: "Jaipur, Rajasthan",
    value: "9-B, 69, Block-B, Ring Road, Boorthal, Jaipur 303012",
    href: "https://maps.google.com/?q=Boorthal+Jaipur+Rajasthan+303012",
  },
];

const departments = [
  { id: "sales", label: "Sales & Quotes", detail: "Custom builds, pricing, timelines" },
  { id: "support", label: "Technical Support", detail: "File prep, print constraints, material guidance" },
  { id: "general", label: "General Inquiry", detail: "Partnerships, media, or everything else" },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    department: "general",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen px-4 pb-20 pt-28 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="luxury-card rounded-[2.2rem] px-8 py-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
              <CheckCircle className="h-10 w-10 text-[var(--accent)]" />
            </div>
            <span className="luxury-kicker mt-8 block">Message received</span>
            <h1 className="display-font mt-4 text-4xl text-[var(--text-primary)]">We&apos;ll reply with the right lane owner.</h1>
            <p className="mx-auto mt-5 max-w-2xl text-[var(--text-secondary)]">
              Your note is in. The team will route it to the right person for quotes, technical review, or studio operations and respond within one business day.
            </p>
            <Button variant="primary" className="mt-8" onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pb-16 pt-28 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="luxury-panel relative overflow-hidden rounded-[2.4rem] px-6 py-8 sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(214,178,114,0.12),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(125,211,199,0.08),transparent_26%)]" />
          <div className="relative z-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="editorial-stage-copy space-y-5">
              <span className="luxury-kicker">Contact AKAAR</span>
              <h1 className="display-font text-[clamp(2.8rem,4.8vw,4.8rem)] leading-[0.95] text-[var(--text-primary)]">
                Reach the studio without falling into a generic support loop.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--text-secondary)] sm:text-lg">
                Use this when the project needs a real response, not a support maze. Whether you are requesting a quote, checking feasibility, or discussing production, the contact experience should feel as composed as the rest of the site.
              </p>
              <p className="editorial-eyebrow">Direct routing · Quote review · Technical response</p>
            </div>

            <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="luxury-stage relative min-h-[320px] overflow-hidden rounded-[2rem] border border-white/8 p-5">
                <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">Studio context</div>
                <div className="editorial-media-frame absolute inset-x-5 bottom-5 top-16">
                  <img
                    src="/showcase/studio/workspace-setup.png"
                    alt="AKAAR studio workspace"
                    className="hero-image-shadow"
                  />
                </div>
              </div>
              <div className="grid gap-px overflow-hidden rounded-[1.8rem] border border-[var(--border)] bg-[var(--border)] lg:self-end">
                <MetricTile label="Reply window" value="Within 24 hours" />
                <MetricTile label="Handled by" value="Sales, support, or ops" />
                <MetricTile label="Best for" value="Quote and product coordination" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.href}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="luxury-card rounded-[1.9rem] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] border border-[var(--border-accent)] bg-[var(--surface-highlight)]">
                <method.icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <h2 className="display-font mt-5 text-3xl text-[var(--text-primary)]">{method.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">{method.description}</p>
              <p className="mt-5 text-sm text-[var(--text-primary)]">{method.value}</p>
            </motion.a>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.04fr_0.96fr]">
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="luxury-card rounded-[2rem] p-6 sm:p-7">
            <span className="luxury-kicker">Send a note</span>
            <h2 className="display-font mt-3 text-4xl text-[var(--text-primary)]">Choose the right conversation lane.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--text-secondary)]">
              Keep it direct. Select the lane, give the context, and the right person on the team can pick it up without extra back-and-forth.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <span className="luxury-label">Department</span>
                <div className="mt-3 grid gap-3 md:grid-cols-3">
                  {departments.map((department) => (
                    <button
                      key={department.id}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, department: department.id }))}
                      className={`rounded-[1.35rem] border px-4 py-4 text-left transition-all ${
                        formData.department === department.id
                          ? "border-[var(--accent)] bg-[var(--surface-highlight)]"
                          : "border-[var(--border)] bg-[var(--bg-secondary)] hover:border-[var(--border-accent)]"
                      }`}
                    >
                      <p className="text-sm uppercase tracking-[0.12em] text-[var(--text-primary)]">{department.label}</p>
                      <p className="mt-2 text-xs leading-6 text-[var(--text-muted)]">{department.detail}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <FieldBlock label="Name *">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="luxury-input w-full rounded-full px-5 py-3"
                  />
                </FieldBlock>
                <FieldBlock label="Email *">
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="luxury-input w-full rounded-full px-5 py-3"
                  />
                </FieldBlock>
                <FieldBlock label="Company">
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="luxury-input w-full rounded-full px-5 py-3"
                  />
                </FieldBlock>
                <FieldBlock label="Subject *">
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="luxury-input w-full rounded-full px-5 py-3"
                  />
                </FieldBlock>
                <div className="sm:col-span-2">
                  <FieldBlock label="Message *" hint="Add product context, quantity, deadline, or a quick note about what is blocking the project.">
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us what you are building and what you need from the team."
                      className="luxury-input min-h-[180px] w-full px-5 py-4"
                    />
                  </FieldBlock>
                </div>
              </div>

              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </motion.section>

          <div className="space-y-6">
            <section className="luxury-card overflow-hidden rounded-[2rem]">
              <div className="luxury-stage relative min-h-[260px] overflow-hidden p-5">
                <div className="absolute left-5 top-5 editorial-eyebrow text-white/52">Studio objects</div>
                <div className="editorial-media-frame absolute inset-x-5 bottom-5 top-16">
                  <img
                    src="/showcase/studio/planter-lineup.png"
                    alt="AKAAR planter lineup"
                    className="hero-image-shadow"
                  />
                </div>
              </div>
              <div className="border-t border-[var(--border)] px-6 py-6">
                <span className="luxury-kicker">Studio routing</span>
                <h3 className="display-font mt-3 text-3xl text-[var(--text-primary)]">Where the conversations go</h3>
                <div className="mt-5 grid gap-px overflow-hidden rounded-[1.4rem] border border-[var(--border)] bg-[var(--border)]">
                  <SummaryRow label="Sales & quotes" value="Product fit, pricing, timeline" />
                  <SummaryRow label="Technical support" value="Geometry, material, manufacturability" />
                  <SummaryRow label="Operations" value="Order coordination and delivery status" />
                </div>
              </div>
            </section>

            <section className="luxury-card rounded-[2rem] p-6">
              <span className="luxury-kicker">Quick links</span>
              <div className="mt-5 space-y-3">
                <Link href="/faq" className="flex items-center justify-between rounded-[1.3rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4 text-sm text-[var(--text-primary)] hover:border-[var(--border-accent)]">
                  <span>Accepted file formats and build prep</span>
                  <MessageSquare className="h-4 w-4 text-[var(--accent)]" />
                </Link>
                <Link href="/quote" className="flex items-center justify-between rounded-[1.3rem] border border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-4 text-sm text-[var(--text-primary)] hover:border-[var(--border-accent)]">
                  <span>Start a reviewed quote request</span>
                  <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                </Link>
              </div>
            </section>

            <section className="luxury-card rounded-[2rem] p-6">
              <span className="luxury-kicker">Business hours</span>
              <div className="mt-5 space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-[var(--accent)]" />
                  <p className="text-sm text-[var(--text-primary)]">Mon-Sat, 10:00 AM to 7:00 PM IST</p>
                </div>
                <div className="flex items-center gap-3">
                  <Building2 className="h-5 w-5 text-[var(--accent)]" />
                  <p className="text-sm leading-7 text-[var(--text-secondary)]">Jaipur-based studio serving custom builds and product orders across India.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
