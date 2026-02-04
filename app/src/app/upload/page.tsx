"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { PhotoUpload } from "@/components/screens";
import { useUser, useUpload } from "@/hooks";
import { analytics } from "@/lib/analytics";

export default function UploadPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { user, isTrial, credits, consumeCredit, canRestore, createRestoration, initAnonymous } = useUser();

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
  // Use ref for trial state - MUST be set before upload() is called
  // This avoids closure issues since refs are read at execution time
  const wasTrialRef = useRef<boolean | null>(null);

  const { upload, isUploading, error } = useUpload({
    onSuccess: (url) => {
      const restorationId = `r_${Date.now()}`;
      // Read from ref - if null (shouldn't happen), default to checking isPaid
      const wasTrial = wasTrialRef.current ?? !isPaid;
      // Save isTrial in restoration record for watermark logic in result page
      createRestoration({
        id: restorationId,
        originalUrl: url,
        restoredUrl: "",
        status: "processing",
        createdAt: new Date().toISOString(),
        adjustments: [],
        isTrial: wasTrial,
      });

      // Credit already consumed in handleUpload BEFORE upload started
      analytics.uploadComplete(currentFile?.size || 0, currentFile?.type || "unknown");
      router.push(`/processing?id=${restorationId}&url=${encodeURIComponent(url)}&trial=${wasTrial}`);
    },
    onError: (err) => {
      analytics.uploadError(typeof err === "string" ? err : "Unknown error");
      // Note: Credit was consumed before upload, but restoration failed
      // In a real system with DB, we'd rollback here
    },
  });

  const handleUpload = async (file: File) => {
    // Validate hydration completed
    if (!mounted) return;

    if (!canRestore()) {
      analytics.upgradeClick("upload");
      router.push("/checkout");
      return;
    }

    // Initialize anonymous user if no user exists (trial flow without email)
    if (!user) {
      initAnonymous();
    }

    // Consume credit BEFORE starting upload to prevent race condition
    // This ensures trial is marked as used even if user closes tab during upload
    const success = consumeCredit();
    if (!success) {
      // Edge case: canRestore() passed but consumeCredit failed (state sync issue)
      router.push("/checkout");
      return;
    }
    setCreditConsumed(true);
    // Capture trial state BEFORE upload - ref ensures callback gets current value
    wasTrialRef.current = !isPaid;

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
