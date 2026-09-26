export interface EmeraldPalaceEvent {
  id?: string;
  title: string;
  subtitle?: string;
  date: string;
  time: string;
  venue: string;
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
  };
  music: {
    themeMusic: string;
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
  };
  events: EmeraldPalaceEvent[];
  story: {
    title: string;
    text: string;
    couplePhoto: string;
    milestones?: Array<{ yearOrDate: string; title: string; desc: string }>;
  };
  gallery: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
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

const isGenericPlaceholder = (val: any, placeholders: string[]) => {
  if (!val || typeof val !== "string") return true;
  const trimmed = val.trim().toLowerCase();
  return placeholders.some((p) => trimmed === p.toLowerCase() || trimmed === "");
};

export function mapInvitationConfigToEmeraldPalace(rawConfig: any): EmeraldPalaceData {
  const isWrapped = rawConfig && "category" in rawConfig && "config" in rawConfig;
  const config = isWrapped ? rawConfig.config : (rawConfig || {});

  // Primary Side
  const primarySide = (config.couple?.primarySide || config.primarySide || "groom") === "bride" ? "bride" : "groom";

  // Couple names
  const rawGroom = config.couple?.groom?.name || config.groom?.name || config.groom || "";
  const rawBride = config.couple?.bride?.name || config.bride?.name || config.bride || "";
  const groomName = isGenericPlaceholder(rawGroom, ["groom name", "host", "groom", ""]) ? "Devrat" : rawGroom;
  const brideName = isGenericPlaceholder(rawBride, ["bride name", "guest", "bride", ""]) ? "Meera" : rawBride;

  const rawGroomSurname = config.couple?.groom?.surname || config.groom?.surname || "";
  const rawBrideSurname = config.couple?.bride?.surname || config.bride?.surname || "";

  const groomImage = config.couple?.groom?.image || config.groom?.image || config.families?.groomPortrait || "/images/couple.jpg";
  const brideImage = config.couple?.bride?.image || config.bride?.image || config.families?.bridePortrait || "/images/couple.jpg";
  
  const groomBio = config.couple?.groom?.bio || "Son of Mrs. Rajeshwari & Mr. Vikramaditya Rathore. A visionary architect who finds harmony between royal heritage and modern design.";
  const brideBio = config.couple?.bride?.bio || "Daughter of Mrs. Gayatri & Mr. Harshavardhan Singh. A classical sitarist and heritage preservationist with a spirit as radiant as morning dawn.";

  // Monogram initials
  const gInitial = (groomName.charAt(0) || "D").toUpperCase();
  const bInitial = (brideName.charAt(0) || "M").toUpperCase();
  const monogram = primarySide === "bride" ? `${bInitial} & ${gInitial}` : `${gInitial} & ${bInitial}`;

  // Introduction
  const rawMantra = config.hero?.welcomeMessage || config.hero?.mantra || config.mantra || "";
  const mantra = isGenericPlaceholder(rawMantra, ["|| shree ganeshaay namah ||", ""]) 
    ? "॥ ॐ श्री गणेशाय नमः ॥" 
    : rawMantra;
  
  const mantraMeaning = "Invoking the divine blessings of Lord Ganesha for auspiciousness, prosperity and eternal grace.";

  const rawEyebrow = config.hero?.title || "";
  const eyebrow = isGenericPlaceholder(rawEyebrow, ["together with our beloved families", "together with their families", ""]) 
    ? "Royal Wedding Celebration" 
    : rawEyebrow;

  const rawMessage = config.hero?.subtitle || "";
  const message = isGenericPlaceholder(rawMessage, ["request the pleasure of your gracious presence as we begin our forever together.", ""])
    ? "Cordially invite you to grace the auspicious wedding ceremonies and bless the union of their hearts"
    : rawMessage;

  const introFamilyTitle = primarySide === "bride"
    ? (rawBrideSurname ? `The ${rawBrideSurname} Royal Family` : `${brideName}'s Family`)
    : (rawGroomSurname ? `The ${rawGroomSurname} Royal Family` : `${groomName}'s Family`);

  // Wedding Date and Time
  const rawDate = config.hero?.date || config.wedding?.date || config.date || "Sunday, 28th November 2026";
  const weddingDate = isGenericPlaceholder(rawDate, ["wedding date", "date", ""]) ? "Sunday, 28th November 2026" : rawDate;
  const weddingDay = config.wedding?.day || "Sunday";
  const weddingTime = config.wedding?.time || "10:30 AM onwards";
  const muhurtham = config.wedding?.muhurtham || "Auspicious Sumuhurtham: 10:48 AM - 11:32 AM (Dhanur Lagnam)";

  // Countdown Target
  const countdownTarget = config.wedding?.countdownTarget || "2026-11-28T10:30:00";

  // Venue
  const rawVenue = config.venue?.name || config.wedding?.venue || "The Grand Oberoi Udaivilas Palace";
  const venue = isGenericPlaceholder(rawVenue, ["venue name", "venue", ""]) ? "The Grand Oberoi Udaivilas Palace" : rawVenue;
  const city = config.venue?.city || config.wedding?.city || "Haridas Ji Ki Magri, Udaipur, Rajasthan";
  const address = config.venue?.address || "Mulla Talai, Udaipur, Rajasthan 313001";
  const mapsLink = config.venue?.mapsLink || config.wedding?.mapsLink || "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur";
  const mapsEmbedUrl = config.venue?.mapsEmbedUrl || config.wedding?.mapsEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3628.026343516515!2d73.6669!3d24.5786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3967e56f4d2f0991%3A0xbbf54e951bf4f952!2sThe%20Oberoi%20Udaivilas%2C%20Udaipur!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin";

  // Reception
  const hasReception = config.reception?.enabled !== false;
  const reception = {
    enabled: hasReception,
    title: config.reception?.title || "Royal Grand Reception & Banquet",
    venue: config.reception?.venue || "The Zenana Mahal Courtyard",
    city: config.reception?.city || "City Palace Complex, Udaipur",
    address: config.reception?.address || "City Palace Rd, Old City, Udaipur, Rajasthan",
    date: config.reception?.date || "Monday, 29th November 2026",
    time: config.reception?.time || "07:00 PM onwards",
    mapsLink: config.reception?.mapsLink || "https://maps.google.com/?q=The+Zenana+Mahal+Udaipur",
    mapsEmbedUrl: config.reception?.mapsEmbedUrl || mapsEmbedUrl,
  };

  // Events itinerary
  const rawEvents = config.events || [];
  let events: EmeraldPalaceEvent[] = [];

  if (Array.isArray(rawEvents) && rawEvents.length > 0) {
    events = rawEvents.map((e: any, idx: number) => ({
      id: e.id || `event-${idx}`,
      title: e.title || `Royal Ceremony ${idx + 1}`,
      subtitle: e.subtitle || "",
      date: e.date || weddingDate,
      time: e.time || "10:00 AM",
      venue: e.venue || venue,
      description: e.description || "Join us in celebrating this joyous milestone filled with traditional music, dance and festive feasts.",
      dressCode: e.dressCode || (idx === 0 ? "Pastel Yellow / Traditional Indian" : idx === 1 ? "Royal Velvet & Jewels" : "Regal Traditional / Sherwani & Lehengas"),
      image: e.image || (idx % 2 === 0 ? "/images/categories/halfsaree.jpg" : "/images/categories/wedding.jpg"),
      icon: e.icon || (idx === 0 ? "🌸" : idx === 1 ? "✨" : idx === 2 ? "🪔" : "👑"),
      auspiciousTime: e.auspiciousTime || "",
      enabled: e.enabled !== false,
    }));
  } else {
    // Default Royal 4-Event Itinerary
    events = [
      {
        id: "haldi-rasam",
        title: "Haldi & Phoolon Ki Holi",
        subtitle: "Auspicious Turmeric & Floral Blessings",
        date: "Saturday, 27th Nov 2026",
        time: "10:00 AM - 01:00 PM",
        venue: "Chandani Courtyard, Udaivilas",
        description: "Basking in the golden radiance of sacred turmeric paste, fragrant rose petals, and soulful folk melodies.",
        dressCode: "Sunshine Yellow & Floral Chiffons",
        icon: "🌼",
        auspiciousTime: "10:30 AM Auspicious Muhurtham",
        enabled: true,
      },
      {
        id: "sangeet-night",
        title: "The Royal Sangeet & Jashn",
        subtitle: "An Evening of Music, Dance & Revelry",
        date: "Saturday, 27th Nov 2026",
        time: "07:30 PM Onwards",
        venue: "Mewar Royal Lawns, Udaivilas",
        description: "A glamorous celebration under the starlit Udaipur skies with spectacular performances, sufi rhythms, and imperial cuisine.",
        dressCode: "Glitz, Royal Emerald & Velvet Couture",
        icon: "✨",
        enabled: true,
      },
      {
        id: "wedding-muhurtham",
        title: "Shubh Vivah & Pheras",
        subtitle: "The Sacred Vows & Seven Steps",
        date: "Sunday, 28th Nov 2026",
        time: "10:00 AM - 02:00 PM",
        venue: "The Lotus Mandap, Waterfront Pavilions",
        description: "Witness the divine union amidst Vedic Vedic chants, sacred holy fire (Agni Sakshi), and auspicious blessings.",
        dressCode: "Traditional Royal Silks & Sherwanis",
        icon: "🪔",
        auspiciousTime: "Sumuhurtham: 10:48 AM",
        enabled: true,
      },
      {
        id: "royal-reception",
        title: "The Royal Grand Reception",
        subtitle: "Imperial Banquet & Gala",
        date: "Monday, 29th Nov 2026",
        time: "07:30 PM Onwards",
        venue: "The Zenana Mahal Courtyard",
        description: "A celebratory evening of toasts, live classical sitar and shehnai symphony, and an authentic royal Rajasthani royal feast.",
        dressCode: "Black Tie / Royal Heritage Formals",
        icon: "👑",
        enabled: true,
      },
    ];
  }

  // Family details
  const brideParents = config.families?.brideParents || config.family?.brideParents || "Mrs. Gayatri & Mr. Harshavardhan Singh";
  const groomParents = config.families?.groomParents || config.family?.groomParents || "Mrs. Rajeshwari & Mr. Vikramaditya Rathore";

  const brideFamily = Array.isArray(config.families?.brideFamily || config.family?.brideFamily)
    ? (config.families?.brideFamily || config.family?.brideFamily)
    : [
        { relation: "Parents", name: brideParents },
        { relation: "Brother & Sister-in-law", name: "Yuvraj Ranveer & Princess Radhika" },
        { relation: "Grandparents", name: "Late Smt. Devika Devi & Late Shri Bhupendra Singh" },
      ];

  const groomFamily = Array.isArray(config.families?.groomFamily || config.family?.groomFamily)
    ? (config.families?.groomFamily || config.family?.groomFamily)
    : [
        { relation: "Parents", name: groomParents },
        { relation: "Sister & Brother-in-law", name: "Dr. Ananya & Kunwar Aditya Pratap" },
        { relation: "Grandparents", name: "Smt. Shanti Devi & Shri Mahendra Singh Rathore" },
      ];

  // Story
  const storyTitle = config.story?.title || "How Destiny Orchestrated Our Forever";
  const storyText = config.story?.text || "From our very first conversation over heritage architecture in Udaipur to countless shared sunsets across the Aravalli hills, our journey has been a symphony of laughter, shared dreams, and unwavering devotion. With the cherished blessings of our parents and divine grace, we joyfully invite you to celebrate the dawn of our eternal union.";
  const couplePhoto = config.story?.couplePhoto || config.couple?.image || "/images/couple.jpg";

  // Gallery
  const rawGallery = config.gallery || [];
  let gallery = Array.isArray(rawGallery) && rawGallery.length > 0
    ? rawGallery.map((item: any, i: number) => ({
        src: typeof item === "string" ? item : item.src || item.url || "/images/couple.jpg",
        alt: typeof item === "object" ? item.alt || `Royal Moment ${i + 1}` : `Royal Moment ${i + 1}`,
        caption: typeof item === "object" ? item.caption || "" : "",
      }))
    : [
        { src: "/images/couple.jpg", alt: "The Royal Couple", caption: "A quiet moment of serene romance" },
        { src: "/images/categories/wedding.jpg", alt: "Celebration of Love", caption: "Tradition woven with contemporary grace" },
        { src: "/images/categories/engagement.jpg", alt: "The Auspicious Ring Ceremony", caption: "When our promises were etched in eternity" },
        { src: "/images/categories/halfsaree.jpg", alt: "Festive Joy", caption: "Joyous laughter and golden celebrations" },
      ];

  // RSVP
  const rsvp = {
    title: config.rsvp?.title || "Grace Us With Your Presence",
    message: config.rsvp?.message || "Kindly confirm your presence by 15th November 2026 to help us make your royal stay comfortable and memorable.",
    buttonText: config.rsvp?.buttonText || "CONFIRM ATTENDANCE",
    contacts: Array.isArray(config.rsvp?.contacts) && config.rsvp.contacts.length > 0
      ? config.rsvp.contacts
      : [
          { type: "phone", label: "Rathore Family Hospitality", value: "+91 98765 43210" },
          { type: "phone", label: "Singh Family Concierge", value: "+91 98765 43211" },
        ],
    whatsappNumber: config.rsvp?.whatsappNumber || "919876543210",
    whatsappLabel: config.rsvp?.whatsappLabel || "Chat with Royal Hospitality Desk",
    rsvpDeadline: config.rsvp?.deadline || "15th November 2026",
  };

  // Footer
  const footer = {
    quote: config.footer?.quote || "“In all the world, there is no heart for me like yours. In all the world, there is no love for you like mine.”",
    blessing: "With humble folded hands and joyful hearts, we look forward to welcoming you into our family celebration.",
    designer: "Ahvaanam Bespoke Royal Invitations",
    service: "Luxury Digital Wedding Suite",
    location: "Udaipur • Rajasthan • India",
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

  return {
    sections,
    music: {
      themeMusic: config.music?.themeMusic || config.music?.file || "/wedding/rose-mandap/theme-music.MP3",
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
      title: config.family?.title || "The Royal Families & Lineage",
      brideParents,
      groomParents,
      brideFamily,
      groomFamily,
      groomPortrait: groomImage,
      bridePortrait: brideImage,
      groomFamilyTitle: `The ${rawGroomSurname || "Rathore"} Dynasty`,
      brideFamilyTitle: `The ${rawBrideSurname || "Singh"} Dynasty`,
      blessingQuote: "Blessed by ancestors, cherished by elders, and celebrated by family and friends.",
    },
    events,
    story: {
      title: storyTitle,
      text: storyText,
      couplePhoto,
      milestones: [
        { yearOrDate: "December 2023", title: "First Encounter", desc: "A chance meeting amidst the grand architecture of Udaipur." },
        { yearOrDate: "August 2024", title: "The Royal Proposal", desc: "Under a starlit sky at Lake Pichola, promises were whispered forever." },
        { yearOrDate: "November 2026", title: "The Auspicious Union", desc: "Two families united into one glorious legacy." }
      ]
    },
    gallery,
    rsvp,
    footer,
  };
}
