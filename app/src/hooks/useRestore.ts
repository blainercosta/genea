"use client";

import { useState, useCallback, useRef } from "react";

// Timeout for restoration API call (2 minutes)
const RESTORE_TIMEOUT_MS = 120000;

interface UseRestoreOptions {
  onComplete?: (restoredUrl: string, restorationId?: string) => void;
  onError?: (error: string) => void;
}

export function useRestore(options: UseRestoreOptions = {}) {
  const { onComplete, onError } = options;

  const [isRestoring, setIsRestoring] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [restorationId, setRestorationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Keep abort controller reference for cleanup
  const abortControllerRef = useRef<AbortController | null>(null);

  // Start restoration (synchronous - waits for result)
  // isTrial: true = 1K resolution, false = 2K resolution
  // email: required for saving restoration to Supabase
  const restore = useCallback(
    async (imageUrl: string, isTrial = false, email?: string) => {
      // Cancel any existing request
      abortControllerRef.current?.abort();

      setIsRestoring(true);
      setStatus("processing");
      setError(null);
      setRestoredUrl(null);
      setRestorationId(null);

      // Create new abort controller with timeout
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Set timeout
      const timeoutId = setTimeout(() => {
        abortController.abort();
      }, RESTORE_TIMEOUT_MS);

      try {
        const response = await fetch("/api/restore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, isTrial, email }),
          signal: abortController.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Erro ao restaurar");
        }

        if (data.status === "completed" && data.restoredUrl) {
          setStatus("completed");
          setRestoredUrl(data.restoredUrl);
          setRestorationId(data.restorationId || null);
          setIsRestoring(false);
          onComplete?.(data.restoredUrl, data.restorationId);
          return { restoredUrl: data.restoredUrl, restorationId: data.restorationId };
        } else {
          throw new Error(data.error || "Restauração falhou");
        }
      } catch (err) {
        clearTimeout(timeoutId);

        let errorMessage: string;
        if (err instanceof Error) {
          if (err.name === "AbortError") {
            errorMessage = "Tempo esgotado. A restauração está demorando mais que o esperado. Tente novamente.";
          } else {
            errorMessage = err.message;
          }
        } else {
          errorMessage = "Erro ao restaurar";
        }

        setError(errorMessage);
        setStatus("failed");
        setIsRestoring(false);
        onError?.(errorMessage);
        return null;
      }
    },
    [onComplete, onError]
  );

  // Reset state
  const reset = useCallback(() => {
    setIsRestoring(false);
    setStatus("idle");
    setRestoredUrl(null);
    setRestorationId(null);
    setError(null);
  }, []);

  return {
    restore,
    isRestoring,
    status,
    restoredUrl,
    restorationId,
    error,
    reset,
  };
}
