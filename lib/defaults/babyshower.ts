import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Baby Shower invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const babyShowerConfig: InvitationConfig = {
  category: "babyshower",
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
      title: "A Little One is on the Way!",
      subtitle: "Help us shower the parents-to-be with love, blessings, and good wishes.",
      welcomeMessage: "|| Welcome to Baby Shower ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "BABY SHOWER INVITATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    mother: {
      name: "Mother Name"
    },
    father: {
      name: "Father Name"
    },
    venue: "Grand Banquet Hall, City",
    events: [
      {
        id: "babyshower",
        enabled: true,
        title: "Baby Shower Party",
        date: "31 Dec 2026",
        time: "03:00 PM",
        venue: "Grand Banquet Hall, City",
        description: "Fun, games, high tea, and blessings.",
        icon: "👶"
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
      salutation: "Waiting for the Bundle of Joy!"
    }
  }
};

export default babyShowerConfig;
