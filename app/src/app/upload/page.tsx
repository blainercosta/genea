"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "@/components/screens";
import { useUser, useUpload } from "@/hooks";
import { analytics } from "@/lib/analytics";

export default function UploadPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isTrial, credits, consumeCredit, canRestore, createRestoration } = useUser();

  // Check if this is paid flow (has credits) or trial
  const isPaid = mounted ? !isTrial() : false;
  const displayCredits = mounted ? credits : 0;

  // Wait for client-side hydration and track page view
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      analytics.uploadPageView(isPaid);
    }
  }, [mounted, isPaid]);

  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // Track consumed credit for rollback on error
  const [creditConsumed, setCreditConsumed] = useState(false);
  // Track if this upload was a trial (determined BEFORE consumeCredit)
  const [wasTrialUpload, setWasTrialUpload] = useState(false);

  const { upload, isUploading, error } = useUpload({
    onSuccess: (url) => {
      const restorationId = `r_${Date.now()}`;
      // Save isTrial in restoration record for watermark logic in result page
      createRestoration({
        id: restorationId,
        originalUrl: url,
        restoredUrl: "",
        status: "processing",
        createdAt: new Date().toISOString(),
        adjustments: [],
        isTrial: wasTrialUpload,
      });

      // Credit already consumed in handleUpload BEFORE upload started
      analytics.uploadComplete(currentFile?.size || 0, currentFile?.type || "unknown");
      router.push(`/processing?id=${restorationId}&url=${encodeURIComponent(url)}&trial=${wasTrialUpload}`);
    },
    onError: (err) => {
      analytics.uploadError(typeof err === "string" ? err : "Unknown error");
      console.error("Upload error:", err);
      // Note: Credit was consumed before upload, but restoration failed
      // In a real system with DB, we'd rollback here
    },
  });

  const handleUpload = async (file: File) => {
    // Validate hydration completed
    if (!mounted) {
      console.error("Page not ready");
      return;
    }

    if (!canRestore()) {
      analytics.upgradeClick("upload");
      router.push("/checkout");
      return;
    }

    // CRITICAL FIX: Consume credit BEFORE starting upload to prevent race condition
    // This ensures trial is marked as used even if user closes tab during upload
    const success = consumeCredit();
    if (!success) {
      // Edge case: canRestore() passed but consumeCredit failed (state sync issue)
      router.push("/checkout");
      return;
    }
    setCreditConsumed(true);
    // Capture trial state BEFORE it changes (for watermark logic later)
    setWasTrialUpload(!isPaid);

    setCurrentFile(file);
    analytics.uploadStart("gallery");
    await upload(file);
  };

  return (
    <PhotoUpload
      onUpload={handleUpload}
      isPaid={isPaid}
      credits={displayCredits}
    />
  );
}
