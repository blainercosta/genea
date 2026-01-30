"use client";

import { HelpCircle } from "lucide-react";

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
  return (
    <section id="duvidas" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-4xl">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-ih-text mb-12 md:mb-16">
          Perguntas que todo mundo faz
        </h2>

        {/* FAQ Grid */}
        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-ih-surface rounded-xl p-5 md:p-6 shadow-card-sm"
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
