"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-[var(--text-muted)] mb-12">
            Last updated: January 2025
          </p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                1. Acceptance of Terms
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                By accessing or using Akaar's website and services, you agree to be bound
                by these Terms of Service. If you do not agree to these terms, please do
                not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                2. Services Description
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Akaar provides 3D printing, CNC machining, and rapid prototyping services.
                We manufacture custom parts based on digital files and specifications
                provided by customers. All services are subject to technical feasibility
                and material availability.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                3. Orders and Payments
              </h2>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>All orders are subject to acceptance and confirmation</li>
                <li>Prices are quoted in USD and may change without notice</li>
                <li>Payment is required before production begins</li>
                <li>We accept major credit cards, PayPal, and bank transfers</li>
                <li>Quotes are valid for 30 days unless otherwise specified</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                4. Intellectual Property
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You retain all intellectual property rights to your designs and 3D files.
                By submitting files, you:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Warrant that you have the right to manufacture the design</li>
                <li>Grant us license to use files solely for fulfilling your order</li>
                <li>Agree that we may retain files for quality assurance purposes</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                We will not share, sell, or reproduce your designs without explicit permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                5. Production and Quality
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We strive to deliver high-quality parts that meet specifications:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Standard tolerance is ±0.1mm unless otherwise specified</li>
                <li>Minor variations in color and finish may occur between batches</li>
                <li>We reserve the right to reject files that are technically unfeasible</li>
                <li>Design for Manufacturing (DFM) feedback is provided when applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                6. Shipping and Delivery
              </h2>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Delivery times are estimates and not guaranteed</li>
                <li>Risk of loss transfers to you upon delivery to the carrier</li>
                <li>We are not responsible for customs duties or import taxes</li>
                <li>Shipping insurance is included for all orders over $100</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                7. Returns and Refunds
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Due to the custom nature of our products:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Defective parts will be reprinted or refunded at our discretion</li>
                <li>Claims must be made within 7 days of delivery with photos</li>
                <li>We do not accept returns for parts that meet specifications</li>
                <li>Design errors are the customer's responsibility</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                8. Limitation of Liability
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Akaar's liability is limited to the purchase price of the order. We are
                not liable for indirect, incidental, consequential, or punitive damages
                arising from use of our services or products. Parts are manufactured to
                your specifications and we make no warranties regarding fitness for
                particular purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                9. Prohibited Uses
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                You may not use our services to manufacture:
              </p>
              <ul className="list-disc list-inside text-[var(--text-secondary)] space-y-2 ml-4">
                <li>Weapons or weapon components</li>
                <li>Items that infringe intellectual property rights</li>
                <li>Counterfeit goods or trademark violations</li>
                <li>Items intended for illegal purposes</li>
                <li>Products that violate export control regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                10. Account Responsibilities
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You are responsible for maintaining the confidentiality of your account
                credentials and for all activities under your account. Notify us immediately
                of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                11. Modifications
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We reserve the right to modify these terms at any time. Changes become
                effective upon posting to the website. Continued use of our services
                constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                12. Governing Law
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                These terms are governed by the laws of the State of Delaware, USA.
                Any disputes shall be resolved in the courts of Delaware.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">
                13. Contact
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                For questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 border border-[var(--border)] rounded-lg bg-[var(--bg-secondary)]">
                <p className="text-[var(--text-secondary)]">
                  Email: legal@akaar.com<br />
                  Address: 123 Innovation Drive, Tech City, TC 12345
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border)]">
            <p className="text-sm text-[var(--text-muted)]">
              See also: <Link href="/privacy" className="text-[var(--accent)] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
