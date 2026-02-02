"use client";

import { useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";
import { DEFAULT_PLAN } from "@/config/plans";
import { analytics } from "@/lib/analytics";
import { useUser } from "@/hooks";

function PaymentConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncCredits, updateRestoration, getRestoration } = useUser();
  const hasRedirectedRef = useRef(false);

  // Lê dados do plano da URL (passados pelo checkout)
  const photos = Number(searchParams.get("photos")) || DEFAULT_PLAN.photos;
  const amount = Number(searchParams.get("amount")) || DEFAULT_PLAN.price;
  const planId = searchParams.get("planId");
  const restorationId = searchParams.get("restoration");

  useEffect(() => {
    analytics.paymentConfirmationView(photos, amount);
    // Sync credits from Supabase (webhook should have added them)
    syncCredits();
  }, [photos, amount, syncCredits]);

  // If user paid to unlock a specific restoration, mark it as paid and redirect
  useEffect(() => {
    if (hasRedirectedRef.current) return;
    if (!restorationId) return;

    const restoration = getRestoration(restorationId);
    if (!restoration) return;

    // Mark restoration as paid (no longer trial)
    updateRestoration(restorationId, { isTrial: false });

    hasRedirectedRef.current = true;

    // Redirect to result page with auto-download flag
    const params = new URLSearchParams({
      id: restorationId,
      autoDownload: "true",
    });
    router.push(`/result?${params.toString()}`);
  }, [restorationId, getRestoration, updateRestoration, router]);

  const handleStartRestoring = () => {
    router.push("/upload?paid=true");
  };

  // If redirecting to result page (has restoration), show loading state
  if (restorationId) {
    return (
      <PaymentConfirmation
        photos={photos}
        amount={amount}
      />
    );
  }

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
