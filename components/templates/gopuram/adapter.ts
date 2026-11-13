export interface GopuramEvent {
  id: string;
  name: string;
  navLabel: string;
  shortDate: string;
  subTitle?: string;
  date: string;
  dayOfWeek?: string;
  startTime: string;
  endTime?: string;
  muhurthamTime?: string;
  venue: string;
  address?: string;
  mapQuery?: string;
  mapsEmbedUrl?: string;
  mapsLink?: string;
  directionsUrl?: string;
  showMap?: boolean;
  showDirections?: boolean;
  illustration: string;
  accentColor?: string;
  enabled: boolean;
}

export interface GopuramFamilyMember {
  role?: string;
  name: string;
}

export interface GopuramFamilySide {
  title: string;
  portrait: string;
  portraitAlt: string;
  relationLabel: string;
  members: GopuramFamilyMember[];
  location?: string;
}

export interface GopuramPhoto {
  id: string;
  src: string;
  alt: string;
  rotation?: number;
}

export interface GopuramData {
  id: string;
  assets: {
    skyBackground: string;
    gopuramOverlay: string;
    coupleCutout: string;
    coupleCutoutAlt: string;
    invitationBackground: string;
    coupleShowcaseBg: string;
    lotusMandala: string;
    coupleCloudsForeground: string;
    topDecorationLeft: string;
    topDecorationRight: string;
    hangingTempleBell: string;
    lotusCorner: string;
  };
  couple: {
    primarySide: "groom" | "bride";
    groomName: string;
    brideName: string;
    groomSurname: string;
    brideSurname: string;
    groomPortrait: string;
    bridePortrait: string;
    firstPersonName: string;
    secondPersonName: string;
    firstPersonSurname: string;
    secondPersonSurname: string;
  };
  details: {
    invocation: string;
    familyName: string;
    introductoryMessage: string;
    introductorySubMessage: string;
    weddingDate: string;
    subDateText?: string;
    muhurthamTime?: string;
    venueName: string;
    venueCity: string;
    venueAddress: string;
    mapsLink: string;
    mapsEmbedUrl?: string;
  };
  events: GopuramEvent[];
  video: {
    enabled: boolean;
    heading: string;
    subheading: string;
    videoSrc: string;
    posterSrc: string;
  };
  story: {
    enabled: boolean;
    heading: string;
    text: string;
    photo: string;
  };
  gallery: {
    enabled: boolean;
    heading: string;
    subheading: string;
    photos: GopuramPhoto[];
  };
  families: {
    enabled: boolean;
    heading: string;
    subheading: string;
    groom: GopuramFamilySide;
    bride: GopuramFamilySide;
  };
  countdown: {
    enabled: boolean;
    title: string;
    targetDate: string;
  };
  rsvp: {
    enabled: boolean;
    heading: string;
    subheading: string;
    submitLabel: string;
    contacts: Array<{ type: string; label: string; value: string }>;
    whatsappNumber: string;
  };
  footer: {
    enabled: boolean;
    quote: string;
    designedBy: string;
    services: string;
    address: string;
    phone: string;
    ratingTitle: string;
  };
  music: {
    enabled: boolean;
    themeMusic: string;
  };
  sectionOrder: string[];
  sections: {
    showHero: boolean;
    showCouple: boolean;
    showEvents: boolean;
    showVideo: boolean;
    showStory: boolean;
    showGallery: boolean;
    showFamilies: boolean;
    showCountdown: boolean;
    showRsvp: boolean;
    showVenue: boolean;
    showFooter: boolean;
  };
  animation: {
    scrollTrackHeightVh: number;
    skyParallaxIntensity: number;
    titleFadeStart: number;
    titleFadeEnd: number;
    coupleRevealStart: number;
    coupleRevealComplete: number;
    headerFadeStart: number;
    headerFadeEnd: number;
    gopuramTravelDesktopPx: number;
    gopuramTravelMobilePx: number;
  };
  layout: {
    desktop: {
      gopuramWidthPercent: number;
      gopuramMaxWidthPx: number;
      gopuramInitialTopVh: number;
    };
    mobile: {
      gopuramWidthPercent: number;
      gopuramMaxWidthPx: number;
      gopuramInitialTopVh: number;
    };
  };
}

const DEFAULT_EVENT_ILLUSTRATIONS: Record<string, string> = {
  engagement: "/templates/gopuram/events/event-engagement-photo.jpg",
  nishchithartham: "/templates/gopuram/events/event-engagement-photo.jpg",
  haldi: "/templates/gopuram/events/event-haldi-photo.jpg",
  mehendi: "/templates/gopuram/events/event-haldi-photo.jpg",
  sangeet: "/templates/gopuram/events/event-sangeet-photo.jpg",
  sangeeth: "/templates/gopuram/events/event-sangeet-photo.jpg",
  wedding: "/templates/gopuram/events/event-muhurtham-photo.jpg",
  muhurtham: "/templates/gopuram/events/event-muhurtham-photo.jpg",
  reception: "/templates/gopuram/events/event-engagement-photo.jpg",
};

export function mapInvitationConfigToGopuram(rawPayload: any, clientId: string = ""): GopuramData {
  const isWrapped = rawPayload && typeof rawPayload === "object" && "category" in rawPayload && "config" in rawPayload;
  const config = isWrapped ? (rawPayload.config || {}) : (rawPayload || {});

  const primarySide: "groom" | "bride" =
    (config.couple?.primarySide || config.primarySide || "groom") === "bride" ? "bride" : "groom";

  // Couple names & surnames
  const rawGroom = config.couple?.groom?.name || config.groom?.name || config.groom || "";
  const rawBride = config.couple?.bride?.name || config.bride?.name || config.bride || "";
  const groomName = (rawGroom && rawGroom.trim() && !/groom name|host/i.test(rawGroom)) ? rawGroom.trim() : "Arjun";
  const brideName = (rawBride && rawBride.trim() && !/bride name|guest/i.test(rawBride)) ? rawBride.trim() : "Meera";

  const groomSurname = config.couple?.groom?.surname || config.groom?.surname || "";
  const brideSurname = config.couple?.bride?.surname || config.bride?.surname || "";

  const firstPersonName = primarySide === "bride" ? brideName : groomName;
  const secondPersonName = primarySide === "bride" ? groomName : brideName;
  const firstPersonSurname = primarySide === "bride" ? brideSurname : groomSurname;
  const secondPersonSurname = primarySide === "bride" ? groomSurname : brideSurname;

  // Portraits
  const groomPortrait = config.families?.groomPortrait || config.couple?.groom?.image || "/templates/gopuram/family/groom-family.jpg";
  const bridePortrait = config.families?.bridePortrait || config.couple?.bride?.image || "/templates/gopuram/family/bride-family.jpg";
  const coupleCutout = config.couple?.coupleCutout || config.couple?.heroImage || config.hero?.heroImage || "/templates/gopuram/Couple.png";

  // Invocations & Titles
  const rawMantra = config.hero?.welcomeMessage || config.hero?.mantra || config.mantra || "";
  const invocation = rawMantra && rawMantra.trim() ? rawMantra.trim() : "|| श्री गणेशाय नमः ||";

  const rawSurname = config.hero?.surname || (primarySide === "bride" ? brideSurname : groomSurname);
  const familyName = rawSurname && rawSurname.trim() && !/reddy/i.test(rawSurname)
    ? `${rawSurname.toUpperCase()}'S FAMILY`
    : (config.hero?.subText || `${firstPersonName.toUpperCase()}'S WEDDING INVITATION`);

  const introductoryMessage = config.hero?.title || "TOGETHER WITH THEIR FAMILIES";
  const introductorySubMessage = config.hero?.subtitle || "invite you to celebrate the beginning of their beautiful journey together";

  // Wedding & Muhurtham details
  const rawEvents = (Array.isArray(config.events) && config.events.length > 0)
    ? config.events
    : (Array.isArray(rawPayload?.events) && rawPayload.events.length > 0)
      ? rawPayload.events
      : (Array.isArray(config.events) ? config.events : []);
  const mainWeddingEvt = rawEvents.find((e: any) => /wedding|muhurtham|vivah/i.test(e.title || e.name || e.id || "")) || rawEvents[0];

  const weddingDate = config.wedding?.date || mainWeddingEvt?.date || config.date || "SUNDAY, NOVEMBER 29, 2026";
  const muhurthamTime = config.wedding?.time || mainWeddingEvt?.time || config.time || "09:15 AM";

  // Venues
  const venueObj = config.venue?.venues?.[0] || {};
  const venueName = venueObj.venueName || config.wedding?.venue || mainWeddingEvt?.venue || (typeof config.venue === "string" ? config.venue : "Ananda Kalyana Mandapam");
  const venueCity = venueObj.city || config.wedding?.city || "Thanjavur, Tamil Nadu";
  const venueAddress = venueObj.address || mainWeddingEvt?.address || "";
  const mapsLink = venueObj.mapsUrl || config.wedding?.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName}${venueAddress ? ', ' + venueAddress : (venueCity ? ', ' + venueCity : '')}`)}`;
  const mapsEmbedUrl = venueObj.embedUrl || config.wedding?.mapsEmbedUrl || "";

  // Events Mapping
  const mappedEvents: GopuramEvent[] = rawEvents.length > 0
    ? rawEvents.map((evt: any, idx: number) => {
        const title = evt.title || evt.name || `Ceremony ${idx + 1}`;
        const tLower = title.toLowerCase();
        let fallbackIll = "/templates/gopuram/events/event-muhurtham-photo.jpg";
        for (const [key, path] of Object.entries(DEFAULT_EVENT_ILLUSTRATIONS)) {
          if (tLower.includes(key)) {
            fallbackIll = path;
            break;
          }
        }

        const dateStr = evt.date || weddingDate;
        const shortDate = evt.shortDate || dateStr.split(",")[0] || dateStr;
        const evtTime = evt.time || evt.startTime || "09:00 AM";
        const evtAddress = (evt.address !== undefined && evt.address !== null)
          ? evt.address.trim()
          : (evt.venue ? "" : (venueAddress || ""));

        const evtVenue = (evt.venue && evt.venue.trim()) ? evt.venue.trim() : venueName;
        const computedMapQuery = evt.mapQuery || (evt.mapsEmbedUrl ? "" : `${evtVenue}${evtAddress && evtAddress !== evtVenue ? ', ' + evtAddress : ''}`);

        return {
          id: evt.id || `event-${idx}`,
          name: title,
          navLabel: evt.navLabel || title.split(" ")[0] || title,
          shortDate,
          subTitle: evt.subTitle !== undefined ? evt.subTitle : (evt.description || ""),
          date: dateStr,
          dayOfWeek: evt.dayOfWeek || "",
          startTime: evtTime,
          endTime: evt.endTime || "",
          muhurthamTime: evt.muhurthamTime !== undefined
            ? evt.muhurthamTime
            : (tLower.includes("wedding") || tLower.includes("muhurtham") ? (config.wedding?.muhurthamTime || muhurthamTime) : undefined),
          venue: evtVenue,
          address: evtAddress,
          mapQuery: computedMapQuery,
          mapsEmbedUrl: evt.mapsEmbedUrl || evt.googleMapsEmbed || "",
          mapsLink: evt.mapsLink || evt.directionsUrl || "",
          directionsUrl: evt.directionsUrl || evt.mapsLink || "",
          showMap: evt.showMap !== false,
          showDirections: evt.showDirections !== false,
          illustration: evt.image && evt.image.trim() ? evt.image : (evt.illustration || fallbackIll),
          accentColor: evt.accentColor || "#8e3622",
          enabled: evt.enabled !== false,
        };
      })
    : [
        {
          id: "nishchithartham",
          name: "Engagement",
          navLabel: "Engagement",
          shortDate: "Fri, Nov 27",
          subTitle: "Traditional Engagement Ceremony",
          date: "Friday, November 27, 2026",
          dayOfWeek: "Friday Evening",
          startTime: "06:00 PM",
          endTime: "09:30 PM",
          venue: "Sri Vijayalakshmi Kalyana Mandapam",
          address: "Grand Ballroom, Rajappa Nagar, Thanjavur",
          mapQuery: "Sri Vijayalakshmi Kalyana Mandapam, Rajappa Nagar, Thanjavur",
          illustration: "/templates/gopuram/events/event-engagement-photo.jpg",
          accentColor: "#8e3622",
          enabled: true,
        },
        {
          id: "haldi",
          name: "Haldi",
          navLabel: "Haldi",
          shortDate: "Sat, Nov 28",
          subTitle: "Auspicious Turmeric Cleansing Ritual",
          date: "Saturday, November 28, 2026",
          dayOfWeek: "Saturday Morning",
          startTime: "08:30 AM",
          endTime: "11:30 AM",
          venue: "Royal Courtyard & Heritage Pavilion",
          address: "Chola Heritage Palace, Court Road, Thanjavur",
          mapQuery: "Chola Heritage Palace, Court Road, Thanjavur",
          illustration: "/templates/gopuram/events/event-haldi-photo.jpg",
          accentColor: "#d97724",
          enabled: true,
        },
        {
          id: "sangeet",
          name: "Sangeet",
          navLabel: "Sangeet",
          shortDate: "Sat, Nov 28",
          subTitle: "Musical Evening & Celebratory Banquet",
          date: "Saturday, November 28, 2026",
          dayOfWeek: "Saturday Evening",
          startTime: "07:00 PM",
          endTime: "11:00 PM",
          venue: "The Grand Lotus Lawns",
          address: "Palace Gardens, Tanjore Expressway, Thanjavur",
          mapQuery: "The Grand Lotus Lawns, Palace Gardens, Thanjavur",
          illustration: "/templates/gopuram/events/event-sangeet-photo.jpg",
          accentColor: "#9c3f20",
          enabled: true,
        },
        {
          id: "wedding",
          name: "Wedding",
          navLabel: "Wedding",
          shortDate: "Sun, Nov 29",
          subTitle: "The Holy Vedic Wedding Ceremony",
          date: "Sunday, November 29, 2026",
          dayOfWeek: "Sunday Morning",
          startTime: "08:15 AM",
          endTime: "12:30 PM",
          muhurthamTime: `Sumuhurtham: ${muhurthamTime} (Dhanur Lagna)`,
          venue: venueName,
          address: venueAddress,
          mapQuery: `${venueName}, ${venueAddress}`,
          illustration: "/templates/gopuram/events/event-muhurtham-photo.jpg",
          accentColor: "#a3281d",
          enabled: true,
        },
      ];

  // Families
  const groomMembersRaw = config.families?.groomFamily || config.couple?.groom?.family || [];
  const brideMembersRaw = config.families?.brideFamily || config.couple?.bride?.family || [];

  const groomMembers: GopuramFamilyMember[] = groomMembersRaw.length > 0
    ? groomMembersRaw.map((m: any) => ({ role: m.relation || m.role || "Family", name: m.name || "" })).filter((m: any) => Boolean(m.name))
    : [
        { role: "Mother", name: "Smt. Padmaja" },
        { role: "Father", name: "Sri Suresh Babu" },
      ];

  const brideMembers: GopuramFamilyMember[] = brideMembersRaw.length > 0
    ? brideMembersRaw.map((m: any) => ({ role: m.relation || m.role || "Family", name: m.name || "" })).filter((m: any) => Boolean(m.name))
    : [
        { role: "Mother", name: "Smt. Lakshmi Devi" },
        { role: "Father", name: "Sri Ramesh Kumar" },
      ];

  const groomFamilySide: GopuramFamilySide = {
    title: config.families?.groomFamilyTitle || config.couple?.groom?.familyTitle || "GROOM'S FAMILY",
    portrait: groomPortrait,
    portraitAlt: "Groom's Family Portrait",
    relationLabel: config.families?.groomRelationLabel || "Son of",
    members: groomMembers,
    location: config.families?.groomLocation || config.couple?.groom?.location || "Kumbakonam, Tamil Nadu",
  };

  const brideFamilySide: GopuramFamilySide = {
    title: config.families?.brideFamilyTitle || config.couple?.bride?.familyTitle || "BRIDE'S FAMILY",
    portrait: bridePortrait,
    portraitAlt: "Bride's Family Portrait",
    relationLabel: config.families?.brideRelationLabel || "Daughter of",
    members: brideMembers,
    location: config.families?.brideLocation || config.couple?.bride?.location || "Thanjavur, Tamil Nadu",
  };

  // Story & Video
  const storyHeading = config.video?.heading || config.story?.title || "A GLIMPSE OF US";
  const storyText = config.video?.subheading || config.story?.subtitle ||
    (config.story?.timeline?.[0]?.description) ||
    "Our story, captured in beautiful moments.";
  const storyPhoto = config.video?.posterSrc || config.story?.posterSrc || config.story?.couplePhoto || config.story?.timeline?.[0]?.image || "/templates/gopuram/video/pre-wedding-poster.jpg";
  const videoSrc = config.video?.videoSrc || config.story?.videoSrc || "/templates/gopuram/video/pre-wedding.mp4";
  const videoPoster = storyPhoto;

  // Gallery
  const rawGallery = config.gallery?.images || [];
  const galleryRotations = [-2, 1.5, -1, 2, -1.5, 1, -2.5, 2];
  const galleryPhotos: GopuramPhoto[] = (Array.isArray(rawGallery) ? rawGallery : []).map((img: any, idx: number) => {
    const rot = galleryRotations[idx % galleryRotations.length];
    if (typeof img === "string") return { id: `g-${idx}`, src: img, alt: `Wedding Moment ${idx + 1}`, rotation: rot };
    return {
      id: img.id || `g-${idx}`,
      src: img.src || img.url || "",
      alt: img.alt || img.caption || `Wedding Moment ${idx + 1}`,
      rotation: img.rotation !== undefined ? img.rotation : rot
    };
  }).filter((p: any) => Boolean(p.src));

  const defaultGalleryPhotos: GopuramPhoto[] = [
    { id: "g1", src: "/templates/gopuram/gallery/photo-1.jpg", alt: "Together at the temple", rotation: -2 },
    { id: "g2", src: "/templates/gopuram/gallery/photo-2.jpg", alt: "First meeting", rotation: 1.5 },
    { id: "g3", src: "/templates/gopuram/gallery/photo-3.jpg", alt: "Sunset walk", rotation: -1 },
    { id: "g4", src: "/templates/gopuram/gallery/photo-4.jpg", alt: "Festival celebration", rotation: 2 },
    { id: "g5", src: "/templates/gopuram/gallery/photo-5.jpg", alt: "Garden moment", rotation: -1.5 },
  ];

  // Countdown target
  const rawTargetDate = config.countdown?.targetDate || "2026-11-29T09:15:00";

  // RSVP Contacts
  const rawContacts = config.rsvp?.contacts || [];
  const contacts = (Array.isArray(rawContacts) ? rawContacts : []).map((c: any) => ({
    type: c.type || "phone",
    label: c.label || "Coordinator",
    value: c.value || "",
  }));
  const whatsappNumber = config.rsvp?.whatsappNumber ||
    (contacts.find((c: any) => c.type === "whatsapp")?.value || "+91 8688178323");

  // Section Order
  const defaultOrder = [
    "hero", "couple", "events", "story", "gallery", "families", "countdown", "rsvp", "venue", "footer"
  ];
  const sectionOrder = Array.isArray(config.sectionOrder) && config.sectionOrder.length > 0
    ? config.sectionOrder
    : defaultOrder;

  return {
    id: clientId || rawPayload?.id || "invitation",
    assets: {
      skyBackground: "/templates/gopuram/sky-background-v2.png",
      gopuramOverlay: "/templates/gopuram/temple-gopuram-v2.png",
      coupleCutout,
      coupleCutoutAlt: `${groomName} & ${brideName} — South Indian Wedding Couple`,
      invitationBackground: "/templates/gopuram/decoration/invitation-background.png",
      coupleShowcaseBg: "/templates/gopuram/decoration/couple-showcase-bg.jpg",
      lotusMandala: "/templates/gopuram/decoration/Lotus-Mandala.png",
      coupleCloudsForeground: "/templates/gopuram/decoration/couple-clouds-foreground.png",
      topDecorationLeft: "/templates/gopuram/decoration/top-decoration-left.png",
      topDecorationRight: "/templates/gopuram/decoration/top-decoration-right.png",
      hangingTempleBell: "/templates/gopuram/events/hanging-temple-bell.png",
      lotusCorner: "/templates/gopuram/events/lotus-corner.png",
    },
    couple: {
      primarySide,
      groomName,
      brideName,
      groomSurname,
      brideSurname,
      groomPortrait,
      bridePortrait,
      firstPersonName,
      secondPersonName,
      firstPersonSurname,
      secondPersonSurname,
    },
    details: {
      invocation,
      familyName,
      introductoryMessage,
      introductorySubMessage,
      weddingDate,
      subDateText: config.hero?.subDateText || "Karthika Masam • Shukla Paksha",
      muhurthamTime,
      venueName,
      venueCity,
      venueAddress,
      mapsLink,
      mapsEmbedUrl,
    },
    events: mappedEvents,
    video: {
      enabled: config.story?.enabled !== false && config.video?.enabled !== false,
      heading: storyHeading,
      subheading: storyText,
      videoSrc,
      posterSrc: videoPoster,
    },
    story: {
      enabled: config.story?.enabled !== false,
      heading: storyHeading,
      text: storyText,
      photo: storyPhoto,
    },
    gallery: {
      enabled: config.gallery?.enabled !== false,
      heading: config.gallery?.title || "MOMENTS WE TREASURE",
      subheading: "Every picture tells a part of our story.",
      photos: galleryPhotos.length > 0 ? galleryPhotos : defaultGalleryPhotos,
    },
    families: {
      enabled: config.families?.enabled !== false,
      heading: config.families?.title || "Our Families",
      subheading: "Two families united in tradition, blessings, and boundless love",
      groom: groomFamilySide,
      bride: brideFamilySide,
    },
    countdown: {
      enabled: config.countdown?.enabled !== false,
      title: config.countdown?.title || "Wedding Begins In",
      targetDate: rawTargetDate,
    },
    rsvp: {
      enabled: config.rsvp?.enabled !== false,
      heading: config.rsvp?.title || "We would be delighted by your presence",
      subheading: config.rsvp?.subtitle || "Your presence and heartfelt blessings are our greatest treasure as we begin this sacred union",
      submitLabel: config.rsvp?.ctaText || "Confirm Your Presence",
      contacts,
      whatsappNumber,
    },
    footer: {
      enabled: config.footer?.enabled !== false,
      quote: config.footer?.quote || config.footer?.salutation || "Beautiful beginnings, cherished forever.",
      designedBy: config.footer?.designer || "AHVAANAM",
      services: config.footer?.creditText || config.footer?.services || "Digital Wedding Invitations & Card Services",
      address: config.footer?.location || config.footer?.address || "Tirumala Printers, Metpally, Dist. Jagtial, Telangana",
      phone: config.footer?.contact || config.footer?.phone || "+91 8688178323",
      ratingTitle: "A LITTLE LOVE FOR AHVAANAM ✨",
    },
    music: {
      enabled: config.music?.enabled ?? true,
      themeMusic: config.music?.file || "",
    },
    sectionOrder,
    sections: {
      showHero: config.hero?.enabled !== false,
      showCouple: config.couple?.enabled !== false,
      showEvents: config.events ? config.events.length > 0 : true,
      showVideo: config.story?.enabled !== false,
      showStory: config.story?.enabled !== false,
      showGallery: config.gallery?.enabled !== false,
      showFamilies: config.families?.enabled !== false,
      showCountdown: config.countdown?.enabled !== false,
      showRsvp: config.rsvp?.enabled !== false,
      showVenue: config.venue?.enabled !== false,
      showFooter: config.footer?.enabled !== false,
    },
    animation: {
      scrollTrackHeightVh: 195,
      skyParallaxIntensity: 0.12,
      titleFadeStart: 0.05,
      titleFadeEnd: 0.42,
      coupleRevealStart: 0.08,
      coupleRevealComplete: 1.0,
      headerFadeStart: 0.02,
      headerFadeEnd: 0.16,
      gopuramTravelDesktopPx: 740,
      gopuramTravelMobilePx: 475,
    },
    layout: {
      desktop: {
        gopuramWidthPercent: 38,
        gopuramMaxWidthPx: 480,
        gopuramInitialTopVh: 20,
      },
      mobile: {
        gopuramWidthPercent: 92,
        gopuramMaxWidthPx: 380,
        gopuramInitialTopVh: 26,
      },
    },
  };
}
