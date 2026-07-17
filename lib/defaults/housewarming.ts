import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Housewarming invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const housewarmingConfig: InvitationConfig = {
  category: "housewarming",
  themeId: "royal-temple",
  config: {
    themeId: "royal-temple",
    sectionOrder: [
      "hero",
      "countdown",
      "events",
      "gallery",
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
      title: "Griha Pravesh Invitation",
      subtitle: "We request the pleasure of your company as we step into our new home and start a new chapter.",
      welcomeMessage: "|| Shree Ganeshaay Namah ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "HOUSEWARMING INVITATION",
      enableHeaderMedia: true,
      headerMediaType: "god",
      selectedGod: "ganesha",
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    hosts: "Host Names",
    address: "123 New Home Street, City",
    date: "2026-12-31",
    time: "10:00 AM",
    countdown: {
      id: "countdown",
      enabled: true,
      title: "Puja Countdown",
      targetDate: "2026-12-31T10:00:00",
      timezone: "IST",
      customLabels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      hideAfterWedding: true,
      postWeddingMessage: "We have moved in!"
    },
    events: [
      {
        id: "housewarming",
        enabled: true,
        title: "Griha Pravesham Puja & Lunch",
        date: "31 Dec 2026",
        time: "10:00 AM",
        venue: "123 New Home Street, City",
        description: "Traditional housewarming puja followed by lunch.",
        icon: "🏠"
      }
    ],
    gallery: {
      id: "gallery",
      enabled: true,
      title: "Our New Home",
      images: [
        "/images/couple.jpg"
      ],
      layoutType: "carousel",
      slideshowMode: true
    },
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
      salutation: "Welcome to our Abode."
    }
  }
};

export default housewarmingConfig;
