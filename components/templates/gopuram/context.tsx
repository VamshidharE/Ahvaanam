"use client";

import React, { createContext, useContext } from "react";
import { GopuramData } from "./adapter";

interface GopuramContextValue {
  data: GopuramData;
  clientId: string;
  isEmbedded?: boolean;
}

const GopuramContext = createContext<GopuramContextValue | null>(null);

export const GopuramProvider: React.FC<{
  value: GopuramContextValue;
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <GopuramContext.Provider value={value}>
      {children}
    </GopuramContext.Provider>
  );
};

export function useGopuram(): GopuramContextValue {
  const ctx = useContext(GopuramContext);
  if (!ctx) {
    throw new Error("useGopuram must be used within a GopuramProvider");
  }
  return ctx;
}
