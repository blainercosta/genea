"use client";

import { useRouter } from "next/navigation";
import { PaymentConfirmation } from "@/components/screens";

export default function PaymentConfirmedPage() {
  const router = useRouter();

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
