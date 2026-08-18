import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { slugSchema } from "@/lib/validation";

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

    const invitation = await getInvitationById(id);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    if (invitation.user_id && invitation.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const adminDb = getAdminDb();

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

    // Populate daily views for charting (order ascending by date)
    const viewsOverTime = Object.keys(dailyViewsMap).map(date => ({
      date,
      views: dailyViewsMap[date]
    })).sort((a, b) => a.date.localeCompare(b.date));

    // 6. Compute RSVP Metrics
    const totalRsvps = rsvpsData.length;
    const acceptedRsvps = rsvpsData.filter(r => r.attending).length;
    const declinedRsvps = rsvpsData.filter(r => !r.attending).length;
    const totalGuestsAttending = rsvpsData.reduce((acc, r) => acc + (r.attending ? (r.guest_count || 1) : 0), 0);
    const lastRsvp = rsvpsData.length > 0
      ? new Date(Math.max(...rsvpsData.map(r => new Date(r.created_at).getTime()))).toISOString()
      : null;

    return NextResponse.json({
      success: true,
      statistics: {
        totalViews,
        uniqueVisitors,
        totalRsvps,
        acceptedRsvps,
        declinedRsvps,
        totalGuestsAttending,
        lastViewed,
        lastRsvp
      },
      viewsOverTime
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load analytics statistics." }, { status: 500 });
  }
}
