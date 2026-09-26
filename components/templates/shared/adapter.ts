export interface WeddingTemplateData {
  themeId: string;
  sections: {
    showAnnouncement: boolean;
    showEvents: boolean;
    showProcession: boolean;
    showFamily: boolean;
    showGallery: boolean;
    showVenue: boolean;
    showCountdown: boolean;
    showRSVP: boolean;
    showFooter: boolean;
  };
  music: {
    themeMusic: string;
    processionMusic: string;
  };
  couple: {
    bride: string;
    groom: string;
    brideSurname?: string;
    groomSurname?: string;
    primarySide: "groom" | "bride";
    groomImage?: string;
    brideImage?: string;
    groomBio?: string;
    brideBio?: string;
  };
  introduction: {
    mantra: string;
    eyebrow: string;
    message: string;
    familyTitle: string;
  };
  wedding: {
    date: string;
    day: string;
    time: string;
    countdownTarget: string;
    venue: string;
    city: string;
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
  };
  events: Array<{
    title: string;
    date: string;
    time: string;
    venue: string;
    description: string;
    image?: string;
    icon?: string;
    enabled: boolean;
  }>;
  story: {
    title: string;
    text: string;
    couplePhoto: string;
  };
  gallery: Array<{
    src: string;
    alt: string;
  }>;
  rsvp: {
    title: string;
    message: string;
    buttonText: string;
    contacts: Array<{ type: string; label: string; value: string }>;
    whatsappNumber: string;
    whatsappLabel?: string;
  };
  footer: {
    quote: string;
    designer: string;
    service: string;
    location: string;
    contact: string;
  };
}

const isGenericPlaceholder = (val: any, placeholders: string[]) => {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim().toLowerCase();
  return placeholders.some((p) => trimmed === p.toLowerCase() || trimmed === "");
};

export function mapInvitationToWeddingData(rawConfig: any): WeddingTemplateData {
  const isWrapped = rawConfig && "category" in rawConfig && "config" in rawConfig;
  const config = isWrapped ? rawConfig.config : (rawConfig || {});

  const themeId = config.themeId || config.theme || rawConfig?.themeId || rawConfig?.theme || "";

  // Primary Side: "groom" (Groom first) vs "bride" (Bride first)
  const primarySide = (config.couple?.primarySide || config.primarySide || "groom") === "bride" ? "bride" : "groom";

  // Groom & Bride Names - check for Ahvaanam generic placeholders
  const rawGroom = config.couple?.groom?.name || config.groom?.name || config.groom || "";
  const rawBride = config.couple?.bride?.name || config.bride?.name || config.bride || "";

  const groomName = isGenericPlaceholder(rawGroom, ["groom name", "host", "groom", ""]) ? "Aarav" : rawGroom;
  const brideName = isGenericPlaceholder(rawBride, ["bride name", "guest", "bride", ""]) ? "Ananya" : rawBride;

  const rawGroomSurname = config.couple?.groom?.surname || config.groom?.surname || "";
  const rawBrideSurname = config.couple?.bride?.surname || config.bride?.surname || "";

  const groomImage = config.couple?.groom?.image || config.groom?.image || config.families?.groomPortrait || "";
  const brideImage = config.couple?.bride?.image || config.bride?.image || config.families?.bridePortrait || "";
  const groomBio = config.couple?.groom?.bio || "";
  const brideBio = config.couple?.bride?.bio || "";

  // Introduction
  const rawMantra = config.hero?.welcomeMessage || config.hero?.mantra || config.mantra || "";
  const mantra = isGenericPlaceholder(rawMantra, ["|| shree ganeshaay namah ||", ""]) ? "ॐ श्री गणेशाय नमः ||" : rawMantra;

  const rawEyebrow = config.hero?.title || "";
  const eyebrow = isGenericPlaceholder(rawEyebrow, ["together with our beloved families", "together with their families", ""]) ? "Together with their families" : rawEyebrow;

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

  // Wedding & Date
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
  const mapsLink = config.venue?.venues?.[0]?.mapsUrl || "https://www.google.com/maps/search/?api=1&query=The+Leela+Palace+Hyderabad";
  const mapsEmbedUrl = config.venue?.venues?.[0]?.embedUrl || "";

  // Reception Event Extraction
  const receptionEvent = Array.isArray(config.events)
    ? config.events.find((e: any) => e && typeof e.title === "string" && e.title.toLowerCase().includes("reception"))
    : null;

  // Reception Venue Extraction
  const rawReceptionVenueObj = config.venue?.venues?.[1] || config.venue?.receptionVenue || null;
  const rawReceptionVenueName = rawReceptionVenueObj?.venueName || rawReceptionVenueObj?.venue || receptionEvent?.venue || "";
  const receptionVenueName = rawReceptionVenueName || venueName;
  const receptionCity = rawReceptionVenueObj?.city || venueCity;
  const receptionDate = rawReceptionVenueObj?.date || receptionEvent?.date || weddingDate;
  const receptionTime = rawReceptionVenueObj?.time || receptionEvent?.time || "7:00 PM Onwards";
  const receptionTitle = rawReceptionVenueObj?.title || "Reception Venue";
  const receptionMapsLink = rawReceptionVenueObj?.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${receptionVenueName}, ${receptionCity}`)}`;
  const receptionMapsEmbedUrl = rawReceptionVenueObj?.embedUrl || "";

  const isReceptionEnabled = rawReceptionVenueObj?.enabled !== false && Boolean(
    rawReceptionVenueObj?.venueName || 
    rawReceptionVenueObj?.enabled === true || 
    (receptionEvent && receptionEvent.enabled !== false) ||
    config.venue?.venues?.length > 1
  );

  const receptionVenueData = {
    enabled: isReceptionEnabled,
    title: receptionTitle,
    venue: receptionVenueName,
    city: receptionCity,
    address: rawReceptionVenueObj?.address || "",
    date: receptionDate,
    time: receptionTime,
    mapsLink: receptionMapsLink,
    mapsEmbedUrl: receptionMapsEmbedUrl
  };

  // Family Extraction
  const familySectionTitle = config.families?.title || "Our Families";

  const rawGroomFamilyList: Array<any> = Array.isArray(config.families?.groomFamily)
    ? config.families.groomFamily.filter((m: any) => m && (m.name || m.relation))
    : Array.isArray(config.couple?.groom?.family)
      ? config.couple.groom.family.filter((m: any) => m && (m.name || m.relation))
      : [];

  const rawBrideFamilyList: Array<any> = Array.isArray(config.families?.brideFamily)
    ? config.families.brideFamily.filter((m: any) => m && (m.name || m.relation))
    : Array.isArray(config.couple?.bride?.family)
      ? config.couple.bride.family.filter((m: any) => m && (m.name || m.relation))
      : [];

  const groomFamily = rawGroomFamilyList.map((m: any) => ({
    relation: m.relation || "",
    name: m.name || ""
  }));

  const brideFamily = rawBrideFamilyList.map((m: any) => ({
    relation: m.relation || "",
    name: m.name || ""
  }));

  let groomParents = "";
  if (groomFamily.length > 0) {
    groomParents = groomFamily.map((m: any) => `${m.relation ? m.relation + ': ' : ''}${m.name}`).join(', ');
  } else if (config.couple?.groom?.parents) {
    groomParents = config.couple.groom.parents;
  } else {
    groomParents = "Son of Mr. & Mrs. Groom Family";
  }

  let brideParents = "";
  if (brideFamily.length > 0) {
    brideParents = brideFamily.map((m: any) => `${m.relation ? m.relation + ': ' : ''}${m.name}`).join(', ');
  } else if (config.couple?.bride?.parents) {
    brideParents = config.couple.bride.parents;
  } else {
    brideParents = "Daughter of Mr. & Mrs. Bride Family";
  }

  const rawGroomFamilyTitle = config.couple?.groom?.familyTitle || config.families?.groomFamilyTitle || "";
  const groomFamilyTitle = rawGroomFamilyTitle.trim() || (groomName ? `${groomName}'s Family` : "Groom's Family");

  const rawBrideFamilyTitle = config.couple?.bride?.familyTitle || config.families?.brideFamilyTitle || "";
  const brideFamilyTitle = rawBrideFamilyTitle.trim() || (brideName ? `${brideName}'s Family` : "Bride's Family");

  // Events list
  let eventsList = [
    {
      title: "Haldi",
      date: "18 December 2026",
      time: "10:00 AM",
      venue: "Family Residence",
      description: "An intimate celebration filled with turmeric, laughter and blessings.",
      enabled: true
    },
    {
      title: "Mehendi",
      date: "18 December 2026",
      time: "6:00 PM",
      venue: "Family Residence",
      description: "An evening of beautiful mehendi, music and celebration.",
      enabled: false
    },
    {
      title: "Wedding",
      date: "20 September 2026",
      time: "10:15 AM",
      venue: "The Leela Palace",
      description: "Join us as we celebrate the sacred wedding ceremony.",
      enabled: true
    },
    {
      title: "Reception",
      date: "01 December 2026",
      time: "7:00 PM",
      venue: "The Leela Palace",
      description: "An evening of joy, dinner and celebration with family and friends.",
      enabled: true
    }
  ];

  if (!isGenericEvents && rawEvents.length > 0) {
    eventsList = rawEvents.map((e: any) => ({
      title: e.title || "Celebration",
      date: e.date || weddingDate,
      time: e.time || weddingTime,
      venue: e.venue || venueName,
      description: e.description || "",
      image: e.image || e.icon || "",
      icon: e.icon || "",
      enabled: e.enabled !== false
    }));
  }

  // Story
  const rawStoryTitle = config.story?.title || "";
  const storyTitle = isGenericPlaceholder(rawStoryTitle, ["our love story", ""]) ? "Our Story" : rawStoryTitle;

  const rawStoryText = config.story?.timeline?.[0]?.description || config.story?.subtitle || "";
  const storyText = isGenericPlaceholder(rawStoryText, ["describe your first meeting here.", ""])
    ? "Two hearts, two families and one beautiful journey. This is the beginning of a new chapter that we would love to celebrate with you."
    : rawStoryText;

  const rawPhoto = config.story?.image || config.story?.couplePhoto || config.story?.timeline?.[0]?.image || config.hero?.heroImage || "/wedding/couple/couple.png";
  const couplePhoto = isGenericPlaceholder(rawPhoto, ["/images/couple.jpg", ""]) ? "/wedding/couple/couple.png" : rawPhoto;

  // Gallery
  const rawGallery = config.gallery?.images || [];
  const isGenericGallery = Array.isArray(rawGallery) && rawGallery.every((img: string) => img === "/images/couple.jpg");

  let galleryList = [
    { src: "/wedding/gallery/pic1.png", alt: "Memories 1" },
    { src: "/wedding/gallery/pic2.jpg", alt: "Memories 2" },
    { src: "/wedding/gallery/pic3.jpg", alt: "Memories 3" },
    { src: "/wedding/gallery/pic4.jpg", alt: "Memories 4" }
  ];

  if (!isGenericGallery && Array.isArray(rawGallery) && rawGallery.length > 0) {
    galleryList = rawGallery.map((src: string, i: number) => ({
      src,
      alt: `Memories ${i + 1}`
    }));
  }

  // RSVP
  const rawRsvpTitle = config.rsvp?.title || "";
  const rsvpTitle = isGenericPlaceholder(rawRsvpTitle, ["kindly rsvp", ""]) ? "We Would Love To Celebrate With You" : rawRsvpTitle;

  const rawRsvpMsg = config.rsvp?.subtitle || "";
  const rsvpMessage = isGenericPlaceholder(rawRsvpMsg, [""]) ? "Your presence and blessings will make our celebration even more special." : rawRsvpMsg;

  const rawBtnText = config.hero?.ctaText || "";
  const rsvpButtonText = isGenericPlaceholder(rawBtnText, ["view invitation", ""]) ? "RSVP" : rawBtnText;

  // RSVP Contacts & WhatsApp Integration
  const rsvpContacts: Array<{ type: string; label: string; value: string }> = Array.isArray(config.rsvp?.contacts)
    ? config.rsvp.contacts.filter((c: any) => c && c.value && c.value.trim())
    : [];

  const waContact = rsvpContacts.find((c: any) => c.type === "whatsapp") ||
                    rsvpContacts.find((c: any) => c.type === "phone") ||
                    rsvpContacts[0] ||
                    (config.footer?.contact ? { type: "whatsapp", label: "Helpline", value: config.footer.contact } : null);

  const rawWaVal = waContact ? waContact.value : "9866767100";
  const cleanDigits = rawWaVal.replace(/\D/g, "");
  const whatsappNumber = cleanDigits.length === 10 ? `91${cleanDigits}` : (cleanDigits || "919866767100");
  const whatsappLabel = waContact?.label || "RSVP on WhatsApp";

  // Footer
  const rawSalutation = config.footer?.salutation || "";
  const footerQuote = isGenericPlaceholder(rawSalutation, ["", "bound by matrimony. aarav & ananya.", "bound by matrimony. host & guest."])
    ? "A beautiful beginning starts with a beautiful invitation."
    : rawSalutation;

  const rawDesigner = config.footer?.designer || config.footer?.title || "";
  const footerDesigner = isGenericPlaceholder(rawDesigner, [""]) ? "Ahvaanam" : rawDesigner;

  const rawCredit = config.footer?.creditText || "";
  const footerService = isGenericPlaceholder(rawCredit, [""]) ? "Digital Wedding Invitations & Card Services" : rawCredit;

  const rawLocation = config.footer?.location || "";
  const footerLocation = isGenericPlaceholder(rawLocation, [""]) ? "Tirumala Printers, Metpally, Dist. Jagtial, Telangana" : rawLocation;

  const rawContact = config.footer?.contact || "";
  const footerContact = isGenericPlaceholder(rawContact, [""]) ? "+91 9866767100" : rawContact;

  // Music
  const rawMusic = config.music?.file || "";
  const themeMusic = isGenericPlaceholder(rawMusic, ["/music/theme.mp3", ""]) ? "/music/theme.mp3" : rawMusic;
  const processionMusic = "";

  // Section Visibilities
  const showAnnouncement = config.story?.enabled !== false;
  const showEvents = isGenericEvents || rawEvents.length > 0;
  const showProcession = true;
  const showFamily = config.families?.enabled !== false;
  const showGallery = config.gallery?.enabled !== false;
  const showVenue = config.venue?.enabled !== false;
  const showCountdown = config.countdown?.enabled !== false;
  const showRSVP = config.rsvp?.enabled !== false;
  const showFooter = config.footer?.enabled !== false;

  return {
    themeId,
    sections: {
      showAnnouncement,
      showEvents,
      showProcession,
      showFamily,
      showGallery,
      showVenue,
      showCountdown,
      showRSVP,
      showFooter
    },
    music: {
      themeMusic,
      processionMusic
    },
    couple: {
      bride: brideName,
      groom: groomName,
      brideSurname: rawBrideSurname,
      groomSurname: rawGroomSurname,
      primarySide,
      groomImage,
      brideImage,
      groomBio,
      brideBio
    },
    introduction: {
      mantra,
      eyebrow,
      message,
      familyTitle: introFamilyTitle
    },
    wedding: {
      date: weddingDate,
      day: "Sunday",
      time: weddingTime,
      countdownTarget,
      venue: venueName,
      city: venueCity,
      mapsLink,
      mapsEmbedUrl
    },
    reception: receptionVenueData,
    family: {
      title: familySectionTitle,
      brideParents,
      groomParents,
      brideFamily,
      groomFamily,
      groomPortrait: groomImage,
      bridePortrait: brideImage,
      groomFamilyTitle,
      brideFamilyTitle
    },
    events: eventsList,
    story: {
      title: storyTitle,
      text: storyText,
      couplePhoto
    },
    gallery: galleryList,
    rsvp: {
      title: rsvpTitle,
      message: rsvpMessage,
      buttonText: rsvpButtonText,
      contacts: rsvpContacts,
      whatsappNumber,
      whatsappLabel
    },
    footer: {
      quote: footerQuote,
      designer: footerDesigner,
      service: footerService,
      location: footerLocation,
      contact: footerContact
    }
  };
}
