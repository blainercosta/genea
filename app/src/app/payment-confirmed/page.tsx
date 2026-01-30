"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";
import { analytics } from "@/lib/analytics";

export default function PaymentConfirmedPage() {
  const router = useRouter();

  useEffect(() => {
    analytics.paymentConfirmationView(3, 39.9);
  }, []);

  const handleStartRestoring = () => {
    router.push("/upload?paid=true");
  };

  return (
    <PaymentConfirmation
      photos={3}
      amount={39.9}
      onStartRestoring={handleStartRestoring}
    />
  );
}
