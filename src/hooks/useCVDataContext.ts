import { useContext } from "react";
import { CVDataContext } from "@/contexts/CVDataContext";
import type { UseCVDataReturn } from "@/hooks/useCVData";

export const useCVDataContext = (): UseCVDataReturn => {
  const context = useContext(CVDataContext);
  if (context === null) {
    throw new Error("useCVDataContext must be used within a CVDataProvider");
  }
  return context;
};
