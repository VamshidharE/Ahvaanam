import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Birthday invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const birthdayConfig: InvitationConfig = {
  category: "birthday",
  themeId: "modern-birthday",
  config: {
    themeId: "modern-birthday",
    sectionOrder: [
      "hero",
      "celebrant",
      "countdown",
      "events",
      "gallery",
      "rsvp",
      "faq",
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
      title: "Join us in celebrating",
      subtitle: "a wonderful milestone birthday full of joy and laughter.",
      welcomeMessage: "|| Welcome to the Celebration ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "View Invitation",
      musicAutoplay: false,
      showParticles: true,
      subText: "BIRTHDAY INVITATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    celebrant: {
      name: "Celebrant Name"
    },
    age: 25,
    venue: "Grand Party Hall, City",
    date: "2026-12-31",
    time: "06:00 PM",
    countdown: {
      id: "countdown",
      enabled: true,
      title: "Birthday Countdown",
      targetDate: "2026-12-31T18:00:00",
      timezone: "IST",
      customLabels: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" },
      hideAfterWedding: true,
      postWeddingMessage: "The celebration has begun!"
    },
    events: [
      {
        id: "birthday",
        enabled: true,
        title: "Birthday Party",
        date: "31 Dec 2026",
        time: "06:00 PM",
        venue: "Grand Party Hall, City",
        description: "Fun, games, and cake cutting ceremony.",
        icon: "🎂"
      }
    ],
    gallery: {
      id: "gallery",
      enabled: true,
      title: "Memories",
      images: [
        "/images/couple.jpg",
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
    faq: {
      id: "faq",
      enabled: true,
      title: "Frequently Asked Questions",
      entries: [
        {
          question: "Is there a theme?",
          answer: "Smart casuals or festive wear."
        }
      ]
    },
    footer: {
      id: "footer",
      enabled: true,
      title: "Footer Credits",
      creditText: "Designed with love by Ahvaanam Hub.",
      salutation: "Cheers to Another Year!"
    }
  }
};

export default birthdayConfig;
