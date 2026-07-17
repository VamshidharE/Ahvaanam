import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Half Saree invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const halfSareeConfig: InvitationConfig = {
  category: "halfsaree",
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
      title: "Half Saree Ceremony",
      subtitle: "We cordially invite you to bless our daughter as she celebrates her traditional half saree function (Ritu Kala Samskara).",
      welcomeMessage: "|| Warm Welcome ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "HALF SAREE INVITATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    celebrant: {
      name: "Celebrant Name"
    },
    parents: "Parents Names",
    venue: "Grand Marriage Palace, City",
    events: [
      {
        id: "halfsaree",
        enabled: true,
        title: "Half Saree Ceremony (Langa Voni)",
        date: "31 Dec 2026",
        time: "10:00 AM",
        venue: "Grand Marriage Palace, City",
        description: "Traditional ceremonies followed by lunch.",
        icon: "✨"
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
      salutation: "Blessings & Wishes."
    }
  }
};

export default halfSareeConfig;
