import { HeroSection } from "@/components/sections/HeroSection";
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
