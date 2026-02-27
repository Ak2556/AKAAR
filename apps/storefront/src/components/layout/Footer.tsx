"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Github, Twitter, Linkedin, Mail, Send } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const footerLinks = {
  products: [
    { label: "All Products", href: "/products" },
    { label: "Custom Prints", href: "/products?category=custom" },
    { label: "Prototypes", href: "/products?category=prototypes" },
    { label: "Production", href: "/products?category=production" },
  ],
  services: [
    { label: "3D Printing", href: "/services#printing" },
    { label: "Design Services", href: "/services#design" },
    { label: "Rapid Prototyping", href: "/services#prototyping" },
    { label: "Mass Production", href: "/services#production" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Get a Quote", href: "/quote" },
    { label: "Settings", href: "/settings" },
  ],
};

const socialLinks = [
  { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: "mailto:hello@akaar.com", label: "Email" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call and store in localStorage
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Store subscriber in localStorage
    const subscribers = JSON.parse(localStorage.getItem("akaar-newsletter") || "[]");
    if (!subscribers.includes(email)) {
      subscribers.push(email);
      localStorage.setItem("akaar-newsletter", JSON.stringify(subscribers));
    }

    setIsSubmitting(false);
    setEmail("");
    toast.success("Thanks for subscribing! We'll keep you updated.");
  };

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      {/* Newsletter Section */}
      <div className="border-b border-[var(--border)]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold mb-2">Engineering Updates</h3>
              <p className="text-[var(--text-secondary)]">
                New materials, capability expansions, and technical insights.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 md:w-80 px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-[var(--accent)] text-[var(--bg-primary)] font-medium rounded-lg hover:bg-[var(--accent)]/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.svg"
                alt="Akaar 3D Printing Solutions"
                width={180}
                height={54}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-[var(--text-muted)] text-sm italic mb-4">We Give AKAAR to Ideas</p>
            <p className="text-[var(--text-secondary)] max-w-sm mb-6">
              Frictionless 3D printing for engineers and hardware startups.
              From CAD to physical part in days.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">
              Products
            </h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-[var(--text-primary)] mb-4 text-sm uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-muted)] text-sm">
            &copy; {new Date().getFullYear()} Akaar. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
