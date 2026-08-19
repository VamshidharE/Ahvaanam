import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { slugSchema } from "@/lib/validation";
import { isAdminUser } from "@/lib/auth/isAdmin";

export async function POST(
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
  const parsedId = slugSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json({
      error: "Validation failed",
      details: parsedId.error.issues.map(err => ({ path: err.path.join("."), message: err.message }))
    }, { status: 400 });
  }

  try {
    const adminDb = getAdminDb();
    // 1. Verify invitation existence and ownership
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

    // 2. Mark as published directly using elevated DB client
    const { error } = await adminDb
      .from("invitations")
      .update({ status: "published", payment_status: "paid" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message || "Failed to publish invitation" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to publish invitation" }, { status: 500 });
  }
}
