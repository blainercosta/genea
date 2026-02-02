"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Checkout } from "@/components/screens";
import { analytics } from "@/lib/analytics";
import { Suspense } from "react";
import { PLANS_MAP } from "@/config/plans";
import { getUser } from "@/lib/storage";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "2";
  const restorationId = searchParams.get("restoration");
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlan);

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

  // Build URL with optional restoration ID
  const buildUrl = (path: string, planId: string) => {
    const params = new URLSearchParams({ plan: planId });
    if (restorationId) params.set("restoration", restorationId);
    return `${path}?${params.toString()}`;
  };

  const handleContinue = (planId: string) => {
    const plan = PLANS_MAP[planId];
    if (plan) {
      analytics.planSelect(planId, plan.name, plan.price, plan.photos);

      const user = getUser();

      // If no email, go to start page first
      if (!user?.email) {
        router.push(buildUrl("/start", planId));
        return;
      }

      // If no customer info, go to customer-info page
      if (!user.name || !user.phone || !user.taxId) {
        router.push(buildUrl("/customer-info", planId));
        return;
      }

      // All data present, go directly to PIX
      router.push(buildUrl("/pix", planId));
      return;
    }
    router.push("/start?plan=2");
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
