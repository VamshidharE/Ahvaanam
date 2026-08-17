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
    id: "footer",
    title: "Page Credits & Footer",
    icon: "Sliders",
    order: 10,
    enabled: true,
    editableFields: ["footer.title", "footer.salutation", "footer.designer", "footer.creditText", "footer.location", "footer.contact"],
    description: "Closing family quote, designer credits, location, and contact information."
  }
];

// Standard Wedding Sidebar Navigation Groups
const WEDDING_NAVIGATION: TemplateNavigationItem[] = [
  {
    id: "general",
    label: "General & Reorder",
    icon: "Sliders",
    sections: ["hero"]
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
    id: "gallery",
    label: "Gallery",
    icon: "Palette",
    sections: ["gallery"]
  },
  {
    id: "families",
    label: "Families",
    icon: "Heart",
    sections: ["families"]
  },
  {
    id: "venues",
    label: "Venues",
    icon: "MapPin",
    sections: ["venue"]
  },
  {
    id: "rsvp",
    label: "RSVP & Guestbook",
    icon: "Sliders",
    sections: ["rsvp"]
  },
  {
    id: "footer",
    label: "Footer & Credits",
    icon: "Sliders",
    sections: ["footer"]
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
const createWeddingDefaults = (themeId: string) => {
  if (themeId === "rose-mandap") {
    return {
      themeId,
      sectionOrder: WEDDING_SECTIONS.map((s) => s.id),
      themeSettings: {
        showParticles: true,
        particleType: "petals",
        borderStyle: "gold",
        heroAnimation: "zoom"
      },
      music: {
        enabled: true,
        file: "/wedding/rose-mandap/theme-music.MP3"
      },
      hero: {
        id: "hero",
        enabled: true,
        title: "Together with their families",
        subtitle: "invite you to celebrate the beginning of their beautiful journey together",
        welcomeMessage: "ॐ श्री गणेशाय नमः ||",
        heroImage: "/wedding/couple/couple.png",
        backgroundType: "image",
        overlayOpacity: 0.3,
        ctaText: "RSVP",
        musicAutoplay: true,
        showParticles: true,
        surname: "Ryagalla",
        showSurnameHeading: true,
        subText: "Ryagalla's Wedding Invitation"
      },
      couple: {
        id: "couple",
        enabled: true,
        title: "The Happy Couple",
        groom: {
          name: "Aarav",
          parents: "Son of Mr. & Mrs. Groom Family",
          bio: "",
          image: "/wedding/couple/couple.png"
        },
        bride: {
          name: "Ananya",
          parents: "Daughter of Mr. & Mrs. Bride Family",
          bio: "",
          image: "/wedding/couple/couple.png"
        }
      },
      venue: "The Leela Palace, Hyderabad",
      date: "2026-09-20",
      time: "10:15 AM",
      countdown: {
        id: "countdown",
        enabled: true,
        title: "Counting The Moments",
        targetDate: "2026-09-20T10:15:00",
        timezone: "IST"
      },
      story: {
        id: "story",
        enabled: true,
        title: "Our Story",
        timeline: [
          {
            title: "Our Story",
            date: "",
            description: "Two hearts, two families and one beautiful journey. This is the beginning of a new chapter that we would love to celebrate with you.",
            image: "/wedding/couple/couple.png"
          }
        ]
      },
      events: [
        {
          id: "haldi",
          enabled: true,
          title: "Haldi",
          date: "18 December 2026",
          time: "10:00 AM",
          venue: "Family Residence",
          description: "An intimate celebration filled with turmeric, laughter and blessings."
        },
        {
          id: "mehendi",
          enabled: false,
          title: "Mehendi",
          date: "18 December 2026",
          time: "6:00 PM",
          venue: "Family Residence",
          description: "An evening of beautiful mehendi, music and celebration."
        },
        {
          id: "wedding",
          enabled: true,
          title: "Wedding",
          date: "20 September 2026",
          time: "10:15 AM",
          venue: "The Leela Palace",
          description: "Join us as we celebrate the sacred wedding ceremony."
        },
        {
          id: "reception",
          enabled: true,
          title: "Reception",
          date: "01 December 2026",
          time: "7:00 PM",
          venue: "The Leela Palace",
          description: "An evening of joy, dinner and celebration with family and friends."
        }
      ],
      gallery: {
        id: "gallery",
        enabled: true,
        title: "Our Memories",
        images: [
          "/wedding/gallery/pic1.png",
          "/wedding/gallery/pic2.jpg",
          "/wedding/gallery/pic3.jpg",
          "/wedding/gallery/pic4.jpg"
        ]
      },
      families: {
        id: "families",
        enabled: true,
        title: "Our Families",
        brideFamily: [
          { relation: "Parents", name: "Mr. & Mrs. Bride Family" }
        ],
        groomFamily: [
          { relation: "Parents", name: "Mr. & Mrs. Groom Family" }
        ]
      },
      rsvp: {
        id: "rsvp",
        enabled: true,
        title: "We Would Love To Celebrate With You",
        subtitle: "Your presence and blessings will make our celebration even more special.",
        contacts: [
          { type: "phone", label: "Contact", value: "+91 9866767100" }
        ]
      },
      footer: {
        id: "footer",
        enabled: true,
        salutation: "A beautiful beginning starts with a beautiful invitation.",
        designer: "Ahvaanam",
        creditText: "Digital Wedding Invitations & Card Services",
        location: "Tirumala Printers, Metpally, Dist. Jagtial, Telangana",
        contact: "+91 9866767100"
      }
    };
  }

  return {
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
  };
};

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
  { id: "grand-mandap", name: "Grand Mandap Layout", desc: "Luxurious floral mandap stages with traditional hanging lights." },
  { id: "azure-serenity", name: "Azure Serenity Layout", desc: "Dreamy skies, lake reflections, glassmorphic cards, and elegant flower frames." },
  { id: "rose-mandap", name: "Rose Mandap", desc: "Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation." }
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
  }))
];
