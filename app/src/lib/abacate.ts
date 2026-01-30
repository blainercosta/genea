/**
 * Integração com Abacate Pay para pagamentos via PIX
 *
 * TODO: Implementar após obter credenciais
 * - Cadastrar em https://abacatepay.com/
 * - Configurar ABACATE_API_KEY no .env.local
 * - Configurar ABACATE_WEBHOOK_SECRET no .env.local
 *
 * Documentação: https://docs.abacatepay.com/
 */

const ABACATE_API_URL = "https://api.abacatepay.com/v1";

export interface PixResponse {
  id: string;
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  expiresAt: string;
}

/**
 * Verifica se o Abacate Pay está configurado
 */
export function isAbacateConfigured(): boolean {
  return Boolean(process.env.ABACATE_API_KEY);
}

/**
 * Gera um código PIX para pagamento
 * TODO: Implementar chamada real à API
 */
export async function generatePix(
  amount: number,
  description: string,
  customerEmail: string
): Promise<PixResponse> {
  if (!isAbacateConfigured()) {
    throw new Error("ABACATE_API_KEY não configurada");
  }

  // TODO: Implementar
  // const response = await fetch(`${ABACATE_API_URL}/billing/pix`, {
  //   method: "POST",
  //   headers: {
  //     "Authorization": `Bearer ${process.env.ABACATE_API_KEY}`,
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     amount,
  //     description,
  //     customer: { email: customerEmail },
  //   }),
  // });

  throw new Error("Integração com Abacate Pay não implementada");
}

/**
 * Valida assinatura de webhook do Abacate Pay
 * TODO: Implementar
 */
export function validateWebhookSignature(
  payload: string,
  signature: string
): boolean {
  // TODO: Implementar validação HMAC
  return false;
}
