import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProductsShowcase />
      <CTASection />
    </>
  );
}
