"use client";

import { Camera, Wand2, Download, RefreshCw } from "lucide-react";
import { useScrollAnimation } from "@/hooks";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Camera,
    title: "Tire a foto",
    description: "Use seu celular pra fotografar a foto antiga.",
  },
  {
    icon: Wand2,
    title: "Espere 2 minutos",
    description: "Nossa IA faz a mágica acontecer.",
  },
  {
    icon: Download,
    title: "Baixe pronta",
    description: "Foto restaurada em alta qualidade.",
  },
];

export function HowItWorksSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();
  const { ref: noteRef, isVisible: noteVisible } = useScrollAnimation();

  return (
    <section id="como-funciona" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <h2
          ref={titleRef}
          className={cn(
            "text-3xl md:text-4xl font-bold text-center text-ih-text mb-12 md:mb-16 opacity-0",
            titleVisible && "animate-fade-up"
          )}
        >
          Funciona assim
        </h2>

        {/* Steps */}
        <div ref={stepsRef} className="relative">
          {/* Desktop connecting line */}
          <div
            className={cn(
              "hidden md:block absolute top-[40px] left-[16.67%] right-[16.67%] h-0.5 border-t-2 border-dashed border-ih-border-strong opacity-0 transition-opacity duration-500",
              stepsVisible && "opacity-100"
            )}
            style={{ transitionDelay: stepsVisible ? "300ms" : "0ms" }}
          />

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={cn(
                  "relative flex flex-col items-center text-center opacity-0",
                  stepsVisible && "animate-fade-up"
                )}
                style={{ animationDelay: stepsVisible ? `${index * 150}ms` : "0ms" }}
              >
                {/* Icon */}
                <div
                  className={cn(
                    "relative z-10 w-20 h-20 rounded-full bg-ih-bg flex items-center justify-center mb-4 border-4 border-genea-green/20 transition-transform duration-300",
                    stepsVisible && "hover:scale-110"
                  )}
                >
                  <step.icon className="h-8 w-8 text-genea-green" />
                </div>

                {/* Step number (mobile) */}
                <div className="md:hidden absolute top-0 left-0 w-6 h-6 rounded-full bg-genea-green text-white text-sm font-bold flex items-center justify-center">
                  {index + 1}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-ih-text mb-2">{step.title}</h3>

                {/* Description */}
                <p className="text-ih-text-secondary">{step.description}</p>

                {/* Mobile connector */}
                {index < steps.length - 1 && (
                  <div className="md:hidden w-0.5 h-8 border-l-2 border-dashed border-ih-border-strong my-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Adjustment note */}
        <div
          ref={noteRef}
          className={cn(
            "mt-12 flex items-center justify-center gap-3 bg-ih-surface-warm rounded-xl p-4 md:p-6 max-w-2xl mx-auto opacity-0",
            noteVisible && "animate-fade-up"
          )}
          style={{ animationDelay: noteVisible ? "200ms" : "0ms" }}
        >
          <RefreshCw className="h-5 w-5 text-genea-green flex-shrink-0" />
          <p className="text-ih-text">
            <span className="font-semibold">Não ficou perfeita?</span> Pede ajuste quantas vezes quiser, sem pagar mais.
          </p>
        </div>
      </div>
    </section>
  );
}
