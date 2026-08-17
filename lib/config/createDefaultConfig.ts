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

  return cloned;
}
