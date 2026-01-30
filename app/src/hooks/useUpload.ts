"use client";

import { useState, useCallback } from "react";
import type { UploadResponse } from "@/types";

interface UseUploadOptions {
  onSuccess?: (url: string) => void;
  onError?: (error: string) => void;
}

export function useUpload(options: UseUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const upload = useCallback(
    async (file: File) => {
      setIsUploading(true);
      setProgress(0);
      setError(null);
      setUploadedUrl(null);

      try {
        // Simulate progress for UX
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);
        setProgress(100);

        const data: UploadResponse = await response.json();

        if (!data.success || !data.url) {
          throw new Error(data.error || "Upload failed");
        }

        setUploadedUrl(data.url);
        options.onSuccess?.(data.url);

        return data.url;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro ao fazer upload";
        setError(errorMessage);
        options.onError?.(errorMessage);
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setIsUploading(false);
    setProgress(0);
    setError(null);
    setUploadedUrl(null);
  }, []);

  return {
    upload,
    isUploading,
    progress,
    error,
    uploadedUrl,
    reset,
  };
}
