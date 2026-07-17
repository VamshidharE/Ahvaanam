"use client";

import { useInvitationData } from "../../context/InvitationDataContext";
import LegacyOrchestrator from "../../shared/LegacyOrchestrator";

// --- TEMPLATE SPECIFIC PARTICLES ---
import React from "react";
const royaltempleParticles = () => null;

export default function RoyalTempleLayout({ onBackToHub }: { onBackToHub: () => void }) {
  const { invitationData } = useInvitationData();

  if (!invitationData) return null;

  return (
    <LegacyOrchestrator
        themeId="royal-temple"
        onBackToHub={onBackToHub}
        particlesComponent={royaltempleParticles}
        themeBgClass="bg-[#FAF9F6]"
        loadingTitle="Royal Temple Invitation"
        loadingSubtitle="Celebrating Love"
      />
  );
}
