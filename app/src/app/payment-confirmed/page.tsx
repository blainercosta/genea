"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";
import { DEFAULT_PLAN } from "@/config/plans";
import { analytics } from "@/lib/analytics";
import { useUser } from "@/hooks";
import { getUser } from "@/lib/storage";

/**
 * Sync restoration as paid to Supabase
 * This ensures the paid status persists across devices
 */
async function syncRestorationPaidToSupabase(
  email: string,
  restorationId: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "markRestorationPaid",
        email,
        restorationId,
      }),
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

/**
 * Sync credit consumption to Supabase (with await, not fire-and-forget)
 */
async function syncConsumeCredit(email: string): Promise<boolean> {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "consumeCredit", email }),
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

function PaymentConfirmedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { syncCredits, updateRestoration, getRestoration, consumeCredit } = useUser();
  const hasRedirectedRef = useRef(false);
  const [isSynced, setIsSynced] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Lê dados do plano da URL (passados pelo checkout)
  const photos = Number(searchParams.get("photos")) || DEFAULT_PLAN.photos;
  const amount = Number(searchParams.get("amount")) || DEFAULT_PLAN.price;
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
    if (!isSynced) return;
    if (isUnlocking) return;

    const unlockRestoration = async () => {
      setIsUnlocking(true);
      hasRedirectedRef.current = true;

      const restoration = getRestoration(restorationId);
      if (!restoration) {
        router.push("/upload?paid=true");
        return;
      }

      const user = getUser();
      const email = user?.email;

      // 1. Mark restoration as paid in Supabase FIRST (persists across devices)
      if (email) {
        await syncRestorationPaidToSupabase(email, restorationId);
      }

      // 2. Mark restoration as paid locally
      updateRestoration(restorationId, { isTrial: false });

      // 3. Consume credit locally
      consumeCredit();

      // 4. Sync credit consumption to Supabase (await to ensure consistency)
      if (email) {
        await syncConsumeCredit(email);
      }

      // 5. Redirect to result page with auto-download flag
      const params = new URLSearchParams({
        id: restorationId,
        autoDownload: "true",
      });
      router.push(`/result?${params.toString()}`);
    };

    unlockRestoration();
  }, [restorationId, getRestoration, updateRestoration, consumeCredit, router, isSynced, isUnlocking]);

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
