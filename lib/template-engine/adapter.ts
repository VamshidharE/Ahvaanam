import { InvitationData } from "./types";

const isGenericPlaceholder = (val: any, placeholders: string[]): boolean => {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim().toLowerCase();
  return placeholders.some((p) => trimmed === p.toLowerCase() || trimmed === "");
};

/**
 * Normalizes raw invitation database JSON into a strongly typed InvitationData object
 * with defensive fallbacks for all optional fields.
 */
export function normalizeInvitationData(rawPayload: any, clientId: string = ""): InvitationData {
  const isWrapped = rawPayload && typeof rawPayload === "object" && "category" in rawPayload && "config" in rawPayload;
  const config = isWrapped ? (rawPayload.config || {}) : (rawPayload || {});

  const themeId = rawPayload?.themeId || config.themeId || config.theme || "rose-mandap";
  const themeVersion = rawPayload?.themeVersion || config.themeVersion || "1.0.0";
  const category = (rawPayload?.category || config.category || "wedding").toLowerCase();

  // Primary Side: "groom" (Groom first) vs "bride" (Bride first)
  const primarySide: "groom" | "bride" = 
    (config.couple?.primarySide || config.primarySide || "groom") === "bride" ? "bride" : "groom";

  // Couple names & surnames
  const rawGroom = config.couple?.groom?.name || config.groom?.name || config.groom || "";
  const rawBride = config.couple?.bride?.name || config.bride?.name || config.bride || "";
  const groomName = isGenericPlaceholder(rawGroom, ["groom name", "host", "groom", ""]) ? "Aarav" : rawGroom;
  const brideName = isGenericPlaceholder(rawBride, ["bride name", "guest", "bride", ""]) ? "Ananya" : rawBride;

  const rawGroomSurname = config.couple?.groom?.surname || config.groom?.surname || config.hero?.surname || "";
  const rawBrideSurname = config.couple?.bride?.surname || config.bride?.surname || "";

  const groomImage = config.couple?.groom?.image || config.groom?.image || config.families?.groomPortrait || "/wedding/couple/couple.png";
  const brideImage = config.couple?.bride?.image || config.bride?.image || config.families?.bridePortrait || "/wedding/couple/couple.png";
  const groomBio = config.couple?.groom?.bio || "";
  const brideBio = config.couple?.bride?.bio || "";

  // Introduction
  const rawMantra = config.hero?.welcomeMessage || config.hero?.mantra || config.mantra || "";
  const mantra = isGenericPlaceholder(rawMantra, ["|| shree ganeshaay namah ||", ""]) ? "ॐ श्री गणेशाय नमः ||" : rawMantra;

  const rawEyebrow = config.hero?.title || "";
  const eyebrow = isGenericPlaceholder(rawEyebrow, ["together with our beloved families", "together with their families", ""]) 
    ? "Together with their families" 
    : rawEyebrow;

  const rawMessage = config.hero?.subtitle || "";
  const message = isGenericPlaceholder(rawMessage, ["request the pleasure of your gracious presence as we begin our forever together.", ""])
    ? "invite you to celebrate the beginning of their beautiful journey together"
    : rawMessage;

  const rawSurname = (primarySide === "bride" ? (rawBrideSurname || config.hero?.surname) : (rawGroomSurname || config.hero?.surname)) || config.hero?.surname;
  const introFamilyTitle = rawSurname && rawSurname.toLowerCase() !== "reddy" && rawSurname.trim() !== ""
    ? `${rawSurname}'s Wedding Invitation`
    : (config.hero?.subText && config.hero.subText !== "WEDDING INVITATION" 
        ? config.hero.subText 
        : (primarySide === "bride" 
            ? (rawBrideSurname ? `${rawBrideSurname}'s Wedding Invitation` : `${brideName}'s Wedding Invitation`) 
            : (rawGroomSurname ? `${rawGroomSurname}'s Wedding Invitation` : `${groomName}'s Wedding Invitation`)));

  // Wedding Date & Muhurtham
  const rawEvents = Array.isArray(config.events) ? config.events : [];
  const isGenericEvents = rawEvents.length === 1 && (rawEvents[0].id === "wedding" && /31 dec 2026|grand marriage palace/i.test(rawEvents[0].date + rawEvents[0].venue));

  const weddingEvent = !isGenericEvents && rawEvents.length > 0
    ? (rawEvents.find((e: any) => e.id === "wedding" || /wedding|muhurtham|vivah/i.test(e.title || "")) || rawEvents[0])
    : undefined;

  const rawDate = weddingEvent?.date || config.date || "";
  const weddingDate = isGenericPlaceholder(rawDate, ["2026-12-31", "31 dec 2026", ""]) ? "20 September 2026" : rawDate;

  const rawTime = weddingEvent?.time || config.time || "";
  const weddingTime = isGenericPlaceholder(rawTime, ["10:00 am", ""]) ? "10:15 AM" : rawTime;

  const rawCountdown = config.countdown?.targetDate || "";
  const countdownTarget = isGenericPlaceholder(rawCountdown, ["2026-12-31t10:00:00", ""]) ? "2026-09-20T10:15:00" : rawCountdown;

  const rawVenue = config.venue?.venues?.[0]?.venueName || weddingEvent?.venue || (typeof config.venue === "string" ? config.venue : "");
  const venueName = isGenericPlaceholder(rawVenue, ["grand marriage palace, city", "grand marriage palace", ""]) ? "The Leela Palace" : rawVenue;
  const venueCity = config.venue?.venues?.[0]?.city || "Hyderabad";
  const mapsLink = config.venue?.venues?.[0]?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venueName}, ${venueCity}`)}`;
  const mapsEmbedUrl = config.venue?.venues?.[0]?.embedUrl || "";

  // Reception details if present
  const receptionEvent = Array.isArray(config.events)
    ? config.events.find((e: any) => e && typeof e.title === "string" && e.title.toLowerCase().includes("reception"))
    : null;
  const rawReceptionVenueObj = config.venue?.venues?.[1] || config.venue?.receptionVenue || null;
  const rawReceptionVenueName = rawReceptionVenueObj?.venueName || rawReceptionVenueObj?.venue || receptionEvent?.venue || "";
  const receptionVenueName = rawReceptionVenueName || venueName;
  const receptionCity = rawReceptionVenueObj?.city || venueCity;
  const receptionDate = rawReceptionVenueObj?.date || receptionEvent?.date || weddingDate;
  const receptionTime = rawReceptionVenueObj?.time || receptionEvent?.time || "7:00 PM Onwards";
  const receptionTitle = rawReceptionVenueObj?.title || "Reception Venue";
  const receptionMapsLink = rawReceptionVenueObj?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${receptionVenueName}, ${receptionCity}`)}`;
  const isReceptionEnabled = rawReceptionVenueObj?.enabled !== false && Boolean(
    rawReceptionVenueObj?.venueName || 
    rawReceptionVenueObj?.enabled === true || 
    (receptionEvent && receptionEvent.enabled !== false) ||
    config.venue?.venues?.length > 1
  );

  // Normalized Events
  const events = rawEvents.map((evt: any, idx: number) => ({
    id: evt.id || `event-${idx}`,
    enabled: evt.enabled !== false,
    title: evt.title || "Celebration",
    date: evt.date || weddingDate,
    time: evt.time || weddingTime,
    venue: evt.venue || venueName,
    description: evt.description || "",
    icon: evt.icon || "✨",
    image: evt.image || undefined,
  }));

  // Family details
  const rawBrideFamily = config.families?.brideFamily || config.family?.brideFamily || [];
  const rawGroomFamily = config.families?.groomFamily || config.family?.groomFamily || [];
  const brideParents = config.couple?.bride?.parents || config.families?.brideParents || "Daughter of Mr. & Mrs. Bride Family";
  const groomParents = config.couple?.groom?.parents || config.families?.groomParents || "Son of Mr. & Mrs. Groom Family";

  // Story details
  const rawStoryTimeline = config.story?.timeline || [];
  const storyText = config.story?.text || 
    (rawStoryTimeline.length > 0 ? rawStoryTimeline[0].description : "Two hearts, two families and one beautiful journey. This is the beginning of a new chapter that we would love to celebrate with you.");
  const storyCouplePhoto = config.story?.couplePhoto || 
    (rawStoryTimeline.length > 0 ? rawStoryTimeline[0].image : "/wedding/couple/couple.png");

  // Gallery
  const rawGalleryImages = config.gallery?.images || [];
  const galleryImages = (Array.isArray(rawGalleryImages) ? rawGalleryImages : []).map((item: any) => {
    if (typeof item === "string") return { src: item, alt: "Wedding Moment" };
    return { src: item.src || item.url || "", alt: item.alt || "Wedding Moment", caption: item.caption };
  }).filter((img: any) => Boolean(img.src));

  // RSVP Contacts
  const rawContacts = config.rsvp?.contacts || [];
  const contacts = (Array.isArray(rawContacts) ? rawContacts : []).map((c: any) => ({
    type: c.type || "phone",
    label: c.label || "Contact",
    value: c.value || "",
  }));
  const whatsappNumber = config.rsvp?.whatsappNumber || 
    (contacts.find((c: any) => c.type === "whatsapp" || c.type === "phone")?.value || "+91 9866767100");

  // Music
  const rawMusicFile = config.music?.file || "";
  const themeMusic = isGenericPlaceholder(rawMusicFile, ["/music/theme.mp3", ""]) 
    ? "/wedding/rose-mandap/theme-music.MP3" 
    : rawMusicFile;
  const processionMusic = config.music?.processionMusic || "/wedding/rose-mandap/wed music.MP3";

  // Section Ordering
  const rawSectionOrder = config.sectionOrder || [
    "hero", "couple", "countdown", "story", "events", "gallery", "venue", "families", "rsvp", "footer"
  ];

  return {
    id: clientId || rawPayload?.id || "invitation",
    category,
    themeId,
    themeVersion,

    couple: {
      primarySide,
      groom: {
        name: groomName,
        surname: rawGroomSurname,
        parents: groomParents,
        bio: groomBio,
        image: groomImage,
        familyTitle: config.couple?.groom?.familyTitle,
      },
      bride: {
        name: brideName,
        surname: rawBrideSurname,
        parents: brideParents,
        bio: brideBio,
        image: brideImage,
        familyTitle: config.couple?.bride?.familyTitle,
      },
    },

    introduction: {
      mantra,
      eyebrow,
      message,
      familyTitle: introFamilyTitle,
      subText: config.hero?.subText,
    },

    wedding: {
      date: weddingDate,
      time: weddingTime,
      countdownTarget,
      venue: venueName,
      city: venueCity,
      mapsLink,
      mapsEmbedUrl,
    },

    reception: {
      enabled: isReceptionEnabled,
      title: receptionTitle,
      venue: receptionVenueName,
      city: receptionCity,
      date: receptionDate,
      time: receptionTime,
      mapsLink: receptionMapsLink,
    },

    events,

    family: {
      title: config.families?.title || "Our Families",
      groomFamilyTitle: config.families?.groomFamilyTitle || `${groomName}'s Family`,
      brideFamilyTitle: config.families?.brideFamilyTitle || `${brideName}'s Family`,
      groomParents,
      brideParents,
      groomPortrait: config.families?.groomPortrait || "/wedding/family/groom.png",
      bridePortrait: config.families?.bridePortrait || "/wedding/family/bride.png",
      groomFamily: Array.isArray(rawGroomFamily) ? rawGroomFamily : [],
      brideFamily: Array.isArray(rawBrideFamily) ? rawBrideFamily : [],
    },

    story: {
      enabled: config.story?.enabled !== false,
      title: config.story?.title || "Our Story",
      text: storyText,
      couplePhoto: storyCouplePhoto,
      timeline: rawStoryTimeline,
    },

    gallery: {
      enabled: config.gallery?.enabled !== false && galleryImages.length > 0,
      title: config.gallery?.title || "Our Memories",
      images: galleryImages,
      layoutType: config.gallery?.layoutType || "grid",
    },

    rsvp: {
      enabled: config.rsvp?.enabled !== false,
      title: config.rsvp?.title || "We Would Love To Celebrate With You",
      message: config.rsvp?.subtitle || config.rsvp?.message || "Your presence and blessings will make our celebration even more special.",
      buttonText: config.rsvp?.ctaText || "RSVP",
      whatsappNumber,
      whatsappLabel: config.rsvp?.whatsappLabel || "RSVP on WhatsApp",
      contacts,
    },

    music: {
      enabled: config.music?.enabled !== false,
      themeMusic,
      processionMusic,
      autoplay: config.hero?.musicAutoplay ?? true,
    },

    sectionOrder: rawSectionOrder,
    sections: {
      showAnnouncement: config.sections?.showAnnouncement ?? config.story?.enabled ?? true,
      showEvents: config.sections?.showEvents ?? (config.events ? config.events.length > 0 : true),
      showProcession: config.sections?.showProcession ?? true,
      showFamily: config.sections?.showFamily ?? true,
      showGallery: config.sections?.showGallery ?? config.gallery?.enabled ?? true,
      showVenue: config.sections?.showVenue ?? true,
      showCountdown: config.sections?.showCountdown ?? config.countdown?.enabled ?? true,
      showRSVP: config.sections?.showRSVP ?? config.rsvp?.enabled ?? true,
      showFooter: config.sections?.showFooter ?? config.footer?.enabled ?? true,
    },

    footer: {
      quote: config.footer?.salutation || "A beautiful beginning starts with a beautiful invitation.",
      designer: config.footer?.designer || "Ahvaanam",
      service: config.footer?.creditText || "Digital Wedding Invitations & Card Services",
      location: config.footer?.location || "Tirumala Printers, Metpally, Dist. Jagtial, Telangana",
      contact: config.footer?.contact || "+91 9866767100",
    },

    rawConfig: config,
  };
}
