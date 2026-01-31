import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Genea <noreply@mail.genea.cc>";

/**
 * Escape HTML to prevent XSS in email templates
 */
function escapeHtml(str: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}

export type EmailTemplate =
  | "welcome"
  | "restoration_complete"
  | "payment_confirmed"
  | "refund_processed";

export interface WelcomeData {
  name?: string;
}

export interface RestorationCompleteData {
  name?: string;
  restorationUrl: string;
}

export interface PaymentConfirmedData {
  name?: string;
  planName: string;
  credits: number;
  amount: number;
}

export interface RefundProcessedData {
  name?: string;
  amount: number;
}

type EmailDataMap = {
  welcome: WelcomeData;
  restoration_complete: RestorationCompleteData;
  payment_confirmed: PaymentConfirmedData;
  refund_processed: RefundProcessedData;
};

export interface SendEmailParams<T extends EmailTemplate> {
  to: string;
  template: T;
  data: EmailDataMap[T];
}

/**
 * Check if Resend is configured
 */
export function isResendConfigured(): boolean {
  return resend !== null;
}

/**
 * Base email layout
 */
function emailLayout(content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Genea</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #16a34a; padding: 24px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Genea</h1>
              <p style="margin: 4px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Restauração de Fotos com IA</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 32px 24px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                © ${new Date().getFullYear()} Genea. Todos os direitos reservados.
              </p>
              <p style="margin: 8px 0 0; color: #9ca3af; font-size: 11px;">
                Este é um email automático. Por favor, não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Email templates
 */
const templates: Record<
  EmailTemplate,
  { subject: string; getHtml: (data: unknown) => string }
> = {
  welcome: {
    subject: "Bem-vindo ao Genea! 🎉",
    getHtml: (data: unknown) => {
      const { name } = data as WelcomeData;
      const safeName = name ? escapeHtml(name) : "";
      const greeting = safeName ? `Olá, ${safeName}!` : "Olá!";
      return emailLayout(`
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">${greeting}</h2>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
          Seja bem-vindo ao <strong>Genea</strong>! Estamos felizes em ter você conosco.
        </p>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
          Com o Genea, você pode restaurar suas fotos antigas e dar nova vida às memórias da sua família usando inteligência artificial de última geração.
        </p>
        <div style="background-color: #f0fdf4; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #166534; font-size: 14px;">
            🎁 <strong>Você tem 1 restauração gratuita!</strong> Experimente agora mesmo.
          </p>
        </div>
        <a href="https://genea.cc/upload" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Restaurar minha primeira foto
        </a>
      `);
    },
  },

  restoration_complete: {
    subject: "Sua foto foi restaurada! ✨",
    getHtml: (data: unknown) => {
      const { name, restorationUrl } = data as RestorationCompleteData;
      const safeName = name ? escapeHtml(name) : "";
      const safeUrl = escapeHtml(restorationUrl);
      const greeting = safeName ? `${safeName}, sua` : "Sua";
      return emailLayout(`
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">${greeting} foto ficou incrível!</h2>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
          A restauração da sua foto foi concluída com sucesso. Nossa IA trabalhou para trazer de volta todos os detalhes e cores originais.
        </p>
        <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            ⏰ <strong>Atenção:</strong> O link para download expira em 24 horas.
          </p>
        </div>
        <a href="${safeUrl}" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Ver minha foto restaurada
        </a>
        <p style="margin: 24px 0 0; color: #6b7280; font-size: 14px;">
          Gostou do resultado? Compartilhe com seus amigos e familiares!
        </p>
      `);
    },
  },

  payment_confirmed: {
    subject: "Pagamento confirmado! 💚",
    getHtml: (data: unknown) => {
      const { name, planName, credits, amount } = data as PaymentConfirmedData;
      const safeName = name ? escapeHtml(name) : "";
      const safePlanName = escapeHtml(planName);
      const greeting = safeName ? `Obrigado, ${safeName}!` : "Obrigado!";
      return emailLayout(`
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">${greeting}</h2>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
          Seu pagamento foi confirmado e seus créditos já estão disponíveis para uso.
        </p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-size: 14px;">Plano</span>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                <span style="color: #111827; font-size: 14px; font-weight: 600;">${safePlanName}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-size: 14px;">Créditos</span>
              </td>
              <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                <span style="color: #111827; font-size: 14px; font-weight: 600;">${credits} ${credits === 1 ? "foto" : "fotos"}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0;">
                <span style="color: #6b7280; font-size: 14px;">Valor</span>
              </td>
              <td style="padding: 8px 0; text-align: right;">
                <span style="color: #16a34a; font-size: 18px; font-weight: 700;">R$ ${amount.toFixed(2).replace(".", ",")}</span>
              </td>
            </tr>
          </table>
        </div>
        <a href="https://genea.cc/upload" style="display: inline-block; background-color: #16a34a; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Restaurar minhas fotos
        </a>
      `);
    },
  },

  refund_processed: {
    subject: "Reembolso processado",
    getHtml: (data: unknown) => {
      const { name, amount } = data as RefundProcessedData;
      const safeName = name ? escapeHtml(name) : "";
      const greeting = safeName ? `Olá, ${safeName}!` : "Olá!";
      return emailLayout(`
        <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px;">${greeting}</h2>
        <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6;">
          Seu reembolso foi processado com sucesso.
        </p>
        <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <p style="margin: 0 0 4px; color: #6b7280; font-size: 14px;">Valor reembolsado</p>
          <p style="margin: 0; color: #16a34a; font-size: 28px; font-weight: 700;">R$ ${amount.toFixed(2).replace(".", ",")}</p>
        </div>
        <p style="margin: 0 0 16px; color: #374151; font-size: 16px; line-height: 1.6;">
          O valor será creditado na sua conta em até <strong>3 dias úteis</strong>, dependendo do seu banco.
        </p>
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          Se tiver alguma dúvida, entre em contato conosco respondendo este email.
        </p>
      `);
    },
  },
};

/**
 * Send an email using a template
 */
export async function sendEmail<T extends EmailTemplate>(
  params: SendEmailParams<T>
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.warn("Resend not configured, skipping email");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const template = templates[params.template];
  const html = template.getHtml(params.data);

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: template.subject,
      html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(to: string, name?: string) {
  return sendEmail({
    to,
    template: "welcome",
    data: { name },
  });
}

/**
 * Send restoration complete email
 */
export async function sendRestorationCompleteEmail(
  to: string,
  restorationUrl: string,
  name?: string
) {
  return sendEmail({
    to,
    template: "restoration_complete",
    data: { name, restorationUrl },
  });
}

/**
 * Send payment confirmed email
 */
export async function sendPaymentConfirmedEmail(
  to: string,
  planName: string,
  credits: number,
  amount: number,
  name?: string
) {
  return sendEmail({
    to,
    template: "payment_confirmed",
    data: { name, planName, credits, amount },
  });
}

/**
 * Send refund processed email
 */
export async function sendRefundProcessedEmail(
  to: string,
  amount: number,
  name?: string
) {
  return sendEmail({
    to,
    template: "refund_processed",
    data: { name, amount },
  });
}
