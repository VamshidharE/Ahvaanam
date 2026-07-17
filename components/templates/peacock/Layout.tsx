"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const peacockParticles = () => null;

export default function PeacockLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="peacock"
        onBackToHub={onBackToHub}
        particlesComponent={peacockParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Peacock Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
