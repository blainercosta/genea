import { createClient } from "@supabase/supabase-js";

/**
 * User type from database
 */
export interface DbUser {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  tax_id: string | null;
  credits: number;
  is_trial_used: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Auth code type from database
 */
export interface DbAuthCode {
  id: string;
  email: string;
  code: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

/**
 * Restoration type from database
 */
export interface DbRestoration {
  id: string;
  user_id: string;
  original_url: string;
  restored_url: string | null;
  status: "pending" | "processing" | "completed" | "failed";
  is_paid: boolean;
  created_at: string;
  completed_at: string | null;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get Supabase client instance
 */
export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    return null;
  }

  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }

  return supabaseInstance;
}

/**
 * Check if Supabase is configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseUrl && !!supabaseAnonKey;
}

/**
 * Generate a 6-digit auth code
 */
export function generateAuthCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Create or get user by email
 */
export async function getOrCreateUser(email: string): Promise<DbUser | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const normalizedEmail = email.toLowerCase().trim();

  // Try to get existing user
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizedEmail)
    .single();

  if (existingUser) {
    return existingUser as DbUser;
  }

  // Create new user
  const { data: newUser, error } = await supabase
    .from("users")
    .insert({ email: normalizedEmail, credits: 0, is_trial_used: false } as never)
    .select()
    .single();

  if (error) {
    console.error("Error creating user:", error);
    return null;
  }

  return newUser as DbUser;
}

/**
 * Create auth code for email verification
 */
export async function createAuthCode(email: string): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const code = generateAuthCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  // Invalidate any existing codes for this email
  await supabase
    .from("auth_codes")
    .update({ used: true } as never)
    .eq("email", email.toLowerCase().trim())
    .eq("used", false);

  // Create new code
  const { error } = await supabase.from("auth_codes").insert({
    email: email.toLowerCase().trim(),
    code,
    expires_at: expiresAt,
    used: false,
  } as never);

  if (error) {
    console.error("Error creating auth code:", error);
    return null;
  }

  return code;
}

/**
 * Verify auth code
 */
export async function verifyAuthCode(
  email: string,
  code: string
): Promise<{ valid: boolean; user?: DbUser }> {
  const supabase = getSupabase();
  if (!supabase) return { valid: false };

  const normalizedEmail = email.toLowerCase().trim();

  // Find valid code
  const { data: authCodeData } = await supabase
    .from("auth_codes")
    .select("*")
    .eq("email", normalizedEmail)
    .eq("code", code)
    .eq("used", false)
    .gt("expires_at", new Date().toISOString())
    .single();

  const authCode = authCodeData as DbAuthCode | null;

  if (!authCode) {
    return { valid: false };
  }

  // Mark code as used
  await supabase.from("auth_codes").update({ used: true } as never).eq("id", authCode.id);

  // Get or create user
  const user = await getOrCreateUser(normalizedEmail);
  if (!user) {
    return { valid: false };
  }

  return { valid: true, user };
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .single();

  return data as DbUser | null;
}

/**
 * User with restorations - combined type for JOIN query
 */
export interface DbUserWithRestorations extends DbUser {
  restorations: DbRestoration[];
}

/**
 * Get user by email with restorations in a single query (avoids N+1)
 */
export async function getUserWithRestorations(email: string): Promise<DbUserWithRestorations | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      restorations (*)
    `)
    .eq("email", email.toLowerCase().trim())
    .single();

  if (error || !data) {
    return null;
  }

  // Sort restorations by created_at descending
  const user = data as DbUserWithRestorations;
  if (user.restorations) {
    user.restorations.sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  return user;
}

/**
 * Update user credits
 */
export async function updateUserCredits(userId: string, credits: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("users")
    .update({ credits, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return !error;
}

/**
 * Add credits to user
 */
export async function addUserCredits(userId: string, creditsToAdd: number): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  // Get current credits
  const { data: userData } = await supabase.from("users").select("credits").eq("id", userId).single();
  const user = userData as { credits: number } | null;
  if (!user) return false;

  const newCredits = (user.credits || 0) + creditsToAdd;

  const { error } = await supabase
    .from("users")
    .update({ credits: newCredits, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return !error;
}

/**
 * Consume one credit from user
 */
export async function consumeUserCredit(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  // Get current credits
  const { data: userData } = await supabase.from("users").select("credits").eq("id", userId).single();
  const user = userData as { credits: number } | null;
  if (!user || user.credits <= 0) return false;

  const { error } = await supabase
    .from("users")
    .update({ credits: user.credits - 1, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return !error;
}

/**
 * Mark trial as used
 */
export async function markTrialUsed(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("users")
    .update({ is_trial_used: true, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return !error;
}

/**
 * Update user profile
 */
export async function updateUserProfile(
  userId: string,
  data: { name?: string; phone?: string; tax_id?: string }
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("users")
    .update({ ...data, updated_at: new Date().toISOString() } as never)
    .eq("id", userId);

  return !error;
}

// ============================================
// RESTORATIONS
// ============================================

/**
 * Create a new restoration record
 */
export async function createRestoration(data: {
  userId: string;
  originalUrl: string;
  isTrial: boolean;
}): Promise<DbRestoration | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: restoration, error } = await supabase
    .from("restorations")
    .insert({
      user_id: data.userId,
      original_url: data.originalUrl,
      status: "processing",
      is_paid: !data.isTrial,
    } as never)
    .select()
    .single();

  if (error) {
    console.error("Error creating restoration:", error);
    return null;
  }

  return restoration as DbRestoration;
}

/**
 * Update restoration after processing completes
 */
export async function updateRestorationStatus(
  restorationId: string,
  data: {
    status: "completed" | "failed";
    restoredUrl?: string;
  }
): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const updateData: Record<string, unknown> = {
    status: data.status,
  };

  if (data.restoredUrl) {
    updateData.restored_url = data.restoredUrl;
  }

  if (data.status === "completed") {
    updateData.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("restorations")
    .update(updateData as never)
    .eq("id", restorationId);

  if (error) {
    console.error("Error updating restoration:", error);
    return false;
  }

  return true;
}

/**
 * Mark restoration as paid (when user unlocks trial photo)
 */
export async function markRestorationAsPaid(restorationId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  const { error } = await supabase
    .from("restorations")
    .update({ is_paid: true } as never)
    .eq("id", restorationId);

  return !error;
}

/**
 * Get all restorations for a user
 */
export async function getRestorationsByUserId(userId: string): Promise<DbRestoration[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("restorations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching restorations:", error);
    return [];
  }

  return (data || []) as DbRestoration[];
}

/**
 * Get a specific restoration by ID
 */
export async function getRestorationById(restorationId: string): Promise<DbRestoration | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("restorations")
    .select("*")
    .eq("id", restorationId)
    .single();

  if (error) {
    console.error("Error fetching restoration:", error);
    return null;
  }

  return data as DbRestoration;
}
