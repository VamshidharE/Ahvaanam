"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const grandmandapParticles = () => null;

export default function GrandMandapLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="grand-mandap"
        onBackToHub={onBackToHub}
        particlesComponent={grandmandapParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Grand Mandap Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
