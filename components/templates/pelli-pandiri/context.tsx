"use client";

import React, { createContext, useContext } from "react";
import { PelliPandiriData } from "./adapter";

interface PelliPandiriContextValue {
  data: PelliPandiriData;
  clientId: string;
  isEmbedded: boolean;
}

const PelliPandiriContext = createContext<PelliPandiriContextValue | undefined>(undefined);

export const PelliPandiriProvider: React.FC<{
  value: PelliPandiriContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <PelliPandiriContext.Provider value={value}>
      {children}
    </PelliPandiriContext.Provider>
  );
};

export function usePelliPandiri(): PelliPandiriContextValue {
  const context = useContext(PelliPandiriContext);
  if (!context) {
    throw new Error("usePelliPandiri must be used within a PelliPandiriProvider");
  }
  return context;
}
