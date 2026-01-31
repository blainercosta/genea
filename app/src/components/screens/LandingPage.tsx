"use client";

import dynamic from "next/dynamic";
import {
  Navbar,
  HeroSection,
  ProblemSection,
  ResultsSection,
  MobileStickyButton,
} from "@/components/landing";

// Lazy load below-the-fold sections
const GenealogySection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.GenealogySection }))
);
const HowItWorksSection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.HowItWorksSection }))
);
const FounderSection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.FounderSection }))
);
const PricingSection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.PricingSection }))
);
const TestimonialsSection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.TestimonialsSection }))
);
const FAQSection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.FAQSection }))
);
const FinalCTASection = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.FinalCTASection }))
);
const Footer = dynamic(() =>
  import("@/components/landing").then((m) => ({ default: m.Footer }))
);

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
