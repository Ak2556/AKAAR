"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
            Legal
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
            Privacy Policy
          </h1>
          <p className="text-[var(--text-muted)] mb-12">
            Last updated: January 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                1. Introduction
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Akaar ("we," "our," or "us") is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and safeguard
                your information when you visit our website or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                2. Information We Collect
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We may collect information about you in various ways:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Personal data you provide (name, email, phone, address)</li>
                <li>Payment information (processed securely through our payment providers)</li>
                <li>3D files and design specifications you upload</li>
                <li>Communication records (emails, chat messages, support tickets)</li>
                <li>Usage data (pages visited, time spent, interactions)</li>
                <li>Device information (browser type, IP address, operating system)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                3. How We Use Your Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Communicate with you about your projects</li>
                <li>Provide customer support</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Improve our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                4. Information Sharing
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Service providers who assist in our operations</li>
                <li>Payment processors for secure transactions</li>
                <li>Shipping carriers to deliver your orders</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                5. Data Security
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We implement appropriate technical and organizational measures to protect
                your personal information against unauthorized access, alteration, disclosure,
                or destruction. This includes encryption, secure servers, and regular security
                assessments.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                6. Your Rights
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Request data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                7. Cookies
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We use cookies and similar technologies to enhance your browsing experience,
                analyze website traffic, and personalize content. You can control cookie
                preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                8. Third-Party Links
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible
                for the privacy practices of these external sites. We encourage you to review
                their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                9. Children's Privacy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Our services are not directed to individuals under 18 years of age. We do not
                knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                10. Changes to This Policy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of
                any changes by posting the new policy on this page and updating the "Last
                updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                11. Contact Us
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
              </p>
              <div className="mt-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]">
                <p className="text-[var(--text-secondary)]">
                  Email: privacy@akaar.com<br />
                  Address: 123 Innovation Drive, Tech City, TC 12345
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)]">
              See also: <Link href="/terms" className="text-[var(--accent)] hover:underline">Terms of Service</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
