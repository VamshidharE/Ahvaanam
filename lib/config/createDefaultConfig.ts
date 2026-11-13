import { InvitationConfig } from "../../components/types/invitation";
import weddingConfig from "../defaults/wedding";
import engagementConfig from "../defaults/engagement";
import birthdayConfig from "../defaults/birthday";
import housewarmingConfig from "../defaults/housewarming";
import retirementConfig from "../defaults/retirement";
import halfsareeConfig from "../defaults/halfsaree";
import babyshowerConfig from "../defaults/babyshower";
import namingceremonyConfig from "../defaults/namingceremony";
import corporateConfig from "../defaults/corporate";
import festivalConfig from "../defaults/festival";

/**
 * Creates and returns a deep clone of the default configuration template for the specified category.
 * Returns a strongly-typed InvitationConfig structure.
 *
 * @param categoryId The category ID to get the default configuration for (e.g., "wedding", "birthday").
 * @returns A deep cloned copy of the default configuration wrapper for the category.
 * @throws Error if the categoryId is invalid, unknown, or not supported.
 */
export function createDefaultConfig(categoryId: string, themeId?: string): InvitationConfig {
  let sourceConfig: InvitationConfig;

  switch (categoryId.toLowerCase()) {
    case "wedding":
      sourceConfig = weddingConfig;
      break;
    case "engagement":
      sourceConfig = engagementConfig;
      break;
    case "birthday":
      sourceConfig = birthdayConfig;
      break;
    case "housewarming":
      sourceConfig = housewarmingConfig;
      break;
    case "retirement":
      sourceConfig = retirementConfig;
      break;
    case "halfsaree":
      sourceConfig = halfsareeConfig;
      break;
    case "babyshower":
      sourceConfig = babyshowerConfig;
      break;
    case "namingceremony":
      sourceConfig = namingceremonyConfig;
      break;
    case "corporate":
      sourceConfig = corporateConfig;
      break;
    case "festival":
      sourceConfig = festivalConfig;
      break;
    default:
      throw new Error(`Unknown invitation category: "${categoryId}"`);
  }

  // Deep clone the object using JSON serialization/deserialization to ensure no shared references
  const cloned = JSON.parse(JSON.stringify(sourceConfig)) as InvitationConfig;
  
  if (categoryId.toLowerCase() === "wedding" && themeId === "rose-mandap" && cloned.config) {
    cloned.themeId = "rose-mandap";
    const config = cloned.config as any;
    config.themeId = "rose-mandap";
    config.sectionOrder = [
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
    ];
    config.music = {
      enabled: true,
      file: "/wedding/rose-mandap/theme-music.MP3"
    };
    if (config.hero) {
      config.hero.title = "Together with their families";
      config.hero.subtitle = "invite you to celebrate the beginning of their beautiful journey together";
      config.hero.welcomeMessage = "ॐ श्री गणेशाय नमः ||";
      config.hero.heroImage = "/wedding/couple/couple.png";
      config.hero.surname = "Ryagalla";
      config.hero.subText = "Ryagalla's Wedding Invitation";
      config.hero.ctaText = "RSVP";
    }
    if (config.couple) {
      config.couple.groom = {
        name: "Aarav",
        parents: "Son of Mr. & Mrs. Groom Family",
        bio: "",
        image: "/wedding/couple/couple.png"
      };
      config.couple.bride = {
        name: "Ananya",
        parents: "Daughter of Mr. & Mrs. Bride Family",
        bio: "",
        image: "/wedding/couple/couple.png"
      };
    }
    if (config.groom) config.groom.name = "Aarav";
    if (config.bride) config.bride.name = "Ananya";
    config.venue = "The Leela Palace, Hyderabad";
    config.date = "2026-09-20";
    config.time = "10:15 AM";
    if (config.countdown) {
      config.countdown.targetDate = "2026-09-20T10:15:00";
    }
    if (config.story) {
      config.story.title = "Our Story";
      config.story.timeline = [
        {
          title: "Our Story",
          date: "",
          description: "Two hearts, two families and one beautiful journey. This is the beginning of a new chapter that we would love to celebrate with you."
        }
      ];
    }
    config.events = [
      {
        id: "haldi",
        enabled: true,
        title: "Haldi",
        date: "18 December 2026",
        time: "10:00 AM",
        venue: "Family Residence",
        description: "An intimate celebration filled with turmeric, laughter and blessings.",
        icon: "✨"
      },
      {
        id: "mehendi",
        enabled: false,
        title: "Mehendi",
        date: "18 December 2026",
        time: "6:00 PM",
        venue: "Family Residence",
        description: "An evening of beautiful mehendi, music and celebration.",
        icon: "🌿"
      },
      {
        id: "wedding",
        enabled: true,
        title: "Wedding",
        date: "20 September 2026",
        time: "10:15 AM",
        venue: "The Leela Palace",
        description: "Join us as we celebrate the sacred wedding ceremony.",
        icon: "💍"
      },
      {
        id: "reception",
        enabled: true,
        title: "Reception",
        date: "01 December 2026",
        time: "7:00 PM",
        venue: "The Leela Palace",
        description: "An evening of joy, dinner and celebration with family and friends.",
        icon: "🥂"
      }
    ];
    if (config.gallery) {
      config.gallery.images = [
        "/wedding/gallery/pic1.png",
        "/wedding/gallery/pic2.jpg",
        "/wedding/gallery/pic3.jpg",
        "/wedding/gallery/pic4.jpg"
      ];
    }
    if (config.families) {
      config.families.brideFamily = [
        { relation: "Parents", name: "Mr. & Mrs. Bride Family" }
      ];
      config.families.groomFamily = [
        { relation: "Parents", name: "Mr. & Mrs. Groom Family" }
      ];
    }
    if (config.rsvp) {
      config.rsvp.title = "We Would Love To Celebrate With You";
      config.rsvp.subtitle = "Your presence and blessings will make our celebration even more special.";
      config.rsvp.contacts = [
        { type: "whatsapp", label: "Contact", value: "+91 9866767100" }
      ];
    }
    if (config.footer) {
      config.footer.salutation = "A beautiful beginning starts with a beautiful invitation.";
      config.footer.designer = "Ahvaanam";
      config.footer.creditText = "Digital Wedding Invitations & Card Services";
      config.footer.location = "Tirumala Printers, Metpally, Dist. Jagtial, Telangana";
      config.footer.contact = "+91 9866767100";
    }
  }


  if (categoryId.toLowerCase() === "wedding" && (themeId === "lotus-mandapam" || themeId === "sacred-courtyard" || themeId === "emerald-palace") && cloned.config) {
    cloned.themeId = themeId;
    const config = cloned.config as any;
    config.themeId = themeId;
    config.sectionOrder = [
      "hero",
      "families",
      "couple",
      "events",
      "story",
      "gallery",
      "venue",
      "rsvp",
      "footer"
    ];
    config.music = {
      enabled: true,
      file: "/wedding/rose-mandap/theme-music.MP3"
    };
    if (config.hero) {
      config.hero.title = "GUPTA & RAO FAMILIES";
      config.hero.subtitle = "Together with our families, we joyfully invite you to celebrate our special day.";
      config.hero.welcomeMessage = "॥ श्री गणेशाय नमः ॥";
      config.hero.heroImage = "/templates/emerald-palace/couple-hero.webp";
      config.hero.bgImage = "/templates/emerald-palace/hero-temple-sunset.jpg";
      config.hero.surname = "GUPTA & RAO FAMILIES";
      config.hero.subText = "THE WEDDING OF ARJUN & DIVYA";
      config.hero.ctaText = "CONFIRM PRESENCE";
    }
    if (config.couple) {
      config.couple.primarySide = "groom";
      config.couple.portraitImage = "/templates/emerald-palace/couple-portrait-large.jpg";
      config.couple.groom = {
        name: "Arjun",
        surname: "Gupta",
        parents: "Son of Sri Ramesh Gupta & Smt. Lalitha Gupta",
        bio: "A compassionate soul of vision and values, finding infinite beauty in love and traditions.",
        image: "/templates/emerald-palace/gallery-groom.jpg"
      };
      config.couple.bride = {
        name: "Divya",
        surname: "Rao",
        parents: "Daughter of Sri Prabhakar Rao & Smt. Sushma Rao",
        bio: "A radiant spirit of grace and creativity, bringing joyous light into every gathering.",
        image: "/templates/emerald-palace/gallery-bride.jpg"
      };
    }
    if (config.groom) {
      config.groom.name = "Arjun";
      config.groom.image = "/templates/emerald-palace/gallery-groom.jpg";
    }
    if (config.bride) {
      config.bride.name = "Divya";
      config.bride.image = "/templates/emerald-palace/gallery-bride.jpg";
    }
    config.venue = "Sri Venkateswara Kalyana Mandapam, Main Road, Ibrahimpatnam, Hyderabad 501506";
    config.date = "2026-12-28";
    config.time = "09:12 AM";
    if (config.countdown) {
      config.countdown.enabled = true;
      config.countdown.title = "Muhurtham Countdown";
      config.countdown.targetDate = "2026-12-28T09:12:00";
      config.countdown.timezone = "IST";
    }
    config.story = {
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
    };
    config.video = {
      enabled: true,
      heading: "A CINEMATIC LOVE CHRONICLE",
      subheading: "Moments woven into eternal memories",
      videoSrc: "/templates/gopuram/video/pre-wedding.mp4",
      posterSrc: "/templates/emerald-palace/bg-film-silk.jpg"
    };
    config.events = [
      {
        id: "pellikuthuru",
        enabled: true,
        title: "Pellikuthuru (Haldi)",
        subtitle: "Auspicious Turmeric Ceremony",
        date: "2026-12-26",
        time: "10:00 AM",
        endTime: "01:00 PM",
        venue: "Sri Venkateswara Kalyana Mandapam",
        address: "Main Road, Ibrahimpatnam, Hyderabad 501506",
        description: "Basking in the golden radiance of sacred turmeric paste, fragrant petals, and playful music.",
        dressCode: "Sunshine Yellow / Traditional Attire",
        illustration: "/templates/emerald-palace/event-haldi.jpg",
        image: "/templates/emerald-palace/event-haldi.jpg",
        accentColor: "#d97724"
      },
      {
        id: "sangeeth",
        enabled: true,
        title: "Sangeeth Night",
        subtitle: "A Musical Celebration of Dance",
        date: "2026-12-26",
        time: "07:00 PM",
        endTime: "11:00 PM",
        venue: "Sri Venkateswara Kalyana Mandapam",
        address: "Grand Ballroom, Ibrahimpatnam, Hyderabad",
        description: "An electric evening filled with celebratory performances, festive music, and boundless joy.",
        dressCode: "Festive Glam / Royal Hues",
        illustration: "/templates/emerald-palace/event-sangeeth.jpg",
        image: "/templates/emerald-palace/event-sangeeth.jpg",
        accentColor: "#9c3f20"
      },
      {
        id: "wedding-muhurtam",
        enabled: true,
        title: "Wedding Muhurtam",
        subtitle: "The Sacred Vows & Pheras",
        date: "2026-12-28",
        time: "09:12 AM",
        endTime: "01:30 PM",
        muhurthamTime: "Sumuhurtham: 09:12 AM",
        venue: "Sri Venkateswara Kalyana Mandapam",
        address: "Main Temple Mandap, Ibrahimpatnam, Hyderabad",
        description: "Witness the sacred union amidst holy Vedic mantras, jasmine garlands, and divine blessings.",
        dressCode: "Traditional South Indian Silks",
        illustration: "/templates/emerald-palace/event-muhurtam.jpg",
        image: "/templates/emerald-palace/event-muhurtam.jpg",
        accentColor: "#a3281d"
      },
      {
        id: "reception",
        enabled: true,
        title: "Reception",
        subtitle: "Grand Celebratory Banquet",
        date: "2026-12-28",
        time: "06:30 PM",
        endTime: "11:00 PM",
        venue: "Sri Venkateswara Kalyana Mandapam Lawns",
        address: "Royal Courtyard Lawns, Ibrahimpatnam, Hyderabad",
        description: "A joyous evening of heartfelt congratulations, royal banquet dining, and celebrating the newlyweds.",
        dressCode: "Indo-Western / Formal Festive",
        illustration: "/templates/emerald-palace/event-reception.jpg",
        image: "/templates/emerald-palace/event-reception.jpg",
        accentColor: "#781d36"
      }
    ];
    config.gallery = {
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
    };
    config.families = {
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
    };
    config.rsvp = {
      id: "rsvp",
      enabled: true,
      title: "Celebrate With Us",
      subtitle: "We request the honour of your esteemed presence to celebrate the holy matrimony and shower your divine blessings upon the newlyweds.",
      contacts: [
        { type: "phone", label: "Family Desk", value: "+91 98765 43210" },
        { type: "whatsapp", label: "WhatsApp Desk", value: "+91 98765 43210" }
      ]
    };
    config.footer = {
      id: "footer",
      enabled: true,
      salutation: "With best compliments from relatives and friends",
      designer: "DESIGNED BY AHVAANAM",
      creditText: "Bespoke Digital Invitations & Royal Stationery",
      location: "Hyderabad & Tirupati",
      contact: "+91 8688178323"
    };
  }

  if (categoryId.toLowerCase() === "wedding" && themeId === "gopuram" && cloned.config) {
    cloned.themeId = "gopuram";
    const config = cloned.config as any;
    config.themeId = "gopuram";
    config.sectionOrder = [
      "hero",
      "couple",
      "events",
      "story",
      "gallery",
      "families",
      "countdown",
      "rsvp",
      "venue",
      "footer"
    ];
    config.music = {
      enabled: true,
      file: "/templates/gopuram/audio/ambient.mp3"
    };
    if (config.hero) {
      config.hero.title = "TOGETHER WITH THEIR FAMILIES";
      config.hero.subtitle = "invite you to celebrate the beginning of their beautiful journey together";
      config.hero.welcomeMessage = "|| श्री गणेशाय नमः ||";
      config.hero.heroImage = "/templates/gopuram/Couple.png";
      config.hero.surname = "SRINIVASAN'S FAMILY";
      config.hero.subText = "SRINIVASAN'S WEDDING INVITATION";
      config.hero.ctaText = "RSVP";
    }
    if (config.couple) {
      config.couple.primarySide = "groom";
      config.couple.groom = {
        name: "Arjun",
        parents: "Son of Smt. Padmaja & Sri Suresh Babu",
        bio: "",
        image: "/templates/gopuram/family/groom-family.jpg"
      };
      config.couple.bride = {
        name: "Meera",
        parents: "Daughter of Smt. Lakshmi Devi & Sri Ramesh Kumar",
        bio: "",
        image: "/templates/gopuram/family/bride-family.jpg"
      };
    }
    if (config.groom) {
      config.groom.name = "Arjun";
      config.groom.image = "/templates/gopuram/family/groom-family.jpg";
    }
    if (config.bride) {
      config.bride.name = "Meera";
      config.bride.image = "/templates/gopuram/family/bride-family.jpg";
    }
    config.venue = "Ananda Kalyana Mandapam, Thanjavur, Tamil Nadu";
    config.date = "2026-11-29";
    config.time = "09:15 AM";
    if (config.countdown) {
      config.countdown.title = "Muhurtham Countdown";
      config.countdown.targetDate = "2026-11-29T09:15:00";
    }
    config.story = {
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
    };
    config.video = {
      enabled: true,
      heading: "A GLIMPSE OF US",
      subheading: "Our story, captured in beautiful moments.",
      videoSrc: "/templates/gopuram/video/pre-wedding.mp4",
      posterSrc: "/templates/gopuram/video/pre-wedding-poster.jpg"
    };
    config.events = [
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
    ];
    config.gallery = {
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
    };
    config.families = {
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
    };
    config.rsvp = {
      id: "rsvp",
      enabled: true,
      title: "We would be delighted by your presence",
      subtitle: "Your presence and heartfelt blessings are our greatest treasure as we begin this sacred union",
      contacts: [
        { type: "phone", label: "Coordinator", value: "+91 8688178323" }
      ]
    };
    config.footer = {
      id: "footer",
      enabled: true,
      salutation: "A beautiful beginning starts with a beautiful invitation.",
      designer: "DESIGNED BY AHVAANAM",
      creditText: "Digital Wedding Invitations & Card Services",
      location: "Tirumala Printers, Metpally, Dist. Jagtial, Telangana",
      contact: "+91 8688178323"
    };
  }

  if (categoryId.toLowerCase() === "wedding" && themeId === "pelli-pandiri" && cloned.config) {
    cloned.themeId = "pelli-pandiri";
    const config = cloned.config as any;
    config.themeId = "pelli-pandiri";
    config.sectionOrder = [
      "hero",
      "couple",
      "events",
      "story",
      "gallery",
      "families",
      "countdown",
      "rsvp",
      "venue",
      "footer"
    ];
    config.music = {
      enabled: true,
      file: "/templates/pelli-pandiri/audio/ambient.mp3"
    };
    if (config.hero) {
      config.hero.title = "TOGETHER WITH THEIR FAMILIES";
      config.hero.subtitle = "invite you to celebrate the beginning of their beautiful journey together";
      config.hero.welcomeMessage = "|| श्री गणेशाय नमः ||";
      config.hero.heroImage = "/templates/pelli-pandiri/Couple.png";
      config.hero.surname = "BIRUDURAJU'S FAMILY";
      config.hero.subText = "BIRUDURAJU'S WEDDING INVITATION";
      config.hero.ctaText = "RSVP";
    }
    if (config.couple) {
      config.couple.primarySide = "groom";
      config.couple.groom = {
        name: "Arjun",
        parents: "Son of Smt. Padmaja & Sri Suresh Babu",
        bio: "",
        image: "/templates/pelli-pandiri/family/groom-family.jpg"
      };
      config.couple.bride = {
        name: "Meera",
        parents: "Daughter of Smt. Lakshmi Devi & Sri Ramesh Kumar",
        bio: "",
        image: "/templates/pelli-pandiri/family/bride-family.jpg"
      };
    }
    if (config.groom) {
      config.groom.name = "Arjun";
      config.groom.image = "/templates/pelli-pandiri/family/groom-family.jpg";
    }
    if (config.bride) {
      config.bride.name = "Meera";
      config.bride.image = "/templates/pelli-pandiri/family/bride-family.jpg";
    }
    config.venue = "Ananda Kalyana Mandapam, Thanjavur, Tamil Nadu";
    config.date = "2026-11-29";
    config.time = "09:15 AM";
    if (config.countdown) {
      config.countdown.title = "Muhurtham Countdown";
      config.countdown.targetDate = "2026-11-29T09:15:00";
    }
    config.story = {
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
    };
    config.video = {
      enabled: true,
      heading: "A GLIMPSE OF US",
      subheading: "Our story, captured in beautiful moments.",
      videoSrc: "/templates/pelli-pandiri/video/pre-wedding.mp4",
      posterSrc: "/templates/pelli-pandiri/video/pre-wedding-poster.jpg"
    };
    config.events = [
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
    ];
    config.gallery = {
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
    };
    config.families = {
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
    };
    config.rsvp = {
      id: "rsvp",
      enabled: true,
      title: "We would be delighted by your presence",
      subtitle: "Your presence and heartfelt blessings are our greatest treasure as we begin this sacred union",
      contacts: [
        { type: "phone", label: "Coordinator", value: "+91 8688178323" }
      ]
    };
    config.footer = {
      id: "footer",
      enabled: true,
      salutation: "A beautiful beginning starts with a beautiful invitation.",
      designer: "DESIGNED BY AHVAANAM",
      creditText: "Digital Wedding Invitations & Card Services",
      location: "Tirumala Printers, Metpally, Dist. Jagtial, Telangana",
      contact: "+91 8688178323"
    };
  }

  return cloned;
}
