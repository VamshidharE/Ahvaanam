import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Festival invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const festivalConfig: InvitationConfig = {
  category: "festival",
  themeId: "royal-temple",
  config: {
    themeId: "royal-temple",
    sectionOrder: [
      "hero",
      "events",
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
      title: "Festival Celebration Invitation",
      subtitle: "Let us gather together with family and friends to share blessings and joy during this festive season.",
      welcomeMessage: "|| Festive Greetings ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "FESTIVAL CELEBRATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    festivalName: "Festival Name",
    venue: "Community Center, City",
    events: [
      {
        id: "festival",
        enabled: true,
        title: "Festive Celebration Gathering",
        date: "31 Dec 2026",
        time: "06:00 PM",
        venue: "Community Center, City",
        description: "Puja, traditional lighting of lamps, and dinner feast.",
        icon: "⭐"
      }
    ],
    rsvp: {
      id: "rsvp",
      enabled: true,
      title: "Kindly RSVP",
      contacts: [
        { type: "whatsapp", label: "WhatsApp Coordinator", value: "919999999999" }
      ]
    },
    footer: {
      id: "footer",
      enabled: true,
      title: "Footer Credits",
      creditText: "Designed with love by Ahvaanam Hub.",
      salutation: "Happy Celebrations!"
    }
  }
};

export default festivalConfig;
