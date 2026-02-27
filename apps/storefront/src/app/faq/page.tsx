"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const categories = [
  { id: "all", label: "All Questions" },
  { id: "ordering", label: "Ordering" },
  { id: "shipping", label: "Shipping" },
  { id: "materials", label: "Materials" },
  { id: "technical", label: "Technical" },
  { id: "pricing", label: "Pricing" },
];

const faqs = [
  {
    category: "ordering",
    question: "What file formats do you accept?",
    answer: "We accept a wide range of 3D file formats including STL, OBJ, STEP, IGES, 3MF, and FBX. For best results, we recommend STL or STEP files. If you have a different format, please contact us and we'll do our best to accommodate your needs.",
  },
  {
    category: "ordering",
    question: "What is the minimum order quantity?",
    answer: "There is no minimum order quantity. We accept orders starting from just 1 unit. However, for larger quantities, we offer volume discounts that can significantly reduce your per-unit cost.",
  },
  {
    category: "ordering",
    question: "How do I get a quote for my project?",
    answer: "You can get an instant quote by uploading your 3D files on our Quote page. For complex projects or custom requirements, our engineering team will review your files and provide a detailed quote within 24 hours.",
  },
  {
    category: "shipping",
    question: "How long does production take?",
    answer: "Production time depends on the complexity of your parts and the chosen manufacturing process. Typical lead times are 3-5 business days for standard orders. Rush orders with 24-48 hour turnaround are available for an additional fee.",
  },
  {
    category: "shipping",
    question: "Do you ship internationally?",
    answer: "Yes, we ship worldwide. International shipping typically takes 5-10 business days depending on the destination. We use trusted carriers like DHL, FedEx, and UPS with full tracking and insurance.",
  },
  {
    category: "shipping",
    question: "Can I track my order?",
    answer: "Absolutely! Once your order ships, you'll receive an email with tracking information. You can also track your order status through your account dashboard or by contacting our support team.",
  },
  {
    category: "materials",
    question: "What materials are available for 3D printing?",
    answer: "We offer a wide range of materials including PLA, ABS, PETG, Nylon (PA12), TPU (flexible), and various resins for SLA printing. For industrial applications, we also offer carbon fiber reinforced materials and metal printing options.",
  },
  {
    category: "materials",
    question: "How do I choose the right material?",
    answer: "Material selection depends on your application requirements. Consider factors like mechanical strength, temperature resistance, flexibility, and surface finish. Our engineering team can help recommend the best material for your specific use case.",
  },
  {
    category: "materials",
    question: "Do you offer custom colors?",
    answer: "Yes! We can produce parts in a variety of colors depending on the material. For specific color matching (Pantone, RAL), we offer painting and finishing services. Contact us with your color requirements for a custom quote.",
  },
  {
    category: "technical",
    question: "What tolerances can you achieve?",
    answer: "Our standard tolerance is ±0.1mm for most processes. For high-precision applications, we can achieve tolerances as tight as ±0.05mm with SLA or CNC machining. Please specify your tolerance requirements when requesting a quote.",
  },
  {
    category: "technical",
    question: "Can you help optimize my design for manufacturing?",
    answer: "Yes, our engineering team offers Design for Manufacturing (DFM) analysis as part of our service. We'll review your design and suggest modifications to improve printability, reduce costs, and ensure the best possible outcome.",
  },
  {
    category: "technical",
    question: "What is the maximum part size you can produce?",
    answer: "Our maximum build size varies by technology. For FDM printing, we can produce parts up to 500mm x 500mm x 500mm. For larger parts, we can print in sections and assemble. Contact us for oversized projects.",
  },
  {
    category: "pricing",
    question: "How is pricing calculated?",
    answer: "Pricing is based on several factors: material volume, complexity, surface area, chosen material, and post-processing requirements. Our instant quote system calculates this automatically. Volume discounts are available for larger orders.",
  },
  {
    category: "pricing",
    question: "Do you offer volume discounts?",
    answer: "Yes! We offer tiered pricing for larger quantities. Discounts typically start at 10+ units and increase with volume. For production runs of 100+ units, contact our sales team for custom pricing.",
  },
  {
    category: "pricing",
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For business accounts, we also offer NET 30 payment terms upon approval.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
              Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Find answers to common questions about our services, materials, and processes.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          {/* Search */}
          <div className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl focus:outline-none focus:border-[var(--accent)]"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? "bg-[var(--accent)] text-[var(--bg-primary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--accent)] border border-[var(--border)]"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl"
        >
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)]">
                No questions found matching your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border border-[var(--border)] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--accent)] flex-shrink-0 transition-transform ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-[var(--text-secondary)]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] max-w-3xl"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-14 h-14 border border-[var(--accent)]/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-[var(--text-secondary)]">
                Can't find what you're looking for? Our team is here to help.
              </p>
            </div>
            <Link href="/contact">
              <Button variant="primary">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
