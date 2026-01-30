"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkout } from "@/components/screens";
import { analytics } from "@/lib/analytics";
import { Suspense } from "react";
import { PLANS_MAP, getPlanById } from "@/config/plans";
import { useUser } from "@/hooks";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "2";
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlan);
  const { addCredits } = useUser();

  useEffect(() => {
    const source = searchParams.get("source") || "direct";
    analytics.checkoutView(source);
  }, [searchParams]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = PLANS_MAP[planId];
    if (plan) {
      analytics.planSelect(planId, plan.name, plan.price, plan.photos);
    }
  };

  const handleContinue = (planId: string) => {
    const plan = PLANS_MAP[planId];
    if (plan) {
      analytics.paymentStart(planId, plan.price, "pix");
      // TODO: Integrar com Stripe/Abacate Pay
      // Por enquanto, simula pagamento bem-sucedido
      analytics.paymentComplete(planId, plan.price, "pix");
      addCredits(plan.photos);

      // Passa dados reais para página de confirmação
      const params = new URLSearchParams({
        photos: plan.photos.toString(),
        amount: plan.price.toString(),
        plan: plan.name,
      });
      router.push(`/payment-confirmed?${params.toString()}`);
      return;
    }
    router.push("/payment-confirmed");
  };

  return (
    <Checkout
      selectedPlanId={selectedPlanId}
      onSelectPlan={handleSelectPlan}
      onContinue={handleContinue}
    />
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<Checkout selectedPlanId="2" onSelectPlan={() => {}} onContinue={() => {}} />}>
      <CheckoutContent />
    </Suspense>
  );
}
