import React from "react";

/**
 * Strongly typed normalized data contract consumed by all templates.
 */
export interface InvitationData {
  id: string;
  category: "wedding" | "engagement" | "birthday" | "housewarming" | "babyshower" | "halfsaree" | "retirement" | "corporate" | string;
  themeId: string;
  themeVersion?: string;

  // Couple / Host Details
  couple: {
    primarySide: "groom" | "bride";
    groom: {
      name: string;
      surname?: string;
      parents?: string;
      bio?: string;
      image?: string;
      familyTitle?: string;
    };
    bride: {
      name: string;
      surname?: string;
      parents?: string;
      bio?: string;
      image?: string;
      familyTitle?: string;
    };
  };

  // Ceremonial Introduction
  introduction: {
    mantra: string;
    eyebrow: string;
    message: string;
    familyTitle: string;
    subText?: string;
  };

  // Schedule & Key Ceremonies
  wedding: {
    date: string;
    day?: string;
    time: string;
    countdownTarget: string;
    venue: string;
    city: string;
    mapsLink?: string;
    mapsEmbedUrl?: string;
  };

  // Optional Secondary Venue (e.g. Reception)
  reception?: {
    enabled: boolean;
    title: string;
    venue: string;
    city: string;
    address?: string;
    date: string;
    time: string;
    mapsLink?: string;
    mapsEmbedUrl?: string;
  };

  // Multi-day Event Ceremonies
  events: Array<{
    id: string;
    enabled: boolean;
    title: string;
    date: string;
    time: string;
    venue: string;
    description?: string;
    icon?: string;
    image?: string;
  }>;

  // Family Lineage & Greetings
  family: {
    title: string;
    groomFamilyTitle?: string;
    brideFamilyTitle?: string;
    groomParents?: string;
    brideParents?: string;
    groomPortrait?: string;
    bridePortrait?: string;
    groomFamily: Array<{ relation?: string; name: string }>;
    brideFamily: Array<{ relation?: string; name: string }>;
  };

  // Story & Timeline
  story: {
    enabled: boolean;
    title: string;
    text: string;
    couplePhoto?: string;
    timeline?: Array<{ title: string; date: string; description: string; image?: string }>;
  };

  // Gallery Photos
  gallery: {
    enabled: boolean;
    title: string;
    images: Array<{ src: string; alt?: string; caption?: string }>;
    layoutType?: "masonry" | "carousel" | "grid";
  };

  // RSVP Configuration
  rsvp: {
    enabled: boolean;
    title: string;
    message?: string;
    deadline?: string;
    buttonText?: string;
    whatsappNumber?: string;
    whatsappLabel?: string;
    contacts: Array<{ type: string; label: string; value: string }>;
  };

  // Audio & Soundtrack
  music: {
    enabled: boolean;
    themeMusic?: string;
    processionMusic?: string;
    autoplay?: boolean;
  };

  // Section Ordering & Enabled Flags
  sectionOrder: string[];
  sections: {
    showAnnouncement: boolean;
    showEvents: boolean;
    showProcession: boolean;
    showFamily: boolean;
    showGallery: boolean;
    showVenue: boolean;
    showCountdown: boolean;
    showRSVP: boolean;
    showFooter: boolean;
  };

  // Footer & Credits
  footer: {
    quote?: string;
    designer?: string;
    service?: string;
    location?: string;
    contact?: string;
  };

  // Optional pass-through raw configuration dictionary
  rawConfig?: Record<string, any>;
}

export interface TemplateAssets {
  /** Marketplace catalog thumbnail */
  thumbnail: string;
  /** High-resolution preview image for theme selection modal */
  preview: string;
  /** Live invitation background textures and SVGs (never catalog thumbnails) */
  backgrounds?: {
    main?: string;
    overlay?: string;
    texture?: string;
  };
  /** Audio defaults */
  defaultMusic?: string;
  /** Custom decorative graphics (arches, pillars, lamps, borders) */
  decorations?: Record<string, string>;
}

export interface TemplateCapabilities {
  supportsProcessionVideo: boolean;
  supportsMusic: boolean;
  supportsGallery: boolean;
  supportsCountdown: boolean;
  supportsStoryTimeline: boolean;
  supportsFamilyTree: boolean;
  supportsCustomGanesha: boolean;
  supportsInteractiveEnvelope: boolean;
}

export interface TemplateRenderProps {
  data: InvitationData;
  clientId?: string;
  isPreview?: boolean;
  isEmbedded?: boolean;
  /** Backward compatibility with components expecting raw config */
  invitationData?: any;
}

export interface TemplateDefinition {
  /** Unique immutable ID, e.g. "rose-mandap", "royal-temple" */
  id: string;
  /** Human-readable template display name */
  name: string;
  /** Event Category */
  category: "wedding" | "engagement" | "birthday" | "housewarming" | "babyshower" | "halfsaree" | "retirement" | "corporate" | string;
  /** Semantic version string */
  version: string;
  /** Template description for catalog */
  description: string;
  /** Tags for search & filtering */
  tags: string[];
  /** Supported capability flags */
  capabilities: TemplateCapabilities;
  /** Asset mapping */
  assets: TemplateAssets;
  /** Default typography and colors */
  tokens?: {
    fonts?: {
      heading: string;
      body: string;
      accent?: string;
    };
    colors?: {
      primary: string;
      secondary?: string;
      accent: string;
      background: string;
      surface?: string;
      text: string;
      mutedText?: string;
      border?: string;
    };
  };
  /** Factory producing initial data for newly created invitations */
  getDefaultData?: () => Partial<InvitationData>;
  /** The root React component implementing the template */
  Component: React.ComponentType<TemplateRenderProps>;
}
