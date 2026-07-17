"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const heritageParticles = () => null;

export default function HeritageLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="heritage"
        onBackToHub={onBackToHub}
        particlesComponent={heritageParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Heritage Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
