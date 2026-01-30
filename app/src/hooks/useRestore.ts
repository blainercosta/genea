"use client";

import { useState, useCallback } from "react";

interface UseRestoreOptions {
  onComplete?: (restoredUrl: string) => void;
  onError?: (error: string) => void;
}

export function useRestore(options: UseRestoreOptions = {}) {
  const { onComplete, onError } = options;

  const [isRestoring, setIsRestoring] = useState(false);
  const [status, setStatus] = useState<"idle" | "processing" | "completed" | "failed">("idle");
  const [restoredUrl, setRestoredUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Start restoration (synchronous - waits for result)
  const restore = useCallback(
    async (imageUrl: string) => {
      setIsRestoring(true);
      setStatus("processing");
      setError(null);
      setRestoredUrl(null);

      try {
        const response = await fetch("/api/restore", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl }),
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Erro ao restaurar");
        }

        if (data.status === "completed" && data.restoredUrl) {
          setStatus("completed");
          setRestoredUrl(data.restoredUrl);
          setIsRestoring(false);
          onComplete?.(data.restoredUrl);
          return data.restoredUrl;
        } else {
          throw new Error(data.error || "Restauração falhou");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro ao restaurar";
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
    setError(null);
  }, []);

  return {
    restore,
    isRestoring,
    status,
    restoredUrl,
    error,
    reset,
  };
}
