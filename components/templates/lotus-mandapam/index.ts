import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import LotusMandapamTemplate from "./LotusMandapamTemplate";

export const lotusMandapamDefinition: TemplateDefinition = {
  id: "lotus-mandapam",
  name: "Lotus Mandapam",
  category: "wedding",
  version: "1.0.0",
  description: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery.",
  tags: [
    "temple",
    "mandap",
    "lotus",
    "traditional",
    "royal",
    "south-indian",
    "gold",
    "burgundy",
    "cinematic",
  ],
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
      texture: "/templates/emerald-palace/bg-family-embossed.jpg",
    },
    defaultMusic: "/wedding/rose-mandap/theme-music.MP3",
    decorations: {
      crest: "monogram",
      arch: "temple-gopuram",
      couple: "/templates/emerald-palace/couple-hero.webp",
    },
  },
  tokens: {
    fonts: {
      heading: "'Cinzel', Georgia, serif",
      body: "'Cormorant Garamond', Georgia, serif",
      accent: "'Playfair Display', Georgia, serif",
    },
    colors: {
      primary: "#C99A38",
      secondary: "#781D36",
      accent: "#5C1222",
      background: "#FFF6E9",
      surface: "#F7E8D0",
      text: "#542D2A",
      mutedText: "#7E5B58",
      border: "rgba(201, 154, 56, 0.45)",
    },
  },
  Component: ({ data, clientId, invitationData }: TemplateRenderProps) =>
    React.createElement(LotusMandapamTemplate, {
      invitationData: invitationData || data,
      clientId,
    }),
};

// Backward-compatible alias for sacred-courtyard
export const sacredCourtyardDefinition: TemplateDefinition = {
  ...lotusMandapamDefinition,
  id: "sacred-courtyard",
  name: "Lotus Mandapam",
};

export default lotusMandapamDefinition;
export { LotusMandapamTemplate };
