"use client";

import { Camera, Wand2, Download, RefreshCw, Play } from "lucide-react";

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
  return (
    <section id="como-funciona" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ih-text mb-12 md:mb-16">
          Funciona assim
        </h2>

        {/* Video/Image Placeholder */}
        <div className="relative aspect-video max-w-3xl mx-auto mb-12 md:mb-16 rounded-2xl overflow-hidden bg-ih-surface-warm">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=450&fit=crop&auto=format"
            alt="Pessoa usando celular para fotografar foto antiga"
            className="w-full h-full object-cover"
          />
          {/* Play button overlay */}
          <button
            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green focus-visible:ring-offset-2"
            aria-label="Assistir vídeo demonstrativo"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="h-7 w-7 md:h-8 md:w-8 text-genea-green ml-1" fill="currentColor" />
            </div>
          </button>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Desktop connecting line */}
          <div className="hidden md:block absolute top-[40px] left-[16.67%] right-[16.67%] h-0.5 border-t-2 border-dashed border-ih-border-strong" />

          <div className="grid gap-8 md:grid-cols-3 md:gap-6">
            {steps.map((step, index) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                {/* Icon */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-ih-bg flex items-center justify-center mb-4 border-4 border-genea-green/20">
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
        <div className="mt-12 flex items-center justify-center gap-3 bg-ih-surface-warm rounded-xl p-4 md:p-6 max-w-2xl mx-auto">
          <RefreshCw className="h-5 w-5 text-genea-green flex-shrink-0" />
          <p className="text-ih-text">
            <span className="font-semibold">Não ficou perfeita?</span> Pede ajuste quantas vezes quiser, sem pagar mais.
          </p>
        </div>
      </div>
    </section>
  );
}
