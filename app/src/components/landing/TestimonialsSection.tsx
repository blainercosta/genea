"use client";

import { useState } from "react";
import Image from "next/image";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks";

const testimonials = [
  {
    quote: "Quando vi a foto pronta eu chorei. Minha mãe morreu faz 15 anos e eu consegui ver ela jovem de novo.",
    name: "Carla Mendes",
    location: "São Paulo, SP",
    image: "https://genea-photos.s3.sa-east-1.amazonaws.com/images/depo-01.jpeg",
  },
  {
    quote: "Achei que não ia funcionar. Testei de graça e não acreditei. Já restaurei 12 fotos da família toda.",
    name: "Roberto Silva",
    location: "Belo Horizonte, MG",
    image: "https://genea-photos.s3.sa-east-1.amazonaws.com/images/depo-02.jpeg",
  },
  {
    quote: "Dei de presente pro meu pai no aniversário de 70 anos. Ele ficou sem falar de tanta emoção.",
    name: "Fernanda Costa",
    location: "Porto Alegre, RS",
    image: "https://genea-photos.s3.sa-east-1.amazonaws.com/images/depo-03.jpeg",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-ih-surface-warm">
      <div className="mx-auto max-w-6xl">
        {/* Title */}
        <h2
          ref={titleRef}
          className={cn(
            "text-3xl md:text-4xl font-bold text-center text-ih-text mb-12 md:mb-16 opacity-0",
            titleVisible && "animate-fade-up"
          )}
        >
          O que as pessoas falam
        </h2>

        {/* Desktop Grid */}
        <div ref={cardsRef} className="hidden md:grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "opacity-0",
                cardsVisible && "animate-fade-up"
              )}
              style={{ animationDelay: cardsVisible ? `${index * 150}ms` : "0ms" }}
            >
              <TestimonialCard testimonial={testimonial} />
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div
            className={cn(
              "relative opacity-0",
              cardsVisible && "animate-scale-in"
            )}
          >
            <TestimonialCard testimonial={testimonials[currentIndex]} />

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              aria-label="Depoimento anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-white shadow-card flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green/50"
            >
              <ChevronLeft className="h-5 w-5 text-ih-text" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Próximo depoimento"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-white shadow-card flex items-center justify-center transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green/50"
            >
              <ChevronRight className="h-5 w-5 text-ih-text" />
            </button>
          </div>

          {/* Pagination Dots */}
          <div className="flex items-center justify-center gap-1 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                aria-label={`Ir para depoimento ${index + 1}`}
                className="p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-genea-green/50 rounded-full"
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-genea-green" : "bg-ih-border-strong"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-ih-surface rounded-2xl p-6 shadow-card transition-transform duration-300 hover:-translate-y-1">
      {/* Quote Icon - flipped horizontally and vertically */}
      <Quote className="h-8 w-8 text-genea-green/30 mb-4 -scale-100" />

      {/* Quote Text */}
      <p className="text-ih-text leading-relaxed mb-6">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-ih-surface-warm">
          <Image
            src={testimonial.image}
            alt={testimonial.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-ih-text">{testimonial.name}</p>
          <p className="text-sm text-ih-text-muted">{testimonial.location}</p>
        </div>
      </div>
    </div>
  );
}
