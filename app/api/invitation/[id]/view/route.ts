import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { viewSubmissionSchema, slugSchema } from "@/lib/validation";
import { isAdminUser } from "@/lib/auth/isAdmin";

export async function POST(
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
    // Ignore demo views to prevent polluting client analytics
    if (id.startsWith("demo-") || id === "demo") {
      return NextResponse.json({ success: true, ignored: "demo_view" });
    }

    // Check if the current viewer is an admin user (do not count admin visits as real client views)
    const supabaseUserClient = await createClient();
    const { data: { user } } = await supabaseUserClient.auth.getUser();
    if (user && isAdminUser(user.email)) {
      return NextResponse.json({ success: true, ignored: "admin_view" });
    }

    // 2. Read and validate body payload
    const body = await request.json();
    const parsedBody = viewSubmissionSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: parsedBody.error.issues.map(err => ({ path: err.path.join("."), message: err.message }))
      }, { status: 400 });
    }

    const { visitor_token } = parsedBody.data;
    const adminDb = getAdminDb();

    // 3. Verify invitation profile exists
    const invitation = await getInvitationById(id, adminDb);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    // 4. Check for duplicate page views in the last 24 hours for this visitor_token
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: existingView, error: checkError } = await adminDb
      .from("invitation_views")
      .select("id")
      .eq("invitation_id", id)
      .eq("visitor_token", visitor_token)
      .gt("viewed_at", twentyFourHoursAgo)
      .limit(1);

    if (checkError) {
      console.error("Error checking duplicate views:", checkError);
    }

    if (existingView && existingView.length > 0) {
      return NextResponse.json({ success: true, duplicated: true });
    }

    // 5. Insert privacy-first view record using adminDb
    const { error: insertError } = await adminDb
      .from("invitation_views")
      .insert([{
        invitation_id: id,
        visitor_token
      }]);

    if (insertError) {
      console.error("Error inserting view event:", insertError);
      return NextResponse.json({ error: insertError.message || "Failed to log page view" }, { status: 500 });
    }

    // 6. Ensure matching session exists in invitation_analytics_sessions
    try {
      const nowIso = new Date().toISOString();
      await adminDb.from("invitation_analytics_sessions").upsert(
        {
          invitation_id: id,
          session_id: visitor_token,
          device_type: "desktop",
          last_active_at: nowIso,
          duration_seconds: 0,
          max_scroll_depth: 0,
          completed: false,
          is_engaged: false,
        },
        { onConflict: "invitation_id, session_id" }
      );
    } catch (sessionUpsertErr) {
      console.warn("Could not upsert analytics session on view:", sessionUpsertErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log page view." }, { status: 500 });
  }
}

