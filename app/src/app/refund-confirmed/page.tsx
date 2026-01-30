"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefundConfirmation } from "@/components/screens";
import { analytics } from "@/lib/analytics";

function RefundConfirmedContent() {
  const searchParams = useSearchParams();

  // Lê dados do refund da URL (passados pela página de refund)
  const amount = Number(searchParams.get("amount")) || 29.9;
  const pixKey = searchParams.get("pixKey") || "***@email.com";

  useEffect(() => {
    analytics.refundConfirmationView();
  }, []);

  return <RefundConfirmation amount={amount} pixKey={pixKey} />;
}

export default function RefundConfirmedPage() {
  return (
    <Suspense fallback={<RefundConfirmation amount={29.9} pixKey="***@email.com" />}>
      <RefundConfirmedContent />
    </Suspense>
  );
}
