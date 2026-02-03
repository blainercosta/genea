import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL = "Genea <noreply@mail.genea.cc>";

/**
 * Send authentication code via email
 */
export async function sendAuthCodeEmail(
  to: string,
  code: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  if (!resend) {
    console.warn("Resend not configured, skipping auth email");
    return { success: false, error: "Email service not configured" };
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Código de acesso - Genea</title>
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
              <h2 style="margin: 0 0 16px; color: #111827; font-size: 24px; text-align: center;">Seu código de acesso</h2>
              <p style="margin: 0 0 24px; color: #374151; font-size: 16px; line-height: 1.6; text-align: center;">
                Use o código abaixo para acessar sua conta:
              </p>
              <div style="background-color: #f0fdf4; border-radius: 12px; padding: 24px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 4px; color: #16a34a; font-family: monospace;">
                  ${code}
                </p>
              </div>
              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; text-align: center;">
                Este código expira em <strong>10 minutos</strong>.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px; text-align: center;">
                Se você não solicitou este código, ignore este email.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 12px;">
                © ${new Date().getFullYear()} Genea. Todos os direitos reservados.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${code} é seu código de acesso - Genea`,
      html,
    });

    if (result.error) {
      console.error("Resend error:", result.error);
      return { success: false, error: result.error.message };
    }

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Failed to send auth email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
