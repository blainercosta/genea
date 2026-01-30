"use client";

import { useState, useEffect } from "react";

/**
 * Hook para prevenir erros de hydration em componentes que usam localStorage
 * ou outras APIs do browser que não existem no servidor
 *
 * @returns boolean indicando se o componente foi hidratado
 *
 * @example
 * const hydrated = useHydrated();
 * if (!hydrated) return <LoadingSkeleton />;
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return hydrated;
}
