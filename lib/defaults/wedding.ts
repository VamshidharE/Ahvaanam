import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Wedding invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const weddingConfig: InvitationConfig = {
  category: "wedding",
  themeId: "royal-temple",
  config: {
    themeId: "royal-temple",
    sectionOrder: [
      "hero",
      "couple",
      "countdown",
      "story",
      "events",
      "gallery",
      "venue",
      "families",
      "rsvp",
      "footer"
    ],
    themeSettings: {
      showParticles: true,
      particleType: "dust",
      borderStyle: "gold",
      heroAnimation: "zoom",
      buttonStyle: "rounded",
      galleryStyle: "carousel",
      countdownStyle: "glass"
    },
    music: {
      enabled: true,
      file: "/music/theme.mp3"
    },
    hero: {
      id: "hero",
      enabled: true,
      title: "Together with our beloved families",
      subtitle: "request the pleasure of your gracious presence as we begin our forever together.",
      welcomeMessage: "|| Shree Ganeshaay Namah ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      surname: "Reddy",
      showSurnameHeading: true,
      surnameFont: "cinzel",
      surnameColor: "#C59B27",
      subText: "WEDDING INVITATION",
      enableHeaderMedia: true,
      headerMediaType: "god",
      selectedGod: "ganesha",
      selectedSymbol: "om",
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    groom: {
      name: "Groom Name"
    },
    bride: {
      name: "Bride Name"
    },
    venue: "Grand Marriage Palace, City",
    date: "2026-12-31",
    time: "10:00 AM",
    couple: {
      id: "couple",
      enabled: true,
      title: "The Happy Couple",
      groom: {
        name: "Groom Name",
        parents: "Groom Parents",
        bio: "A description of the groom's background, hobbies, and personality.",
        image: "/images/couple.jpg"
      },
      bride: {
        name: "Bride Name",
        parents: "Bride Parents",
        bio: "A description of the bride's background, hobbies, and personality.",
        image: "/images/couple.jpg"
      }
    },
    countdown: {
      id: "countdown",
      enabled: true,
      title: "Muhurtham Countdown",
      targetDate: "2026-12-31T10:00:00",
      timezone: "IST",
      customLabels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      hideAfterWedding: true,
      postWeddingMessage: "The wedding has concluded! Thank you for your blessings."
    },
    story: {
      id: "story",
      enabled: true,
      title: "Our Love Story",
      timeline: [
        {
          title: "First Meeting",
          date: "14 Feb 2024",
          description: "Describe your first meeting here."
        },
        {
          title: "The Proposal",
          date: "01 Jan 2025",
          description: "Describe the proposal here."
        }
      ]
    },
    events: [
      {
        id: "wedding",
        enabled: true,
        title: "Wedding Ceremony (Muhurtham)",
        date: "31 Dec 2026",
        time: "10:00 AM",
        venue: "Grand Marriage Palace, City",
        description: "The sacred marriage ceremony details.",
        icon: "💍"
      }
    ],
    gallery: {
      id: "gallery",
      enabled: true,
      title: "Our Moments",
      images: [
        "/images/couple.jpg",
        "/images/couple.jpg",
        "/images/couple.jpg"
      ],
      layoutType: "carousel",
      slideshowMode: true
    },
    families: {
      id: "families",
      enabled: true,
      title: "Warm Greetings",
      brideFamily: [
        { relation: "Parents", name: "Mr. & Mrs. Bride Parents" }
      ],
      groomFamily: [
        { relation: "Parents", name: "Mr. & Mrs. Groom Parents" }
      ]
    },
    rsvp: {
      id: "rsvp",
      enabled: true,
      title: "Kindly RSVP",
      contacts: [
        { type: "whatsapp", label: "WhatsApp Coordinator", value: "919999999999" }
      ]
    },
    faq: {
      id: "faq",
      enabled: true,
      title: "Frequently Asked Questions",
      entries: [
        {
          question: "Is there a dress code?",
          answer: "Traditional Indian attire is preferred."
        }
      ]
    },
    dressCode: {
      id: "dressCode",
      enabled: true,
      title: "Dress Code & Theme",
      code: "Traditional Festive",
      description: "Vibrant ethnic colors are highly encouraged!",
      colors: ["#FF8800", "#FFD700", "#C59B27", "#8B0000"]
    },
    footer: {
      id: "footer",
      enabled: true,
      title: "Footer Credits",
      creditText: "Designed with love by Ahvaanam Hub.",
      salutation: "Bound by Matrimony."
    }
  }
};

export default weddingConfig;
