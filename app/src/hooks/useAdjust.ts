"use client";

import { useState, useCallback, useRef } from "react";

// Timeout for adjustment API call (2 minutes)
const ADJUST_TIMEOUT_MS = 120000;

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

  // Keep abort controller reference for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  const adjust = useCallback(
    async (imageUrl: string, adjustments: string[], customNote?: string) => {
      // Cancel any existing request
      abortControllerRef.current?.abort();

      setIsAdjusting(true);
      setStatus("processing");
      setError(null);
      setAdjustedUrl(null);

      // Create new abort controller with timeout
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Set timeout
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, ADJUST_TIMEOUT_MS);

      try {
        const response = await fetch("/api/adjust", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, adjustments, customNote }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

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
        clearTimeout(timeoutId);

        let errorMessage: string;
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            errorMessage = "Tempo esgotado. O ajuste está demorando mais que o esperado. Tente novamente.";
          } else {
            errorMessage = err.message;
          }
        } else {
          errorMessage = "Erro ao ajustar";
        }

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
