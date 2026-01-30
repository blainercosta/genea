"use client";

import Link from "next/link";
import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { analytics } from "@/lib/analytics";

const plans = [
  {
    id: "1",
    name: "UMA MEMÓRIA",
    quantity: "1 foto",
    price: "R$ 9,90",
    unitPrice: null,
    benefits: [
      "Restauração completa",
      "Ajustes até você gostar",
      "Download em alta qualidade",
    ],
    highlighted: false,
    badge: null,
  },
  {
    id: "2",
    name: "ÁLBUM",
    quantity: "5 fotos",
    price: "R$ 29,90",
    unitPrice: "Sai R$ 5,98 cada",
    benefits: [
      "Tudo da opção anterior",
      "Fila mais rápida",
      "Suporte por WhatsApp",
    ],
    highlighted: true,
    badge: "Mais pedido",
  },
  {
    id: "3",
    name: "ACERVO",
    quantity: "15 fotos",
    price: "R$ 59,90",
    unitPrice: "Sai R$ 3,99 cada",
    benefits: [
      "Tudo da opção anterior",
      "Atendimento dedicado",
      "Ajuda pra organizar suas fotos",
    ],
    highlighted: false,
    badge: null,
  },
];

export function PricingSection() {
  return (
    <section id="precos" className="py-16 md:py-24 px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-ih-text mb-4">
            Escolha quantas fotos quer restaurar
          </h2>
          <p className="text-lg text-ih-text-secondary">
            Quanto mais fotos, menor o preço. E seus créditos nunca vencem.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-6 md:grid-cols-3 md:gap-8 mb-10">
          {/* Desktop: original order (highlighted in center). Mobile: highlighted first via CSS order */}
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-2xl p-6 md:p-8",
                plan.highlighted
                  ? "bg-genea-green text-white shadow-lg md:scale-105 md:-my-4 order-first md:order-none"
                  : "bg-ih-surface shadow-card"
              )}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-genea-amber px-4 py-1 text-xs font-semibold text-white">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-6">
                {/* Plan Info */}
                <div className="text-center">
                  <p className={cn(
                    "text-sm font-semibold tracking-wide mb-2",
                    plan.highlighted ? "text-white/80" : "text-ih-text-muted"
                  )}>
                    {plan.name}
                  </p>
                  <p className={cn(
                    "text-lg font-medium mb-3",
                    plan.highlighted ? "text-white" : "text-ih-text"
                  )}>
                    {plan.quantity}
                  </p>
                  <p className={cn(
                    "text-4xl font-bold",
                    plan.highlighted ? "text-white" : "text-ih-text"
                  )}>
                    {plan.price}
                  </p>
                  {plan.unitPrice && (
                    <p className={cn(
                      "text-sm mt-1",
                      plan.highlighted ? "text-white/80" : "text-ih-text-secondary"
                    )}>
                      {plan.unitPrice}
                    </p>
                  )}
                </div>

                {/* Benefits */}
                <ul className="space-y-3">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <Check className={cn(
                        "h-5 w-5 flex-shrink-0",
                        plan.highlighted ? "text-white" : "text-genea-green"
                      )} />
                      <span className={cn(
                        "text-sm",
                        plan.highlighted ? "text-white/90" : "text-ih-text-secondary"
                      )}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={`/checkout?plan=${plan.id}`} className="block" onClick={() => analytics.ctaClick("pricing")}>
                  <Button
                    variant={plan.highlighted ? "secondary" : "primary"}
                    className={cn(
                      "w-full",
                      plan.highlighted && "bg-genea-amber border-genea-amber text-white hover:bg-genea-amber/90 hover:border-genea-amber/90"
                    )}
                  >
                    {plan.highlighted ? "Escolher esse" : "Começar"}
                  </Button>
                </Link>

                {/* Guarantee */}
                <p className={cn(
                  "flex items-center justify-center gap-2 text-xs",
                  plan.highlighted ? "text-white/70" : "text-ih-text-muted"
                )}>
                  <Shield className="h-3 w-3" />
                  Dinheiro de volta se não gostar
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <PaymentIcon type="pix" />
            <PaymentIcon type="visa" />
            <PaymentIcon type="mastercard" />
          </div>
          <p className="text-sm text-ih-text-secondary">
            Paga por PIX ou cartão. Seus créditos nunca vencem.
          </p>
        </div>
      </div>
    </section>
  );
}

function PaymentIcon({ type }: { type: "pix" | "visa" | "mastercard" }) {
  const icons = {
    pix: (
      <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4DB6AC]/10">
        <img src="/images/pix.svg" alt="PIX" className="w-6 h-6" />
      </div>
    ),
    visa: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="8" fill="#1A1F71" fillOpacity="0.1" />
        <text x="20" y="24" textAnchor="middle" className="text-[10px] font-bold fill-[#1A1F71]">VISA</text>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <rect width="40" height="40" rx="8" fill="#EB001B" fillOpacity="0.1" />
        <circle cx="16" cy="20" r="6" fill="#EB001B" fillOpacity="0.8" />
        <circle cx="24" cy="20" r="6" fill="#F79E1B" fillOpacity="0.8" />
      </svg>
    ),
  };

  return icons[type];
}
