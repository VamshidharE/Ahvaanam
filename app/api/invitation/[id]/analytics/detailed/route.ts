import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { slugSchema } from "@/lib/validation";
import { isAdminUser } from "@/lib/auth/isAdmin";
import { ANALYTICS_CONFIG, isSessionEngaged } from "@/lib/analytics/config";
import {
  AdvancedAnalyticsResponse,
  DeviceDistribution,
  FunnelStep,
  InteractionMetrics,
  SectionEngagementItem,
} from "@/lib/analytics/types";
import { getManifest } from "@/lib/template-manifests";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Validate slug parameter
  const parsedId = slugSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsedId.error.issues },
      { status: 400 }
    );
  }

  try {
    // 2. Strict Admin Authorization Guard
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !isAdminUser(user.email)) {
      return NextResponse.json(
        { error: "Forbidden: Admin access required to view detailed engagement analytics." },
        { status: 403 }
      );
    }

    const adminDb = getAdminDb();

    // 3. Load invitation profile
    const invitation = await getInvitationById(id, adminDb);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // 4. Retrieve raw sessions, events, and views from database
    const [sessionsRes, eventsRes, viewsRes] = await Promise.all([
      adminDb
        .from("invitation_analytics_sessions")
        .select("*")
        .eq("invitation_id", id)
        .order("created_at", { ascending: false }),
      adminDb
        .from("invitation_analytics_events")
        .select("*")
        .eq("invitation_id", id)
        .order("created_at", { ascending: true }),
      adminDb
        .from("invitation_views")
        .select("visitor_token, viewed_at")
        .eq("invitation_id", id),
    ]);

    const sessions = sessionsRes.data || [];
    const events = eventsRes.data || [];
    const views = viewsRes.data || [];

    // Total views preserved from invitation_views table (or max of sessions and views)
    const totalViews = Math.max(views.length, sessions.length);
    const uniqueSessionsCount = Math.max(sessions.length, views.length);

    // 5. Compute Overview Metrics from 100% REAL session records
    let totalDuration = 0;
    let totalScroll = 0;
    let engagedCount = 0;
    let completedCount = 0;
    let reach25 = 0;
    let reach50 = 0;
    let reach75 = 0;
    let reach90 = 0;
    let reach100 = 0;

    const deviceCounts: DeviceDistribution = { mobile: 0, desktop: 0, tablet: 0 };

    sessions.forEach((s) => {
      totalDuration += s.duration_seconds || 0;
      totalScroll += s.max_scroll_depth || 0;

      const isEngaged =
        s.is_engaged || isSessionEngaged(s.duration_seconds || 0, s.max_scroll_depth || 0);
      if (isEngaged) engagedCount++;

      const isComp = s.completed || (s.max_scroll_depth || 0) >= 100;
      if (isComp) completedCount++;

      const scroll = s.max_scroll_depth || 0;
      if (scroll >= 25) reach25++;
      if (scroll >= 50) reach50++;
      if (scroll >= 75) reach75++;
      if (scroll >= 90) reach90++;
      if (scroll >= 100 || isComp) reach100++;

      const dev = (s.device_type || "desktop").toLowerCase();
      if (dev === "mobile") deviceCounts.mobile++;
      else if (dev === "tablet") deviceCounts.tablet++;
      else deviceCounts.desktop++;
    });

    const avgDuration =
      uniqueSessionsCount > 0 ? Math.round(totalDuration / uniqueSessionsCount) : 0;
    const avgScroll =
      uniqueSessionsCount > 0
        ? Math.min(100, Math.round(totalScroll / uniqueSessionsCount))
        : 0;
    const engagementRate =
      uniqueSessionsCount > 0
        ? Math.min(100, Number(((engagedCount / uniqueSessionsCount) * 100).toFixed(1)))
        : 0;
    const completionRate =
      uniqueSessionsCount > 0
        ? Math.min(100, Number(((reach100 / uniqueSessionsCount) * 100).toFixed(1)))
        : 0;

    // 6. Compute Step-by-Step Funnel (Strictly real data)
    const funnelMilestones = [
      { key: "opened", label: "Opened", count: uniqueSessionsCount },
      { key: "reach_25", label: "25% Scrolled", count: Math.min(reach25, uniqueSessionsCount) },
      { key: "reach_50", label: "50% Scrolled", count: Math.min(reach50, reach25) },
      { key: "reach_75", label: "75% Scrolled", count: Math.min(reach75, reach50) },
      { key: "reach_90", label: "90% Scrolled", count: Math.min(reach90, reach75) },
      { key: "reach_100", label: "Bottom Reached", count: Math.min(reach100, reach90) },
    ];

    const funnel: FunnelStep[] = funnelMilestones.map((step, idx) => {
      const prevCount = idx === 0 ? uniqueSessionsCount : funnelMilestones[idx - 1].count;
      const conversionRate =
        uniqueSessionsCount > 0
          ? Number(((step.count / uniqueSessionsCount) * 100).toFixed(1))
          : 0;
      const dropOffRate =
        prevCount > 0
          ? Number((((prevCount - step.count) / prevCount) * 100).toFixed(1))
          : 0;

      return {
        milestone: step.key,
        label: step.label,
        percent: idx === 0 ? 100 : [25, 50, 75, 90, 100][idx - 1],
        count: step.count,
        conversionRate,
        dropOffRate: Math.max(0, dropOffRate),
      };
    });

    // 7. Dynamic Section Discovery & Section Engagement
    const rawConfig = invitation.config || {};
    const isWrapped = "category" in rawConfig && "config" in rawConfig;
    const innerConfig = isWrapped ? rawConfig.config || {} : rawConfig;
    const themeId = rawConfig.themeId || innerConfig.themeId || "rose-mandap";

    // Extract sections dynamically
    let sectionKeys: string[] = [];
    if (Array.isArray(innerConfig.sectionOrder) && innerConfig.sectionOrder.length > 0) {
      sectionKeys = innerConfig.sectionOrder;
    } else {
      const manifest = getManifest(themeId);
      if (manifest?.editor?.sections) {
        sectionKeys = manifest.editor.sections.map((s) => s.id);
      } else {
        sectionKeys = [...ANALYTICS_CONFIG.DEFAULT_SECTION_ORDER];
      }
    }

    // Filter enabled sections
    const enabledSections = sectionKeys.filter((sId) => {
      if (sId === "hero") return innerConfig.hero?.enabled ?? true;
      if (sId === "couple" || sId === "groom" || sId === "bride" || sId === "celebrant" || sId === "hosts") return true;
      if (sId === "events") return innerConfig.events?.enabled ?? true;
      if (sId === "gallery") return innerConfig.gallery?.enabled ?? (innerConfig.gallery?.images?.length > 0);
      if (sId === "venue") return innerConfig.venue?.enabled ?? true;
      if (sId === "rsvp") return innerConfig.rsvp?.enabled ?? true;
      if (sId === "footer") return innerConfig.footer?.enabled ?? true;
      if (sId === "story") return innerConfig.story?.enabled ?? true;
      if (sId === "countdown") return innerConfig.countdown?.enabled ?? true;
      if (sId === "families" || sId === "family") return innerConfig.families?.enabled ?? innerConfig.family?.enabled ?? true;
      if (sId === "announcement") return true;
      if (sId === "procession") return true;
      return true;
    });

    const sectionLabelMap: Record<string, string> = {
      hero: "Hero Section",
      couple: "Couple Information",
      celebrant: "Celebrant Information",
      hosts: "Hosts Information",
      baby: "Baby Information",
      mother: "Mother Information",
      company: "Company Information",
      announcement: "Wedding Announcement",
      story: "Love Story",
      events: "Ceremony Events",
      procession: "Baraat Procession",
      family: "Family & Loved Ones",
      families: "Family & Loved Ones",
      gallery: "Photo Gallery",
      venue: "Venue & Maps",
      countdown: "Event Countdown",
      rsvp: "RSVP & Wishes",
      footer: "Footer & Signature",
    };

    // Calculate view count per section from real events
    const sectionSessionsMap: Record<string, Set<string>> = {};
    enabledSections.forEach((sId) => {
      sectionSessionsMap[sId] = new Set<string>();
    });

    events.forEach((e) => {
      if (e.event_type === "section_view" && e.section_id) {
        const normalized = e.section_id.toLowerCase().replace(/[^a-z0-9]/g, "");
        for (const sId of enabledSections) {
          const targetKey = sId.toLowerCase().replace(/[^a-z0-9]/g, "");
          if (targetKey === normalized || normalized.includes(targetKey) || targetKey.includes(normalized)) {
            sectionSessionsMap[sId]?.add(e.session_id);
            break;
          }
        }
      }
    });

    // Build real section engagement list
    const sections: SectionEngagementItem[] = enabledSections.map((sId, index) => {
      // Real recorded section views, or 100% for hero if at least 1 session opened
      const realCount =
        index === 0
          ? uniqueSessionsCount
          : Math.min(sectionSessionsMap[sId]?.size || 0, uniqueSessionsCount);

      const percentage =
        uniqueSessionsCount > 0
          ? Number(((realCount / uniqueSessionsCount) * 100).toFixed(1))
          : 0;

      return {
        sectionId: sId,
        label: sectionLabelMap[sId] || sId.charAt(0).toUpperCase() + sId.slice(1),
        viewCount: realCount,
        percentage,
        dropOffFromPrevious: 0,
        isHighestDropOff: false,
      };
    });

    // Enforce monotonic hierarchy and compute real drop-offs
    let maxDropOff = -1;
    let highestDropIndex = -1;

    for (let i = 0; i < sections.length; i++) {
      if (i > 0) {
        if (sections[i].viewCount > sections[i - 1].viewCount) {
          sections[i].viewCount = sections[i - 1].viewCount;
          sections[i].percentage = sections[i - 1].percentage;
        }

        const drop = sections[i - 1].viewCount - sections[i].viewCount;
        sections[i].dropOffFromPrevious = drop;

        if (drop > maxDropOff && drop > 0) {
          maxDropOff = drop;
          highestDropIndex = i;
        }
      }
    }

    if (highestDropIndex > 0) {
      sections[highestDropIndex].isHighestDropOff = true;
    }

    // 8. Interaction Metrics from real events
    const interactions: InteractionMetrics = {
      musicPlayed: 0,
      galleryOpened: 0,
      galleryImagesViewed: 0,
      mapClicked: 0,
      contactClicked: 0,
      whatsappClicked: 0,
      rsvpOpened: 0,
      rsvpSubmitted: 0,
      shareClicked: 0,
    };

    events.forEach((e) => {
      switch (e.event_type) {
        case "music_play":
          interactions.musicPlayed++;
          break;
        case "gallery_open":
          interactions.galleryOpened++;
          break;
        case "gallery_image_view":
          interactions.galleryImagesViewed++;
          break;
        case "map_click":
          interactions.mapClicked++;
          break;
        case "contact_click":
          interactions.contactClicked++;
          break;
        case "whatsapp_click":
          interactions.whatsappClicked++;
          break;
        case "rsvp_open":
          interactions.rsvpOpened++;
          break;
        case "rsvp_submit":
          interactions.rsvpSubmitted++;
          break;
        case "share_click":
          interactions.shareClicked++;
          break;
      }
    });

    const response: AdvancedAnalyticsResponse = {
      success: true,
      invitationId: id,
      overview: {
        totalViews,
        uniqueSessions: uniqueSessionsCount,
        engagedVisits: engagedCount,
        engagementRate,
        averageEngagementTime: avgDuration,
        averageScrollDepth: avgScroll,
        completionRate,
        scrollReach: {
          reach25,
          reach50,
          reach75,
          reach90,
          reach100,
        },
      },
      funnel,
      sections,
      interactions,
      devices: deviceCounts,
      highestDropOffSection: highestDropIndex > 0 ? sections[highestDropIndex] : null,
    };

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Detailed analytics error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to compile detailed engagement analytics." },
      { status: 500 }
    );
  }
}
