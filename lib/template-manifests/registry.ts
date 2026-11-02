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
    title: "Bride & Groom Details & Family",
    icon: "Heart",
    order: 2,
    enabled: true,
    editableFields: [
      "couple.primarySide",
      "couple.groom.name",
      "couple.groom.image",
      "couple.groom.family",
      "couple.bride.name",
      "couple.bride.image",
      "couple.bride.family"
    ],
    description: "Configures side order, names, portraits, and family members of the Bride and Groom."
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
    title: "Our Story",
    icon: "Palette",
    order: 4,
    enabled: true,
    editableFields: ["story.title", "story.timeline"],
    description: "Configures our story heading, description, and milestones."
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
    id: "rsvp",
    title: "Confirmation RSVP Info",
    icon: "Phone",
    order: 8,
    enabled: true,
    editableFields: ["rsvp.title", "rsvp.contacts"],
    description: "Interactive RSVP buttons and contact coordinates."
  },
  {
    id: "footer",
    title: "Page Credits & Footer",
    icon: "Sliders",
    order: 9,
    enabled: true,
    editableFields: ["footer.title", "footer.salutation", "footer.designer", "footer.creditText", "footer.location", "footer.contact"],
    description: "Closing family quote, designer credits, location, and contact information."
  }
];

// Pelli Pandiri Custom Sections (Template-specific architecture)
const PELLI_PANDIRI_SECTIONS: TemplateSection[] = [
  {
    id: "hero",
    title: "Welcome Banner & Mandap",
    icon: "Sliders",
    order: 1,
    enabled: true,
    editableFields: [
      "hero.title",
      "hero.subtitle",
      "hero.welcomeMessage",
      "hero.heroImage",
      "hero.surname",
      "hero.subText"
    ],
    description: "Configures temple entrance scene, couple invocation, surname, and animated sky."
  },
  {
    id: "couple",
    title: "Grand Couple Showcase",
    icon: "Heart",
    order: 2,
    enabled: true,
    editableFields: [
      "couple.primarySide",
      "couple.groom.name",
      "couple.groom.image",
      "couple.bride.name",
      "couple.bride.image"
    ],
    description: "Configures groom & bride names, portraits, and auspicious mantra."
  },
  {
    id: "events",
    title: "Wedding Celebrations Schedule",
    icon: "Calendar",
    order: 3,
    enabled: true,
    editableFields: ["events"],
    description: "Sacred ceremonies schedule with date, time, venue address, and description."
  },
  {
    id: "story",
    title: "Pre-Wedding Film",
    icon: "Video",
    order: 4,
    enabled: true,
    editableFields: ["story.title", "story.subtitle", "story.videoSrc", "story.posterSrc"],
    description: "Configures cinematic video memory, heading, and poster thumbnail."
  },
  {
    id: "gallery",
    title: "Moments We Treasure Gallery",
    icon: "Palette",
    order: 5,
    enabled: true,
    editableFields: ["gallery.images"],
    description: "Configures the 5-photo showcase with full-screen lightbox viewer."
  },
  {
    id: "families",
    title: "Our Families Details",
    icon: "Users",
    order: 6,
    enabled: true,
    editableFields: [
      "couple.groom.family",
      "couple.bride.family"
    ],
    description: "Configures Groom & Bride family cards, photos, and family members list."
  },
  {
    id: "rsvp",
    title: "RSVP & Muhurtham Timer",
    icon: "Phone",
    order: 7,
    enabled: true,
    editableFields: ["countdown.targetDate", "rsvp.contacts"],
    description: "Celebration attendance RSVP form, Muhurtham timer, and contact coordinates."
  },
  {
    id: "footer",
    title: "Page Credits & Rating",
    icon: "Sliders",
    order: 8,
    enabled: true,
    editableFields: ["footer.title", "footer.creditText", "footer.location", "footer.contact"],
    description: "Closing family blessings, brand signature, rating feedback, and contact details."
  }
];

// Standard Wedding Sidebar Navigation Groups
const WEDDING_NAVIGATION: TemplateNavigationItem[] = [
  {
    id: "general",
    label: "General Config",
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
    label: "Our Story",
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
    id: "venues",
    label: "Venues",
    icon: "MapPin",
    sections: ["venue"]
  },
  {
    id: "rsvp",
    label: "RSVP & Contacts",
    icon: "Phone",
    sections: ["rsvp"]
  },
  {
    id: "footer",
    label: "Footer & Quote",
    icon: "Sliders",
    sections: ["footer"]
  }
];

// Pelli Pandiri Dedicated Navigation Groups (1:1 with template sections)
const PELLI_PANDIRI_NAVIGATION: TemplateNavigationItem[] = [
  {
    id: "general",
    label: "General Config",
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
    label: "Celebrations",
    icon: "Calendar",
    sections: ["events"]
  },
  {
    id: "story",
    label: "Pre-Wedding Film",
    icon: "Video",
    sections: ["story"]
  },
  {
    id: "gallery",
    label: "Photo Gallery",
    icon: "Palette",
    sections: ["gallery"]
  },
  {
    id: "families",
    label: "Our Families",
    icon: "Users",
    sections: ["families"]
  },
  {
    id: "rsvp",
    label: "RSVP & Timer",
    icon: "Phone",
    sections: ["rsvp"]
  },
  {
    id: "footer",
    label: "Credits & Rating",
    icon: "Sliders",
    sections: ["footer"]
  }
];

// Standard capabilities of wedding layouts
const WEDDING_FEATURES: TemplateFeatures = {
  supportsGallery: true,
  supportsCountdown: true,
  supportsMusic: true,
  supportsVideo: true,
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
  if (themeId === "pelli-pandiri") {
    return {
      themeId,
      sectionOrder: PELLI_PANDIRI_SECTIONS.map((s) => s.id),
      themeSettings: {
        showParticles: true,
        particleType: "petals",
        borderStyle: "gold",
        heroAnimation: "zoom"
      },
      music: {
        enabled: true,
        file: "/templates/pelli-pandiri/audio/ambient.mp3"
      },
      hero: {
        id: "hero",
        enabled: true,
        title: "TOGETHER WITH THEIR FAMILIES",
        subtitle: "invite you to celebrate the beginning of their beautiful journey together",
        welcomeMessage: "|| श्री गणेशाय नमः ||",
        heroImage: "/templates/pelli-pandiri/Couple.png",
        backgroundType: "image",
        overlayOpacity: 0.3,
        ctaText: "RSVP",
        musicAutoplay: true,
        showParticles: true,
        surname: "BIRUDURAJU'S FAMILY",
        showSurnameHeading: true,
        subText: "BIRUDURAJU'S WEDDING INVITATION"
      },
      couple: {
        id: "couple",
        enabled: true,
        title: "The Auspicious Union",
        primarySide: "groom",
        groom: {
          name: "Arjun",
          parents: "Son of Smt. Padmaja & Sri Suresh Babu",
          bio: "",
          image: "/templates/pelli-pandiri/family/groom-family.jpg"
        },
        bride: {
          name: "Meera",
          parents: "Daughter of Smt. Lakshmi Devi & Sri Ramesh Kumar",
          bio: "",
          image: "/templates/pelli-pandiri/family/bride-family.jpg"
        }
      },
      venue: "Ananda Kalyana Mandapam, Thanjavur, Tamil Nadu",
      date: "2026-11-29",
      time: "09:15 AM",
      countdown: {
        id: "countdown",
        enabled: true,
        title: "Muhurtham Countdown",
        targetDate: "2026-11-29T09:15:00",
        timezone: "IST"
      },
      story: {
        id: "story",
        enabled: true,
        title: "A GLIMPSE OF US",
        subtitle: "Our story, captured in beautiful moments.",
        videoSrc: "/templates/pelli-pandiri/video/pre-wedding.mp4",
        posterSrc: "/templates/pelli-pandiri/video/pre-wedding-poster.jpg",
        timeline: [
          {
            title: "A GLIMPSE OF US",
            date: "",
            description: "Our story, captured in beautiful moments.",
            image: "/templates/pelli-pandiri/video/pre-wedding-poster.jpg"
          }
        ]
      },
      video: {
        enabled: true,
        heading: "A GLIMPSE OF US",
        subheading: "Our story, captured in beautiful moments.",
        videoSrc: "/templates/pelli-pandiri/video/pre-wedding.mp4",
        posterSrc: "/templates/pelli-pandiri/video/pre-wedding-poster.jpg"
      },
      events: [
        {
          id: "engagement",
          enabled: true,
          title: "Engagement",
          name: "Engagement",
          navLabel: "Engagement",
          shortDate: "Fri, Nov 27",
          date: "Friday, November 27, 2026",
          dayOfWeek: "Friday Evening",
          time: "06:00 PM",
          startTime: "06:00 PM",
          endTime: "09:30 PM",
          venue: "Sri Vijayalakshmi Kalyana Mandapam",
          address: "Grand Ballroom, Rajappa Nagar, Thanjavur",
          description: "Traditional Engagement Ceremony",
          illustration: "/templates/pelli-pandiri/events/event-engagement.png",
          accentColor: "#8e3622"
        },
        {
          id: "haldi",
          enabled: true,
          title: "Haldi",
          name: "Haldi",
          navLabel: "Haldi",
          shortDate: "Sat, Nov 28",
          date: "Saturday, November 28, 2026",
          dayOfWeek: "Saturday Morning",
          time: "08:30 AM",
          startTime: "08:30 AM",
          endTime: "11:30 AM",
          venue: "Royal Courtyard & Heritage Pavilion",
          address: "Chola Heritage Palace, Court Road, Thanjavur",
          description: "Auspicious Turmeric Cleansing Ritual",
          illustration: "/templates/pelli-pandiri/events/event-haldi.png",
          accentColor: "#d97724"
        },
        {
          id: "sangeet",
          enabled: true,
          title: "Sangeet",
          name: "Sangeet",
          navLabel: "Sangeet",
          shortDate: "Sat, Nov 28",
          date: "Saturday, November 28, 2026",
          dayOfWeek: "Saturday Evening",
          time: "07:00 PM",
          startTime: "07:00 PM",
          endTime: "11:00 PM",
          venue: "The Grand Lotus Lawns",
          address: "Palace Gardens, Tanjore Expressway, Thanjavur",
          description: "Musical Evening & Celebratory Banquet",
          illustration: "/templates/pelli-pandiri/events/event-sangeet.png",
          accentColor: "#9c3f20"
        },
        {
          id: "wedding",
          enabled: true,
          title: "Wedding",
          name: "Wedding",
          navLabel: "Wedding",
          shortDate: "Sun, Nov 29",
          date: "Sunday, November 29, 2026",
          dayOfWeek: "Sunday Morning",
          time: "08:15 AM",
          startTime: "08:15 AM",
          endTime: "12:30 PM",
          muhurthamTime: "Sumuhurtham: 09:15 AM - 09:45 AM (Dhanur Lagna)",
          venue: "Ananda Kalyana Mandapam",
          address: "Temple Sanctum Auditorium, South Rampart, Thanjavur",
          description: "The Holy Vedic Wedding Ceremony",
          illustration: "/templates/pelli-pandiri/events/event-muhurtham.png",
          accentColor: "#a3281d"
        }
      ],
      gallery: {
        id: "gallery",
        enabled: true,
        title: "MOMENTS WE TREASURE",
        subheading: "Every picture tells a part of our story.",
        images: [
          "/templates/pelli-pandiri/gallery/photo-1.jpg",
          "/templates/pelli-pandiri/gallery/photo-2.jpg",
          "/templates/pelli-pandiri/gallery/photo-3.jpg",
          "/templates/pelli-pandiri/gallery/photo-4.jpg",
          "/templates/pelli-pandiri/gallery/photo-5.jpg"
        ]
      },
      families: {
        id: "families",
        enabled: true,
        title: "Our Families",
        subheading: "Two families united in tradition, blessings, and boundless love",
        brideFamily: [
          { relation: "Mother", name: "Smt. Lakshmi Devi" },
          { relation: "Father", name: "Sri Ramesh Kumar" }
        ],
        groomFamily: [
          { relation: "Mother", name: "Smt. Padmaja" },
          { relation: "Father", name: "Sri Suresh Babu" }
        ],
        groomLocation: "Kumbakonam, Tamil Nadu",
        brideLocation: "Thanjavur, Tamil Nadu"
      },
      rsvp: {
        id: "rsvp",
        enabled: true,
        title: "We would be delighted by your presence",
        subtitle: "Your presence and heartfelt blessings are our greatest treasure as we begin this sacred union",
        contacts: [
          { type: "phone", label: "Coordinator", value: "+91 8688178323" }
        ]
      },
      footer: {
        id: "footer",
        enabled: true,
        salutation: "A beautiful beginning starts with a beautiful invitation.",
        designer: "DESIGNED BY AHVAANAM",
        creditText: "Digital Wedding Invitations & Card Services",
        location: "Tirumala Printers, Metpally, Dist. Jagtial, Telangana",
        contact: "+91 8688178323"
      }
    };
  }

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
  { id: "rose-mandap", name: "Rose Mandap", desc: "Royal mandap architecture, hanging brass bells, couple artwork, falling petals, and live wedding procession animation." },
  { id: "pelli-pandiri", name: "Pelli Pandiri", desc: "A grand traditional Telugu wedding invitation with temple entrance arch, sunset sky, 3D butterfly companion, auspicious toranam, and parchment scroll sections." }
];

export const TEMPLATE_MANIFEST_REGISTRY: TemplateManifest[] = [
  ...WEDDING_THEMES.map((theme) => ({
    id: `manifest_${theme.id}`,
    templateId: theme.id,
    category: "wedding",
    editor: {
      sections: theme.id === "pelli-pandiri" ? PELLI_PANDIRI_SECTIONS : WEDDING_SECTIONS,
      navigation: theme.id === "pelli-pandiri" ? PELLI_PANDIRI_NAVIGATION : WEDDING_NAVIGATION,
      defaultExpanded: ["hero", "couple", "events"],
      displayOrder: (theme.id === "pelli-pandiri" ? PELLI_PANDIRI_SECTIONS : WEDDING_SECTIONS).map((s) => s.id)
    },
    features: WEDDING_FEATURES,
    defaults: createWeddingDefaults(theme.id),
    version: "1.0.0",
    description: theme.desc
  }))
];
