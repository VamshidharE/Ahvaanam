import React from "react";
import { TemplateDefinition, TemplateRenderProps } from "@/lib/template-engine/types";
import RoseMandapTemplate from "./RoseMandapTemplate";

export const roseMandapDefinition: TemplateDefinition = {
  id: "rose-mandap",
  name: "Rose Mandap",
  category: "wedding",
  version: "1.0.0",
  description: "Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation.",
  tags: ["mandap", "rose", "procession", "animated", "traditional", "royal"],
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
    thumbnail: "/images/themes/rose-mandap.jpg",
    preview: "/images/themes/rose-mandap.jpg",
    backgrounds: {
      main: "/wedding/rose-mandap/background/bg.png",
    },
    defaultMusic: "/wedding/rose-mandap/theme-music.MP3",
    decorations: {
      arch: "/wedding/rose-mandap/mandap/mandap-arch.png",
      pedestal: "/wedding/rose-mandap/Pedestal/pedestal.png",
      couple: "/wedding/rose-mandap/couple/couple.png",
      bell1: "/wedding/rose-mandap/bells/bell 1.png",
      bell2: "/wedding/rose-mandap/bells/bell 2.png",
      elephantLeft: "/wedding/rose-mandap/elephants/Elephant-left.png",
      elephantRight: "/wedding/rose-mandap/elephants/Elephant-right.png",
      flowerLeft: "/wedding/rose-mandap/flowers/flower left.png",
      flowerRight: "/wedding/rose-mandap/flowers/flower right.png",
    },
  },
  tokens: {
    fonts: {
      heading: "'Cormorant Garamond', Georgia, serif",
      body: "'Cormorant Garamond', Georgia, serif",
    },
    colors: {
      primary: "#b8872f",
      secondary: "#8f641f",
      accent: "#b8872f",
      background: "#fbf5e9",
      surface: "rgba(255, 250, 241, 0.85)",
      text: "#63451f",
      mutedText: "#8f641f",
      border: "rgba(184, 135, 47, 0.35)",
    },
  },
  Component: ({ data, clientId, invitationData }: TemplateRenderProps) =>
    React.createElement(RoseMandapTemplate, {
      invitationData: invitationData || data,
      clientId,
    }),
};

export default roseMandapDefinition;
export { RoseMandapTemplate };
