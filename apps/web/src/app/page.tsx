import { MainLayout } from "@/components/layout/main-layout";
import { HeroSection } from "@/features/home/components/hero-section";
import { CategoriesSection } from "@/features/home/components/categories-section";
import { FeaturesSection } from "@/features/home/components/features-section";
import { FeaturedProducts } from "@/features/home/components/featured-products";
import { AIFeaturesSection } from "@/features/home/components/ai-features-section";
import { CTASection } from "@/features/home/components/cta-section";
import { AboutSection } from "@/features/home/components/about-section";

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <CategoriesSection />
      <FeaturesSection />
      <FeaturedProducts />
      <AboutSection />
      {/* <AIFeaturesSection /> */}
      <CTASection />
    </MainLayout>
  );
}
