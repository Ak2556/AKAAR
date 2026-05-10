"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Clock, Award, CheckCircle, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";

const trustBadges = [
  { icon: Shield, label: "ISO 9001 Certified" },
  { icon: Clock, label: "24h Response Time" },
  { icon: Award, label: "99% Quality Rate" },
];

export function EnhancedCTA() {
  return (
    <section id="cta" className="py-20 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent-secondary)]/5" />
        <motion.div
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at center, var(--accent) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full"
              >
                <badge.icon className="w-4 h-4 text-[var(--accent)]" />
                <span className="text-sm font-medium">{badge.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Main content */}
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-full mb-6"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]" />
              </span>
              <span className="text-sm font-medium text-[var(--accent)]">
                Limited slots available this week
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Give Your Ideas <span className="gradient-text">AKAAR</span>?
            </h2>

            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              From concept to physical part in days, not weeks. Upload your CAD, get instant pricing,
              and let us bring your ideas to life with precision manufacturing.
            </p>

            {/* Features list */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-10">
              {["Instant Quotes", "24h Turnaround", "Pan-India Shipping", "Quality Guaranteed"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-[var(--accent)]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/quote">
                <Button variant="primary" size="lg" glow className="min-w-[200px]">
                  Get Instant Quote
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule a Call
                </Button>
              </Link>
            </div>

            {/* Contact info */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-[var(--text-muted)]">
              <a
                href="mailto:akaar3d.printing@gmail.com"
                className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              >
                <Mail className="w-4 h-4" />
                akaar3d.printing@gmail.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 hover:text-[var(--accent)] transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
            </div>
          </div>
        </motion.div>

        {/* Bottom accent line */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 h-px bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
        />
      </div>
    </section>
  );
}
