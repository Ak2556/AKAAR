import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { HeroSection } from "@/components/sections/HeroSection";

export const metadata: Metadata = buildMetadata(
  "AKAAR 3D — 3D Printing Studio in Jaipur",
  "Upload your CAD file, pick a material, and get a reviewed quote within 48 hours. PLA, ABS, TPU, PETG — Jaipur studio shipping across India.",
  "/"
);
import { PrinterShowcaseSection } from "@/components/sections/PrinterShowcaseSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PrinterShowcaseSection />
      <ServicesSection />
      <ProductsShowcase />
      <CTASection />
    </>
  );
}
