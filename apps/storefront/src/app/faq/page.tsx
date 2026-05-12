import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { faqs } from "./faq-data";
import FaqClient from "./FaqClient";

export const metadata: Metadata = buildMetadata(
  "FAQ — Frequently Asked Questions | AKAAR 3D",
  "Answers to common questions about file formats, materials, shipping, lead times, and pricing at AKAAR 3D studio in Jaipur.",
  "/faq"
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqClient />
    </>
  );
}
