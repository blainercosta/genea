"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Dashboard } from "@/components/screens";
import { Header } from "@/components/layout";
import { useUser } from "@/hooks";
import { analytics } from "@/lib/analytics";
import type { Restoration } from "@/types";

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

export default function DashboardPage() {
  const router = useRouter();
  const { user, credits, isLoading, isTrial } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !user?.email) {
      // No user logged in, redirect to start
      router.replace("/start");
    }
  }, [mounted, isLoading, user, router]);

  useEffect(() => {
    if (mounted && user?.email) {
      const restorationCount = user.restorations?.length || 0;
      analytics.dashboardView(restorationCount, credits);
    }
  }, [mounted, user, credits]);

  const handleNewRestoration = () => {
    router.push("/upload");
  };

  const handleViewRestoration = (restorationId: string) => {
    router.push(`/result?id=${restorationId}`);
  };

  const handleDownloadRestoration = async (restoration: Restoration) => {
    if (!restoration.restoredUrl) return;

    try {
      // Fetch the image and trigger download
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(restoration.restoredUrl)}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `genea-restaurada-${restoration.id.slice(0, 8)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch {
      // Fallback: open in new tab
      window.open(restoration.restoredUrl, "_blank");
    }
  };

  // Show loading while checking user state
  if (!mounted || isLoading) {
    return <LoadingScreen />;
  }

  // If no user, we're redirecting
  if (!user?.email) {
    return <LoadingScreen />;
  }

  const isTrialAvailable = isTrial();

  return (
    <Dashboard
      userName={user.name}
      userEmail={user.email}
      credits={credits}
      isTrialAvailable={isTrialAvailable}
      restorations={user.restorations || []}
      onNewRestoration={handleNewRestoration}
      onViewRestoration={handleViewRestoration}
      onDownloadRestoration={handleDownloadRestoration}
    />
  );
}
