"use client";

import { useEffect } from "react";
import { RefundConfirmation } from "@/components/screens";
import { analytics } from "@/lib/analytics";

export default function RefundConfirmedPage() {
  useEffect(() => {
    analytics.refundConfirmationView();
  }, []);

  return <RefundConfirmation amount={39.9} pixKey="***@email.com" />;
}
