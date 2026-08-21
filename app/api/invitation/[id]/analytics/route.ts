import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { slugSchema } from "@/lib/validation";

import { isAdminUser } from "@/lib/auth/isAdmin";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // 1. Validate slug parameter
  const parsedId = slugSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({
      error: "Validation failed",
      details: parsedId.error.issues.map(err => ({ path: err.path.join("."), message: err.message }))
    }, { status: 400 });
  }

  try {
    // 2. Load invitation and verify ownership
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const invitation = await getInvitationById(id, adminDb);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const isAdmin = isAdminUser(user.email);
    const assignedClientEmail = (invitation.config?.clientEmail || (invitation.config as any)?.config?.clientEmail || "").toLowerCase().trim();
    const currentEmail = (user.email || "").toLowerCase().trim();
    const isOwner = invitation.user_id === user.id || (assignedClientEmail && assignedClientEmail === currentEmail);

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Query views database data
    const { data: viewsData, error: viewsError } = await adminDb
      .from("invitation_views")
      .select("visitor_token, viewed_at")
      .eq("invitation_id", id);

    if (viewsError) {
      console.error("Supabase views select error:", viewsError);
      return NextResponse.json({ error: viewsError.message || "Failed to retrieve views metrics." }, { status: 500 });
    }

    // 4. Query RSVPs database data
    const { data: rsvpsData, error: rsvpsError } = await adminDb
      .from("rsvps")
      .select("attending, guest_count, created_at")
      .eq("invitation_id", id);

    if (rsvpsError) {
      console.error("Supabase rsvps select error:", rsvpsError);
      return NextResponse.json({ error: rsvpsError.message || "Failed to retrieve RSVP metrics." }, { status: 500 });
    }

    // 5. Compute View Metrics
    const totalViews = viewsData.length;
    const uniqueVisitors = new Set(viewsData.map(v => v.visitor_token)).size;
    const lastViewed = viewsData.length > 0 
      ? new Date(Math.max(...viewsData.map(v => new Date(v.viewed_at).getTime()))).toISOString() 
      : null;

    // Compute daily views over time
    const dailyViewsMap: Record<string, number> = {};
    viewsData.forEach(v => {
      const dateStr = new Date(v.viewed_at).toISOString().split("T")[0]; // YYYY-MM-DD
      dailyViewsMap[dateStr] = (dailyViewsMap[dateStr] || 0) + 1;
    });

    // Populate continuous date timeline (at least past 14 days up to today)
    const today = new Date();
    const recordedDates = Object.keys(dailyViewsMap).sort();
    let startDate = new Date();
    startDate.setDate(today.getDate() - 13); // Default 14 days window

    if (recordedDates.length > 0) {
      const earliestRecorded = new Date(recordedDates[0]);
      if (earliestRecorded < startDate) {
        startDate = new Date(earliestRecorded);
      }
    }

    const viewsOverTime: { date: string; views: number }[] = [];
    const cur = new Date(startDate);
    // Normalize cur to start of day UTC
    cur.setUTCHours(0, 0, 0, 0);
    const end = new Date(today);
    end.setUTCHours(23, 59, 59, 999);

    while (cur <= end) {
      const dateKey = cur.toISOString().split("T")[0];
      viewsOverTime.push({
        date: dateKey,
        views: dailyViewsMap[dateKey] || 0
      });
      cur.setUTCDate(cur.getUTCDate() + 1);
    }

    // 6. Compute RSVP Metrics
    let rsvpsList: any[] = rsvpsData || [];
    if (rsvpsList.length === 0 && Array.isArray(invitation.config?._rsvps)) {
      rsvpsList = invitation.config._rsvps.map((r: any) => ({
        attending: r.attending,
        guest_count: r.guestCount || r.guest_count || 1,
        created_at: r.created_at
      }));
    }

    const totalRsvps = rsvpsList.length;
    const acceptedRsvps = rsvpsList.filter(r => r.attending === true).length;
    const declinedRsvps = rsvpsList.filter(r => r.attending === false).length;
    const totalGuestsAttending = rsvpsList
      .filter(r => r.attending === true)
      .reduce((sum, r) => sum + (Number(r.guest_count) || 1), 0);
    const lastRsvp = rsvpsList.length > 0 
      ? new Date(Math.max(...rsvpsList.map(r => new Date(r.created_at).getTime()))).toISOString() 
      : null;

    // 7. Compute Feedback & Rating Metrics (Admin Only)
    let feedbacksList: any[] = [];
    let totalRatings = 0;
    let averageRating = 0;

    if (isAdmin) {
      try {
        const { data: tableData } = await adminDb
          .from("invitation_feedbacks")
          .select("*")
          .eq("invitation_id", id)
          .order("created_at", { ascending: false });

        if (tableData && tableData.length > 0) {
          feedbacksList = tableData.map(f => ({
            id: f.id,
            rating: f.rating,
            feedback: f.feedback,
            guestName: f.guest_name || f.guestName || "Guest",
            created_at: f.created_at
          }));
        }
      } catch {}

      if (feedbacksList.length === 0 && Array.isArray(invitation.config?._feedbacks)) {
        feedbacksList = invitation.config._feedbacks;
      }

      totalRatings = feedbacksList.length;
      averageRating = totalRatings > 0
        ? Number((feedbacksList.reduce((acc, f) => acc + (Number(f.rating) || 0), 0) / totalRatings).toFixed(1))
        : 5.0;
    }

    return NextResponse.json({
      success: true,
      isAdmin,
      statistics: {
        totalViews,
        uniqueVisitors,
        totalRsvps,
        acceptedRsvps,
        declinedRsvps,
        totalGuestsAttending,
        lastViewed,
        lastRsvp,
        ...(isAdmin ? { totalRatings, averageRating } : {})
      },
      viewsOverTime,
      feedbacks: isAdmin ? feedbacksList : []
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load analytics statistics." }, { status: 500 });
  }
}
