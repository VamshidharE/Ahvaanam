export interface EmeraldPalaceEvent {
  id?: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
  address?: string;
  description: string;
  dressCode?: string;
  image?: string;
  icon?: string;
  auspiciousTime?: string;
  enabled: boolean;
}

export interface EmeraldPalaceData {
  sections: {
    showAnnouncement: boolean;
    showCouple: boolean;
    showEvents: boolean;
    showFamily: boolean;
    showStory: boolean;
    showGallery: boolean;
    showVenue: boolean;
    showCountdown: boolean;
    showRSVP: boolean;
    showFooter: boolean;
    showVideo?: boolean;
  };
  music: {
    themeMusic: string;
  };
  hero: {
    coupleImage: string;
    bgImage: string;
    eyebrow: string;
    date: string;
  };
  couple: {
    bride: string;
    groom: string;
    portraitImage?: string;
    brideSurname?: string;
    groomSurname?: string;
    primarySide: "groom" | "bride";
    groomImage?: string;
    brideImage?: string;
    groomBio?: string;
    brideBio?: string;
    groomParents?: string;
    brideParents?: string;
    monogram?: string;
  };
  introduction: {
    mantra: string;
    mantraMeaning?: string;
    eyebrow: string;
    message: string;
    familyTitle: string;
    invitationGreeting?: string;
  };
  wedding: {
    date: string;
    day: string;
    time: string;
    muhurtham?: string;
    countdownTarget: string;
    venue: string;
    city: string;
    address?: string;
    mapsLink: string;
    mapsEmbedUrl: string;
  };
  reception?: {
    enabled: boolean;
    title: string;
    venue: string;
    city: string;
    address?: string;
    date: string;
    time: string;
    mapsLink: string;
    mapsEmbedUrl: string;
  };
  family: {
    title: string;
    brideParents: string;
    groomParents: string;
    brideFamily: Array<{ relation?: string; name: string }>;
    groomFamily: Array<{ relation?: string; name: string }>;
    groomPortrait?: string;
    bridePortrait?: string;
    groomFamilyTitle?: string;
    brideFamilyTitle?: string;
    blessingQuote?: string;
    groomFamilyImage?: string;
    brideFamilyImage?: string;
    groomFamilyFocalPoint?: string;
    brideFamilyFocalPoint?: string;
  };
  events: EmeraldPalaceEvent[];
  story: {
    title: string;
    text: string;
    couplePhoto: string;
    couplePhoto2?: string;
    milestones?: Array<{ yearOrDate: string; title: string; desc: string }>;
  };
  gallery: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  video?: {
    enabled: boolean;
    title: string;
    subtitle?: string;
    url: string;
    poster: string;
  };
  rsvp: {
    title: string;
    message: string;
    buttonText: string;
    contacts: Array<{ type: string; label: string; value: string }>;
    whatsappNumber: string;
    whatsappLabel?: string;
    rsvpDeadline?: string;
  };
  footer: {
    quote: string;
    blessing: string;
    designer: string;
    service: string;
    location: string;
    contact: string;
  };
}

const formatWeddingDate = (raw: string) => {
  if (!raw || typeof raw !== "string") return "28th Dec 2026";
  const trimmed = raw.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const parts = trimmed.split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const suffix = (day % 10 === 1 && day !== 11) ? "st" : (day % 10 === 2 && day !== 12) ? "nd" : (day % 10 === 3 && day !== 13) ? "rd" : "th";
    return `${day}${suffix} ${months[monthIndex] || "Dec"} ${year}`;
  }
  return trimmed;
};

const isGenericPlaceholder = (val: any, placeholders: string[]) => {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim().toLowerCase();
  return placeholders.some((p) => trimmed === p.toLowerCase() || trimmed === "" || trimmed.includes("groom family") || trimmed.includes("bride family"));
};

export function mapInvitationConfigToEmeraldPalace(rawConfig: any): EmeraldPalaceData {
  const isWrapped = rawConfig && "category" in rawConfig && "config" in rawConfig;
  const config = isWrapped ? rawConfig.config : (rawConfig || {});

  // Primary Side
  const primarySide = (config.couple?.primarySide || config.primarySide || "groom") === "bride" ? "bride" : "groom";

  // Couple names - elegant default fallback to Arjun & Divya with proper capitalization
  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const rawGroom = config.couple?.groom?.name || config.groom?.name || config.groom || "";
  const rawBride = config.couple?.bride?.name || config.bride?.name || config.bride || "";
  const groomName = capitalize(isGenericPlaceholder(rawGroom, ["groom name", "host", "groom", ""]) ? "Arjun" : rawGroom);
  const brideName = capitalize(isGenericPlaceholder(rawBride, ["bride name", "guest", "bride", ""]) ? "Divya" : rawBride);

  const rawGroomSurname = config.couple?.groom?.surname || config.groom?.surname || "Gupta";
  const rawBrideSurname = config.couple?.bride?.surname || config.bride?.surname || "Rao";

  const groomImage = config.couple?.groom?.image || config.groom?.image || config.families?.groomPortrait || "/wedding/family/groom.png";
  const brideImage = config.couple?.bride?.image || config.bride?.image || config.families?.bridePortrait || "/wedding/family/bride.png";
  
  const groomParents = config.families?.groomParents || config.family?.groomParents || config.groomParents || "Sri Ramesh Gupta & Smt. Lalitha Gupta";
  const brideParents = config.families?.brideParents || config.family?.brideParents || config.brideParents || "Sri Prabhakar Rao & Smt. Sushma Rao";

  const groomBio = config.couple?.groom?.bio || "A compassionate soul of vision and values, finding infinite beauty in love and traditions.";
  const brideBio = config.couple?.bride?.bio || "A radiant spirit of grace and creativity, bringing joyous light into every gathering.";

  // Monogram initials
  const gInitial = (groomName.charAt(0) || "A").toUpperCase();
  const bInitial = (brideName.charAt(0) || "D").toUpperCase();
  const monogram = primarySide === "bride" ? `${bInitial} & ${gInitial}` : `${gInitial} & ${bInitial}`;

  // Introduction
  const rawMantra = config.hero?.welcomeMessage || config.hero?.mantra || config.mantra || "";
  const mantra = isGenericPlaceholder(rawMantra, ["|| shree ganeshaay namah ||", ""]) 
    ? "॥ श्री गणेशाय नमः ॥" 
    : rawMantra;
  
  const mantraMeaning = "Invoking the divine blessings of Lord Ganesha for auspiciousness, prosperity and eternal grace.";

  const rawEyebrow = config.hero?.title || "";
  const eyebrow = isGenericPlaceholder(rawEyebrow, ["together with our beloved families", "together with their families", ""]) 
    ? "The Wedding of" 
    : rawEyebrow;

  const rawMessage = config.hero?.subtitle || "";
  const message = isGenericPlaceholder(rawMessage, ["request the pleasure of your gracious presence as we begin our forever together.", ""])
    ? "With the blessings of our families, we joyfully invite you to celebrate the wedding of"
    : rawMessage;

  const introFamilyTitle = primarySide === "bride"
    ? (rawBrideSurname ? `The ${rawBrideSurname} Family` : `${brideName}'s Family`)
    : (rawGroomSurname ? `The ${rawGroomSurname} Family` : `${groomName}'s Family`);

  // Wedding Date and Time
  const rawDate = config.hero?.date || config.wedding?.date || config.date || "28th Dec 2026";
  const weddingDate = formatWeddingDate(isGenericPlaceholder(rawDate, ["wedding date", "date", ""]) ? "28th Dec 2026" : rawDate);
  const weddingDay = config.wedding?.day || "Sunday";
  const weddingTime = config.wedding?.time || "9:12 AM";
  const muhurtham = config.wedding?.muhurtham || "Sumuhurtham: 9:12 AM";

  // Countdown Target
  const countdownTarget = config.wedding?.countdownTarget || "2026-12-28T09:12:00";

  // Venue
  const rawVenue = config.venue?.name || config.wedding?.venue || "Sri Venkateswara Kalyana Mandapam";
  const venue = isGenericPlaceholder(rawVenue, ["venue name", "venue", ""]) ? "Sri Venkateswara Kalyana Mandapam" : rawVenue;
  const city = config.venue?.city || config.wedding?.city || "Ibrahimpatnam, Hyderabad";
  const address = config.venue?.address || "Main Road, Ibrahimpatnam, Hyderabad 501506";
  const mapsLink = config.venue?.mapsLink || config.wedding?.mapsLink || "https://maps.google.com/?q=Sri+Venkateswara+Kalyana+Mandapam+Hyderabad";
  const mapsEmbedUrl = config.venue?.mapsEmbedUrl || config.wedding?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15234.567890!2d78.64!3d17.20!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTfCsDEyJzAwLjAiTiA3OMKwMzgnMjQuMCJF!5e0!3m2!1sen!2sin!4v1700000000000";

  // Reception
  const hasReception = config.reception?.enabled !== false;
  const reception = {
    enabled: hasReception,
    title: config.reception?.title || "Reception",
    venue: config.reception?.venue || "Sri Venkateswara Kalyana Mandapam Lawns",
    city: config.reception?.city || "Ibrahimpatnam, Hyderabad",
    address: config.reception?.address || address,
    date: config.reception?.date || "28 Dec 2026",
    time: config.reception?.time || "6:30 PM",
    mapsLink: config.reception?.mapsLink || mapsLink,
    mapsEmbedUrl: config.reception?.mapsEmbedUrl || mapsEmbedUrl,
  };

  // Events itinerary - 4 distinct events matching the reference
  const defaultEventImages = [
    "/templates/emerald-palace/event-haldi.jpg",
    "/templates/emerald-palace/event-sangeeth.jpg",
    "/templates/emerald-palace/event-muhurtam.jpg",
    "/templates/emerald-palace/event-reception.jpg",
  ];

  const rawEvents = config.events || [];
  let events: EmeraldPalaceEvent[] = [];

  if (Array.isArray(rawEvents) && rawEvents.length > 0) {
    events = rawEvents.map((e: any, idx: number) => ({
      id: e.id || `event-${idx}`,
      title: e.title || (idx === 0 ? "Pellikuthuru (Haldi)" : idx === 1 ? "Sangeeth" : idx === 2 ? "Wedding Muhurtam" : "Reception"),
      subtitle: e.subtitle || "",
      date: e.date || (idx < 2 ? "26 Dec 2026" : "28 Dec 2026"),
      time: e.time || (idx === 0 ? "10:00 AM" : idx === 1 ? "7:00 PM" : idx === 2 ? "9:12 AM" : "6:30 PM"),
      venue: e.venue || venue,
      address: e.address || e.venueAddress || address,
      description: e.description || (idx === 0 ? "Turmeric and floral blessings" : idx === 1 ? "An evening of music and dance" : idx === 2 ? "Sacred union and wedding sumuhurtham" : "Grand celebratory dinner"),
      dressCode: e.dressCode || (idx === 0 ? "Pastel Yellow" : idx === 1 ? "Festive Glam" : idx === 2 ? "Traditional Silk" : "Formal Festive"),
      image: e.image || defaultEventImages[idx % defaultEventImages.length],
      icon: e.icon || (idx === 0 ? "haldi" : idx === 1 ? "sangeeth" : idx === 2 ? "muhurtam" : "reception"),
      auspiciousTime: e.auspiciousTime || (idx === 2 ? "9:12 AM" : ""),
      enabled: e.enabled !== false,
    }));
  } else {
    // Exact 4-Event Itinerary from Reference Mockup
    events = [
      {
        id: "pellikuthuru",
        title: "Pellikuthuru (Haldi)",
        subtitle: "Auspicious Turmeric Ceremony",
        date: "26 Dec 2026",
        time: "10:00 AM",
        venue: venue,
        address: address,
        description: "Basking in the golden radiance of sacred turmeric paste, fragrant petals, and playful music.",
        dressCode: "Sunshine Yellow / Traditional",
        icon: "haldi",
        image: "/templates/emerald-palace/event-haldi.jpg",
        enabled: true,
      },
      {
        id: "sangeeth",
        title: "Sangeeth",
        subtitle: "A Night of Music & Celebration",
        date: "26 Dec 2026",
        time: "7:00 PM",
        venue: venue,
        address: address,
        description: "An evening filled with energetic dances, melodious performances, and celebratory joy.",
        dressCode: "Festive Glam / Royal Hues",
        icon: "sangeeth",
        image: "/templates/emerald-palace/event-sangeeth.jpg",
        enabled: true,
      },
      {
        id: "wedding-muhurtam",
        title: "Wedding Muhurtam",
        subtitle: "The Sacred Vows & Pheras",
        date: "28 Dec 2026",
        time: "9:12 AM",
        venue: venue,
        address: address,
        description: "Witness the sacred union amidst holy Vedic mantras, floral blessings, and divine grace.",
        dressCode: "Traditional South Indian Silks",
        icon: "muhurtam",
        image: "/templates/emerald-palace/event-muhurtam.jpg",
        auspiciousTime: "Sumuhurtham: 9:12 AM",
        enabled: true,
      },
      {
        id: "reception",
        title: "Reception",
        subtitle: "Celebratory Banquet",
        date: "28 Dec 2026",
        time: "6:30 PM",
        venue: venue,
        address: address,
        description: "A joyous evening of heartfelt congratulations, music, and an exquisite royal feast.",
        dressCode: "Indo-Western / Formal Festive",
        icon: "reception",
        image: "/templates/emerald-palace/event-reception.jpg",
        enabled: true,
      },
    ];
  }

  // Family details
  const rawGroomFamilyImg =
    config.family?.groomFamilyImage ||
    config.families?.groomFamilyImage ||
    config.family?.groomFamilyPhoto ||
    config.families?.groomFamilyPhoto;

  const rawBrideFamilyImg =
    config.family?.brideFamilyImage ||
    config.families?.brideFamilyImage ||
    config.family?.brideFamilyPhoto ||
    config.families?.brideFamilyPhoto;

  const groomFamilyImage = rawGroomFamilyImg || "/templates/emerald-palace/family-groom.jpg";
  const brideFamilyImage = rawBrideFamilyImg || "/templates/emerald-palace/family-bride.jpg";

  const groomFamilyFocalPoint =
    config.family?.groomFamilyFocalPoint ||
    config.families?.groomFamilyFocalPoint ||
    "center 20%";

  const brideFamilyFocalPoint =
    config.family?.brideFamilyFocalPoint ||
    config.families?.brideFamilyFocalPoint ||
    "center 20%";

  const groomFamilyTitle =
    config.family?.groomFamilyTitle ||
    config.families?.groomFamilyTitle ||
    (rawGroomSurname ? `The ${rawGroomSurname} Family` : `${groomName}'s Family`);

  const brideFamilyTitle =
    config.family?.brideFamilyTitle ||
    config.families?.brideFamilyTitle ||
    (rawBrideSurname ? `The ${rawBrideSurname} Family` : `${brideName}'s Family`);

  const familyBlessingQuote =
    config.family?.blessingQuote ||
    config.families?.blessingQuote ||
    "Together, our families welcome you to celebrate this beautiful union.";

  const brideFamily = Array.isArray(config.families?.brideFamily || config.family?.brideFamily)
    ? (config.families?.brideFamily || config.family?.brideFamily)
    : [
        { relation: "Parents", name: brideParents },
        { relation: "Brother", name: "Karthik Rao" },
      ];

  const groomFamily = Array.isArray(config.families?.groomFamily || config.family?.groomFamily)
    ? (config.families?.groomFamily || config.family?.groomFamily)
    : [
        { relation: "Parents", name: groomParents },
        { relation: "Sister", name: "Pooja Gupta" },
      ];

  // Story
  const storyTitle = config.story?.title || "Our Story";
  const storyText = config.story?.text || "From a chance meeting to a lifelong journey, our story has been one of friendship, laughter, and shared dreams.";
  const couplePhoto = config.story?.couplePhoto || "/templates/emerald-palace/story-candid.jpg";
  const couplePhoto2 = config.story?.couplePhoto2 || "/templates/emerald-palace/story-hands.jpg";

  // Gallery
  const rawGallery = config.gallery || [];
  let gallery = Array.isArray(rawGallery) && rawGallery.length > 0
    ? rawGallery.map((item: any, i: number) => ({
        src: typeof item === "string" ? item : item.src || item.url || "/templates/emerald-palace/couple-portrait-large.jpg",
        alt: typeof item === "object" ? item.alt || `Moment ${i + 1}` : `Moment ${i + 1}`,
        caption: typeof item === "object" ? item.caption || "" : "",
      }))
    : [
        { src: "/templates/emerald-palace/couple-portrait-large.jpg", alt: "Arjun & Divya Royal Portrait", caption: "Eternal Beginning" },
        { src: "/templates/emerald-palace/story-candid.jpg", alt: "Sunset Courtyard Candid", caption: "Joyous Laughter" },
        { src: "/templates/emerald-palace/gallery-bride.jpg", alt: "Divya Bridal Glow", caption: "Bridal Radiance" },
        { src: "/templates/emerald-palace/gallery-groom.jpg", alt: "Arjun Regal Groom", caption: "Royal Heritage" },
        { src: "/templates/emerald-palace/story-hands.jpg", alt: "Sacred Clasped Hands", caption: "Sacred Bond" },
        { src: "/templates/emerald-palace/event-muhurtam.jpg", alt: "Sacred Kalyana Mandapam", caption: "Divine Blessings" },
      ];

  // Video settings
  const video = {
    enabled: config.video?.enabled !== false,
    title: config.video?.title || "Our Wedding Film",
    subtitle: config.video?.subtitle || "Relive the timeless moments, laughter, and sacred vows captured in cinematic motion.",
    url: config.video?.url || "/wedding/procession/procession.mp4",
    poster: config.video?.poster || "/templates/emerald-palace/couple-portrait-large.jpg",
  };

  // RSVP
  const rsvp = {
    title: config.rsvp?.title || "Will You Be Joining Us?",
    message: config.rsvp?.message || "Please let us know if you can join us for the celebrations.",
    buttonText: config.rsvp?.buttonText || "CONFIRM ATTENDANCE",
    contacts: Array.isArray(config.rsvp?.contacts) && config.rsvp.contacts.length > 0
      ? config.rsvp.contacts
      : [
          { type: "phone", label: "Hospitality Desk", value: "+91 9866767100" },
        ],
    whatsappNumber: config.rsvp?.whatsappNumber || "919866767100",
    whatsappLabel: config.rsvp?.whatsappLabel || "Confirm via WhatsApp",
    rsvpDeadline: config.rsvp?.deadline || "20th December 2026",
  };

  // Footer
  const footer = {
    quote: config.footer?.quote || "Two souls with but a single thought, two hearts that beat as one.",
    blessing: "Looking forward to celebrating this auspicious union with you.",
    designer: "Ahvaanam",
    service: "Luxury Wedding Suite",
    location: "Hyderabad • India",
    contact: "care@ahvaanam.com",
  };

  // Section visibility flags
  const sections = {
    showAnnouncement: config.sections?.showAnnouncement !== false,
    showCouple: config.sections?.showCouple !== false,
    showEvents: config.sections?.showEvents !== false,
    showFamily: config.sections?.showFamily !== false,
    showStory: config.sections?.showStory !== false,
    showGallery: config.sections?.showGallery !== false,
    showVenue: config.sections?.showVenue !== false,
    showCountdown: config.sections?.showCountdown !== false,
    showRSVP: config.sections?.showRSVP !== false,
    showFooter: config.sections?.showFooter !== false,
  };

  // Hero settings
  const rawCoupleHero =
    config.hero?.coupleImage ||
    config.hero?.coupleCutout ||
    config.couple?.heroImage ||
    config.couple?.cutoutImage;
  const coupleHeroImage = rawCoupleHero || "/templates/emerald-palace/couple-hero.png";
  const bgImage = config.hero?.backgroundImage || config.hero?.bgImage || "/templates/emerald-palace/hero-temple-sunset.jpg";

  return {
    sections,
    music: {
      themeMusic: config.music?.themeMusic || config.music?.file || "/wedding/rose-mandap/theme-music.MP3",
    },
    hero: {
      coupleImage: coupleHeroImage,
      bgImage,
      eyebrow,
      date: weddingDate,
    },
    couple: {
      bride: brideName,
      groom: groomName,
      portraitImage: config.couple?.portraitImage || config.couple?.image || "/templates/emerald-palace/couple-portrait-large.jpg",
      brideSurname: rawBrideSurname,
      groomSurname: rawGroomSurname,
      primarySide,
      groomImage,
      brideImage,
      groomBio,
      brideBio,
      groomParents,
      brideParents,
      monogram,
    },
    introduction: {
      mantra,
      mantraMeaning,
      eyebrow,
      message,
      familyTitle: introFamilyTitle,
      invitationGreeting: config.hero?.greeting || "Shree Ganeshay Namah",
    },
    wedding: {
      date: weddingDate,
      day: weddingDay,
      time: weddingTime,
      muhurtham,
      countdownTarget,
      venue,
      city,
      address,
      mapsLink,
      mapsEmbedUrl,
    },
    reception,
    family: {
      title: config.family?.title || config.families?.title || "With the Blessings of Our Families",
      brideParents,
      groomParents,
      brideFamily,
      groomFamily,
      groomPortrait: groomImage,
      bridePortrait: brideImage,
      groomFamilyTitle,
      brideFamilyTitle,
      blessingQuote: familyBlessingQuote,
      groomFamilyImage,
      brideFamilyImage,
      groomFamilyFocalPoint,
      brideFamilyFocalPoint,
    },
    events,
    story: {
      title: storyTitle,
      text: storyText,
      couplePhoto,
      couplePhoto2,
      milestones: [
        { yearOrDate: "2024", title: "First Encounter", desc: "A chance meeting that blossomed into a beautiful friendship." },
        { yearOrDate: "2025", title: "The Promise", desc: "Deciding on a forever filled with love and shared dreams." },
        { yearOrDate: "2026", title: "The Sacred Muhurtam", desc: "Uniting our hearts and families in eternal celebration." },
      ],
    },
    gallery,
    video,
    rsvp,
    footer,
  };
}
