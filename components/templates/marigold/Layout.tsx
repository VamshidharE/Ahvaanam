"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const marigoldParticles = () => null;

export default function MarigoldLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="marigold"
        onBackToHub={onBackToHub}
        particlesComponent={marigoldParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Marigold Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
