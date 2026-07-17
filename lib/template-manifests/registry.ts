import { TemplateManifest, TemplateSection, TemplateNavigationItem, TemplateFeatures } from "./types";

// Standard Wedding Sections List
const WEDDING_SECTIONS: TemplateSection[] = [
  {
    id: "hero",
    title: "Welcome Banner",
    icon: "Sliders",
    order: 1,
    enabled: true,
    editableFields: [
      "hero.title",
      "hero.subtitle",
      "hero.welcomeMessage",
      "hero.heroImage",
      "hero.ctaText",
      "hero.surname",
      "hero.subText"
    ],
    description: "Configures the top welcome slide image, tagline, and CTA options."
  },
  {
    id: "couple",
    title: "Bride & Groom Details",
    icon: "Heart",
    order: 2,
    enabled: true,
    editableFields: [
      "couple.title",
      "couple.groom.name",
      "couple.groom.parents",
      "couple.groom.bio",
      "couple.groom.image",
      "couple.bride.name",
      "couple.bride.parents",
      "couple.bride.bio",
      "couple.bride.image"
    ],
    description: "Configures names, parents, and biography details of the couple."
  },
  {
    id: "countdown",
    title: "Wedding Countdown",
    icon: "Calendar",
    order: 3,
    enabled: true,
    editableFields: [
      "countdown.title",
      "countdown.targetDate",
      "countdown.timezone",
      "countdown.postWeddingMessage"
    ],
    description: "Interactive Muhurtham timer counting down to the main wedding ceremony."
  },
  {
    id: "story",
    title: "Love Story Timeline",
    icon: "Palette",
    order: 4,
    enabled: true,
    editableFields: ["story.title", "story.timeline"],
    description: "A chronological list of milestone events in the relationship."
  },
  {
    id: "events",
    title: "Ceremonies Schedule",
    icon: "Calendar",
    order: 5,
    enabled: true,
    editableFields: ["events"],
    description: "List of sub-events (e.g. Sangeet, Mehendi, reception) with date and venue coordinates."
  },
  {
    id: "gallery",
    title: "Photo Gallery",
    icon: "Palette",
    order: 6,
    enabled: true,
    editableFields: ["gallery.title", "gallery.images", "gallery.layoutType"],
    description: "Configures slideshow and moments photo grid layouts."
  },
  {
    id: "venue",
    title: "Location Venues Map",
    icon: "MapPin",
    order: 7,
    enabled: true,
    editableFields: ["venue"],
    description: "Traditional address text alongside embedded interactive maps."
  },
  {
    id: "families",
    title: "Warm Greetings / Families",
    icon: "Heart",
    order: 8,
    enabled: true,
    editableFields: ["families.title", "families.brideFamily", "families.groomFamily"],
    description: "A dedicated greeting card showing members of both families."
  },
  {
    id: "rsvp",
    title: "Confirmation RSVP Info",
    icon: "MapPin",
    order: 9,
    enabled: true,
    editableFields: ["rsvp.title", "rsvp.contacts"],
    description: "Interactive RSVP buttons and contact coordinates."
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: "Shirt",
    order: 10,
    enabled: true,
    editableFields: ["faq.title", "faq.entries"],
    description: "Helpful Q&A list items for guests (e.g. transport, accommodation details)."
  },
  {
    id: "dressCode",
    title: "Dress Code & Theme Colors",
    icon: "Shirt",
    order: 11,
    enabled: true,
    editableFields: ["dressCode.title", "dressCode.code", "dressCode.description", "dressCode.colors"],
    description: "Color palette circles and styling guidelines for attendees."
  },
  {
    id: "footer",
    title: "Page Credits / Footer",
    icon: "Sliders",
    order: 12,
    enabled: true,
    editableFields: ["footer.title", "footer.creditText", "footer.salutation"],
    description: "Closing family credits and designer watermark details."
  }
];

// Standard Wedding Sidebar Navigation Groups
const WEDDING_NAVIGATION: TemplateNavigationItem[] = [
  {
    id: "general",
    label: "General & Reorder",
    icon: "Sliders",
    sections: ["hero", "footer"]
  },
  {
    id: "couple",
    label: "Bride & Groom",
    icon: "Heart",
    sections: ["couple"]
  },
  {
    id: "events",
    label: "Events Schedule",
    icon: "Calendar",
    sections: ["events", "countdown"]
  },
  {
    id: "story",
    label: "Love Story",
    icon: "Palette",
    sections: ["story"]
  },
  {
    id: "venues",
    label: "Venues & RSVP",
    icon: "MapPin",
    sections: ["venue", "rsvp"]
  },
  {
    id: "details",
    label: "FAQs & Dress Code",
    icon: "Shirt",
    sections: ["faq", "dressCode"]
  }
];

// Standard capabilities of wedding layouts
const WEDDING_FEATURES: TemplateFeatures = {
  supportsGallery: true,
  supportsCountdown: true,
  supportsMusic: true,
  supportsVideo: false,
  supportsMaps: true,
  supportsRSVP: true,
  supportsGiftRegistry: false,
  supportsQRCode: false,
  supportsTimeline: true,
  supportsSchedule: true,
  supportsFamily: true,
  supportsStory: true,
  supportsSponsors: false,
  supportsRegistration: false,
  supportsBranding: true,
  supportsCustomCSS: false,
  supportsAnalytics: false
};

// Default values factory
const createWeddingDefaults = (themeId: string) => ({
  themeId,
  sectionOrder: WEDDING_SECTIONS.map((s) => s.id),
  themeSettings: {
    showParticles: true,
    particleType: "dust",
    borderStyle: "gold",
    heroAnimation: "zoom"
  },
  music: {
    enabled: true,
    file: "/music/theme.mp3"
  }
});

// Wedding Themes definitions
const WEDDING_THEMES = [
  { id: "royal-temple", name: "Royal Temple Layout", desc: "Ornate golden pillars, traditional arches, and gold leaf detailing." },
  { id: "floral-garden", name: "Floral Garden Layout", desc: "Rose gold accents, blooming borders, and pastel overlays." },
  { id: "south-indian", name: "South Indian Traditional", desc: "Muted copper tones, banana leaf frames, and sacred marigolds." },
  { id: "palace-luxury", name: "Palace Luxury Layout", desc: "Grand palace gates, royal red velvet overlays, and gold borders." },
  { id: "lotus-serenity", name: "Lotus Serenity Layout", desc: "Sacred pink lotus blossoms and glowing golden spiritual overlays." },
  { id: "marigold", name: "Marigold Celebration Layout", desc: "Vibrant orange and yellow marigold garlands with festive backgrounds." },
  { id: "peacock", name: "Peacock Royal Layout", desc: "Majestic peacock feather overlays and deep royal blue gradients." },
  { id: "heritage", name: "Heritage Haveli Layout", desc: "Terracotta textures, vintage stone arches, and heritage designs." },
  { id: "moonlight", name: "Moonlight Wedding Layout", desc: "Midnight skies, glowing lanterns, and starry overlays." },
  { id: "grand-mandap", name: "Grand Mandap Layout", desc: "Luxurious floral mandap stages with traditional hanging lights." }
];

// Birthday shared sections configuration
const BIRTHDAY_SECTIONS = [
  {
    id: "hero",
    title: "Welcome Banner",
    icon: "Sliders",
    order: 1,
    enabled: true,
    editableFields: [
      "hero.title",
      "hero.subtitle",
      "hero.welcomeMessage",
      "hero.heroImage",
      "hero.ctaText",
      "hero.subText"
    ],
    description: "Configures the top welcome slide image, tagline, and CTA options."
  },
  {
    id: "celebrant",
    title: "Celebrant Details",
    icon: "Heart",
    order: 2,
    enabled: true,
    editableFields: [
      "celebrant.name",
      "age"
    ],
    description: "Configures name and age being celebrated."
  },
  {
    id: "countdown",
    title: "Party Countdown",
    icon: "Calendar",
    order: 3,
    enabled: true,
    editableFields: [
      "countdown.title",
      "countdown.targetDate",
      "countdown.timezone",
      "countdown.postWeddingMessage"
    ],
    description: "Interactive party countdown clock."
  },
  {
    id: "events",
    title: "Party Details",
    icon: "Calendar",
    order: 4,
    enabled: true,
    editableFields: ["events"],
    description: "Configure schedule, timings, and events details."
  },
  {
    id: "gallery",
    title: "Gallery Memories",
    icon: "Palette",
    order: 5,
    enabled: true,
    editableFields: ["gallery.title", "gallery.images", "gallery.layoutType"],
    description: "Configures grid of past moments and snapshots."
  },
  {
    id: "venue",
    title: "Party Venue Map",
    icon: "MapPin",
    order: 6,
    enabled: true,
    editableFields: ["venue"],
    description: "Address and locations guide map."
  },
  {
    id: "rsvp",
    title: "RSVP Info",
    icon: "MapPin",
    order: 7,
    enabled: true,
    editableFields: ["rsvp.title", "rsvp.contacts"],
    description: "Interactive RSVP buttons and contact options."
  },
  {
    id: "faq",
    title: "Frequently Asked Questions",
    icon: "Shirt",
    order: 8,
    enabled: true,
    editableFields: ["faq.title", "faq.entries"],
    description: "Helpful party guidelines and FAQs."
  },
  {
    id: "footer",
    title: "Footer Credits",
    icon: "Sliders",
    order: 9,
    enabled: true,
    editableFields: ["footer.title", "footer.creditText", "footer.salutation"],
    description: "Footer text and salutations."
  }
];

const BIRTHDAY_NAVIGATION = [
  {
    id: "general",
    label: "General & Reorder",
    icon: "Sliders",
    sections: ["hero", "footer"]
  },
  {
    id: "basics",
    label: "Celebrant Info",
    icon: "Heart",
    sections: ["celebrant"]
  },
  {
    id: "event_details",
    label: "Party Details",
    icon: "Calendar",
    sections: ["events", "countdown", "venue"]
  },
  {
    id: "gallery",
    label: "Gallery",
    icon: "Palette",
    sections: ["gallery"]
  },
  {
    id: "rsvp",
    label: "RSVP & FAQs",
    icon: "MapPin",
    sections: ["rsvp", "faq"]
  }
];

const BIRTHDAY_FEATURES = {
  supportsGallery: true,
  supportsCountdown: true,
  supportsMusic: true,
  supportsVideo: false,
  supportsMaps: true,
  supportsRSVP: true,
  supportsGiftRegistry: false,
  supportsQRCode: false,
  supportsTimeline: false,
  supportsSchedule: true,
  supportsFamily: false,
  supportsStory: false,
  supportsSponsors: false,
  supportsRegistration: false,
  supportsBranding: true,
  supportsCustomCSS: false,
  supportsAnalytics: false
};

const BIRTHDAY_THEMES = [
  { id: "modern-birthday", name: "Modern Birthday Celebration", desc: "Elegant modern typography, clean dark mode aesthetic with twinkling stars and celebration particles." },
  { id: "midnight", name: "Midnight Black Luxury", desc: "Matte black with gold accents, luxury serif typography, gold foil detailing, and elegant motion glow." },
  { id: "marble", name: "White Marble Luxury", desc: "Minimal luxury style featuring white marble backgrounds, soft gold borders, and elegant serif typography." },
  { id: "emerald", name: "Royal Emerald", desc: "Imperial emerald green layout adorned with classical gold floral details and rich textures." },
  { id: "navy", name: "Navy Blue & Gold", desc: "Deep navy canvas offset by glowing starlight constellations, floating night sky particles." },
  { id: "burgundy", name: "Burgundy Velvet", desc: "Warm luxury layout featuring dark burgundy velvet textures, golden rules, and candle-glow gradients." },
  { id: "champagne", name: "Champagne Celebration", desc: "Creamy warm champagne gold, soft bokeh light leaks, and ultra-fine frosted glass panels." },
  { id: "glass", name: "Modern Glassmorphism", desc: "Apple-inspired frosted glass panels floating over vibrant liquid-blur animated gradients." },
  { id: "rosegold", name: "Black & Rose Gold", desc: "Matte charcoal black workspace offset by sleek rose-gold highlights and geometric lines." },
  { id: "artdeco", name: "Golden Art Deco", desc: "Symmetric metallic frames, retro 1920s Gatsby art-deco corners, and classic brass buttons." },
  { id: "botanical", name: "Botanical Luxury", desc: "Warm ivory linen canvas decorated with hand-painted watercolor sage and eucalyptus leaves." }
];

export const TEMPLATE_MANIFEST_REGISTRY: TemplateManifest[] = [
  ...WEDDING_THEMES.map((theme) => ({
    id: `manifest_${theme.id}`,
    templateId: theme.id,
    category: "wedding",
    editor: {
      sections: WEDDING_SECTIONS,
      navigation: WEDDING_NAVIGATION,
      defaultExpanded: ["hero", "couple", "events"],
      displayOrder: WEDDING_SECTIONS.map((s) => s.id)
    },
    features: WEDDING_FEATURES,
    defaults: createWeddingDefaults(theme.id),
    version: "1.0.0",
    description: theme.desc
  })),
  ...BIRTHDAY_THEMES.map((theme) => ({
    id: `manifest_${theme.id}`,
    templateId: theme.id,
    category: "birthday",
    editor: {
      sections: BIRTHDAY_SECTIONS,
      navigation: BIRTHDAY_NAVIGATION,
      defaultExpanded: ["hero", "celebrant", "events"],
      displayOrder: BIRTHDAY_SECTIONS.map((s) => s.id)
    },
    features: BIRTHDAY_FEATURES,
    defaults: {
      themeId: theme.id,
      sectionOrder: ["hero", "celebrant", "countdown", "events", "gallery", "venue", "rsvp", "faq", "footer"],
      themeSettings: {
        showParticles: true,
        particleType: theme.id === "glass" ? "bubbles" : theme.id === "navy" ? "stars" : "confetti",
        borderStyle: theme.id === "midnight" || theme.id === "artdeco" ? "gold" : "none",
        heroAnimation: "zoom"
      },
      music: {
        enabled: true,
        file: "/music/theme.mp3"
      }
    },
    version: "1.0.0",
    description: theme.desc
  }))
];
