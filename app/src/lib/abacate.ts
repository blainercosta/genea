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
 * Valida assinatura de webhook do Abacate Pay
 * Usa HMAC SHA256 para validar a integridade da requisição
 */
export function validateWebhookSignature(
  payload: string,
  signature: string
): boolean {
  const secret = process.env.ABACATE_WEBHOOK_SECRET;

  if (!secret) {
    console.warn("ABACATE_WEBHOOK_SECRET não configurado - pulando validação");
    return true; // Em dev, aceita sem validar
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Processa evento de webhook do Abacate Pay
 */
export function parseWebhookEvent(body: string): AbacateWebhookEvent {
  return JSON.parse(body) as AbacateWebhookEvent;
}
