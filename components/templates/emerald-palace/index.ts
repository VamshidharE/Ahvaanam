import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import EmeraldPalaceTemplate from "./EmeraldPalaceTemplate";

export const emeraldPalaceDefinition: TemplateDefinition = {
  id: "emerald-palace",
  name: "Emerald Palace Royale",
  category: "wedding",
  version: "1.0.0",
  description: "Royal Rajputana heritage court, multi-foil Jharokha archway, glowing wax seal envelope opening, antique brass lanterns, falling jasmine petals, and imperial banquet typography.",
  tags: ["palace", "emerald", "gold", "royal", "heritage", "jharokha", "luxury", "udaivilas"],
  capabilities: {
    supportsProcessionVideo: false,
    supportsMusic: true,
    supportsGallery: true,
    supportsCountdown: true,
    supportsStoryTimeline: true,
    supportsFamilyTree: true,
    supportsCustomGanesha: true,
    supportsInteractiveEnvelope: true,
  },
  assets: {
    thumbnail: "/images/categories/wedding.jpg",
    preview: "/images/categories/wedding.jpg",
    backgrounds: {
      main: "/wedding/rose-mandap/background/bg.png",
    },
    defaultMusic: "/wedding/rose-mandap/theme-music.MP3",
    decorations: {
      crest: "monogram",
      arch: "jharokha",
    },
  },
  tokens: {
    fonts: {
      heading: "'Cinzel', Georgia, serif",
      body: "'Cormorant Garamond', Georgia, serif",
      accent: "'Great Vibes', cursive",
    },
    colors: {
      primary: "#DFB759",
      secondary: "#0C2B22",
      accent: "#8B1E2F",
      background: "#FAF5EB",
      surface: "rgba(250, 245, 235, 0.9)",
      text: "#241D17",
      mutedText: "#6B5C50",
      border: "rgba(223, 183, 89, 0.45)",
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
