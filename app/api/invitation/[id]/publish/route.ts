import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getInvitationById, getAdminDb } from "@/lib/db";
import { slugSchema } from "@/lib/validation";
import { isAdminUser } from "@/lib/auth/isAdmin";
import { provisionClientAndSendOnboarding } from "@/lib/onboarding/provisionClient";
import { getBaseUrl } from "@/lib/utils/baseUrl";

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
  if (id.startsWith("demo-") || id === "demo") {
    return NextResponse.json({ error: "Demo templates cannot be modified through this endpoint." }, { status: 403 });
  }
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

    // 3. Automated Client Account Provisioning & Passwordless Email Onboarding
    let requestBody: any = {};
    try {
      requestBody = await request.json();
    } catch {
      requestBody = {};
    }

    const clientEmail = (
      requestBody.clientEmail ||
      assignedClientEmail ||
      ""
    ).toLowerCase().trim();

    let onboarding: any = null;

    if (clientEmail) {
      try {
        const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
        const proto = request.headers.get("x-forwarded-proto") || (host && host.includes("localhost") ? "http" : "https");
        let appBaseUrl = host ? `${proto}://${host}` : getBaseUrl();
        if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")) {
          appBaseUrl = process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
        }

        onboarding = await provisionClientAndSendOnboarding({
          invitationId: id,
          clientEmail,
          adminDb,
          appBaseUrl,
          forceResend: Boolean(requestBody.forceResend),
        });
      } catch (onboardingErr: any) {
        console.error(`[Ahvaanam Onboarding] Error during onboarding for invitation ${id}:`, onboardingErr?.message || onboardingErr);
        onboarding = {
          success: false,
          error: onboardingErr?.message || "Internal onboarding failure",
        };
      }
    } else {
      console.log(`[Ahvaanam Onboarding] Invitation ${id} published without a client email. Skipped email onboarding.`);
      onboarding = {
        skipped: true,
        reason: "No client email specified for this invitation.",
      };
    }

    return NextResponse.json({ success: true, onboarding });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to publish invitation" }, { status: 500 });
  }
}
