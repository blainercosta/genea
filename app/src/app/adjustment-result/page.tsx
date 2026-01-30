"use client";

import { useRouter } from "next/navigation";
import { AdjustmentResult } from "@/components/screens";

export default function AdjustmentResultPage() {
  const router = useRouter();

  const handleApprove = () => {
    // TODO: Approve adjustment
    console.log("Approved!");
    router.push("/result?approved=true");
  };

  const handleRequestMore = () => {
    router.push("/adjust");
  };

  const handleDownload = () => {
    // TODO: Download adjusted image
    console.log("Downloading...");
  };

  return (
    <AdjustmentResult
      credits={2}
      onApprove={handleApprove}
      onRequestMore={handleRequestMore}
      onDownload={handleDownload}
    />
  );
}
