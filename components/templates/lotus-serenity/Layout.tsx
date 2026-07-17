"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const lotusserenityParticles = () => null;

export default function LotusSerenityLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="lotus-serenity"
        onBackToHub={onBackToHub}
        particlesComponent={lotusserenityParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Lotus Serenity Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
