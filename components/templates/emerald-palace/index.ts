import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import EmeraldPalaceTemplate from "./EmeraldPalaceTemplate";

export const emeraldPalaceDefinition: TemplateDefinition = {
  id: "emerald-palace",
  name: "Emerald Palace Royale",
  category: "wedding",
  version: "2.0.0",
  description: "Cinematic South Indian temple sunrise, ornamental ivory invitation plaque, bougainvillea floral borders, deep burgundy organic story, and 4 auspicious royal celebration panels.",
  tags: ["temple", "mandap", "burgundy", "ivory", "gold", "royal", "south-indian", "luxury", "bougainvillea"],
  capabilities: {
    supportsProcessionVideo: true,
    supportsMusic: true,
    supportsGallery: true,
    supportsCountdown: true,
    supportsStoryTimeline: true,
    supportsFamilyTree: true,
    supportsCustomGanesha: true,
    supportsInteractiveEnvelope: true,
  },
  assets: {
    thumbnail: "/templates/emerald-palace/hero-temple-sunset.jpg",
    preview: "/templates/emerald-palace/hero-temple-sunset.jpg",
    backgrounds: {
      main: "/templates/emerald-palace/hero-temple-sunset.jpg",
    },
    defaultMusic: "/wedding/rose-mandap/theme-music.MP3",
    decorations: {
      crest: "monogram",
      arch: "temple-gopuram",
    },
  },
  tokens: {
    fonts: {
      heading: "'Cinzel', Georgia, serif",
      body: "'Cormorant Garamond', Georgia, serif",
      accent: "'Great Vibes', cursive",
    },
    colors: {
      primary: "#D6AD63",
      secondary: "#781D36",
      accent: "#65182F",
      background: "#FFF6E9",
      surface: "#F7E8D0",
      text: "#542D2A",
      mutedText: "#7E5B58",
      border: "rgba(214, 173, 99, 0.45)",
    },
  },
  Component: ({ data, clientId, invitationData }: TemplateRenderProps) =>
    React.createElement(EmeraldPalaceTemplate, {
      invitationData: invitationData || data,
      clientId,
    }),
};

export default emeraldPalaceDefinition;
export { EmeraldPalaceTemplate };
