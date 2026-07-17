import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, saveInvitation, deleteInvitation } from "@/lib/db";
import { configUpdateSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // 1. Fetch the invitation details globally (using service client default fallback)
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    const { config, user_id, status, payment_status } = invite;

    // 2. If status is published, allow public access
    if (status === "published") {
      return NextResponse.json(config);
    }

    // 3. If draft (not published), authenticate the request
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // 4. Return 404 if not the owner (or not logged in)
    if (!user || user.id !== user_id) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    // 5. Owner is authenticated and owns the invite; always return the config
    const responsePayload = {
      ...config,
      _payment_status: payment_status,
      _status: status,
    };

    return NextResponse.json(responsePayload);
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

  const { id } = await params;

  try {
    // 1. Fetch current owner metadata
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    // 2. Ensure caller owns this invitation
    if (invite.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const isWedding = !invite.config || !invite.config.category || invite.config.category === "wedding";

    if (isWedding) {
      const parsed = configUpdateSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json({ 
          error: "Validation failed", 
          details: parsed.error.issues.map(err => ({ path: err.path.join("."), message: err.message })) 
        }, { status: 400 });
      }

      // 3. Perform save using the user client (validates RLS update check)
      const result = await saveInvitation(id, parsed.data, supabase);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Failed to save configuration data" }, { status: 500 });
      }
    } else {
      // Non-wedding category update: ensure it preserves the basic InvitationConfig wrapper keys
      if (!body.category || !body.themeId || !body.config) {
        return NextResponse.json({ error: "Invalid category configuration structure." }, { status: 400 });
      }

      // Perform save using the user client (validates RLS update check)
      const result = await saveInvitation(id, body, supabase);
      if (!result.success) {
        return NextResponse.json({ error: result.error || "Failed to save configuration data" }, { status: 500 });
      }
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save configuration data" }, { status: 500 });
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

  const { id } = await params;

  try {
    // 1. Fetch current owner metadata
    const invite = await getInvitationById(id);
    if (!invite) {
      return NextResponse.json({ error: "Invitation profile not found" }, { status: 404 });
    }

    // 2. Ensure caller owns this invitation
    if (invite.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Perform delete using user client (enforces RLS delete rule)
    await deleteInvitation(id, supabase);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete client profile" }, { status: 500 });
  }
}
