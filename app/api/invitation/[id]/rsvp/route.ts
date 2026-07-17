import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById } from "@/lib/db";
import { rsvpSubmissionSchema, slugSchema } from "@/lib/validation";

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
    // 2. Load and verify invitation
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    if (invite.status !== "published") {
      return NextResponse.json({ error: "Cannot submit RSVP to an unpublished invitation." }, { status: 400 });
    }

    // 3. Parse and validate body
    const body = await request.json();
    const parsed = rsvpSubmissionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: parsed.error.issues.map(err => ({ path: err.path.join("."), message: err.message }))
      }, { status: 400 });
    }

    const { guest_name, phone, email, attending, guest_count, message } = parsed.data;

    // 4. Save to Database using the Supabase client
    const supabase = await createClient();
    const { error } = await supabase
      .from("rsvps")
      .insert([{
        invitation_id: id,
        guest_name,
        phone,
        email: email || null,
        attending,
        guest_count: attending ? guest_count : 1,
        message: message || null
      }]);

    if (error) {
      // 5. Unique constraint violation (duplicate invitation_id + phone key)
      if (error.code === "23505") {
        return NextResponse.json({ error: "An RSVP has already been submitted for this phone number." }, { status: 400 });
      }
      console.error("Supabase RSVP insert error:", error);
      return NextResponse.json({ error: error.message || "Failed to submit RSVP." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process RSVP submission." }, { status: 500 });
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    if (invite.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Fetch all RSVPs for this invitation
    const { data: rsvps, error } = await supabase
      .from("rsvps")
      .select("guest_name, phone, email, attending, guest_count, message, created_at")
      .eq("invitation_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase RSVP select error:", error);
      return NextResponse.json({ error: "Failed to retrieve RSVPs." }, { status: 500 });
    }

    return NextResponse.json({ success: true, rsvps });
  } catch (error) {
    return NextResponse.json({ error: "Failed to load RSVPs." }, { status: 500 });
  }
}
