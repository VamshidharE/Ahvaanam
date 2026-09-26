import { NextResponse } from "next/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { slugSchema } from "@/lib/validation";
import { isSessionEngaged } from "@/lib/analytics/config";
import { AnalyticsTrackPayload } from "@/lib/analytics/types";

export async function POST(
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
    // 2. Read request body (supports standard JSON & sendBeacon text)
    let payload: AnalyticsTrackPayload;
    try {
      const text = await request.text();
      payload = JSON.parse(text);
    } catch (err: any) {
      return NextResponse.json({ error: "Invalid JSON body", details: err.message }, { status: 400 });
    }

    const {
      session_id,
      device_type = "desktop",
      event_type,
      section_id,
      event_data = {},
      scroll_depth = 0,
      duration_seconds = 0,
      completed = false,
    } = payload;

    if (!session_id || !event_type) {
      return NextResponse.json({ error: "Missing required session_id or event_type" }, { status: 400 });
    }

    const adminDb = getAdminDb();

    // 3. Verify invitation exists
    const invitation = await getInvitationById(id, adminDb);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const nowIso = new Date().toISOString();
    const isComp = Boolean(completed || scroll_depth >= 100);
    const engaged = isSessionEngaged(duration_seconds, scroll_depth);

    // 4. Atomic UPSERT into invitation_analytics_sessions
    // Using onConflict: "invitation_id, session_id" ensures insert on 1st visit and in-place update on pings/scrolls
    const { error: upsertErr } = await adminDb
      .from("invitation_analytics_sessions")
      .upsert(
        {
          invitation_id: id,
          session_id,
          device_type,
          last_active_at: nowIso,
          duration_seconds: duration_seconds || 0,
          max_scroll_depth: scroll_depth || 0,
          completed: isComp,
          is_engaged: engaged,
        },
        {
          onConflict: "invitation_id, session_id",
        }
      );

    if (upsertErr) {
      console.error("Upsert analytics session error:", upsertErr);
    }

    // 5. Insert event into invitation_analytics_events if event is meaningful
    if (event_type !== "session_ping") {
      const { error: eventInsertErr } = await adminDb
        .from("invitation_analytics_events")
        .insert([
          {
            invitation_id: id,
            session_id,
            event_type,
            section_id: section_id || null,
            event_data: event_data || {},
            created_at: nowIso,
          },
        ]);

      if (eventInsertErr) {
        console.error("Insert analytics event error:", eventInsertErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Analytics track route exception:", err);
    return NextResponse.json({ success: true, error: err.message });
  }
}
