export interface BaseSection {
  id: string;
  enabled: boolean;
  title: string;
  subtitle?: string;
  animation?: string;
  themeOverrides?: Record<string, any>;
}

export interface HeroSection extends BaseSection {
  welcomeMessage: string;
  mantra?: string;
  heroImage: string;
  heroVideo?: string;
  backgroundType: "gradient" | "image" | "video";
  overlayOpacity: number;
  ctaText: string;
  musicAutoplay: boolean;
  showParticles: boolean;
  surname?: string;
  showSurnameHeading?: boolean;
  surnameFont?: string;
  surnameColor?: string;
  subText?: string;
  enableHeaderMedia?: boolean;
  headerMediaType?: "god" | "symbol";
  selectedGod?: "ganesha" | "venkateswara" | "lakshmi" | "shiva" | "krishna" | "murugan" | "durga" | "hanuman";
  selectedSymbol?: "om" | "swastik" | "shree" | "kalash" | "nandi";
  headerMediaColor?: string;
  headerMediaSize?: number;
  headerMediaPosition?: "top-middle" | "top-left" | "top-right";
  headerMediaSpacing?: number;
}

export interface CoupleSection extends BaseSection {
  primarySide?: "groom" | "bride";
  coupleCutout?: string;
  heroImage?: string;
  groom: {
    name: string;
    surname?: string;
    parents: string;
    bio: string;
    image: string;
    familyTitle?: string;
    location?: string;
    family?: Array<{ relation?: string; name: string }>;
  };
  bride: {
    name: string;
    surname?: string;
    parents: string;
    bio: string;
    image: string;
    familyTitle?: string;
    location?: string;
    family?: Array<{ relation?: string; name: string }>;
  };
}

export interface StoryTimelineEntry {
  title: string;
  date: string;
  description: string;
  image?: string;
}

export interface StorySection extends BaseSection {
  timeline: StoryTimelineEntry[];
}

export interface CountdownSection extends BaseSection {
  targetDate: string; // ISO format
  timezone: string;
  customLabels?: { days?: string; hours?: string; minutes?: string; seconds?: string };
  hideAfterWedding: boolean;
  postWeddingMessage?: string;
}

export interface WeddingEvent {
  id: string;
  enabled: boolean;
  title: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  icon: string;
  subTitle?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  muhurthamTime?: string;
  address?: string;
  navLabel?: string;
  image?: string;
  mapsEmbedUrl?: string;
  mapsLink?: string;
  directionsUrl?: string;
  showMap?: boolean;
  showDirections?: boolean;
}

export interface GallerySection extends BaseSection {
  images: string[];
  videos?: string[];
  layoutType: "masonry" | "carousel" | "grid";
  slideshowMode: boolean;
}

export interface FamilyMember {
  relation: string;
  name: string;
}

export interface FamiliesSection extends BaseSection {
  brideFamily: FamilyMember[];
  groomFamily: FamilyMember[];
  groomFamilyTitle?: string;
  brideFamilyTitle?: string;
  groomPortrait?: string;
  bridePortrait?: string;
  groomRelationLabel?: string;
  brideRelationLabel?: string;
  groomLocation?: string;
  brideLocation?: string;
  subheading?: string;
  subtitle?: string;
  eyebrow?: string;
  blessingQuote?: string;
  groomParents?: string;
  brideParents?: string;
  groomFamilyImage?: string;
  brideFamilyImage?: string;
  groomFamilyFocalPoint?: string;
  brideFamilyFocalPoint?: string;
}

export interface VenueDetail {
  id: string;
  title: string;
  venueName: string;
  address: string;
  city: string;
  date?: string;
  time?: string;
  mapsUrl: string;
  embedUrl: string;
  enabled?: boolean;
  coordinates?: { lat: number; lng: number };
  parkingInfo?: string;
}

export interface VenueSection extends BaseSection {
  venues: VenueDetail[];
}

export interface RSVPContact {
  type: "whatsapp" | "phone" | "email" | "form";
  label: string;
  value: string;
}

export interface RSVPSection extends BaseSection {
  contacts: RSVPContact[];
  qrCodeUrl?: string;
  whatsappNumber?: string;
}

export interface FAQEntry {
  question: string;
  answer: string;
}

export interface FAQSection extends BaseSection {
  entries: FAQEntry[];
}

export interface DressCodeSection extends BaseSection {
  code: string;
  description: string;
  colors?: string[];
}

export interface TravelAccommodationSection extends BaseSection {
  accommodationDetails?: string;
  travelGuide?: string;
}

export interface FooterSection extends BaseSection {
  creditText: string;
  salutation: string;
  quote?: string;
  designer?: string;
  location?: string;
  contact?: string;
  services?: string;
  address?: string;
  phone?: string;
}

export interface ThemeSettings {
  showParticles: boolean;
  particleType: "petals" | "dust" | "stars" | "embers";
  borderStyle: "gold" | "minimal" | "floral" | "stone";
  heroAnimation: "zoom" | "fade" | "slide";
  buttonStyle: "rounded" | "square" | "embossed";
  galleryStyle: "grid" | "carousel" | "masonry";
  countdownStyle: "glass" | "solid" | "traditional";
}

export interface MusicSettings {
  enabled: boolean;
  file: string;
}

export interface WeddingInvitationConfig {
  clientEmail?: string;
  themeId: string; // e.g. "royal-temple" or "moonlight"
  sectionOrder: string[]; // e.g. ["hero", "couple", "countdown", "story", "events", "gallery", "venue", "families", "rsvp", "faq", "dressCode", "footer"]
  themeSettings: ThemeSettings;
  music: MusicSettings;
  mantra?: string;
  primarySide?: "groom" | "bride";
  hero: HeroSection;
  couple: CoupleSection;
  story: StorySection;
  countdown: CountdownSection;
  events: WeddingEvent[];
  gallery: GallerySection;
  families: FamiliesSection;
  venue: VenueSection;
  rsvp: RSVPSection;
  faq?: FAQSection;
  dressCode?: DressCodeSection;
  travel?: TravelAccommodationSection;
  footer: FooterSection;
}

/**
 * Shared type for invitation configurations.
 * Unifies all category-specific configuration objects under a structured wrapper.
 */
export interface InvitationConfig {
  clientEmail?: string;
  category: string;
  themeId: string;
  config: Record<string, unknown>;
}

