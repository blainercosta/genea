"use client";

import { useState, useEffect, useCallback } from "react";
import type { User, Restoration, Adjustment } from "@/types";
import {
  getUser,
  saveUser,
  initUser,
  addCredits,
  consumeCredit as consumeCreditFromStorage,
  canRestore,
  isTrial,
  addRestoration,
  updateRestoration,
  getRestoration,
  getLatestRestoration,
  clearUserData,
  canAdjust as canAdjustFromStorage,
  addAdjustmentToRestoration,
  MAX_ADJUSTMENTS,
} from "@/lib/storage";

/**
 * Sync user data from Supabase
 */
async function syncFromSupabase(email: string): Promise<{
  credits: number;
  isTrialUsed: boolean;
  name?: string;
  phone?: string;
  taxId?: string;
} | null> {
  try {
    const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
    const data = await response.json();

    if (data.user) {
      return {
        credits: data.user.credits,
        isTrialUsed: data.user.isTrialUsed,
        name: data.user.name,
        phone: data.user.phone,
        taxId: data.user.taxId,
      };
    }
    return null;
  } catch (error) {
    console.error("Error syncing from Supabase:", error);
    return null;
  }
}

/**
 * Sync credit consumption to Supabase
 */
async function syncConsumeCredit(email: string): Promise<boolean> {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "consumeCredit", email }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error syncing credit consumption:", error);
    return false;
  }
}

/**
 * Sync trial usage to Supabase
 */
async function syncUseTrial(email: string): Promise<boolean> {
  try {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "useTrial", email }),
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("Error syncing trial usage:", error);
    return false;
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load user on mount and sync with Supabase
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = getUser();
      setUser(storedUser);

      // If user has email, sync from Supabase
      if (storedUser?.email) {
        setIsSyncing(true);
        const supabaseData = await syncFromSupabase(storedUser.email);

        if (supabaseData) {
          // Update localStorage with Supabase data (Supabase is source of truth for credits)
          const updatedUser: User = {
            ...storedUser,
            credits: supabaseData.credits,
            isTrialUsed: supabaseData.isTrialUsed,
            // Keep local name/phone/taxId if Supabase doesn't have them
            name: supabaseData.name || storedUser.name,
            phone: supabaseData.phone || storedUser.phone,
            taxId: supabaseData.taxId || storedUser.taxId,
          };
          saveUser(updatedUser);
          setUser(updatedUser);
        }
        setIsSyncing(false);
      }

      setIsLoading(false);
    };

    loadUser();
  }, []);

  // Initialize user with email and sync from Supabase
  const initialize = useCallback(async (email: string) => {
    // First create locally
    const newUser = initUser(email);
    setUser(newUser);

    // Then sync from Supabase (fire and forget, will update state when done)
    const supabaseData = await syncFromSupabase(email);
    if (supabaseData) {
      const updatedUser: User = {
        ...newUser,
        credits: supabaseData.credits,
        isTrialUsed: supabaseData.isTrialUsed,
        name: supabaseData.name || newUser.name,
        phone: supabaseData.phone || newUser.phone,
        taxId: supabaseData.taxId || newUser.taxId,
      };
      saveUser(updatedUser);
      setUser(updatedUser);
      return updatedUser;
    }

    return newUser;
  }, []);

  // Add credits to user
  const addUserCredits = useCallback((amount: number) => {
    const updated = addCredits(amount);
    setUser(updated);
    return updated;
  }, []);

  // Use a credit for restoration (syncs with Supabase)
  const consumeCredit = useCallback(() => {
    const currentUser = getUser();

    // First consume locally
    const success = consumeCreditFromStorage();
    if (success) {
      setUser(getUser());

      // Sync to Supabase in background
      if (currentUser?.email) {
        // Check if this was a trial consumption
        if (!currentUser.isTrialUsed) {
          syncUseTrial(currentUser.email);
        } else {
          syncConsumeCredit(currentUser.email);
        }
      }
    }
    return success;
  }, []);

  // Check if user can restore
  const checkCanRestore = useCallback(() => {
    return canRestore();
  }, []);

  // Check if this is a trial
  const checkIsTrial = useCallback(() => {
    return isTrial();
  }, []);

  // Get credits count
  const credits = user?.credits || 0;

  // Add a new restoration
  const createRestoration = useCallback((restoration: Restoration) => {
    addRestoration(restoration);
    setUser(getUser());
  }, []);

  // Update a restoration
  const updateUserRestoration = useCallback(
    (restorationId: string, updates: Partial<Restoration>) => {
      updateRestoration(restorationId, updates);
      setUser(getUser());
    },
    []
  );

  // Get a restoration
  const getUserRestoration = useCallback((restorationId: string) => {
    return getRestoration(restorationId);
  }, []);

  // Get latest restoration
  const getLatest = useCallback(() => {
    return getLatestRestoration();
  }, []);

  // Clear user data (for testing)
  const clearData = useCallback(() => {
    clearUserData();
    setUser(null);
  }, []);

  // Force sync from Supabase
  const syncCredits = useCallback(async () => {
    const currentUser = getUser();
    if (!currentUser?.email) return;

    setIsSyncing(true);
    const supabaseData = await syncFromSupabase(currentUser.email);

    if (supabaseData) {
      const updatedUser: User = {
        ...currentUser,
        credits: supabaseData.credits,
        isTrialUsed: supabaseData.isTrialUsed,
        name: supabaseData.name || currentUser.name,
        phone: supabaseData.phone || currentUser.phone,
        taxId: supabaseData.taxId || currentUser.taxId,
      };
      saveUser(updatedUser);
      setUser(updatedUser);
    }
    setIsSyncing(false);
  }, []);

  // Check if user can adjust a specific restoration
  const checkCanAdjust = useCallback((restorationId: string) => {
    return canAdjustFromStorage(restorationId);
  }, []);

  // Add an adjustment to a restoration
  const addAdjustment = useCallback(
    (restorationId: string, adjustment: Adjustment) => {
      const success = addAdjustmentToRestoration(restorationId, adjustment);
      if (success) {
        setUser(getUser());
      }
      return success;
    },
    []
  );

  return {
    user,
    isLoading,
    isSyncing,
    credits,
    initialize,
    addCredits: addUserCredits,
    consumeCredit,
    canRestore: checkCanRestore,
    isTrial: checkIsTrial,
    createRestoration,
    updateRestoration: updateUserRestoration,
    getRestoration: getUserRestoration,
    getLatestRestoration: getLatest,
    clearData,
    canAdjust: checkCanAdjust,
    addAdjustment,
    syncCredits,
    MAX_ADJUSTMENTS,
  };
}
