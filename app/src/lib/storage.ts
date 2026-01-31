import type { User, Restoration, Payment, Adjustment } from "@/types";

const USER_STORAGE_KEY = "genea_user";
const RESTORATIONS_KEY = "genea_restorations";

/** Maximum adjustments allowed per restoration (paid users only) */
export const MAX_ADJUSTMENTS = 3;

/**
 * Get user data from localStorage
 */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const stored = localStorage.getItem(USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as User;
  } catch {
    return null;
  }
}

/**
 * Save user data to localStorage
 */
export function saveUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

/**
 * Initialize or get existing user by email
 */
export function initUser(email: string): User {
  const existing = getUser();

  if (existing && existing.email === email) {
    return existing;
  }

  const newUser: User = {
    email,
    credits: 0,
    isTrialUsed: false,
    restorations: [],
  };

  saveUser(newUser);
  return newUser;
}

/**
 * Add credits to user account
 */
export function addCredits(amount: number): User | null {
  const user = getUser();
  if (!user) return null;

  user.credits += amount;
  saveUser(user);
  return user;
}

/**
 * Use one credit for a restoration
 */
export function consumeCredit(): boolean {
  const user = getUser();
  if (!user) return false;

  // Trial flow - first photo is free
  if (!user.isTrialUsed) {
    user.isTrialUsed = true;
    saveUser(user);
    return true;
  }

  // Paid flow - need credits
  if (user.credits <= 0) return false;

  user.credits -= 1;
  saveUser(user);
  return true;
}

/**
 * Check if user can restore (has credits or trial available)
 */
export function canRestore(): boolean {
  const user = getUser();
  if (!user) return true; // New user can use trial

  return !user.isTrialUsed || user.credits > 0;
}

/**
 * Check if this is a trial restoration
 */
export function isTrial(): boolean {
  const user = getUser();
  return !user || !user.isTrialUsed;
}

/**
 * Get remaining credits
 */
export function getCredits(): number {
  const user = getUser();
  return user?.credits || 0;
}

/**
 * Add a restoration to user history
 */
export function addRestoration(restoration: Restoration): void {
  const user = getUser();
  if (!user) return;

  user.restorations.unshift(restoration);
  saveUser(user);
}

/**
 * Update a restoration status
 */
export function updateRestoration(
  restorationId: string,
  updates: Partial<Restoration>
): void {
  const user = getUser();
  if (!user) return;

  const index = user.restorations.findIndex((r) => r.id === restorationId);
  if (index === -1) return;

  user.restorations[index] = { ...user.restorations[index], ...updates };
  saveUser(user);
}

/**
 * Get a specific restoration
 */
export function getRestoration(restorationId: string): Restoration | null {
  const user = getUser();
  if (!user) return null;

  return user.restorations.find((r) => r.id === restorationId) || null;
}

/**
 * Get the latest restoration
 */
export function getLatestRestoration(): Restoration | null {
  const user = getUser();
  if (!user || user.restorations.length === 0) return null;

  return user.restorations[0];
}

/**
 * Update customer info (name, phone, CPF)
 */
export function updateCustomerInfo(info: {
  name?: string;
  phone?: string;
  taxId?: string;
}): User | null {
  const user = getUser();
  if (!user) return null;

  if (info.name) user.name = info.name;
  if (info.phone) user.phone = info.phone;
  if (info.taxId) user.taxId = info.taxId;

  saveUser(user);
  return user;
}

/**
 * Clear all user data (for testing)
 */
export function clearUserData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_STORAGE_KEY);
}

/**
 * Get adjustment count for a restoration
 */
export function getAdjustmentCount(restorationId: string): number {
  const restoration = getRestoration(restorationId);
  return restoration?.adjustments?.length || 0;
}

/**
 * Check if a restoration can have more adjustments
 * Only paid users can adjust, and there's a limit of MAX_ADJUSTMENTS per restoration
 */
export function canAdjust(restorationId: string): { allowed: boolean; remaining: number; reason?: string } {
  const user = getUser();

  // No user - cannot adjust
  if (!user) {
    return { allowed: false, remaining: 0, reason: "no_user" };
  }

  // Trial users cannot adjust
  if (!user.isTrialUsed) {
    return { allowed: false, remaining: 0, reason: "trial_user" };
  }

  // Check if this was a trial restoration (first restoration with no credits at the time)
  // If user has never had credits and only used trial, they can't adjust
  const restoration = getRestoration(restorationId);
  if (!restoration) {
    return { allowed: false, remaining: 0, reason: "no_restoration" };
  }

  // Check adjustment limit
  const currentCount = restoration.adjustments?.length || 0;
  const remaining = MAX_ADJUSTMENTS - currentCount;

  if (remaining <= 0) {
    return { allowed: false, remaining: 0, reason: "limit_reached" };
  }

  return { allowed: true, remaining };
}

/**
 * Add an adjustment to a restoration (appends to existing adjustments)
 */
export function addAdjustmentToRestoration(
  restorationId: string,
  adjustment: Adjustment
): boolean {
  const user = getUser();
  if (!user) return false;

  const index = user.restorations.findIndex((r) => r.id === restorationId);
  if (index === -1) return false;

  const restoration = user.restorations[index];
  const currentAdjustments = restoration.adjustments || [];

  // Check limit before adding
  if (currentAdjustments.length >= MAX_ADJUSTMENTS) {
    return false;
  }

  user.restorations[index] = {
    ...restoration,
    adjustments: [...currentAdjustments, adjustment],
  };

  saveUser(user);
  return true;
}
