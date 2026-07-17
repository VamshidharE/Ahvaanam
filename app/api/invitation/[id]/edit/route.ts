import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById } from "@/lib/db";

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
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    const { config, user_id, status, payment_status, updated_at } = invite;

    if (user_id !== user.id) {
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

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    if (error.message && error.message.includes("not found")) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to load configuration" }, { status: 500 });
  }
}
