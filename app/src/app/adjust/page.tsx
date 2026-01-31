"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestAdjustment } from "@/components/screens";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";

function AdjustContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRestoration, getLatestRestoration, credits, isTrial, canAdjust, MAX_ADJUSTMENTS } = useUser();
  const [mounted, setMounted] = useState(false);

  const restorationId = searchParams.get("id");
  const restoredUrlParam = searchParams.get("restored");

  const [restoredUrl, setRestoredUrl] = useState<string | undefined>();
  const [remainingAdjustments, setRemainingAdjustments] = useState(MAX_ADJUSTMENTS);

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Guard: Only paid users can request adjustments
  // Trial users cannot adjust at all
  useEffect(() => {
    if (!mounted) return;

    // Trial users cannot adjust - redirect to checkout
    if (isTrial()) {
      analytics.upgradeClick("adjust");
      router.push("/checkout?source=adjust");
      return;
    }

    // Get the restoration data first
    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (!data) {
      router.push("/upload");
      return;
    }

    // Check adjustment limit
    const adjustCheck = canAdjust(data.id);

    if (!adjustCheck.allowed) {
      if (adjustCheck.reason === "limit_reached") {
        // Show a message about limit reached - redirect to result with a flag
        router.push(`/result?id=${data.id}&limit=true`);
        return;
      }
      // Other reasons (trial_user, no_user) - redirect to checkout
      router.push("/checkout?source=adjust");
      return;
    }

    setRemainingAdjustments(adjustCheck.remaining);
    analytics.adjustPageView();

    if (restoredUrlParam) {
      setRestoredUrl(decodeURIComponent(restoredUrlParam));
      return;
    }

    if (data?.restoredUrl) {
      setRestoredUrl(data.restoredUrl);
    }
  }, [mounted, restorationId, restoredUrlParam, getRestoration, getLatestRestoration, isTrial, canAdjust, router]);

  const handleSubmit = (adjustments: string[], customNote: string) => {
    // Double-check: validate user can still adjust
    if (isTrial()) {
      router.push("/checkout?source=adjust");
      return;
    }

    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (!data) return;

    const adjustCheck = canAdjust(data.id);
    if (!adjustCheck.allowed) {
      router.push(`/result?id=${data.id}&limit=true`);
      return;
    }

    analytics.adjustmentSubmit(adjustments, customNote.length > 0);

    if (!restoredUrl) {
      console.error("No restored URL to adjust");
      return;
    }

    // Build URL params for processing page
    const params = new URLSearchParams();
    params.set("mode", "adjust");
    params.set("url", encodeURIComponent(restoredUrl));
    params.set("adjustments", JSON.stringify(adjustments));
    if (customNote) {
      params.set("note", encodeURIComponent(customNote));
    }
    params.set("id", data.id);

    router.push(`/processing?${params.toString()}`);
  };

  const handleCancel = () => {
    analytics.adjustmentCancel();
    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (data) {
      router.push(`/result?id=${data.id}`);
    } else {
      router.push("/result");
    }
  };

  return (
    <RequestAdjustment
      photoUrl={restoredUrl}
      credits={credits}
      remainingAdjustments={remainingAdjustments}
      maxAdjustments={MAX_ADJUSTMENTS}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
    />
  );
}

export default function AdjustPage() {
  return (
    <Suspense fallback={<RequestAdjustment />}>
      <AdjustContent />
    </Suspense>
  );
}
