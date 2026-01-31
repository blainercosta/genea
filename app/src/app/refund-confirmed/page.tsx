"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefundConfirmation } from "@/components/screens";
import { DEFAULT_PLAN } from "@/config/plans";
import { analytics } from "@/lib/analytics";

function RefundConfirmedContent() {
  const searchParams = useSearchParams();

  // Lê dados do refund da URL (passados pela página de refund)
  const amount = Number(searchParams.get("amount")) || DEFAULT_PLAN.price;
  const pixKey = searchParams.get("pixKey") || "***@email.com";

  useEffect(() => {
    analytics.refundConfirmationView();
  }, []);

  return <RefundConfirmation amount={amount} pixKey={pixKey} />;
}

export default function RefundConfirmedPage() {
  return (
    <Suspense fallback={<RefundConfirmation />}>
      <RefundConfirmedContent />
    </Suspense>
  );
}
