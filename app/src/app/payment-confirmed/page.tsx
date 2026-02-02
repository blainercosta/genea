"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";
import { DEFAULT_PLAN } from "@/config/plans";
import { analytics } from "@/lib/analytics";
import { useUser } from "@/hooks";

function PaymentConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncCredits } = useUser();

  // Lê dados do plano da URL (passados pelo checkout)
  const photos = Number(searchParams.get("photos")) || DEFAULT_PLAN.photos;
  const amount = Number(searchParams.get("amount")) || DEFAULT_PLAN.price;

  useEffect(() => {
    analytics.paymentConfirmationView(photos, amount);
    // Sync credits from Supabase (webhook should have added them)
    syncCredits();
  }, [photos, amount, syncCredits]);

  const handleStartRestoring = () => {
    router.push("/upload?paid=true");
  };

  return (
    <PaymentConfirmation
      photos={photos}
      amount={amount}
      onStartRestoring={handleStartRestoring}
    />
  );
}

export default function PaymentConfirmedPage() {
  return (
    <Suspense fallback={<PaymentConfirmation />}>
      <PaymentConfirmedContent />
    </Suspense>
  );
}
