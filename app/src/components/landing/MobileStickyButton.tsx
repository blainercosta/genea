"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

export function MobileStickyButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isPricingVisible, setIsPricingVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      const scrolled = window.scrollY > 400;
      setIsVisible(scrolled);

      // Check if pricing section is visible
      const pricingSection = document.getElementById("precos");
      if (pricingSection) {
        const rect = pricingSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsPricingVisible(isInView);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const shouldShow = isVisible && !isPricingVisible;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-t from-white via-white to-transparent md:hidden transition-transform duration-300",
        shouldShow ? "translate-y-0" : "translate-y-full"
      )}
    >
      <Link href="/try" className="block" onClick={() => analytics.ctaClick("mobile_sticky")}>
        <Button size="lg" className="w-full shadow-lg">
          Testar Grátis
        </Button>
      </Link>
    </div>
  );
}
