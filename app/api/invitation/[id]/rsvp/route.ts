import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
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
    const invite = await getInvitationById(id).catch(() => null);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
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

    // Normalize phone number or generate unique identifier if empty
    const effectivePhone = phone && phone.trim() !== "" 
      ? phone.trim() 
      : `guest_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    const adminDb = getAdminDb();

    // 4. Check if an RSVP for this phone already exists, if so update it, otherwise insert
    const { data: existingRsvp } = await adminDb
      .from("rsvps")
      .select("id")
      .eq("invitation_id", id)
      .eq("phone", effectivePhone)
      .maybeSingle();

    if (existingRsvp) {
      const { error: updateError } = await adminDb
        .from("rsvps")
        .update({
          guest_name,
          email: email || null,
          attending,
          guest_count: attending ? (guest_count || 1) : 1,
          message: message || null,
          created_at: new Date().toISOString()
        })
        .eq("id", existingRsvp.id);

      if (updateError) {
        console.error("Supabase RSVP update error:", updateError);
        return NextResponse.json({ error: updateError.message || "Failed to update RSVP." }, { status: 500 });
      }
    } else {
      const { error: insertError } = await adminDb
        .from("rsvps")
        .insert([{
          invitation_id: id,
          guest_name,
          phone: effectivePhone,
          email: email || null,
          attending,
          guest_count: attending ? (guest_count || 1) : 1,
          message: message || null
        }]);

      if (insertError) {
        console.error("Supabase RSVP insert error:", insertError);
        return NextResponse.json({ error: insertError.message || "Failed to submit RSVP." }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process RSVP submission." }, { status: 500 });
  }
}

import { isAdminUser } from "@/lib/auth/isAdmin";

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
    const adminDb = getAdminDb();
    // 2. Load invitation and verify ownership
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    const isAdmin = isAdminUser(user.email);
    const assignedClientEmail = (invite.config?.clientEmail || (invite.config as any)?.config?.clientEmail || "").toLowerCase().trim();
    const currentEmail = (user.email || "").toLowerCase().trim();
    const isOwner = invite.user_id === user.id || (assignedClientEmail && assignedClientEmail === currentEmail);

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Fetch all RSVPs using the elevated admin DB client
    const { data: rsvps, error } = await adminDb
      .from("rsvps")
      .select("guest_name, phone, email, attending, guest_count, message, created_at")
      .eq("invitation_id", id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase RSVP select error:", error);
      return NextResponse.json({ error: "Failed to retrieve RSVPs." }, { status: 500 });
    }

    return NextResponse.json({ success: true, rsvps: rsvps || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load RSVPs." }, { status: 500 });
  }
}
