"use client";

import React, { use } from "react";
import { InvitationDataProvider, useInvitationData } from "../../../../components/context/InvitationDataContext";
import ThemeSelectorHub from "../../../../components/shared/ThemeSelectorHub";

function SelectorContent() {
  const { invitationData, loading } = useInvitationData();

  if (loading || !invitationData) {
    return (
      <div className="min-h-screen bg-[#05020B] flex items-center justify-center text-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-[#C59B27] text-[10px] uppercase tracking-[3px] font-semibold animate-pulse">Loading Comparison Hub</h2>
        </div>
      </div>
    );
  }

  return <ThemeSelectorHub />;
}

export default function ThemePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return (
    <InvitationDataProvider clientId={id}>
      <SelectorContent />
    </InvitationDataProvider>
  );
}
