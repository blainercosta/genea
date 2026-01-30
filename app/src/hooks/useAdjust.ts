"use client";

import { useState, useCallback } from "react";

interface UseAdjustOptions {
  onComplete?: (adjustedUrl: string) => void;
  onError?: (error: string) => void;
}

export function useAdjust(options: UseAdjustOptions = {}) {
  const { onComplete, onError } = options;

  const [isAdjusting, setIsAdjusting] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [adjustedUrl, setAdjustedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const adjust = useCallback(
    async (imageUrl: string, adjustments: string[], customNote?: string) => {
      setIsAdjusting(true);
      setStatus("processing");
      setError(null);
      setAdjustedUrl(null);

      try {
        const response = await fetch("/api/adjust", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, adjustments, customNote }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Erro ao ajustar");
        }

        if (data.status === "completed" && data.adjustedUrl) {
          setStatus("completed");
          setAdjustedUrl(data.adjustedUrl);
          setIsAdjusting(false);
          onComplete?.(data.adjustedUrl);
          return data.adjustedUrl;
        } else {
          throw new Error(data.error || "Ajuste falhou");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao ajustar";
        setError(errorMessage);
        setStatus("failed");
        setIsAdjusting(false);
        onError?.(errorMessage);
        return null;
      }
    },
    [onComplete, onError]
  );

  const reset = useCallback(() => {
    setIsAdjusting(false);
    setStatus("idle");
    setAdjustedUrl(null);
    setError(null);
  }, []);

  return {
    adjust,
    isAdjusting,
    status,
    adjustedUrl,
    error,
    reset,
  };
}
