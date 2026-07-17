"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const floralgardenParticles = () => null;

export default function FloralGardenLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="floral-garden"
        onBackToHub={onBackToHub}
        particlesComponent={floralgardenParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Floral Garden Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
