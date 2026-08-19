import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { isAdminUser } from "@/lib/auth/isAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  try {
    const adminDb = getAdminDb();
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    const { config, user_id, status, payment_status, updated_at } = invite;

    const isAdmin = isAdminUser(user.email);
    const assignedClientEmail = (config?.clientEmail || (config as any)?.config?.clientEmail || "").toLowerCase().trim();
    const currentEmail = (user.email || "").toLowerCase().trim();
    const isOwner = user_id === user.id || (assignedClientEmail && assignedClientEmail === currentEmail);

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const responsePayload = {
      ...config,
      _payment_status: payment_status,
      _status: status,
      _updated_at: updated_at,
      payment_status,
      status,
      updated_at
    };

    return new NextResponse(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to load configuration" }, { status: 500 });
  }
}
