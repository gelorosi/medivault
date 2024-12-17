import React from "react";
import { useBusinessSetupStatus } from "@/hooks/useBusinessProfile";
import { BusinessContext } from "./BusinessContext";
import { useAuth } from "@/context/auth";

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const { data: setupStatus, isLoading, error } = useBusinessSetupStatus();
  const { isAuthenticated } = useAuth();

  const effectiveLoading = isAuthenticated && isLoading;

  const value = {
    isBusinessSetup: setupStatus?.isSetup ?? false,
    businessProfile: setupStatus?.profile ?? null,
    isLoading: effectiveLoading,
    error: error as Error | null,
  };

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
}
