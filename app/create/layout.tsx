"use client";

import React from "react";
import { InvitationDataProvider } from "../../components/context/InvitationDataContext";

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  return (
    <InvitationDataProvider>
      {children}
    </InvitationDataProvider>
  );
}
