"use client";

import { HelpCircle } from "lucide-react";
import { useScrollAnimation } from "@/hooks";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "E se eu não gostar?",
    answer: "A gente devolve seu dinheiro em 24h pelo PIX. Sem burocracia nenhuma.",
  },
  {
    question: "Demora muito?",
    answer: "A maioria fica pronta em 2 minutos. No máximo 5 minutos pra fotos mais difíceis.",
  },
  {
    question: "Vem com marca d'água?",
    answer: "Não. Você baixa a foto limpa, pronta pra imprimir ou colocar na parede.",
  },
  {
    question: "Posso pedir pra mudar alguma coisa?",
    answer: "Pode. Quantas vezes quiser, até ficar do jeito que você quer. Sem pagar mais.",
  },
];

export function FAQSection() {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: gridRef, isVisible: gridVisible } = useScrollAnimation();

  return (
    <section id="duvidas" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <h2
          ref={titleRef}
          className={cn(
            "text-3xl md:text-4xl font-bold text-center text-ih-text mb-12 md:mb-16 opacity-0",
            titleVisible && "animate-fade-up"
          )}
        >
          Perguntas que todo mundo faz
        </h2>

        {/* FAQ Grid */}
        <div ref={gridRef} className="grid gap-4 md:grid-cols-2 md:gap-6">
          {faqs.map((faq, index) => (
            <div
              key={faq.question}
              className={cn(
                "bg-ih-surface rounded-xl p-5 md:p-6 shadow-card-sm opacity-0 transition-transform duration-300 hover:-translate-y-1",
                gridVisible && "animate-fade-up"
              )}
              style={{ animationDelay: gridVisible ? `${index * 100}ms` : "0ms" }}
            >
              <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="h-5 w-5 text-genea-green flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-ih-text">{faq.question}</h3>
              </div>
              <p className="text-ih-text-secondary pl-8">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
