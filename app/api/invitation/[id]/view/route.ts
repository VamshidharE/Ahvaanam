import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById } from "@/lib/db";
import { viewSubmissionSchema, slugSchema } from "@/lib/validation";

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
    // 2. Read and validate body payload
    const body = await request.json();
    const parsedBody = viewSubmissionSchema.safeParse(body);
    if (!parsedBody.success) {
      return NextResponse.json({
        error: "Validation failed",
        details: parsedBody.error.issues.map(err => ({ path: err.path.join("."), message: err.message }))
      }, { status: 400 });
    }

    const { visitor_token } = parsedBody.data;

    // 3. Verify invitation profile exists
    const invitation = await getInvitationById(id);
    if (!invitation) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const supabase = await createClient();

    // 4. Check for duplicate page views in the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
    const { data: existingView, error: checkError } = await supabase
      .from("invitation_views")
      .select("id")
      .eq("invitation_id", id)
      .eq("visitor_token", visitor_token)
      .gt("viewed_at", thirtyMinutesAgo)
      .limit(1);

    if (checkError) {
      console.error("Error checking duplicate views:", checkError);
    }

    if (existingView && existingView.length > 0) {
      return NextResponse.json({ success: true, duplicated: true });
    }

    // 5. Insert privacy-first view record
    const { error: insertError } = await supabase
      .from("invitation_views")
      .insert([{
        invitation_id: id,
        visitor_token
      }]);

    if (insertError) {
      console.error("Error inserting view event:", insertError);
      return NextResponse.json({ error: insertError.message || "Failed to log page view" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to log page view." }, { status: 500 });
  }
}
