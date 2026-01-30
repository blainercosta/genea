"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RequestAdjustment } from "@/components/screens";
import { useUser } from "@/hooks";

function AdjustContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getRestoration, getLatestRestoration, credits } = useUser();

  const restorationId = searchParams.get("id");
  const restoredUrlParam = searchParams.get("restored");

  const [restoredUrl, setRestoredUrl] = useState<string | undefined>();

  useEffect(() => {
    // First try query params
    if (restoredUrlParam) {
      setRestoredUrl(decodeURIComponent(restoredUrlParam));
      return;
    }

    // Try to get restoration from localStorage
    const data = restorationId
      ? getRestoration(restorationId)
      : getLatestRestoration();

    if (data?.restoredUrl) {
      setRestoredUrl(data.restoredUrl);
    }
  }, [restorationId, restoredUrlParam, getRestoration, getLatestRestoration]);

  const handleSubmit = (adjustments: string[], customNote: string) => {
    // TODO: Submit adjustment request to API
    console.log("Adjustments:", adjustments, customNote);

    // For now, just go back to processing with the same image
    // In production, this would send the adjustment request to the API
    router.push("/processing");
  };

  const handleCancel = () => {
    // Go back to result with the restoration ID
    if (restorationId) {
      router.push(`/result?id=${restorationId}`);
    } else {
      router.push("/result");
    }
  };

  return (
    <RequestAdjustment
      photoUrl={restoredUrl}
      credits={credits}
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
