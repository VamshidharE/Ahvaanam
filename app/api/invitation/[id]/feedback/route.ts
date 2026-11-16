import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { isAdminUser } from "@/lib/auth/isAdmin";
import { slugSchema } from "@/lib/validation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const parsedId = slugSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({ error: "Invalid invitation ID" }, { status: 400 });
  }

  try {
    const body = await request.json().catch(() => ({}));

    // Demo sandbox protection: gracefully acknowledge demo feedback without writing to DB
    if (id.startsWith("demo-") || id === "demo") {
      return NextResponse.json({
        success: true,
        message: "Demo feedback acknowledged in read-only sandbox mode.",
        feedback: {
          id: body.id || body.feedbackId || `demo_fb_${Date.now()}`,
          rating: Number(body.rating) || 5,
          feedback: body.feedback || "",
          created_at: new Date().toISOString()
        }
      });
    }

    const adminDb = getAdminDb();
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));
    const feedbackText = typeof body.feedback === "string" ? body.feedback.trim() : "";
    const guestName = typeof body.guestName === "string" && body.guestName.trim() ? body.guestName.trim() : "Anonymous Guest";
    const guestPhone = typeof body.phone === "string" && body.phone.trim() ? body.phone.trim() : null;

    const targetId = body.id || body.feedbackId;
    const deviceId = typeof body.deviceId === "string" ? body.deviceId.trim() : (typeof body.sessionId === "string" ? body.sessionId.trim() : "");

    const currentConfig = invite.config || {};
    const existingFeedbacks: any[] = Array.isArray(currentConfig._feedbacks) ? [...currentConfig._feedbacks] : [];

    // Deduplication: Check if this user/device already rated this invitation
    let matchedIndex = -1;
    if (targetId) {
      matchedIndex = existingFeedbacks.findIndex((f: any) => f.id === targetId);
    }
    if (matchedIndex === -1 && deviceId) {
      matchedIndex = existingFeedbacks.findIndex((f: any) => f.deviceId && f.deviceId === deviceId);
    }

    const isUpdate = matchedIndex !== -1 || (typeof targetId === "string" && targetId.trim().length > 0);
    const existingEntry = matchedIndex !== -1 ? existingFeedbacks[matchedIndex] : null;
    const resolvedId = existingEntry?.id || targetId;

    let dbFeedbackId: string | null = isUpdate ? resolvedId : null;

    // 1. Database table sync
    if (isUpdate && resolvedId) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(resolvedId);
        if (isUuid) {
          await adminDb.from("invitation_feedbacks").update({
            rating,
            feedback: feedbackText,
            guest_name: guestName,
          }).eq("id", resolvedId);
        }
      } catch {
        // ignore if table does not exist or targetId not uuid
      }
    } else {
      try {
        const { data: insertedData } = await adminDb.from("invitation_feedbacks").insert([{
          invitation_id: id,
          rating,
          feedback: feedbackText,
          guest_name: guestName,
          created_at: new Date().toISOString()
        }]).select("id").single();

        if (insertedData?.id) {
          dbFeedbackId = insertedData.id;
        }
      } catch {
        // ignore if table does not exist or column missing
      }
    }

    // 2. Persist in invitation config as durable JSON array fallback
    let updatedFeedbacks: any[];
    let returnedEntry: any;

    if (matchedIndex !== -1) {
      // Update existing entry in place
      existingFeedbacks[matchedIndex] = {
        ...existingFeedbacks[matchedIndex],
        id: dbFeedbackId || existingFeedbacks[matchedIndex].id,
        deviceId: deviceId || existingFeedbacks[matchedIndex].deviceId || null,
        rating,
        feedback: feedbackText,
        guestName,
        phone: guestPhone,
        updated_at: new Date().toISOString()
      };
      returnedEntry = existingFeedbacks[matchedIndex];
      updatedFeedbacks = existingFeedbacks;
    } else if (isUpdate) {
      returnedEntry = {
        id: resolvedId,
        deviceId: deviceId || null,
        rating,
        feedback: feedbackText,
        guestName,
        phone: guestPhone,
        created_at: new Date().toISOString()
      };
      updatedFeedbacks = [returnedEntry, ...existingFeedbacks.slice(0, 99)];
    } else {
      returnedEntry = {
        id: dbFeedbackId || `fb_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        deviceId: deviceId || null,
        rating,
        feedback: feedbackText,
        guestName,
        phone: guestPhone,
        created_at: new Date().toISOString()
      };
      updatedFeedbacks = [returnedEntry, ...existingFeedbacks.slice(0, 99)];
    }

    await adminDb.from("invitations").update({
      config: {
        ...currentConfig,
        _feedbacks: updatedFeedbacks
      }
    }).eq("id", id);

    return NextResponse.json({ success: true, feedback: returnedEntry });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit feedback" }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminDb = getAdminDb();
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const isAdmin = isAdminUser(user.email);
    const assignedClientEmail = (invite.config?.clientEmail || (invite.config as any)?.config?.clientEmail || "").toLowerCase().trim();
    const currentEmail = (user.email || "").toLowerCase().trim();
    const isOwner = invite.user_id === user.id || (assignedClientEmail && assignedClientEmail === currentEmail);

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Attempt table query first
    let feedbacks: any[] = [];
    try {
      const { data: tableData } = await adminDb
        .from("invitation_feedbacks")
        .select("*")
        .eq("invitation_id", id)
        .order("created_at", { ascending: false });

      if (tableData && tableData.length > 0) {
        feedbacks = tableData.map(f => ({
          id: f.id,
          rating: f.rating,
          feedback: f.feedback,
          guestName: f.guest_name || f.guestName || "Guest",
          created_at: f.created_at
        }));
      }
    } catch {}

    // Fallback to JSON config
    if (feedbacks.length === 0 && Array.isArray(invite.config?._feedbacks)) {
      feedbacks = invite.config._feedbacks;
    }

    const totalRatings = feedbacks.length;
    const avgRating = totalRatings > 0 
      ? Number((feedbacks.reduce((acc, f) => acc + (Number(f.rating) || 0), 0) / totalRatings).toFixed(1))
      : 5.0;

    return NextResponse.json({
      success: true,
      feedbacks,
      statistics: {
        totalRatings,
        averageRating: avgRating
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch feedbacks" }, { status: 500 });
  }
}
