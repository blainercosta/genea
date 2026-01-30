"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Checkout } from "@/components/screens";

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPlanId, setSelectedPlanId] = useState<string>("2");

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
  };

  const handleContinue = (planId: string) => {
    // TODO: Process payment
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
