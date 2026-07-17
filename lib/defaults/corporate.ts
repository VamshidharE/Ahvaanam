import { InvitationConfig } from "../../components/types/invitation";

/**
 * Default configuration object for the Corporate invitation category.
 * Wrapped in the strongly-typed InvitationConfig structure.
 */
const corporateConfig: InvitationConfig = {
  category: "corporate",
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
      showParticles: false,
      particleType: "dust",
      borderStyle: "gold",
      heroAnimation: "zoom",
      buttonStyle: "rounded",
      galleryStyle: "carousel",
      countdownStyle: "glass"
    },
    music: {
      enabled: false,
      file: ""
    },
    hero: {
      id: "hero",
      enabled: true,
      title: "Corporate Event & Networking Session",
      subtitle: "We invite you to join us for our upcoming professional summit and keynotes.",
      welcomeMessage: "|| Corporate Event ||",
      heroImage: "/images/couple.jpg",
      backgroundType: "image",
      overlayOpacity: 0.45,
      ctaText: "Register & Details",
      musicAutoplay: false,
      showParticles: false,
      subText: "CORPORATE INVITATION",
      enableHeaderMedia: false,
      headerMediaColor: "#C59B27",
      headerMediaSize: 80,
      headerMediaPosition: "top-middle",
      headerMediaSpacing: 30
    },
    company: "Company Name",
    eventTitle: "Corporate Event Title",
    speaker: "Speaker Name",
    venue: "Grand Conference Center, City",
    events: [
      {
        id: "corporate",
        enabled: true,
        title: "Corporate Summit Keynote",
        date: "31 Dec 2026",
        time: "09:00 AM",
        venue: "Grand Conference Center, City",
        description: "Registration followed by keynote presentations and high tea.",
        icon: "💼"
      }
    ],
    rsvp: {
      id: "rsvp",
      enabled: true,
      title: "Kindly RSVP",
      contacts: [
        { type: "email", label: "Event Registration Desk", value: "events@company.com" }
      ]
    },
    footer: {
      id: "footer",
      enabled: true,
      title: "Footer Credits",
      creditText: "Designed with love by Ahvaanam Hub.",
      salutation: "Looking forward to your presence."
    }
  }
};

export default corporateConfig;
