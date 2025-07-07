import React, { createContext, ReactNode } from "react";
import { useCVData, UseCVDataReturn } from "@/hooks/useCVData";

const CVDataContext = createContext<UseCVDataReturn | null>(null);

interface CVDataProviderProps {
  children: ReactNode;
}

export const CVDataProvider: React.FC<CVDataProviderProps> = ({ children }) => {
  const cvDataHook = useCVData();

  return (
    <CVDataContext.Provider value={cvDataHook}>
      {children}
    </CVDataContext.Provider>
  );
};

export { CVDataContext };
