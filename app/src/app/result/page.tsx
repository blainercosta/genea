"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Result } from "@/components/screens";
import { EmailGateModal } from "@/components/ui";
import { useUser } from "@/hooks";
import { analytics, identify } from "@/lib/analytics";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, getRestoration, credits, getLatestRestoration, user, setEmail, isAnonymous } = useUser();
  const autoDownloadTriggeredRef = useRef(false);

  // Email gate modal state
  const [showEmailGate, setShowEmailGate] = useState(false);

  const restorationId = searchParams.get("id");
  const originalUrlParam = searchParams.get("original");
  const restoredUrlParam = searchParams.get("restored");
  const autoDownload = searchParams.get("autoDownload") === "true";

  // Get restoration data (including isTrial flag for watermark)
  const [restoration, setRestoration] = useState<{
    originalUrl: string;
    restoredUrl: string;
    isTrial?: boolean;
  } | null>(null);

  useEffect(() => {
    // Wait for user data to load
    if (isLoading) return;

    // Try to get restoration from localStorage first (has isTrial flag)
    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (data && data.restoredUrl) {
      setRestoration({
        originalUrl: data.originalUrl,
        restoredUrl: data.restoredUrl,
        isTrial: data.isTrial,
      });
      analytics.resultView(data.isTrial ?? false);
      return;
    }

    // Fallback to query params (for direct links)
    if (originalUrlParam && restoredUrlParam) {
      setRestoration({
        originalUrl: decodeURIComponent(originalUrlParam),
        restoredUrl: decodeURIComponent(restoredUrlParam),
        // Assume trial if no restoration record found
        isTrial: true,
      });
      analytics.resultView(true);
      return;
    }

    // No restoration found after loading - redirect to upload
    // This handles edge cases like expired localStorage or invalid IDs
    router.push("/upload");
  }, [restorationId, originalUrlParam, restoredUrlParam, getRestoration, getLatestRestoration, isLoading, router]);

  // Show loading state while fetching restoration data
  const isDataLoading = isLoading || (!restoration && (restorationId || originalUrlParam));

  // Use restoration's isTrial flag (captured at upload time, before consumeCredit)
  const isTrialRestoration = restoration?.isTrial ?? true;
  const isPaid = !isTrialRestoration;

  // Auto-download when coming from payment confirmation
  useEffect(() => {
    if (!autoDownload || autoDownloadTriggeredRef.current) return;
    if (!restoration?.restoredUrl || !isPaid) return;

    autoDownloadTriggeredRef.current = true;

    // Small delay to ensure UI is rendered first
    const timer = setTimeout(() => {
      analytics.downloadClick(false);

      // Download without watermark (paid)
      const downloadUrl = `/api/download?url=${encodeURIComponent(restoration.restoredUrl)}`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `genea-restored-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 500);

    return () => clearTimeout(timer);
  }, [autoDownload, restoration?.restoredUrl, isPaid]);

  // Trigger download (called after email verification for anonymous users)
  const triggerDownload = useCallback((withWatermark: boolean) => {
    if (!restoration?.restoredUrl) return;

    // Track download
    analytics.downloadClick(withWatermark);

    // Use proxy API to download (avoids CORS issues with S3)
    // Add trial param to apply watermark for trial users
    const downloadUrl = `/api/download?url=${encodeURIComponent(restoration.restoredUrl)}${withWatermark ? "&trial=true" : ""}`;

    // Create download link
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `genea-restored-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [restoration?.restoredUrl]);

  const handleDownload = () => {
    if (!restoration?.restoredUrl) return;

    // For trial users who are anonymous, show email gate first
    if (isTrialRestoration && isAnonymous()) {
      setShowEmailGate(true);
      return;
    }

    // For authenticated trial users or paid users, download directly
    triggerDownload(isTrialRestoration);
  };

  // Handle email verification from gate modal
  const handleEmailVerified = async (email: string) => {
    // Set email for the anonymous user and sync with Supabase
    const { isNewUser } = await setEmail(email);
    identify(email);

    // Send welcome email for new users
    if (isNewUser) {
      fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: email, type: "welcome" }),
      }).catch(() => {
        // Ignore email errors - not critical
      });
    }

    // Close modal and trigger download
    setShowEmailGate(false);
    triggerDownload(true); // Still trial, so with watermark
  };

  const handleRequestAdjustment = () => {
    analytics.requestAdjustmentClick();
    const params = new URLSearchParams();
    if (restorationId) params.set("id", restorationId);
    if (restoration?.restoredUrl) params.set("restored", encodeURIComponent(restoration.restoredUrl));
    router.push(`/adjust?${params.toString()}`);
  };

  const handleShare = async () => {
    if (!restoration?.restoredUrl) return;

    // For trial users, share the landing page instead of the direct image URL
    // This prevents bypassing the watermark and drives traffic to the product
    const shareUrl = isTrialRestoration
      ? window.location.origin
      : restoration.restoredUrl;

    const shareText = isTrialRestoration
      ? "Descobri esse site incrível que restaura fotos antigas com IA! Olha o resultado:"
      : "Olha como ficou minha foto antiga depois de restaurar no Genea!";

    if (navigator.share) {
      try {
        analytics.shareClick("native");
        await navigator.share({
          title: "Minha foto restaurada no Genea",
          text: shareText,
          url: shareUrl,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      analytics.shareClick("clipboard");
      navigator.clipboard.writeText(shareUrl);
    }
  };

  const handleUpgrade = () => {
    analytics.upgradeClick("result");
    router.push("/checkout?source=result");
  };

  // Unlock just this photo - plan 1 (R$9.90)
  const handleUnlockThisPhoto = () => {
    analytics.upgradeClick("result_unlock_this");
    const params = new URLSearchParams({
      plan: "1",
      source: "result",
      ...(restorationId && { restoration: restorationId }),
    });

    // Anonymous users need to provide email before checkout (payment requires email)
    if (isAnonymous()) {
      router.push(`/start?${params.toString()}`);
    } else {
      router.push(`/checkout?${params.toString()}`);
    }
  };

  // Get more photos - go to checkout to choose plan
  const handleGetMorePhotos = () => {
    analytics.upgradeClick("result_get_more");
    const params = new URLSearchParams({
      source: "result",
      ...(restorationId && { restoration: restorationId }),
    });

    // Anonymous users need to provide email before checkout (payment requires email)
    if (isAnonymous()) {
      router.push(`/start?${params.toString()}`);
    } else {
      router.push(`/checkout?${params.toString()}`);
    }
  };

  // Show loading state while data is being fetched
  if (isDataLoading) {
    return <Result />;
  }

  return (
    <>
      <Result
        originalUrl={restoration?.originalUrl}
        restoredUrl={restoration?.restoredUrl}
        isPaid={isPaid}
        credits={credits}
        restorationId={restorationId || undefined}
        onDownload={handleDownload}
        onRequestAdjustment={handleRequestAdjustment}
        onShare={handleShare}
        onUpgrade={handleUpgrade}
        onUnlockThisPhoto={handleUnlockThisPhoto}
        onGetMorePhotos={handleGetMorePhotos}
      />
      <EmailGateModal
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onEmailVerified={handleEmailVerified}
      />
    </>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<Result />}>
      <ResultContent />
    </Suspense>
  );
}
