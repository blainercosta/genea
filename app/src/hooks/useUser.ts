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
  getCredits,
  addRestoration,
  updateRestoration,
  getRestoration,
  getLatestRestoration,
  clearUserData,
  canAdjust as canAdjustFromStorage,
  addAdjustmentToRestoration,
  MAX_ADJUSTMENTS,
} from "@/lib/storage";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const storedUser = getUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  // Initialize user with email
  const initialize = useCallback((email: string) => {
    const newUser = initUser(email);
    setUser(newUser);
    return newUser;
  }, []);

  // Add credits to user
  const addUserCredits = useCallback((amount: number) => {
    const updated = addCredits(amount);
    setUser(updated);
    return updated;
  }, []);

  // Use a credit for restoration
  const consumeCredit = useCallback(() => {
    const success = consumeCreditFromStorage();
    if (success) {
      setUser(getUser());
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
    MAX_ADJUSTMENTS,
  };
}
