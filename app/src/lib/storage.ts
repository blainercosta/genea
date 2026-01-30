import type { User, Restoration, Payment } from "@/types";

const USER_STORAGE_KEY = "genea_user";
const RESTORATIONS_KEY = "genea_restorations";

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
