"use client";

import { useEffect, useRef, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Processing } from "@/components/screens";
import { useUser, useRestore, useAdjust } from "@/hooks";
import { analytics } from "@/lib/analytics";

function ProcessingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateRestoration } = useUser();
  const startTimeRef = useRef<number>(Date.now());
  const hasStartedRef = useRef(false);

  // Parse URL params
  const mode = searchParams.get("mode") || "restore";
  const restorationId = searchParams.get("id");
  const imageUrl = searchParams.get("url");
  const adjustmentsParam = searchParams.get("adjustments");
  const customNote = searchParams.get("note");

  // Parse adjustments from JSON - memoize to avoid re-renders
  const adjustments = useMemo<string[]>(
    () => (adjustmentsParam ? JSON.parse(adjustmentsParam) : []),
    [adjustmentsParam]
  );

  // Restore hook
  const { restore, status: restoreStatus } = useRestore({
    onComplete: (url) => {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      analytics.processingComplete(durationSeconds);

      if (restorationId) {
        updateRestoration(restorationId, {
          status: "completed",
          restoredUrl: url,
        });
      }

      const originalUrl = imageUrl ? decodeURIComponent(imageUrl) : "";
      router.push(`/result?id=${restorationId}&original=${encodeURIComponent(originalUrl)}&restored=${encodeURIComponent(url)}`);
    },
    onError: (err) => {
      console.error("Restore error:", err);
      analytics.processingError(typeof err === "string" ? err : "Unknown error");

      if (restorationId) {
        updateRestoration(restorationId, { status: "failed" });
      }

      router.push("/error");
    },
  });

  // Adjust hook
  const { adjust, status: adjustStatus } = useAdjust({
    onComplete: (url) => {
      const durationSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      analytics.processingComplete(durationSeconds);

      if (restorationId) {
        // Create a proper Adjustment record
        const decodedNote = customNote ? decodeURIComponent(customNote) : "";
        const adjustmentRecord = {
          id: `adj_${Date.now()}`,
          instructions: adjustments.join(", ") + (decodedNote ? `. ${decodedNote}` : ""),
          resultUrl: url,
          createdAt: new Date().toISOString(),
        };

        updateRestoration(restorationId, {
          status: "completed",
          restoredUrl: url,
          adjustments: [adjustmentRecord],
        });
      }

      // Navigate to result with the adjusted image
      const originalUrl = imageUrl ? decodeURIComponent(imageUrl) : "";
      router.push(`/result?id=${restorationId}&original=${encodeURIComponent(originalUrl)}&restored=${encodeURIComponent(url)}`);
    },
    onError: (err) => {
      console.error("Adjust error:", err);
      analytics.processingError(typeof err === "string" ? err : "Unknown error");

      if (restorationId) {
        updateRestoration(restorationId, { status: "failed" });
      }

      router.push("/error");
    },
  });

  // Determine current status based on mode
  const status = mode === "adjust" ? adjustStatus : restoreStatus;

  // Start processing when component mounts (only once)
  useEffect(() => {
    if (!imageUrl || status !== "idle" || hasStartedRef.current) return;

    hasStartedRef.current = true;
    analytics.processingStart();

    const decodedUrl = decodeURIComponent(imageUrl);

    if (mode === "adjust" && adjustments.length > 0) {
      const decodedNote = customNote ? decodeURIComponent(customNote) : undefined;
      adjust(decodedUrl, adjustments, decodedNote);
    } else {
      restore(decodedUrl);
    }
  }, [imageUrl, status, mode, adjustments, customNote, restore, adjust]);

  const previewUrl = imageUrl ? decodeURIComponent(imageUrl) : undefined;

  return <Processing previewUrl={previewUrl} />;
}

export default function ProcessingPage() {
  return (
    <Suspense fallback={<Processing />}>
      <ProcessingContent />
    </Suspense>
  );
}
