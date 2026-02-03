import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";
import { isValidEmail } from "@/lib/validation";
import {
  isSupabaseConfigured,
  createAuthCode,
  verifyAuthCode,
  getUserByEmail,
} from "@/lib/supabase";
import { sendAuthCodeEmail } from "@/lib/resend-auth";

/**
 * POST /api/auth
 * Send auth code to email or verify code
 *
 * For sending code:
 * - action: "send"
 * - email: string
 *
 * For verifying code:
 * - action: "verify"
 * - email: string
 * - code: string
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, code } = body;

    if (!action || !email) {
      return NextResponse.json(
        { error: "action and email are required" },
        { status: 400 }
      );
    }

    // Validate email
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Serviço de autenticação não configurado" },
        { status: 503 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (action === "send") {
      // Rate limit: 3 code sends per minute
      const rateLimitResponse = await checkRateLimit(
        request,
        "authCode",
        RATE_LIMITS.authCode
      );
      if (rateLimitResponse) return rateLimitResponse;

      // Create auth code
      const authCode = await createAuthCode(normalizedEmail);
      if (!authCode) {
        return NextResponse.json(
          { error: "Erro ao gerar código de acesso" },
          { status: 500 }
        );
      }

      // Send email with code
      const emailResult = await sendAuthCodeEmail(normalizedEmail, authCode);
      if (!emailResult.success) {
        console.error("Failed to send auth email:", emailResult.error);
        return NextResponse.json(
          { error: "Erro ao enviar email. Tente novamente." },
          { status: 500 }
        );
      }

      // Check if user exists and has credits
      const existingUser = await getUserByEmail(normalizedEmail);
      const hasCredits = existingUser && existingUser.credits > 0;
      const isTrialUsed = existingUser?.is_trial_used ?? false;

      return NextResponse.json({
        success: true,
        message: "Código enviado para seu email",
        hasCredits,
        isTrialUsed,
        isNewUser: !existingUser,
      });
    }

    if (action === "verify") {
      // Rate limit: 5 verify attempts per minute
      const rateLimitResponse = await checkRateLimit(
        request,
        "authVerify",
        RATE_LIMITS.authVerify
      );
      if (rateLimitResponse) return rateLimitResponse;

      if (!code) {
        return NextResponse.json(
          { error: "Código é obrigatório" },
          { status: 400 }
        );
      }

      // Verify code
      const result = await verifyAuthCode(normalizedEmail, code);
      if (!result.valid || !result.user) {
        return NextResponse.json(
          { error: "Código inválido ou expirado" },
          { status: 401 }
        );
      }

      // Return user data
      return NextResponse.json({
        success: true,
        user: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          phone: result.user.phone,
          taxId: result.user.tax_id,
          credits: result.user.credits,
          isTrialUsed: result.user.is_trial_used,
        },
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Erro no servidor" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/auth?email=xxx
 * Check if user exists and has credits
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "email is required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Serviço não configurado" },
        { status: 503 }
      );
    }

    const user = await getUserByEmail(email.toLowerCase().trim());

    return NextResponse.json({
      exists: !!user,
      hasCredits: user ? user.credits > 0 : false,
      isTrialUsed: user?.is_trial_used ?? false,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Erro no servidor" },
      { status: 500 }
    );
  }
}
