"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const southindianParticles = () => null;

export default function SouthIndianLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="south-indian"
        onBackToHub={onBackToHub}
        particlesComponent={southindianParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="South Indian Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
