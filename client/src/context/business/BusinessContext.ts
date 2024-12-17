import { createContext } from "react";
import { BusinessProfile } from "@/types";

interface BusinessContextType {
  isBusinessSetup: boolean;
  businessProfile: BusinessProfile | null;
  isLoading: boolean;
  error: Error | null;
}

export const BusinessContext = createContext<BusinessContextType>({
  isBusinessSetup: false,
  businessProfile: null,
  isLoading: false,
  error: null,
});
