"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  Mail, Phone, MapPin, Clock, Send,
  MessageSquare, Headphones, Building2, CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 24 hours",
    value: "hello@akaar.com",
    href: "mailto:hello@akaar.com",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 9am to 6pm",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come see our facility",
    value: "123 Innovation Drive, Tech City, TC 12345",
    href: "#",
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "When we're available",
    value: "Mon-Fri: 9AM-6PM EST",
    href: "#",
  },
];

const departments = [
  { id: "sales", label: "Sales & Quotes", icon: Building2 },
  { id: "support", label: "Technical Support", icon: Headphones },
  { id: "general", label: "General Inquiry", icon: MessageSquare },
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-8 border border-[var(--accent)] rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-[var(--accent)]" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Message Sent</h1>
            <p className="text-[var(--text-secondary)] mb-8">
              Thank you for reaching out. We've received your message and will
              get back to you within 24 hours.
            </p>
            <Button variant="primary" onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
              We Give AKAAR to Ideas
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Let's <span className="gradient-text">Connect</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Have a question or ready to give your ideas AKAAR? We're here to help.
              Reach out and let's discuss your next project.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Contact Methods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {contactMethods.map((method, index) => (
            <a
              key={method.title}
              href={method.href}
              className="group p-6 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] hover:border-[var(--accent)]/50 transition-all"
            >
              <div className="w-12 h-12 mb-4 border border-[var(--accent)]/30 rounded-lg flex items-center justify-center group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)]/10 transition-all">
                <method.icon className="w-6 h-6 text-[var(--accent)]" />
              </div>
              <h3 className="font-semibold mb-1">{method.title}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-2">
                {method.description}
              </p>
              <p className="text-sm text-[var(--accent)]">{method.value}</p>
            </a>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="border border-[var(--border)] rounded-xl p-8 bg-[var(--bg-secondary)]">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Department Selection */}
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Department
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {departments.map((dept) => (
                      <button
                        key={dept.id}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, department: dept.id }))
                        }
                        className={`p-4 border rounded-lg text-center transition-all ${
                          formData.department === dept.id
                            ? "border-[var(--accent)] bg-[var(--accent)]/10"
                            : "border-[var(--border)] hover:border-[var(--accent)]/50"
                        }`}
                      >
                        <dept.icon
                          className={`w-5 h-5 mx-auto mb-2 ${
                            formData.department === dept.id
                              ? "text-[var(--accent)]"
                              : "text-[var(--text-secondary)]"
                          }`}
                        />
                        <span className="text-sm">{dept.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project or question..."
                    className="w-full px-4 py-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--accent)] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </motion.div>

          {/* Sidebar Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Map Placeholder */}
            <div className="aspect-video border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] overflow-hidden relative">
              <div className="absolute inset-0 grid-overlay opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[var(--accent)] mx-auto mb-4" />
                  <p className="text-[var(--text-secondary)]">
                    Interactive map coming soon
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
              <h3 className="font-semibold mb-4">Frequently Asked</h3>
              <div className="space-y-3">
                <Link
                  href="/faq"
                  className="block p-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-colors"
                >
                  <p className="text-sm">What file formats do you accept?</p>
                </Link>
                <Link
                  href="/faq"
                  className="block p-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-colors"
                >
                  <p className="text-sm">How long does production take?</p>
                </Link>
                <Link
                  href="/faq"
                  className="block p-3 border border-[var(--border)] rounded-lg hover:border-[var(--accent)]/50 transition-colors"
                >
                  <p className="text-sm">Do you offer rush orders?</p>
                </Link>
              </div>
            </div>

            {/* Social Links */}
            <div className="border border-[var(--border)] rounded-xl p-6 bg-[var(--bg-secondary)]">
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "Instagram", "YouTube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 border border-[var(--border)] rounded-lg flex items-center justify-center hover:border-[var(--accent)] hover:bg-[var(--accent)]/10 transition-all"
                  >
                    <span className="text-xs text-[var(--text-muted)]">
                      {social[0]}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
