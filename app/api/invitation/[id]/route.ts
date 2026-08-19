import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, saveInvitation, deleteInvitation, getAdminDb } from "@/lib/db";
import { configUpdateSchema } from "@/lib/validation";

import { isAdminUser } from "@/lib/auth/isAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Fetch the invitation details globally (using elevated admin client)
    const adminDb = getAdminDb();
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    const { config, user_id, status, payment_status, updated_at } = invite;

    const responsePayload = {
      ...config,
      _payment_status: payment_status,
      _status: status,
      _updated_at: updated_at,
      payment_status,
      status,
      updated_at
    };

    // Return with strict no-cache headers so edits reflect instantly on public and guest links
    return new NextResponse(JSON.stringify(responsePayload), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
  }
}

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

  // Only admin is authorized to edit/save invitation configurations
  if (!isAdminUser(user.email)) {
    return NextResponse.json({ error: "Forbidden. Only administrators are authorized to edit configurations." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const adminDb = getAdminDb();
    // 1. Fetch current owner metadata
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    const body = await request.json();

    // 2. Perform save using the admin DB client (bypasses RLS restrictions)
    const result = await saveInvitation(id, body, adminDb);
    if (!result.success) {
      return NextResponse.json({ error: result.error || "Failed to save configuration data" }, { status: 500 });
    }

    // 3. If clientEmail was updated, auto-sync target user ID in Supabase
    const assignedClientEmail = (body.clientEmail || body.config?.clientEmail || "").toLowerCase().trim();
    if (assignedClientEmail) {
      try {
        const { data: usersData } = await adminDb.auth.admin.listUsers();
        const matchedUser = (usersData?.users || []).find(
          (u) => u.email?.toLowerCase().trim() === assignedClientEmail
        );
        if (matchedUser) {
          await adminDb.from("invitations").update({ user_id: matchedUser.id }).eq("id", id);
        }
      } catch {}
    }

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to save configuration data" }, { status: 500 });
  }
}

export async function DELETE(
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

  // Only admin is authorized to delete invitation profiles
  if (!isAdminUser(user.email)) {
    return NextResponse.json({ error: "Forbidden. Only administrators are authorized to delete invitations." }, { status: 403 });
  }

  const { id } = await params;

  try {
    const adminDb = getAdminDb();
    // 1. Fetch current owner metadata
    const invite = await getInvitationById(id, adminDb);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    // 2. Perform delete using admin client
    await deleteInvitation(id, adminDb);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client profile" }, { status: 500 });
  }
}
