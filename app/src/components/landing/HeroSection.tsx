"use client";

import Link from "next/link";
import { ArrowRight, Gift, Shield, ChevronDown, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BeforeAfterSlider } from "./BeforeAfterSlider";
import { analytics } from "@/lib/analytics";

export function HeroSection() {
  const scrollToResults = () => {
    analytics.scrollToResults();
    document.getElementById("resultados")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCtaClick = () => {
    analytics.ctaClick("hero");
  };

  return (
    <section className="min-h-screen pt-20 pb-12 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
          {/* Text Column */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-genea-green/10 px-4 py-2 text-sm font-medium text-genea-green">
              <Gift className="h-4 w-4" />
              Primeira foto grátis
            </div>

            {/* Titles */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-ih-text leading-tight">
                Sua foto antiga pode voltar a ficar bonita
              </h1>
              <p className="text-lg md:text-xl text-ih-text-secondary leading-relaxed">
                Rasgos, manchas, rostos apagados pelo tempo. A gente traz tudo de volta em 2 minutos.
              </p>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <Link href="/start" className="inline-block w-full sm:w-auto" onClick={handleCtaClick}>
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Quero ver minha foto restaurada
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <p className="flex items-center gap-2 text-sm text-ih-text-secondary">
                <Shield className="h-4 w-4 text-genea-green" />
                Não gostou? Devolvemos seu dinheiro em 24h.
              </p>
            </div>

            {/* Secondary Link */}
            <button
              onClick={scrollToResults}
              className="flex items-center gap-2 py-2 text-genea-green hover:underline font-medium transition-colors focus:outline-none focus-visible:underline"
            >
              Ver fotos que já restauramos
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Social Proof */}
            <div className="inline-flex items-center gap-2 rounded-full bg-ih-surface-warm px-4 py-2 text-sm">
              <CheckCircle className="h-4 w-4 text-ih-positive" />
              <span className="text-ih-text-secondary">
                <span className="font-semibold text-ih-text">847 fotos</span> restauradas essa semana
              </span>
            </div>
          </div>

          {/* Image Column */}
          <div className="lg:pl-8">
            <BeforeAfterSlider
              beforeImage="https://genea-photos.s3.sa-east-1.amazonaws.com/landing/hero-old.png"
              afterImage="https://genea-photos.s3.sa-east-1.amazonaws.com/landing/hero-new.png"
              beforeAlt="Foto antiga danificada"
              afterAlt="Foto restaurada"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
