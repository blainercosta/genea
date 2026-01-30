"use client";

import { Quote } from "lucide-react";

export function FounderSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-ih-surface-warm">
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-8 md:grid-cols-[200px_1fr] lg:grid-cols-[240px_1fr] items-center">
          {/* Photo */}
          <div className="flex justify-center md:justify-start">
            <div className="relative">
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-ih-surface shadow-card">
                <img
                  src="https://genea-photos.s3.sa-east-1.amazonaws.com/landing/profile-blainer.png"
                  alt="Blainer Costa, Fundador do Genea"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border-2 border-genea-green/20 scale-110" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-6 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-ih-text">
              Por que a gente faz isso
            </h2>

            {/* Quote */}
            <div className="relative">
              <Quote className="absolute -top-2 -left-2 h-8 w-8 text-genea-green/20 hidden md:block -scale-100" />
              <blockquote className="text-lg md:text-xl text-ih-text-secondary leading-relaxed italic md:pl-8">
                Eu perdi a única foto da minha avó numa mudança. Nunca mais vi o rosto dela. Criei o Genea pra isso não acontecer com outras famílias.
              </blockquote>
            </div>

            <p className="text-lg text-ih-text-secondary leading-relaxed md:pl-8">
              Toda foto antiga conta uma história. A gente ajuda a salvar essas histórias.
            </p>

            {/* Signature */}
            <div className="md:pl-8">
              <p className="font-semibold text-ih-text">Blainer Costa</p>
              <p className="text-sm text-ih-text-muted">Fundador do Genea</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
