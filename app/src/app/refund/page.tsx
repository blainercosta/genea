"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { RequestRefund } from "@/components/screens";
import { analytics } from "@/lib/analytics";

export default function RefundPage() {
  const router = useRouter();

  useEffect(() => {
    analytics.refundPageView();
  }, []);

  const handleSubmit = (reason: string, details: string, pixKey: string) => {
    analytics.refundSubmit(reason);
    console.log("Refund requested:", { reason, details, pixKey });
    router.push("/refund-confirmed");
  };

  const handleCancel = () => {
    analytics.refundCancel();
    router.back();
  };

  return <RequestRefund onSubmit={handleSubmit} onCancel={handleCancel} />;
}
