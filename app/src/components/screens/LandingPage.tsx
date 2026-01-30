"use client";

import {
  Navbar,
  HeroSection,
  ProblemSection,
  ResultsSection,
  GenealogySection,
  HowItWorksSection,
  FounderSection,
  PricingSection,
  TestimonialsSection,
  FAQSection,
  FinalCTASection,
  Footer,
  MobileStickyButton,
} from "@/components/landing";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-ih-bg">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <ResultsSection />
      <GenealogySection />
      <HowItWorksSection />
      <FounderSection />
      <PricingSection />
      <TestimonialsSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
      <MobileStickyButton />
      {/* Spacer for sticky CTA on mobile */}
      <div className="h-20 md:hidden" />
    </div>
  );
}
