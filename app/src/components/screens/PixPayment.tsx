"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Copy, Check, Clock, QrCode, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Header } from "@/components/layout";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/config/plans";

interface PixData {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  expiresAt: string;
  amount: number;
}

interface PlanData {
  id: string;
  name: string;
  photos: number;
  price: number;
}

interface PixPaymentProps {
  pix: PixData;
  plan: PlanData;
  onPaymentConfirmed: () => void;
  onExpired?: () => void;
  onCancel?: () => void;
}

// Maximum polling attempts (200 * 3s = ~10 minutes)
const MAX_POLL_ATTEMPTS = 200;

export function PixPayment({
  pix,
  plan,
  onPaymentConfirmed,
  onExpired,
  onCancel,
}: PixPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [status, setStatus] = useState<"pending" | "expired">("pending");
  const [isChecking, setIsChecking] = useState(false);
  const [checkCount, setCheckCount] = useState(0);
  const [lastCheckTime, setLastCheckTime] = useState<number | null>(null);
  const checkCountRef = useRef(0);

  // Calcula tempo restante
  useEffect(() => {
    const expiresAt = new Date(pix.expiresAt).getTime();

    const updateTime = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((expiresAt - now) / 1000));
      setTimeLeft(remaining);

      if (remaining === 0) {
        setStatus("expired");
        onExpired?.();
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [pix.expiresAt, onExpired]);

  // Poll para verificar status do pagamento
  const checkPaymentStatus = useCallback(async () => {
    if (isChecking) return;

    // Safety limit: stop polling after MAX_POLL_ATTEMPTS
    if (checkCountRef.current >= MAX_POLL_ATTEMPTS) {
      console.warn("Max polling attempts reached, stopping");
      setStatus("expired");
      onExpired?.();
      return;
    }

    setIsChecking(true);
    try {
      const response = await fetch(`/api/payment/pix?id=${pix.id}`);
      const data = await response.json();

      checkCountRef.current += 1;
      setCheckCount(checkCountRef.current);
      setLastCheckTime(Date.now());

      if (data.status === "COMPLETED") {
        onPaymentConfirmed();
      }
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
    } finally {
      setIsChecking(false);
    }
  }, [pix.id, onPaymentConfirmed, onExpired, isChecking]);

  // Polling a cada 3 segundos
  useEffect(() => {
    if (status === "expired") return;

    // Check immediately on mount
    checkPaymentStatus();

    const interval = setInterval(checkPaymentStatus, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]); // checkPaymentStatus omitted to avoid infinite loop

  // Manual check button
  const handleManualCheck = () => {
    if (!isChecking) {
      checkPaymentStatus();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pix.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Erro ao copiar:", error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (status === "expired") {
    return (
      <div className="min-h-screen bg-ih-bg flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-6 gap-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-ih-text">PIX expirado</h1>
            <p className="text-ih-text-secondary">
              O tempo para pagamento acabou. Gere um novo código.
            </p>
          </div>
          <Button onClick={onCancel}>Tentar novamente</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ih-bg flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 gap-8">
        {/* Timer */}
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full",
            timeLeft < 60 ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"
          )}
        >
          <Clock className="w-4 h-4" />
          <span className="font-medium">
            Pague em {formatTime(timeLeft)}
          </span>
        </div>

        {/* Plan info */}
        <div className="text-center space-y-1">
          <p className="text-sm text-ih-text-secondary">{plan.name}</p>
          <p className="text-3xl font-bold text-ih-text">
            {formatPrice(plan.price)}
          </p>
          <p className="text-sm text-ih-text-secondary">
            {plan.photos} {plan.photos === 1 ? "foto" : "fotos"}
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-6 rounded-2xl shadow-card">
          {pix.qrCodeBase64 ? (
            <img
              src={pix.qrCodeBase64.startsWith("data:")
                ? pix.qrCodeBase64
                : `data:image/png;base64,${pix.qrCodeBase64}`}
              alt="QR Code PIX"
              className="w-64 h-64"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
              <QrCode className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>

        {/* Copy paste */}
        <div className="w-full max-w-md space-y-3">
          <p className="text-center text-sm text-ih-text-secondary">
            Ou copie o código PIX:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={pix.copyPaste}
              readOnly
              className="flex-1 px-4 py-3 bg-ih-surface border border-ih-border rounded-xl text-sm text-ih-text truncate"
            />
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="flex-shrink-0"
            >
              {copied ? (
                <Check className="w-5 h-5" />
              ) : (
                <Copy className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2 max-w-sm">
          <p className="text-sm text-ih-text-secondary">
            1. Abra o app do seu banco
          </p>
          <p className="text-sm text-ih-text-secondary">
            2. Escolha pagar com PIX
          </p>
          <p className="text-sm text-ih-text-secondary">
            3. Escaneie o QR code ou cole o código
          </p>
        </div>

        {/* Status */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-ih-text-secondary">
            {isChecking ? (
              <Loader2 className="w-4 h-4 text-genea-green animate-spin" />
            ) : (
              <div className="w-2 h-2 bg-genea-green rounded-full animate-pulse" />
            )}
            <span className="text-sm">
              {isChecking ? "Verificando pagamento..." : "Aguardando pagamento..."}
            </span>
          </div>

          {/* Check count and manual refresh */}
          <div className="flex items-center gap-3 text-xs text-ih-text-muted">
            {checkCount > 0 && (
              <span>Verificado {checkCount}x</span>
            )}
            <button
              onClick={handleManualCheck}
              disabled={isChecking}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg transition-colors",
                isChecking
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-ih-surface hover:text-ih-text"
              )}
            >
              <RefreshCw className={cn("w-3 h-3", isChecking && "animate-spin")} />
              <span>Verificar agora</span>
            </button>
          </div>
        </div>

        {/* Cancel */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-ih-text-muted hover:text-ih-text underline"
          >
            Cancelar e voltar
          </button>
        )}
      </main>
    </div>
  );
}
