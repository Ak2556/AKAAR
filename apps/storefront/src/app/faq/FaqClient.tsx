"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { faqs, faqCategories as categories } from "./faq-data";

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
    <div className="min-h-screen animate-fade-in pt-32 pb-20">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <span className="text-[var(--accent)] font-mono text-sm uppercase tracking-wider">
              Support
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="text-lg text-[var(--text-secondary)]">
              Find answers to common questions about our services, materials, and processes.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search & Filters */}
        <div className="mb-12">
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
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-muted)]">
                No questions found matching your search.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-[var(--border)] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <span className="font-medium pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-[var(--accent)] flex-shrink-0 transition-transform duration-200 ${
                        openIndex === index ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-out ${
                      openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-[var(--text-secondary)]">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 p-8 border border-[var(--border)] rounded-xl bg-[var(--bg-secondary)] max-w-3xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-14 h-14 border border-[var(--accent)]/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-7 h-7 text-[var(--accent)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
              <p className="text-[var(--text-secondary)]">
                Can&apos;t find what you&apos;re looking for? Our team is here to help.
              </p>
            </div>
            <Link href="/contact">
              <Button variant="primary">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
