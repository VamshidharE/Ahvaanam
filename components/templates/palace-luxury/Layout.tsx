"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const GoldFoilParticles = () => null;

export default function PalaceLuxuryLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="palace-luxury"
        onBackToHub={onBackToHub}
        particlesComponent={GoldFoilParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Palace Luxury Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
