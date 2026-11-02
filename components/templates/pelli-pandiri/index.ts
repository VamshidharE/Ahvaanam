import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import PelliPandiriTemplate from "./PelliPandiriTemplate";

export const pelliPandiriDefinition: TemplateDefinition = {
  id: "pelli-pandiri",
  name: "Pelli Pandiri",
  category: "wedding",
  version: "1.0.0",
  description:
    "A grand traditional Telugu wedding invitation with temple entrance arch, sunset sky, 3D butterfly companion, auspicious toranam, and parchment scroll sections.",
  tags: [
    "traditional",
    "telugu",
    "south-indian",
    "temple",
    "pelli-pandiri",
    "butterfly",
    "royal",
    "gold",
  ],
  capabilities: {
    supportsProcessionVideo: true,
    supportsMusic: true,
    supportsGallery: true,
    supportsCountdown: true,
    supportsStoryTimeline: true,
    supportsFamilyTree: true,
    supportsCustomGanesha: true,
    supportsInteractiveEnvelope: false,
  },
  assets: {
    thumbnail: "/images/themes/pelli-pandiri.jpg",
    preview: "/images/themes/pelli-pandiri.jpg",
    backgrounds: {
      main: "/templates/pelli-pandiri/sky-background-v2.png",
      texture: "/templates/pelli-pandiri/decoration/parchment-bg.png",
    },
    defaultMusic: "/templates/pelli-pandiri/audio/ambient.mp3",
    decorations: {
      arch: "/templates/pelli-pandiri/temple-gopuram-v2.png",
      couple: "/templates/pelli-pandiri/Couple.png",
      gopuram: "/templates/pelli-pandiri/temple-gopuram-v2.png",
      toranam: "/templates/pelli-pandiri/decoration/toranam.png",
      pendant: "/templates/pelli-pandiri/decoration/pendant.png",
    },
  },
  tokens: {
    fonts: {
      heading: "'Cinzel', 'Playfair Display', Georgia, serif",
      body: "'Montserrat', sans-serif",
    },
    colors: {
      primary: "#c49a45",
      secondary: "#e6ca65",
      accent: "#f4ebd0",
      background: "#070b14",
      surface: "rgba(18, 12, 8, 0.92)",
      text: "#ffffff",
      mutedText: "#a89f91",
      border: "rgba(196, 154, 69, 0.4)",
    },
  },
  Component: ({ data, clientId, invitationData }: TemplateRenderProps) =>
    React.createElement(PelliPandiriTemplate, {
      invitationData: invitationData || data,
      clientId,
    }),
};

export default pelliPandiriDefinition;
export { PelliPandiriTemplate };
