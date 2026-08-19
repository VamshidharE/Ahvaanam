import { getInvitationById, getAdminDb } from "@/lib/db";

export interface InvitationPreviewMeta {
  id: string;
  category: string;
  categoryTitle: string;
  title: string;
  headingNames: string;
  description: string;
  dateText: string;
  venueText: string;
  mantraText: string;
  themeId: string;
  isPublished: boolean;
}

const CATEGORY_TITLES: Record<string, string> = {
  wedding: "Wedding Invitation",
  birthday: "Birthday Invitation",
  engagement: "Engagement Invitation",
  housewarming: "Housewarming Invitation",
  anniversary: "Anniversary Invitation",
  corporate: "Corporate Event",
  festival: "Festival Celebration",
  general: "Special Invitation"
};

export async function getInvitationMeta(id: string): Promise<InvitationPreviewMeta> {
  const fallback: InvitationPreviewMeta = {
    id,
    category: "wedding",
    categoryTitle: "Wedding Invitation",
    title: "Wedding Invitation | Ahvaanam",
    headingNames: "Wedding Celebration",
    description: "You are cordially invited to celebrate this sacred and joyous wedding celebration with us.",
    dateText: "",
    venueText: "",
    mantraText: "ॐ श्री गणेशाय नमः ||",
    themeId: "rose-mandap",
    isPublished: true,
  };

  try {
    const adminDb = getAdminDb();
    const invite = await getInvitationById(id, adminDb);

    if (!invite || !invite.config) {
      return fallback;
    }

    const raw = invite.config;
    const isWrapped = raw && "category" in raw && "config" in raw;
    const config = isWrapped ? raw.config : (raw || {});
    const category = (isWrapped ? raw.category : config.category) || "wedding";
    const categoryTitle = CATEGORY_TITLES[category.toLowerCase()] || "Special Celebration";

    // Primary side order
    const primarySide = config.couple?.primarySide || config.primarySide || "groom";

    // Groom and Bride extraction
    const rawGroom = config.couple?.groom?.name || config.groom?.name || config.groom || "";
    const rawBride = config.couple?.bride?.name || config.bride?.name || config.bride || "";
    const groom = rawGroom && rawGroom.toLowerCase() !== "host" && rawGroom.toLowerCase() !== "groom" ? rawGroom : "Aarav";
    const bride = rawBride && rawBride.toLowerCase() !== "guest" && rawBride.toLowerCase() !== "bride" ? rawBride : "Ananya";

    let headingNames = "";
    if (category === "wedding" || category === "engagement" || category === "anniversary") {
      headingNames = primarySide === "bride" ? `${bride} & ${groom}` : `${groom} & ${bride}`;
    } else {
      headingNames = config.hero?.title || config.metadata?.celebrantName || config.metadata?.hosts || config.celebrantName || `${categoryTitle}`;
    }

    // Mantra / auspicious blessing
    const mantraText = config.hero?.welcomeMessage || "ॐ श्री गणेशाय नमः ||";

    // Date formatting
    let dateText = "";
    const rawDate = config.wedding?.date || config.countdown?.targetDate || config.events?.[0]?.date || config.metadata?.date || "";
    if (rawDate) {
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          dateText = d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        } else {
          dateText = String(rawDate);
        }
      } catch {
        dateText = String(rawDate);
      }
    }

    // Venue formatting
    const rawVenue = config.wedding?.venue || config.venue?.venues?.[0]?.venueName || config.events?.[0]?.venue || config.metadata?.venue || "";
    const rawCity = config.wedding?.city || config.venue?.venues?.[0]?.city || "";
    const venueText = rawVenue ? (rawCity ? `${rawVenue}, ${rawCity}` : rawVenue) : "";

    // Subtitle / Description
    const title = `${headingNames} | ${categoryTitle}`;
    let description = "";
    if (category === "wedding") {
      description = `Together with their families, ${headingNames} warmly invite you to celebrate their sacred wedding ceremony.${dateText ? ` Join us on ${dateText}.` : ""}`;
    } else {
      description = `You are cordially invited to celebrate ${headingNames} with us.${dateText ? ` Date: ${dateText}.` : ""}`;
    }

    return {
      id,
      category,
      categoryTitle,
      title,
      headingNames,
      description,
      dateText,
      venueText,
      mantraText,
      themeId: config.themeId || "rose-mandap",
      isPublished: invite.status === "published",
    };
  } catch (error) {
    return fallback;
  }
}
