"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkout } from "@/components/screens";
import { analytics } from "@/lib/analytics";
import { Suspense } from "react";

const plans: Record<string, { name: string; price: number; photos: number }> = {
  "1": { name: "UMA MEMÓRIA", price: 9.9, photos: 1 },
  "2": { name: "ÁLBUM", price: 29.9, photos: 5 },
  "3": { name: "ACERVO", price: 59.9, photos: 15 },
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "2";
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlan);

  useEffect(() => {
    const source = searchParams.get("source") || "direct";
    analytics.checkoutView(source);
  }, [searchParams]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans[planId];
    if (plan) {
      analytics.planSelect(planId, plan.name, plan.price, plan.photos);
    }
  };

  const handleContinue = (planId: string) => {
    const plan = plans[planId];
    if (plan) {
      analytics.paymentStart(planId, plan.price, "pix");
      analytics.paymentComplete(planId, plan.price, "pix");
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
