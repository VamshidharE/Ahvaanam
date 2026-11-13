"use client";

import React, { createContext, useContext } from "react";
import { EmeraldPalaceData, mapInvitationConfigToEmeraldPalace } from "./adapter";

const EmeraldPalaceContext = createContext<EmeraldPalaceData>(
  mapInvitationConfigToEmeraldPalace({})
);

export function EmeraldPalaceProvider({
  children,
  data,
}: {
  children: React.ReactNode;
  data: EmeraldPalaceData;
}) {
  return (
    <EmeraldPalaceContext.Provider value={data}>
      {children}
    </EmeraldPalaceContext.Provider>
  );
}

export function useEmeraldPalace(): EmeraldPalaceData {
  return useContext(EmeraldPalaceContext);
}
