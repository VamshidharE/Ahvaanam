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

// Lotus Mandapam Custom Sections
const LOTUS_MANDAPAM_SECTIONS: TemplateSection[] = [
  {
    id: "hero",
    title: "Welcome Banner & Temple Gopuram",
    icon: "Sliders",
    order: 1,
    enabled: true,
    editableFields: [
      "hero.title",
      "hero.subtitle",
      "hero.welcomeMessage",
      "hero.heroImage",
      "hero.bgImage",
      "hero.surname",
      "hero.subText",
      "hero.ctaText"
    ],
    description: "Configures sacred temple gopuram scene, couple cutout, auspicious mantra, and stationery card typography."
  },
  {
    id: "families",
    title: "Family Blessings & Lineage",
    icon: "Users",
    order: 2,
    enabled: true,
    editableFields: [
      "families.title",
      "families.eyebrow",
      "families.blessingQuote",
      "families.groomFamilyTitle",
      "families.brideFamilyTitle",
      "families.groomParents",
      "families.brideParents",
      "families.groomFamilyImage",
      "families.brideFamilyImage",
      "couple.groom.family",
      "couple.bride.family"
    ],
    description: "Configures Family Blessings section, family portraits on embossed paper, parents, and lineage."
  },
  {
    id: "couple",
    title: "Grand Couple Showcase",
    icon: "Heart",
    order: 3,
    enabled: true,
    editableFields: [
      "couple.primarySide",
      "couple.portraitImage",
      "couple.groom.name",
      "couple.groom.image",
      "couple.groom.bio",
      "couple.bride.name",
      "couple.bride.image",
      "couple.bride.bio"
    ],
    description: "Configures Bride and Groom names, large royal portrait, bios, and individual profiles."
  },
  {
    id: "events",
    title: "Auspicious Celebrations",
    icon: "Calendar",
    order: 4,
    enabled: true,
    editableFields: ["events"],
    description: "Configures the 4 celebration ceremonies (Engagement, Haldi, Sangeeth, Muhurtham) with venue and timing."
  },
  {
    id: "story",
    title: "Wedding Film Highlights",
    icon: "Video",
    order: 5,
    enabled: true,
    editableFields: ["story.title", "story.subtitle", "story.videoSrc", "story.posterSrc", "video.videoSrc", "video.posterSrc"],
    description: "Configures cinematic wedding film video player, heading, subtitle, and custom poster thumbnail."
  },
  {
    id: "gallery",
    title: "Moments We Treasure Gallery",
    icon: "Palette",
    order: 6,
    enabled: true,
    editableFields: ["gallery.images", "gallery"],
    description: "Configures full-width interactive photography gallery and photo lightbox viewer."
  },
  {
    id: "venue",
    title: "Sacred Venue Concierge",
    icon: "MapPin",
    order: 7,
    enabled: true,
    editableFields: ["venue", "address", "venueDetails"],
    description: "Configures ceremony venue location, address details, and directions."
  },
  {
    id: "rsvp",
    title: "Muhurtham Countdown & RSVP",
    icon: "Phone",
    order: 8,
    enabled: true,
    editableFields: ["countdown.targetDate", "rsvp.contacts", "rsvp.title", "rsvp.subtitle"],
    description: "Configures auspicious Muhurtham countdown timer, guest RSVP desk, and WhatsApp contact links."
  },
  {
    id: "footer",
    title: "Royal Closing & Blessings",
    icon: "Sliders",
    order: 9,
    enabled: true,
    editableFields: ["footer.title", "footer.creditText", "footer.location", "footer.contact", "footer.salutation"],
    description: "Configures closing benediction, Ahvaanam signature, and guest blessings."
  }
];

const LOTUS_MANDAPAM_NAVIGATION: TemplateNavigationItem[] = [
  {
    id: "general",
    label: "General Config",
    icon: "Sliders",
    sections: ["hero"]
  },
  {
    id: "families",
    label: "Family Blessings",
    icon: "Users",
    sections: ["families"]
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
    label: "Wedding Film",
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
    id: "venues",
    label: "Venue Concierge",
    icon: "MapPin",
    sections: ["venue"]
  },
  {
    id: "rsvp",
    label: "RSVP & Timer",
    icon: "Phone",
    sections: ["rsvp"]
  },
  {
    id: "footer",
    label: "Closing & Credits",
    icon: "Sliders",
    sections: ["footer"]
  }
];

// Gopuram Custom Sections (Template-specific architecture)
const GOPURAM_SECTIONS: TemplateSection[] = [
  {
    id: "hero",
    title: "Welcome Banner & Gopuram",
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
    description: "Configures Dravidian temple entrance scene, gopuram tower travel, couple invocation, and animated sky."
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
    description: "Configures the photo showcase with full-screen lightbox viewer."
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

// Gopuram Dedicated Navigation Groups
const GOPURAM_NAVIGATION: TemplateNavigationItem[] = [
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
  if (themeId === "lotus-mandapam" || themeId === "sacred-courtyard" || themeId === "emerald-palace") {
    return {
      themeId,
      sectionOrder: LOTUS_MANDAPAM_SECTIONS.map((s) => s.id),
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
        title: "GUPTA & RAO FAMILIES",
        subtitle: "Together with our families, we joyfully invite you to celebrate our special day.",
        welcomeMessage: "॥ श्री गणेशाय नमः ॥",
        heroImage: "/templates/emerald-palace/couple-hero.webp",
        bgImage: "/templates/emerald-palace/hero-temple-sunset.jpg",
        backgroundType: "image",
        overlayOpacity: 0.25,
        ctaText: "CONFIRM PRESENCE",
        musicAutoplay: true,
        showParticles: true,
        surname: "GUPTA & RAO FAMILIES",
        showSurnameHeading: true,
        subText: "THE WEDDING OF ARJUN & DIVYA"
      },
      couple: {
        id: "couple",
        enabled: true,
        title: "The Auspicious Union",
        primarySide: "groom",
        portraitImage: "/templates/emerald-palace/couple-portrait-large.jpg",
        groom: {
          name: "Arjun",
          surname: "Gupta",
          parents: "Son of Sri Ramesh Gupta & Smt. Lalitha Gupta",
          bio: "A compassionate soul of vision and values, finding infinite beauty in love and traditions.",
          image: "/templates/emerald-palace/gallery-groom.jpg"
        },
        bride: {
          name: "Divya",
          surname: "Rao",
          parents: "Daughter of Sri Prabhakar Rao & Smt. Sushma Rao",
          bio: "A radiant spirit of grace and creativity, bringing joyous light into every gathering.",
          image: "/templates/emerald-palace/gallery-bride.jpg"
        }
      },
      venue: "Sri Venkateswara Kalyana Mandapam, Main Road, Ibrahimpatnam, Hyderabad 501506",
      date: "2026-12-28",
      time: "09:12 AM",
      countdown: {
        id: "countdown",
        enabled: true,
        title: "Muhurtham Countdown",
        targetDate: "2026-12-28T09:12:00",
        timezone: "IST"
      },
      story: {
        id: "story",
        enabled: true,
        title: "A CINEMATIC LOVE CHRONICLE",
        subtitle: "Moments woven into eternal memories",
        videoSrc: "/templates/gopuram/video/pre-wedding.mp4",
        posterSrc: "/templates/emerald-palace/bg-film-silk.jpg",
        timeline: [
          {
            title: "A CINEMATIC LOVE CHRONICLE",
            date: "",
            description: "Moments woven into eternal memories",
            image: "/templates/emerald-palace/bg-film-silk.jpg"
          }
        ]
      },
      video: {
        enabled: true,
        heading: "A CINEMATIC LOVE CHRONICLE",
        subheading: "Moments woven into eternal memories",
        videoSrc: "/templates/gopuram/video/pre-wedding.mp4",
        posterSrc: "/templates/emerald-palace/bg-film-silk.jpg"
      },
      events: [
        {
          id: "pellikuthuru",
          title: "Pellikuthuru (Haldi)",
          subtitle: "Auspicious Turmeric Ceremony",
          date: "26 Dec 2026",
          time: "10:00 AM",
          venue: "Sri Venkateswara Kalyana Mandapam",
          address: "Main Road, Ibrahimpatnam, Hyderabad 501506",
          description: "Basking in the golden radiance of sacred turmeric paste, fragrant petals, and playful music.",
          dressCode: "Sunshine Yellow / Traditional Attire",
          illustration: "/templates/emerald-palace/event-haldi.jpg",
          image: "/templates/emerald-palace/event-haldi.jpg",
          accentColor: "#d97724",
          enabled: true
        },
        {
          id: "sangeeth",
          title: "Sangeeth Night",
          subtitle: "A Musical Celebration of Dance",
          date: "26 Dec 2026",
          time: "07:00 PM",
          venue: "Sri Venkateswara Kalyana Mandapam",
          address: "Grand Ballroom, Ibrahimpatnam, Hyderabad",
          description: "An electric evening filled with celebratory performances, festive music, and boundless joy.",
          dressCode: "Festive Glam / Royal Hues",
          illustration: "/templates/emerald-palace/event-sangeeth.jpg",
          image: "/templates/emerald-palace/event-sangeeth.jpg",
          accentColor: "#9c3f20",
          enabled: true
        },
        {
          id: "wedding-muhurtam",
          title: "Wedding Muhurtam",
          subtitle: "The Sacred Vows & Pheras",
          date: "28 Dec 2026",
          time: "09:12 AM",
          muhurthamTime: "Sumuhurtham: 09:12 AM",
          venue: "Sri Venkateswara Kalyana Mandapam",
          address: "Main Temple Mandap, Ibrahimpatnam, Hyderabad",
          description: "Witness the sacred union amidst holy Vedic mantras, jasmine garlands, and divine blessings.",
          dressCode: "Traditional South Indian Silks",
          illustration: "/templates/emerald-palace/event-muhurtam.jpg",
          image: "/templates/emerald-palace/event-muhurtam.jpg",
          accentColor: "#a3281d",
          enabled: true
        },
        {
          id: "reception",
          title: "Reception",
          subtitle: "Grand Celebratory Banquet",
          date: "28 Dec 2026",
          time: "06:30 PM",
          venue: "Sri Venkateswara Kalyana Mandapam Lawns",
          address: "Royal Courtyard Lawns, Ibrahimpatnam, Hyderabad",
          description: "A joyous evening of heartfelt congratulations, royal banquet dining, and celebrating the newlyweds.",
          dressCode: "Indo-Western / Formal Festive",
          illustration: "/templates/emerald-palace/event-reception.jpg",
          image: "/templates/emerald-palace/event-reception.jpg",
          accentColor: "#781d36",
          enabled: true
        }
      ],
      gallery: {
        id: "gallery",
        enabled: true,
        title: "MOMENTS WE TREASURE",
        subheading: "Every picture tells a part of our sacred story.",
        images: [
          "/templates/emerald-palace/couple-portrait-large.jpg",
          "/templates/emerald-palace/story-candid.jpg",
          "/templates/emerald-palace/gallery-bride.jpg",
          "/templates/emerald-palace/gallery-groom.jpg",
          "/templates/emerald-palace/story-hands.jpg",
          "/templates/emerald-palace/event-muhurtam.jpg"
        ]
      },
      families: {
        id: "families",
        enabled: true,
        title: "With the Blessings of Our Families",
        eyebrow: "The Union of Two Families",
        blessingQuote: "Together, our families welcome you to celebrate this beautiful union.",
        groomFamilyTitle: "The Gupta Family",
        brideFamilyTitle: "The Rao Family",
        groomParents: "Sri Ramesh Gupta & Smt. Lalitha Gupta",
        brideParents: "Sri Prabhakar Rao & Smt. Sushma Rao",
        groomFamilyImage: "/templates/emerald-palace/family-groom.jpg",
        brideFamilyImage: "/templates/emerald-palace/family-bride.jpg",
        groomFamily: [
          { relation: "Parents", name: "Sri Ramesh Gupta & Smt. Lalitha Gupta" },
          { relation: "Sister", name: "Pooja Gupta" }
        ],
        brideFamily: [
          { relation: "Parents", name: "Sri Prabhakar Rao & Smt. Sushma Rao" },
          { relation: "Brother", name: "Karthik Rao" }
        ],
        groomLocation: "Hyderabad, Telangana",
        brideLocation: "Tirupati, Andhra Pradesh"
      },
      rsvp: {
        id: "rsvp",
        enabled: true,
        title: "Celebrate With Us",
        subtitle: "We request the honour of your esteemed presence to celebrate the holy matrimony and shower your divine blessings upon the newlyweds.",
        contacts: [
          { type: "phone", label: "Family Desk", value: "+91 98765 43210" },
          { type: "whatsapp", label: "WhatsApp Desk", value: "+91 98765 43210" }
        ]
      },
      footer: {
        id: "footer",
        enabled: true,
        salutation: "With best compliments from relatives and friends",
        designer: "DESIGNED BY AHVAANAM",
        creditText: "Bespoke Digital Invitations & Royal Stationery",
        location: "Hyderabad & Tirupati",
        contact: "+91 8688178323"
      }
    };
  }

  if (themeId === "gopuram") {
    return {
      themeId,
      sectionOrder: GOPURAM_SECTIONS.map((s) => s.id),
      themeSettings: {
        showParticles: true,
        particleType: "petals",
        borderStyle: "gold",
        heroAnimation: "zoom"
      },
      music: {
        enabled: true,
        file: "/templates/gopuram/audio/ambient.mp3"
      },
      hero: {
        id: "hero",
        enabled: true,
        title: "TOGETHER WITH THEIR FAMILIES",
        subtitle: "invite you to celebrate the beginning of their beautiful journey together",
        welcomeMessage: "|| श्री गणेशाय नमः ||",
        heroImage: "/templates/gopuram/Couple.png",
        backgroundType: "image",
        overlayOpacity: 0.3,
        ctaText: "RSVP",
        musicAutoplay: true,
        showParticles: true,
        surname: "SRINIVASAN'S FAMILY",
        showSurnameHeading: true,
        subText: "SRINIVASAN'S WEDDING INVITATION"
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
          image: "/templates/gopuram/family/groom-family.jpg"
        },
        bride: {
          name: "Meera",
          parents: "Daughter of Smt. Lakshmi Devi & Sri Ramesh Kumar",
          bio: "",
          image: "/templates/gopuram/family/bride-family.jpg"
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
        videoSrc: "/templates/gopuram/video/pre-wedding.mp4",
        posterSrc: "/templates/gopuram/video/pre-wedding-poster.jpg",
        timeline: [
          {
            title: "A GLIMPSE OF US",
            date: "",
            description: "Our story, captured in beautiful moments.",
            image: "/templates/gopuram/video/pre-wedding-poster.jpg"
          }
        ]
      },
      video: {
        enabled: true,
        heading: "A GLIMPSE OF US",
        subheading: "Our story, captured in beautiful moments.",
        videoSrc: "/templates/gopuram/video/pre-wedding.mp4",
        posterSrc: "/templates/gopuram/video/pre-wedding-poster.jpg"
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
          illustration: "/templates/gopuram/events/event-engagement-photo.jpg",
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
          illustration: "/templates/gopuram/events/event-haldi-photo.jpg",
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
          illustration: "/templates/gopuram/events/event-sangeet-photo.jpg",
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
          illustration: "/templates/gopuram/events/event-muhurtham-photo.jpg",
          accentColor: "#a3281d"
        }
      ],
      gallery: {
        id: "gallery",
        enabled: true,
        title: "MOMENTS WE TREASURE",
        subheading: "Every picture tells a part of our story.",
        images: [
          "/templates/gopuram/gallery/photo-1.jpg",
          "/templates/gopuram/gallery/photo-2.jpg",
          "/templates/gopuram/gallery/photo-3.jpg",
          "/templates/gopuram/gallery/photo-4.jpg",
          "/templates/gopuram/gallery/photo-5.jpg"
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
  { id: "pelli-pandiri", name: "Pelli Pandiri", desc: "A grand traditional Telugu wedding invitation with temple entrance arch, sunset sky, 3D butterfly companion, auspicious toranam, and parchment scroll sections." },
  { id: "gopuram", name: "Gopuram", desc: "A majestic Dravidian temple gopuram invitation featuring a towering gopuram entrance, rising couple reveal, sunset skies, authentic sacred ambiance, and continuous parchment celebration sections." },
  { id: "emerald-palace", name: "Emerald Palace", desc: "Warm ivory and imperial burgundy royal wedding template with cinematic photographic presentation." },
{ id: "lotus-mandapam", name: "Lotus Mandapam", desc: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery." },
  { id: "sacred-courtyard", name: "The Sacred Courtyard", desc: "A cinematic South Indian wedding invitation inspired by traditional temple architecture, lotus ponds and golden sunset scenery." },
];

export const TEMPLATE_MANIFEST_REGISTRY: TemplateManifest[] = [
  ...WEDDING_THEMES.map((theme) => {
    const isLotusMandapam = theme.id === "lotus-mandapam" || theme.id === "sacred-courtyard" || theme.id === "emerald-palace";
    const isPelliPandiri = theme.id === "pelli-pandiri";
    const isGopuram = theme.id === "gopuram";
    const sections = isLotusMandapam ? LOTUS_MANDAPAM_SECTIONS : (isPelliPandiri ? PELLI_PANDIRI_SECTIONS : (isGopuram ? GOPURAM_SECTIONS : WEDDING_SECTIONS));
    const navigation = isLotusMandapam ? LOTUS_MANDAPAM_NAVIGATION : (isPelliPandiri ? PELLI_PANDIRI_NAVIGATION : (isGopuram ? GOPURAM_NAVIGATION : WEDDING_NAVIGATION));

    return {
      id: `manifest_${theme.id}`,
      templateId: theme.id,
      category: "wedding",
      editor: {
        sections,
        navigation,
        defaultExpanded: ["hero", "couple", "events"],
        displayOrder: sections.map((s) => s.id)
      },
      features: WEDDING_FEATURES,
      defaults: createWeddingDefaults(theme.id),
      version: "1.0.0",
      description: theme.desc
    };
  })
];
