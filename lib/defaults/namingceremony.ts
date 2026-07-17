import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Naming Ceremony invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const namingCeremonyConfig: InvitationConfig = {
  category: "namingceremony",
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
      title: "Naming Ceremony (Peyarakaranam)",
      subtitle: "We invite you to share in our joy as we bestow a name upon our sweet bundle of joy.",
      welcomeMessage: "|| Welcome to Naming Ceremony ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "NAMING CEREMONY INVITATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    baby: {
      name: "Baby Name"
    },
    parents: "Parents Names",
    events: [
      {
        id: "namingceremony",
        enabled: true,
        title: "Peyarakaranam Ceremony",
        date: "31 Dec 2026",
        time: "10:00 AM",
        venue: "Grand Marriage Palace, City",
        description: "Naming ceremony rituals followed by a celebratory feast.",
        icon: "😊"
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
      salutation: "Bless our little one."
    }
  }
};

export default namingCeremonyConfig;
