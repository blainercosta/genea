"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";
import { DEFAULT_PLAN } from "@/config/plans";
import { analytics } from "@/lib/analytics";
import { useUser } from "@/hooks";

function PaymentConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncCredits, updateRestoration, getRestoration, consumeCredit } = useUser();
  const hasRedirectedRef = useRef(false);
  const [isSynced, setIsSynced] = useState(false);

  // Lê dados do plano da URL (passados pelo checkout)
  const photos = Number(searchParams.get("photos")) || DEFAULT_PLAN.photos;
  const amount = Number(searchParams.get("amount")) || DEFAULT_PLAN.price;
  const planId = searchParams.get("planId");
  const restorationId = searchParams.get("restoration");

  // Sync credits from Supabase first, then mark as synced
  useEffect(() => {
    const doSync = async () => {
      analytics.paymentConfirmationView(photos, amount);
      await syncCredits();
      setIsSynced(true);
    };
    doSync();
  }, [photos, amount, syncCredits]);

  // If user paid to unlock a specific restoration, mark it as paid and redirect
  // Only after credits are synced to ensure consistency
  useEffect(() => {
    if (hasRedirectedRef.current) return;
    if (!restorationId) return;
    if (!isSynced) return; // Wait for sync to complete

    const restoration = getRestoration(restorationId);
    if (!restoration) {
      // Restoration not found - redirect to upload instead
      console.error("Restoration not found:", restorationId);
      router.push("/upload?paid=true");
      return;
    }

    // Mark restoration as paid (no longer trial)
    updateRestoration(restorationId, { isTrial: false });

    // Consume 1 credit to "pay" for unlocking this specific photo
    // The webhook added credits, now we use one for this restoration
    consumeCredit();

    hasRedirectedRef.current = true;

    // Redirect to result page with auto-download flag
    const params = new URLSearchParams({
      id: restorationId,
      autoDownload: "true",
    });
    router.push(`/result?${params.toString()}`);
  }, [restorationId, getRestoration, updateRestoration, consumeCredit, router, isSynced]);

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
