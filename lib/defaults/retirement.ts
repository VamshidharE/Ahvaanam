import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Retirement invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const retirementConfig: InvitationConfig = {
  category: "retirement",
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
      title: "Celebrating a Distinguished Career",
      subtitle: "Please join us in honoring the retirement of our beloved colleague.",
      welcomeMessage: "|| Happy Retirement ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "RETIREMENT INVITATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    honoree: {
      name: "Honoree Name"
    },
    organization: "Company Name",
    venue: "Grand Banquet Hall, City",
    date: "2026-12-31",
    events: [
      {
        id: "retirement",
        enabled: true,
        title: "Retirement Party",
        date: "31 Dec 2026",
        time: "06:00 PM",
        venue: "Grand Banquet Hall, City",
        description: "Speeches, dinner, and toast celebrating years of hard work.",
        icon: "🎁"
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
      salutation: "Best wishes for the next adventure!"
    }
  }
};

export default retirementConfig;
