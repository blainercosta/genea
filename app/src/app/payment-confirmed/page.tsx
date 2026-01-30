"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";
import { analytics } from "@/lib/analytics";

function PaymentConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lê dados do plano da URL (passados pelo checkout)
  const photos = Number(searchParams.get("photos")) || 5;
  const amount = Number(searchParams.get("amount")) || 29.9;

  useEffect(() => {
    analytics.paymentConfirmationView(photos, amount);
  }, [photos, amount]);

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
    <Suspense fallback={<PaymentConfirmation photos={5} amount={29.9} onStartRestoring={() => {}} />}>
      <PaymentConfirmedContent />
    </Suspense>
  );
}
