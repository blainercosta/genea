import { NextRequest, NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import {
  isSupabaseConfigured,
  getUserByEmail,
  getOrCreateUser,
  consumeUserCredit,
  markTrialUsed,
  updateUserProfile,
} from "@/lib/supabase";

/**
 * GET /api/user?email=xxx
 * Get user data including credits from Supabase
 */
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "email is required" }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      // Return empty user if Supabase not configured (fallback to localStorage)
      return NextResponse.json({ user: null, source: "localStorage" });
    }

    const user = await getUserByEmail(email.toLowerCase().trim());

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        taxId: user.tax_id,
        credits: user.credits,
        isTrialUsed: user.is_trial_used,
      },
      source: "supabase",
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
  }
}

/**
 * POST /api/user
 * Create or update user, consume credit, or mark trial as used
 *
 * Actions:
 * - action: "sync" - Get or create user and return data
 * - action: "consumeCredit" - Consume one credit
 * - action: "useTrial" - Mark trial as used
 * - action: "updateProfile" - Update user profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, name, phone, taxId } = body;

    if (!action || !email) {
      return NextResponse.json(
        { error: "action and email are required" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({ success: false, source: "localStorage" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    switch (action) {
      case "sync": {
        const user = await getOrCreateUser(normalizedEmail);
        if (!user) {
          return NextResponse.json(
            { error: "Erro ao sincronizar usuário" },
            { status: 500 }
          );
        }

        // Update profile if provided
        if (name || phone || taxId) {
          await updateUserProfile(user.id, {
            ...(name && { name }),
            ...(phone && { phone }),
            ...(taxId && { tax_id: taxId }),
          });
        }

        return NextResponse.json({
          success: true,
          user: {
            id: user.id,
            email: user.email,
            name: name || user.name,
            phone: phone || user.phone,
            taxId: taxId || user.tax_id,
            credits: user.credits,
            isTrialUsed: user.is_trial_used,
          },
          source: "supabase",
        });
      }

      case "consumeCredit": {
        const user = await getUserByEmail(normalizedEmail);
        if (!user) {
          return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        // Check if user has credits
        if (user.credits <= 0) {
          return NextResponse.json({ success: false, reason: "no_credits" });
        }

        const consumed = await consumeUserCredit(user.id);
        return NextResponse.json({
          success: consumed,
          credits: consumed ? user.credits - 1 : user.credits,
        });
      }

      case "useTrial": {
        const user = await getOrCreateUser(normalizedEmail);
        if (!user) {
          return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
        }

        // Check if trial already used
        if (user.is_trial_used) {
          return NextResponse.json({ success: false, reason: "trial_already_used" });
        }

        const marked = await markTrialUsed(user.id);
        return NextResponse.json({ success: marked });
      }

      case "updateProfile": {
        const user = await getUserByEmail(normalizedEmail);
        if (!user) {
          return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
        }

        const updated = await updateUserProfile(user.id, {
          ...(name && { name }),
          ...(phone && { phone }),
          ...(taxId && { tax_id: taxId }),
        });

        return NextResponse.json({ success: updated });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("User API error:", error);
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 });
  }
}
