"use client";

import { Check, Shield } from "lucide-react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { PLANS, formatPrice } from "@/config/plans";

interface CheckoutProps {
  selectedPlanId?: string;
  onSelectPlan?: (planId: string) => void;
  onContinue?: (planId: string) => void;
}

export function Checkout({
  selectedPlanId,
  onSelectPlan,
  onContinue,
}: CheckoutProps) {
  const handleSelectPlan = (planId: string) => {
    onSelectPlan?.(planId);
    onContinue?.(planId);
  };

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Title */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-ih-text">
            Escolha quantas fotos quer restaurar
          </h1>
          <p className="text-ih-text-secondary">
            Quanto mais fotos, menor o preço. Seus créditos nunca vencem.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid gap-4 md:grid-cols-3 md:gap-6 w-full max-w-4xl">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-2xl p-6",
                plan.popular
                  ? "bg-genea-green text-white shadow-lg md:scale-105 md:-my-2 order-first md:order-none"
                  : "bg-ih-surface shadow-card border border-ih-border"
              )}
            >
              {/* Badge */}
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-genea-amber px-4 py-1 text-xs font-semibold text-white">
                  Mais pedido
                </div>
              )}

              <div className="space-y-5">
                {/* Plan Info */}
                <div className="text-center">
                  <p className={cn(
                    "text-xs font-semibold tracking-wide mb-1",
                    plan.popular ? "text-white/80" : "text-ih-text-muted"
                  )}>
                    {plan.name}
                  </p>
                  <p className={cn(
                    "text-lg font-medium mb-2",
                    plan.popular ? "text-white" : "text-ih-text"
                  )}>
                    {plan.photos} {plan.photos === 1 ? "foto" : "fotos"}
                  </p>
                  <p className={cn(
                    "text-3xl font-bold",
                    plan.popular ? "text-white" : "text-ih-text"
                  )}>
                    {formatPrice(plan.price)}
                  </p>
                  {plan.unitPrice && (
                    <p className={cn(
                      "text-sm mt-1",
                      plan.popular ? "text-white/80" : "text-ih-text-secondary"
                    )}>
                      {plan.unitPrice}
                    </p>
                  )}
                </div>

                {/* Benefits */}
                <ul className="space-y-2">
                  {plan.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2">
                      <Check className={cn(
                        "h-4 w-4 flex-shrink-0",
                        plan.popular ? "text-white" : "text-genea-green"
                      )} />
                      <span className={cn(
                        "text-sm",
                        plan.popular ? "text-white/90" : "text-ih-text-secondary"
                      )}>
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.popular ? "secondary" : "primary"}
                  className={cn(
                    "w-full",
                    plan.popular && "bg-genea-amber border-genea-amber text-white hover:bg-genea-amber/90",
                    selectedPlanId === plan.id && !plan.popular && "ring-2 ring-offset-2 ring-genea-green"
                  )}
                >
                  {plan.popular ? "Escolher esse" : "Começar"}
                </Button>

                {/* Guarantee */}
                <p className={cn(
                  "flex items-center justify-center gap-2 text-xs",
                  plan.popular ? "text-white/70" : "text-ih-text-muted"
                )}>
                  <Shield className="h-3 w-3" />
                  Dinheiro de volta se não gostar
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4DB6AC]/10">
              <img src="/images/pix.svg" alt="PIX" className="w-6 h-6" />
            </div>
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <rect width="40" height="40" rx="8" fill="#1A1F71" fillOpacity="0.1" />
              <text x="20" y="24" textAnchor="middle" className="text-[10px] font-bold fill-[#1A1F71]">VISA</text>
            </svg>
            <svg viewBox="0 0 40 40" className="w-10 h-10">
              <rect width="40" height="40" rx="8" fill="#EB001B" fillOpacity="0.1" />
              <circle cx="16" cy="20" r="6" fill="#EB001B" fillOpacity="0.8" />
              <circle cx="24" cy="20" r="6" fill="#F79E1B" fillOpacity="0.8" />
            </svg>
          </div>
          <p className="text-sm text-ih-text-secondary">
            Paga por PIX ou cartão. Seus créditos nunca vencem.
          </p>
        </div>
      </main>
    </div>
  );
}
