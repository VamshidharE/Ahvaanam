"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const moonlightParticles = () => null;

export default function MoonlightLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="moonlight"
        onBackToHub={onBackToHub}
        particlesComponent={moonlightParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Moonlight Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
