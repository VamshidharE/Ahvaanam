import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, payInvitation } from "@/lib/db";
import { slugSchema } from "@/lib/validation";

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
    // 1. Verify invitation existence and ownership
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    if (invite.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Perform simulated payment update
    await payInvitation(id, supabase);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to process payment simulation" }, { status: 500 });
  }
}
