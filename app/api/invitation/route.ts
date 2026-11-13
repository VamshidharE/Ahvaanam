import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitations, createInvitation, getInvitationById, getAdminDb } from "@/lib/db";
import defaultTemplate from "@/lib/default-template.json";
import { creationSchema } from "@/lib/validation";
import { categoryExists, getCategoryFields } from "@/lib/categories/utils";
import { createDefaultConfig } from "@/lib/config/createDefaultConfig";
import { isAdminUser } from "@/lib/auth/isAdmin";

interface NormalizedPayload {
  id: string;
  category: string;
  themeId: string;
  metadata: Record<string, string>;
}

/**
 * Normalizes input bodies from legacy flat payloads and new category metadata payloads
 * into a single unified data structure.
 */
function normalizeInvitationPayload(body: any): NormalizedPayload {
  const id = body.id || "";
  const themeId = body.themeId || body.metadata?.themeId || "royal-temple";
  
  if (body.category && body.category !== "wedding") {
    return {
      id,
      category: body.category,
      themeId,
      metadata: body.metadata || {}
    };
  }
  
  const category = body.category || "wedding";
  const metadata: Record<string, string> = {};
  
  if (body.metadata) {
    Object.assign(metadata, body.metadata);
  } else {
    // Map legacy parameters to metadata structures
    metadata["groom.name"] = body.groom || "";
    metadata["bride.name"] = body.bride || "";
    metadata["surname"] = body.surname || "";
  }
  
  return {
    id,
    category,
    themeId,
    metadata
  };
}

/**
 * Validates dynamic metadata field constraints mapped from categories.
 */
function validateNormalizedPayload(payload: NormalizedPayload): { success: boolean; error?: string } {
  if (!payload.id || typeof payload.id !== "string") {
    return { success: false, error: "Invitation URL slug is required." };
  }
  if (!/^[a-z0-9-]+$/.test(payload.id)) {
    return { success: false, error: "URL slug must only contain lowercase letters, numbers, and dashes." };
  }
  if (payload.id.length < 3 || payload.id.length > 50) {
    return { success: false, error: "URL slug must be between 3 and 50 characters." };
  }

  if (!categoryExists(payload.category)) {
    return { success: false, error: `Unsupported category: "${payload.category}"` };
  }

  if (!payload.themeId || typeof payload.themeId !== "string" || payload.themeId.trim() === "") {
    return { success: false, error: "Theme ID is required." };
  }

  const fields = getCategoryFields(payload.category).filter(f => !["venue", "date", "time", "address"].includes(f.key));
  for (const field of fields) {
    if (field.required) {
      const val = payload.metadata[field.key];
      if (!val || val.trim() === "") {
        return { success: false, error: `Field "${field.label}" is required.` };
      }
    }
  }

  return { success: true };
}

/**
 * Helper to dynamically set properties at nested paths.
 */
function setNestedProperty(obj: any, path: string, value: any) {
  const parts = path.split(".");
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = isAdminUser(user.email);

  try {
    const adminDb = getAdminDb();
    const invites = await getInvitations(adminDb, user.id, user.email, isAdmin);
    const inviteIds = invites.map(i => i.id);
    const rsvpStatsMap: Record<string, { accepted: number; declined: number; guestCount: number }> = {};
    const viewsCountMap: Record<string, number> = {};
    const feedbacksStatsMap: Record<string, { totalRatings: number; avgRating: number; feedbacks: any[] }> = {};
    
    inviteIds.forEach(id => {
      rsvpStatsMap[id] = { accepted: 0, declined: 0, guestCount: 0 };
      viewsCountMap[id] = 0;
      feedbacksStatsMap[id] = { totalRatings: 0, avgRating: 0, feedbacks: [] };
    });

    if (inviteIds.length > 0) {
      // 1. Fetch RSVPs
      const { data: rsvps } = await adminDb
        .from("rsvps")
        .select("invitation_id, attending, guest_count")
        .in("invitation_id", inviteIds);

      (rsvps || []).forEach(r => {
        const id = r.invitation_id;
        if (rsvpStatsMap[id]) {
          if (r.attending) {
            rsvpStatsMap[id].accepted += 1;
            rsvpStatsMap[id].guestCount += (r.guest_count || 1);
          } else {
            rsvpStatsMap[id].declined += 1;
          }
        }
      });

      // 2. Fetch Views
      const { data: views } = await adminDb
        .from("invitation_views")
        .select("invitation_id")
        .in("invitation_id", inviteIds);

      (views || []).forEach(v => {
        const id = v.invitation_id;
        if (viewsCountMap[id] !== undefined) {
          viewsCountMap[id] += 1;
        }
      });

      // 3. Fetch Feedbacks & Ratings from dedicated table (Admin Only)
      if (isAdmin) {
        try {
          const { data: fbData } = await adminDb
            .from("invitation_feedbacks")
            .select("invitation_id, rating, feedback, guest_name, created_at")
            .in("invitation_id", inviteIds)
            .order("created_at", { ascending: false });

          (fbData || []).forEach(f => {
            const id = f.invitation_id;
            if (feedbacksStatsMap[id]) {
              feedbacksStatsMap[id].feedbacks.push({
                rating: f.rating,
                feedback: f.feedback,
                guestName: f.guest_name,
                created_at: f.created_at
              });
            }
          });
        } catch {
          // Table fallback handled below
        }
      }
    }

    if (isAdmin) {
      // Merge with JSON config fallback if table was empty
      invites.forEach((inv: any) => {
        if (feedbacksStatsMap[inv.id]?.feedbacks.length === 0 && Array.isArray(inv.config?._feedbacks)) {
          feedbacksStatsMap[inv.id].feedbacks = inv.config._feedbacks;
        }
        const list = feedbacksStatsMap[inv.id]?.feedbacks || [];
        const total = list.length;
        const avg = total > 0
          ? Number((list.reduce((acc, x) => acc + (Number(x.rating) || 0), 0) / total).toFixed(1))
          : 0;
        feedbacksStatsMap[inv.id].totalRatings = total;
        feedbacksStatsMap[inv.id].avgRating = avg;
      });
    }

    const payload = invites.map(i => ({
      ...i,
      acceptedCount: rsvpStatsMap[i.id]?.accepted || 0,
      declinedCount: rsvpStatsMap[i.id]?.declined || 0,
      pendingCount: 0,
      guestCount: rsvpStatsMap[i.id]?.guestCount || 0,
      viewsCount: viewsCountMap[i.id] || 0,
      ...(isAdmin ? {
        ratingCount: feedbacksStatsMap[i.id]?.totalRatings || 0,
        avgRating: feedbacksStatsMap[i.id]?.avgRating || 0,
        feedbacks: feedbacksStatsMap[i.id]?.feedbacks || []
      } : {})
    }));

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch invitation profiles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only admin is permitted to create new invitations
  if (!isAdminUser(user.email)) {
    return NextResponse.json({ 
      error: "Access denied. Only administrators are authorized to create new invitations." 
    }, { status: 403 });
  }

  try {
    const body = await request.json();
    const isLegacyWedding = !body.category || body.category === "wedding";

    let slug = "";
    let finalConfig: any;

    if (isLegacyWedding) {
      // Run the original legacy validation exactly as before
      const parsed = creationSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ 
          error: "Validation failed", 
          details: parsed.error.issues.map(err => ({ path: err.path.join("."), message: err.message })) 
        }, { status: 400 });
      }

      const { id, groom, bride, surname, primarySide, themeId } = parsed.data;
      slug = id;

      // Check globally if client profile already exists (slug must be unique)
      let exists = false;
      try {
        const existing = await getInvitationById(slug).catch(() => null);
        if (existing) {
          exists = true;
        }
      } catch {
        exists = false;
      }

      if (exists) {
        return NextResponse.json({ error: "An invitation with this URL slug already exists." }, { status: 400 });
      }

      // Clone starter default JSON config to seed the profile
      const effectiveTheme = themeId || "royal-temple";
      let config: any;

      if (effectiveTheme === "rose-mandap") {
        config = createDefaultConfig("wedding", "rose-mandap").config;
      } else if (effectiveTheme === "pelli-pandiri") {
        config = createDefaultConfig("wedding", "pelli-pandiri").config;
      } else if (effectiveTheme === "gopuram") {
        config = createDefaultConfig("wedding", "gopuram").config;
      } else {
        config = JSON.parse(JSON.stringify(defaultTemplate));
      }

      // Seed config with user inputs
      config.themeId = effectiveTheme;
      const isPlaceholderGroom = !groom || groom.toLowerCase() === "host" || groom.toLowerCase() === "groom name";
      const isPlaceholderBride = !bride || bride.toLowerCase() === "guest" || bride.toLowerCase() === "bride name";

      if (config.couple) {
        if (!isPlaceholderGroom) config.couple.groom.name = groom;
        if (!isPlaceholderBride) config.couple.bride.name = bride;
        if (primarySide) config.couple.primarySide = primarySide;
      }
      if (primarySide) config.primarySide = primarySide;
      if (config.groom && !isPlaceholderGroom) config.groom.name = groom;
      if (config.bride && !isPlaceholderBride) config.bride.name = bride;

      if (config.hero) {
        if (surname) {
          config.hero.surname = surname;
          config.hero.showSurnameHeading = true;
        }
      }
      if (config.footer && !isPlaceholderGroom && !isPlaceholderBride) {
        config.footer.salutation = primarySide === "bride"
          ? `Bound by Matrimony. ${bride} & ${groom}.`
          : `Bound by Matrimony. ${groom} & ${bride}.`;
      }

      finalConfig = config;
    } else {
      // New category payload validation and construction
      const normalized = normalizeInvitationPayload(body);
      const validation = validateNormalizedPayload(normalized);
      if (!validation.success) {
        return NextResponse.json({ error: validation.error }, { status: 400 });
      }

      slug = normalized.id;

      // Check globally if client profile already exists (slug must be unique)
      let exists = false;
      try {
        const existing = await getInvitationById(slug).catch(() => null);
        if (existing) {
          exists = true;
        }
      } catch {
        exists = false;
      }

      if (exists) {
        return NextResponse.json({ error: "An invitation with this URL slug already exists." }, { status: 400 });
      }

      // Retrieve default category template structures and merge values
      const wrapper = createDefaultConfig(normalized.category, normalized.themeId);
      wrapper.themeId = normalized.themeId;
      if (wrapper.config) {
        wrapper.config.themeId = normalized.themeId;
        // Dynamically populate fields
        for (const [key, value] of Object.entries(normalized.metadata)) {
          if (value && typeof value === "string" && !/^(host|guest|groom name|bride name)$/i.test(value.trim())) {
            setNestedProperty(wrapper.config, key, value);
          }
        }
      }

      finalConfig = wrapper;
    }

    const clientEmail = (body.clientEmail || body.metadata?.clientEmail || "").toLowerCase().trim();
    if (clientEmail) {
      if (finalConfig.config) {
        finalConfig.config.clientEmail = clientEmail;
      }
      finalConfig.clientEmail = clientEmail;
    }

    const adminDb = getAdminDb();
    let targetUserId: string | null = null;

    if (clientEmail) {
      try {
        const { data: usersData } = await adminDb.auth.admin.listUsers();
        const matchedUser = (usersData?.users || []).find(
          (u) => u.email?.toLowerCase().trim() === clientEmail
        );
        if (matchedUser) {
          targetUserId = matchedUser.id;
        }
      } catch {
        // Fallback: will link dynamically on user's first login
      }
    }

    // Save newly created invitation config via db helper with owner metadata
    await createInvitation(slug, finalConfig, targetUserId, adminDb);
    return NextResponse.json({ success: true, id: slug });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create client invitation profile" }, { status: 500 });
  }
}
