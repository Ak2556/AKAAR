"use client";

import { useState } from "react";
import Link from "next/link";
import { Instagram, Linkedin, Mail, Send } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Logo } from "@/components/ui/Logo";
import { BRAND_TAGLINE } from "@/lib/brand";

const footerLinks = {
  collection: [
    { label: "All Products", href: "/products" },
    { label: "Functional Parts", href: "/products?category=functional" },
    { label: "Prototype Runs", href: "/products?category=prototype" },
    { label: "Custom Builds", href: "/quote" },
  ],
  capabilities: [
    { label: "3D Printing", href: "/services#printing" },
    { label: "DFM Review", href: "/services#design" },
    { label: "Rapid Prototyping", href: "/services#prototyping" },
    { label: "Shipping", href: "/services#logistics" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
    { label: "Settings", href: "/settings" },
  ],
};

const socialLinks = [
  { icon: Mail, href: "mailto:akaar3d.printing@gmail.com", label: "Email" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/akaar-3d-64a07240a/", label: "LinkedIn" },
  { icon: Instagram, href: "https://www.instagram.com/akaar3d.printing?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", label: "Instagram" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleNewsletterSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const subscribers = JSON.parse(localStorage.getItem("akaar-newsletter") || "[]");
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem("akaar-newsletter", JSON.stringify(subscribers));
    }

    setEmail("");
    setIsSubmitting(false);
    toast.success("Subscribed. We’ll send capability updates and release notes.");
  };

  return (
    <footer className="px-4 pb-6 pt-20 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="luxury-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-10 border-b border-[var(--border)] px-6 py-10 lg:grid-cols-[1.4fr_1fr] lg:px-10">
            <div className="space-y-5">
              <span className="luxury-kicker">Production Updates</span>
              <p className="editorial-eyebrow text-[var(--accent)]">{BRAND_TAGLINE}</p>
              <h2 className="display-font max-w-[12ch] text-[clamp(2.1rem,2.8vw,3.2rem)] leading-[1.02] text-[var(--text-primary)]">
                A quieter engineering brief for new materials, pricing logic, and launch-ready parts.
              </h2>
              <p className="max-w-xl text-[var(--text-secondary)]">
                AKAAR ships product notes for engineers, founders, and procurement teams that need clarity without the noise.
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-end lg:justify-end">
              <div className="flex-1">
                <label className="luxury-metric-label mb-2 block">Email</label>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="luxury-input w-full rounded-full px-5 py-3.5"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3.5 font-medium text-[var(--bg-primary)] transition-transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe"}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="grid gap-10 px-6 py-10 lg:grid-cols-[1.2fr_repeat(3,minmax(0,1fr))] lg:px-10">
            <div className="space-y-6">
              <Logo size="lg" showTagline />
              <p className="max-w-sm text-[var(--text-secondary)]">
                {BRAND_TAGLINE}. Launch-grade 3D printing for product teams that care about finish, lead time, and manufacturability.
              </p>
              <div className="space-y-1 text-sm text-[var(--text-muted)]">
                <p>9-B, 69, Block-B, Ring Road, Boorthal</p>
                <p>Jaipur, Rajasthan 303012</p>
                <p>+91 7300431301</p>
                <p>akaar3d.printing@gmail.com</p>
              </div>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="luxury-pill flex h-11 w-11 items-center justify-center rounded-full hover:text-[var(--text-primary)]"
                  >
                    <social.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <FooterColumn title="Collection" links={footerLinks.collection} />
            <FooterColumn title="Capabilities" links={footerLinks.capabilities} />
            <FooterColumn title="Company" links={footerLinks.company} />
          </div>

          <div className="flex flex-col gap-4 border-t border-[var(--border)] px-6 py-6 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between lg:px-10">
            <p>&copy; {new Date().getFullYear()} AKAAR. Precision parts, responsibly shipped.</p>
            <div className="flex gap-5">
              <Link href="/privacy" className="transition-colors hover:text-[var(--text-primary)]">
                Privacy
              </Link>
              <Link href="/terms" className="transition-colors hover:text-[var(--text-primary)]">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; href: string }>;
}) {
  return (
    <div>
      <p className="luxury-metric-label mb-4">{title}</p>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)]"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
