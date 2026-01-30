"use client";

import { useRouter } from "next/navigation";
import { RequestRefund } from "@/components/screens";

export default function RefundPage() {
  const router = useRouter();

  const handleSubmit = (reason: string, details: string, pixKey: string) => {
    // TODO: Submit refund request
    console.log("Refund requested:", { reason, details, pixKey });
    router.push("/refund-confirmed");
  };

  const handleCancel = () => {
    router.back();
  };

  return <RequestRefund onSubmit={handleSubmit} onCancel={handleCancel} />;
}
