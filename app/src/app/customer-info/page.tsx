"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { CustomerInfo } from "@/components/screens";
import { Header } from "@/components/layout";
import { updateCustomerInfo, getUser } from "@/lib/storage";
import { PLANS_MAP } from "@/config/plans";

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-genea-green animate-spin" />
      </main>
    </div>
  );
}

function CustomerInfoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "2";
  const restorationId = searchParams.get("restoration");
  const [isChecking, setIsChecking] = useState(true);

  const plan = PLANS_MAP[planId];

  useEffect(() => {
    // Check if user has email
    const user = getUser();
    if (!user?.email) {
      const params = new URLSearchParams({ plan: planId });
      if (restorationId) params.set("restoration", restorationId);
      router.push(`/start?${params.toString()}`);
      return;
    }
    setIsChecking(false);
  }, [router, planId, restorationId]);

  const handleSubmit = (data: { name: string; phone: string; taxId: string }) => {
    updateCustomerInfo(data);
    const params = new URLSearchParams({ plan: planId });
    if (restorationId) params.set("restoration", restorationId);
    router.push(`/pix?${params.toString()}`);
  };

  if (isChecking) {
    return <LoadingScreen />;
  }

  return (
    <CustomerInfo
      planName={plan?.name}
      planPrice={plan?.price}
      onSubmit={handleSubmit}
    />
  );
}

export default function CustomerInfoPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <CustomerInfoContent />
    </Suspense>
  );
}
