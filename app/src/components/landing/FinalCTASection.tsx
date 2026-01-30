"use client";

import Link from "next/link";
import { ArrowRight, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCTASection() {
  return (
    <section className="relative py-16 md:py-24 px-4 md:px-6 bg-ih-text overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1200&h=800&fit=crop&auto=format&sepia=60')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px)",
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
          Não deixa essa foto estragar mais
        </h2>

        <p className="text-lg md:text-xl text-white/80 mb-6">
          Testa grátis agora e vê o que ainda dá pra salvar.
        </p>

        <div className="flex justify-center mb-6">
          <Link href="/start">
            <Button
              size="lg"
              className="bg-white text-genea-green hover:bg-white/90 gap-2"
            >
              Restaurar minha foto de graça
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Guarantees */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/70">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">Fica pronta em 2 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="text-sm">Dinheiro de volta se não gostar</span>
          </div>
        </div>
      </div>
    </section>
  );
}
