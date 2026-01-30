import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/email
 * Envia emails transacionais via Resend
 *
 * TODO: Integrar com Resend API
 * - npm install resend
 * - Configurar RESEND_API_KEY no .env.local
 * - Criar templates de email
 */

interface EmailRequest {
  to: string;
  type: "welcome" | "restoration_complete" | "payment_confirmed" | "refund_processed";
  data?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const { to, type, data } = (await request.json()) as EmailRequest;

    if (!to || !type) {
      return NextResponse.json(
        { error: "to e type são obrigatórios" },
        { status: 400 }
      );
    }

    // TODO: Implementar integração com Resend
    // const { Resend } = require("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    //
    // const templates = {
    //   welcome: {
    //     subject: "Bem-vindo ao Genea!",
    //     html: `<h1>Olá!</h1><p>Sua primeira restauração está pronta...</p>`,
    //   },
    //   restoration_complete: {
    //     subject: "Sua foto foi restaurada!",
    //     html: `<h1>Ficou linda!</h1><p>Acesse para ver o resultado...</p>`,
    //   },
    //   payment_confirmed: {
    //     subject: "Pagamento confirmado - Genea",
    //     html: `<h1>Obrigado!</h1><p>Você agora tem ${data?.credits} créditos...</p>`,
    //   },
    //   refund_processed: {
    //     subject: "Reembolso processado - Genea",
    //     html: `<h1>Reembolso enviado</h1><p>O valor será creditado em até 24h...</p>`,
    //   },
    // };
    //
    // await resend.emails.send({
    //   from: "Genea <noreply@genea.com.br>",
    //   to,
    //   subject: templates[type].subject,
    //   html: templates[type].html,
    // });

    return NextResponse.json(
      {
        error: "Integração com Resend não implementada",
        message: "Configure RESEND_API_KEY e implemente os templates",
        type,
        to,
      },
      { status: 501 }
    );
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return NextResponse.json(
      { error: "Erro ao enviar email" },
      { status: 500 }
    );
  }
}
