import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import GopuramTemplate from "./GopuramTemplate";

export const gopuramDefinition: TemplateDefinition = {
  id: "gopuram",
  name: "Gopuram",
  category: "wedding",
  version: "1.0.0",
  description:
    "A majestic Dravidian temple gopuram invitation featuring a towering gopuram entrance, rising couple reveal, sunset skies, authentic sacred ambiance, and continuous parchment celebration sections.",
  tags: [
    "traditional",
    "gopuram",
    "temple",
    "butterfly",
    "royal",
    "gold",
    "animated",
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
    thumbnail: "/images/themes/gopuram.jpg",
    preview: "/images/themes/gopuram.jpg",
    backgrounds: {
      main: "/templates/gopuram/sky-background-v2.png",
      texture: "/templates/gopuram/decoration/invitation-background.png",
    },
    defaultMusic: "",
    decorations: {
      arch: "/templates/gopuram/temple-gopuram-v2.png",
      couple: "/templates/gopuram/Couple.png",
      gopuram: "/templates/gopuram/temple-gopuram-v2.png",
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
      background: "#0a0807",
      surface: "rgba(18, 12, 8, 0.92)",
      text: "#ffffff",
      mutedText: "#a89f91",
      border: "rgba(196, 154, 69, 0.4)",
    },
  },
  Component: ({ data, clientId, invitationData }: TemplateRenderProps) =>
    React.createElement(GopuramTemplate, {
      invitationData: invitationData || data,
      clientId,
    }),
};

export default gopuramDefinition;
export { GopuramTemplate };
