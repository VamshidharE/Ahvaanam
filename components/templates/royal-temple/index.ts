import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import RoyalTempleTemplate from "./RoyalTempleTemplate";

export const royalTempleDefinition: TemplateDefinition = {
  id: "royal-temple",
  name: "Royal Temple",
  category: "wedding",
  version: "1.0.0",
  description: "Ornate carved stone pillars, grand temple arch, brass samayi diyas, golden bells, and sacred Vedic ambiance.",
  tags: ["traditional", "temple", "gold", "royal", "sandstone", "maroon", "vedic"],
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
    thumbnail: "/images/themes/royal-temple.jpg",
    preview: "/images/themes/royal-temple.jpg",
    backgrounds: {
      main: "/templates/royal-temple/backgrounds/temple_backdrop.jpg",
      texture: "/templates/royal-temple/backgrounds/parchment_bg.jpg",
    },
    defaultMusic: "/wedding/rose-mandap/theme-music.MP3",
    decorations: {
      arch: "/templates/royal-temple/architecture/temple_arch.png",
      pillarLeft: "/templates/royal-temple/architecture/pillar_left.png",
      pillarRight: "/templates/royal-temple/architecture/pillar_right.png",
      floorUrlis: "/templates/royal-temple/architecture/floor_urlis.png",
      diyaLeft: "/templates/royal-temple/decorations/diya_left.png",
      diyaRight: "/templates/royal-temple/decorations/diya_right.png",
      templeBell: "/templates/royal-temple/decorations/temple_bell.png",
    },
  },
  tokens: {
    fonts: {
      heading: "'Cinzel', Georgia, serif",
      body: "'Cormorant Garamond', Georgia, serif",
    },
    colors: {
      primary: "#c59b27",
      secondary: "#8c6b12",
      accent: "#68121a",
      background: "#fcf8f0",
      surface: "#f9f3e5",
      text: "#2b1d14",
      mutedText: "#6e5c4f",
      border: "rgba(197, 155, 39, 0.4)",
    },
  },
  Component: ({ data, clientId, invitationData }: TemplateRenderProps) =>
    React.createElement(RoyalTempleTemplate, {
      data,
      clientId,
      invitationData,
    }),
};

export default royalTempleDefinition;
export { RoyalTempleTemplate };
