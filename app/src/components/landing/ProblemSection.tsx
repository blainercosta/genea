"use client";

import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

const timelineSteps = [
  {
    year: "1950",
    label: "Foto original",
    description: "Em bom estado",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
  },
  {
    year: "1980",
    label: "Começa a desbotar",
    description: "Imagem amarelada",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
  },
  {
    year: "2000",
    label: "Manchas aparecem",
    description: "Danos visíveis",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
  },
  {
    year: "2024",
    label: "Quase sumindo",
    description: "Muito deteriorada",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format",
  },
];

export function ProblemSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-ih-surface-warm">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ih-text mb-12 md:mb-16">
          Fotos velhas estragam cada vez mais
        </h2>

        {/* Desktop Timeline */}
        <div className="hidden md:block relative mb-12">
          {/* Connecting Line */}
          <div className="absolute top-[60px] left-0 right-0 h-0.5 border-t-2 border-dashed border-ih-border-strong" />

          <div className="grid grid-cols-4 gap-6">
            {timelineSteps.map((step, index) => (
              <div key={step.year} className="relative flex flex-col items-center">
                {/* Photo */}
                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-ih-surface shadow-card-sm mb-4">
                  <img
                    src={step.image}
                    alt={`Foto em ${step.year}`}
                    className="w-full h-full object-cover"
                    style={{
                      filter: index === 0 ? "none" :
                              index === 1 ? "sepia(0.3) saturate(0.8)" :
                              index === 2 ? "sepia(0.5) saturate(0.6) contrast(0.9)" :
                              "sepia(0.7) saturate(0.4) contrast(0.8) brightness(1.1)"
                    }}
                  />
                </div>

                {/* Dot on timeline */}
                <div className="w-3 h-3 rounded-full bg-genea-green mb-4" />

                {/* Year */}
                <span className="text-lg font-bold text-ih-text mb-1">{step.year}</span>

                {/* Label */}
                <span className="text-sm text-ih-text-secondary text-center">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden space-y-6 mb-12">
          {timelineSteps.map((step, index) => (
            <div key={step.year} className="relative flex items-center gap-4">
              {/* Photo */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-ih-surface shadow-card-sm flex-shrink-0">
                <img
                  src={step.image}
                  alt={`Foto em ${step.year}`}
                  className="w-full h-full object-cover"
                  style={{
                    filter: index === 0 ? "none" :
                            index === 1 ? "sepia(0.3) saturate(0.8)" :
                            index === 2 ? "sepia(0.5) saturate(0.6) contrast(0.9)" :
                            "sepia(0.7) saturate(0.4) contrast(0.8) brightness(1.1)"
                  }}
                />
              </div>

              {/* Text */}
              <div className="flex-1">
                <span className="text-sm font-bold text-genea-green">{step.year}</span>
                <p className="text-ih-text font-medium">{step.label}</p>
                <p className="text-sm text-ih-text-secondary">{step.description}</p>
              </div>

              {/* Connector */}
              {index < timelineSteps.length - 1 && (
                <div className="absolute left-10 w-0.5 h-6 border-l-2 border-dashed border-ih-border-strong mt-24" />
              )}
            </div>
          ))}
        </div>

        {/* Urgency Callout */}
        <div className="bg-genea-amber/10 border border-genea-amber/30 rounded-2xl p-4 md:p-6 mb-8">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-genea-amber flex-shrink-0 mt-0.5" />
            <p className="text-ih-text">
              <span className="font-semibold">Quanto mais tempo passa, mais difícil de recuperar.</span>{" "}
              Se você tem fotos guardadas, agora é a hora.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link href="/start">
            <Button variant="secondary" size="lg">
              Salvar minhas fotos agora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
