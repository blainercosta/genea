/**
 * Integração com Abacate Pay para pagamentos via PIX
 *
 * Documentação: https://docs.abacatepay.com/
 *
 * Variáveis de ambiente necessárias:
 * - ABACATE_API_KEY: Chave de API do Abacate Pay
 * - ABACATE_WEBHOOK_SECRET: Segredo para validar webhooks (opcional)
 */

import crypto from "crypto";

const ABACATE_API_URL = "https://api.abacatepay.com/v1";

// Tempo de expiração do PIX em segundos (30 minutos)
const PIX_EXPIRATION_SECONDS = 1800;

/**
 * Resposta da API ao criar PIX
 */
export interface AbacatePixResponse {
  error: string | null;
  data: {
    id: string;
    status: "PENDING" | "COMPLETED" | "EXPIRED" | "REFUNDED";
    brCode: string;
    brCodeBase64: string;
    amount: number;
    expiresAt: string;
  };
}

/**
 * Resposta formatada para o frontend
 */
export interface PixPaymentData {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  expiresAt: string;
  amount: number;
}

/**
 * Dados do cliente para criação do PIX
 */
export interface PixCustomer {
  name?: string;
  email: string;
  cellphone?: string;
  taxId?: string;
}

/**
 * Evento de webhook do Abacate Pay
 */
export interface AbacateWebhookEvent {
  event: "BILLING_PAID" | "BILLING_EXPIRED" | "BILLING_REFUNDED";
  data: {
    id: string;
    status: string;
    amount: number;
    metadata?: Record<string, string>;
  };
}

/**
 * Verifica se o Abacate Pay está configurado
 */
export function isAbacateConfigured(): boolean {
  return Boolean(process.env.ABACATE_API_KEY);
}

/**
 * Faz uma requisição para a API do Abacate Pay
 */
async function abacateRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const apiKey = process.env.ABACATE_API_KEY;

  if (!apiKey) {
    throw new Error("ABACATE_API_KEY não configurada");
  }

  const response = await fetch(`${ABACATE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const result = await response.json();

  if (!response.ok || result.error) {
    throw new Error(result.error || `Erro na API: ${response.status}`);
  }

  return result;
}

/**
 * Gera um código PIX para pagamento
 *
 * @param amountInReais - Valor em reais (ex: 29.90)
 * @param description - Descrição do pagamento
 * @param customer - Dados do cliente
 * @param metadata - Dados extras para identificar o pagamento (planId, etc)
 */
export async function generatePix(
  amountInReais: number,
  description: string,
  customer: PixCustomer,
  metadata?: Record<string, string>
): Promise<PixPaymentData> {
  // API espera valor em centavos
  const amountInCents = Math.round(amountInReais * 100);

  const payload = {
    amount: amountInCents,
    description,
    expiresIn: PIX_EXPIRATION_SECONDS,
    customer: {
      email: customer.email,
      ...(customer.name && { name: customer.name }),
      ...(customer.cellphone && { cellphone: customer.cellphone }),
      ...(customer.taxId && { taxId: customer.taxId }),
    },
    ...(metadata && { metadata }),
  };

  const response = await abacateRequest<AbacatePixResponse>(
    "/pixQrCode/create",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return {
    id: response.data.id,
    qrCode: response.data.brCode,
    qrCodeBase64: response.data.brCodeBase64,
    copyPaste: response.data.brCode,
    expiresAt: response.data.expiresAt,
    amount: amountInReais,
  };
}

/**
 * Consulta o status de um pagamento PIX
 */
export async function getPixStatus(pixId: string): Promise<{
  id: string;
  status: "PENDING" | "COMPLETED" | "EXPIRED" | "REFUNDED";
  amount: number;
}> {
  const response = await abacateRequest<AbacatePixResponse>(
    `/pixQrCode/${pixId}`
  );

  return {
    id: response.data.id,
    status: response.data.status,
    amount: response.data.amount / 100, // Converte centavos para reais
  };
}

/**
 * Chave pública do Abacate Pay para validação HMAC
 * Fonte: https://docs.abacatepay.com/pages/webhooks
 */
const ABACATE_PUBLIC_KEY =
  "t9dXRhHHo3yDEj5pVDYz0frf7q6bMKyMRmxxCPIPp3RCplBfXRxqlC6ZpiWmOqj4L63qEaeUOtrCI8P0VMUgo6iIga2ri9ogaHFs0WIIywSMg0q7RmBfybe1E5XJcfC4IW3alNqym0tXoAKkzvfEjZxV6bE0oG2zJrNNYmUCKZyV0KZ3JS8Votf9EAWWYdiDkMkpbMdPggfh1EqHlVkMiTady6jOR3hyzGEHrIz2Ret0xHKMbiqkr9HS1JhNHDX9";

/**
 * Valida assinatura de webhook do Abacate Pay
 *
 * O Abacate Pay suporta duas formas de validação:
 * 1. Query string: ?webhookSecret=xxx (validado pelo secret configurado no webhook)
 * 2. Header X-Webhook-Signature: HMAC-SHA256 com chave pública fixa
 *
 * @param payload - Body raw da requisição
 * @param signature - Header X-Webhook-Signature (opcional)
 * @param querySecret - Query param webhookSecret (opcional)
 */
export function validateWebhookSignature(
  payload: string,
  signature: string | null,
  querySecret?: string | null
): boolean {
  const configuredSecret = process.env.ABACATE_WEBHOOK_SECRET;

  // Método 1: Validação via query string
  if (querySecret && configuredSecret) {
    if (querySecret === configuredSecret) {
      console.log("Webhook validated via query string secret");
      return true;
    }
  }

  // Método 2: Validação via HMAC com chave pública
  if (signature) {
    try {
      const expectedSignature = crypto
        .createHmac("sha256", ABACATE_PUBLIC_KEY)
        .update(payload)
        .digest("hex");

      const isValid = crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      );

      if (isValid) {
        console.log("Webhook validated via HMAC signature");
        return true;
      }
    } catch (error) {
      console.error("Error validating HMAC signature:", error);
    }
  }

  // Método 3: Em desenvolvimento, permite sem validação
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    console.warn("DEV MODE: Webhook validation bypassed");
    return true;
  }

  // Em produção, se nenhuma validação passou, rejeita
  console.error("Webhook validation failed: no valid signature or secret");
  return false;
}

/**
 * Processa evento de webhook do Abacate Pay
 */
export function parseWebhookEvent(body: string): AbacateWebhookEvent {
  return JSON.parse(body) as AbacateWebhookEvent;
}

/**
 * Tipos de chave PIX suportados
 */
export type PixKeyType = "CPF" | "CNPJ" | "PHONE" | "EMAIL" | "RANDOM" | "BR_CODE";

/**
 * Resposta da API ao criar saque/withdrawal
 */
export interface AbacateWithdrawalResponse {
  error: string | null;
  data: {
    id: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    amount: number;
    createdAt: string;
  };
}

/**
 * Detecta o tipo de chave PIX automaticamente
 */
export function detectPixKeyType(key: string): PixKeyType {
  const cleaned = key.trim();

  // Email
  if (cleaned.includes("@")) {
    return "EMAIL";
  }

  // BR Code (PIX copia e cola)
  if (cleaned.length > 50 && cleaned.includes("br.gov.bcb.pix")) {
    return "BR_CODE";
  }

  const digitsOnly = cleaned.replace(/\D/g, "");

  // CNPJ (14 digits)
  if (digitsOnly.length === 14) {
    return "CNPJ";
  }

  // CPF (11 digits)
  if (digitsOnly.length === 11) {
    // Check if it's a phone (starts with DDD)
    const ddd = parseInt(digitsOnly.substring(0, 2));
    if (ddd >= 11 && ddd <= 99 && digitsOnly[2] === "9") {
      return "PHONE";
    }
    return "CPF";
  }

  // Phone (10-11 digits)
  if (digitsOnly.length >= 10 && digitsOnly.length <= 11) {
    return "PHONE";
  }

  // Random key (UUID-like, 32-36 characters)
  return "RANDOM";
}

/**
 * Cria um saque/withdrawal (usado para reembolsos)
 *
 * @param amountInReais - Valor em reais (mínimo R$3,50)
 * @param pixKey - Chave PIX do destinatário
 * @param externalId - ID único da operação no seu sistema
 * @param description - Descrição do saque
 */
export async function createWithdrawal(
  amountInReais: number,
  pixKey: string,
  externalId: string,
  description?: string
): Promise<{
  id: string;
  status: string;
  amount: number;
}> {
  // Minimum amount is 350 cents (R$3.50)
  const amountInCents = Math.round(amountInReais * 100);

  if (amountInCents < 350) {
    throw new Error("Valor mínimo para saque é R$3,50");
  }

  const pixKeyType = detectPixKeyType(pixKey);

  const payload = {
    externalId,
    method: "PIX",
    amount: amountInCents,
    pix: {
      type: pixKeyType,
      key: pixKey.trim(),
    },
    ...(description && { description }),
  };

  const response = await abacateRequest<AbacateWithdrawalResponse>(
    "/withdraw/create",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  return {
    id: response.data.id,
    status: response.data.status,
    amount: amountInReais,
  };
}
