/**
 * Integração com Resend para emails transacionais
 *
 * TODO: Implementar após obter credenciais
 * - npm install resend
 * - Cadastrar em https://resend.com/
 * - Configurar RESEND_API_KEY no .env.local
 * - Verificar domínio para envio
 *
 * Documentação: https://resend.com/docs
 */

// import { Resend } from "resend";
//
// if (!process.env.RESEND_API_KEY) {
//   throw new Error("RESEND_API_KEY não configurada");
// }
//
// export const resend = new Resend(process.env.RESEND_API_KEY);

export type EmailTemplate =
  | "welcome"
  | "restoration_complete"
  | "payment_confirmed"
  | "refund_processed";

export interface EmailData {
  to: string;
  template: EmailTemplate;
  data?: Record<string, unknown>;
}

/**
 * Verifica se o Resend está configurado
 */
export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/**
 * Envia um email usando template
 * TODO: Implementar
 */
export async function sendEmail(email: EmailData): Promise<void> {
  if (!isResendConfigured()) {
    throw new Error("RESEND_API_KEY não configurada");
  }

  // TODO: Implementar
  // const templates: Record<EmailTemplate, { subject: string; getHtml: (data: any) => string }> = {
  //   welcome: {
  //     subject: "Bem-vindo ao Genea!",
  //     getHtml: () => "...",
  //   },
  //   restoration_complete: {
  //     subject: "Sua foto foi restaurada!",
  //     getHtml: (data) => `... ${data.restorationUrl} ...`,
  //   },
  //   payment_confirmed: {
  //     subject: "Pagamento confirmado - Genea",
  //     getHtml: (data) => `... ${data.credits} créditos ...`,
  //   },
  //   refund_processed: {
  //     subject: "Reembolso processado - Genea",
  //     getHtml: (data) => `... R$ ${data.amount} ...`,
  //   },
  // };
  //
  // const template = templates[email.template];
  // await resend.emails.send({
  //   from: "Genea <noreply@genea.com.br>",
  //   to: email.to,
  //   subject: template.subject,
  //   html: template.getHtml(email.data),
  // });

  throw new Error("Integração com Resend não implementada");
}
