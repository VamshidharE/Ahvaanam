"use client";

import React, { createContext, useContext } from "react";
import { RoseMandapData, mapInvitationConfigToRoseMandap } from "./adapter";

const RoseMandapContext = createContext<RoseMandapData>(mapInvitationConfigToRoseMandap({}));

export function RoseMandapProvider({
  data,
  children,
}: {
  data: RoseMandapData;
  children: React.ReactNode;
}) {
  return (
    <RoseMandapContext.Provider value={data}>
      {children}
    </RoseMandapContext.Provider>
  );
}

export function useRoseMandap(): RoseMandapData {
  return useContext(RoseMandapContext);
}
