import { SupabaseClient } from "@supabase/supabase-js";
import { sendEmail } from "@/lib/email/mailer";
import { getOnboardingEmailHtml, getOnboardingEmailText } from "@/lib/email/templates/onboardingEmail";

export interface ProvisionClientParams {
  invitationId: string;
  clientEmail: string;
  adminDb: SupabaseClient;
  appBaseUrl: string;
  forceResend?: boolean;
}

export interface ProvisionClientResult {
  success: boolean;
  emailSent?: boolean;
  alreadySent?: boolean;
  simulated?: boolean;
  isNewUser?: boolean;
  userId?: string;
  message?: string;
  error?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Extracts couple or celebrant names from invitation config to personalize greetings and titles.
 */
function extractClientDetails(config: any): { clientName: string; invitationTitle: string; eventDate: string } {
  const json = config || {};
  const isWrapped = json && typeof json === "object" && "category" in json && "config" in json;
  const inner = isWrapped ? (json.config || {}) : (json || {});

  const groomName = inner.couple?.groom?.name || 
                    inner.groom?.name ||
                    inner.celebrant?.name || 
                    inner.hosts || 
                    inner.baby?.name || 
                    inner.mother?.name || 
                    inner.company || 
                    inner.festivalName || 
                    "";

  const brideName = inner.couple?.bride?.name || 
                    inner.bride?.name ||
                    inner.father?.name || 
                    inner.eventTitle || 
                    "";

  let clientName = "";
  if (groomName && brideName) {
    clientName = `${groomName} & ${brideName}`;
  } else if (groomName) {
    clientName = groomName;
  } else if (brideName) {
    clientName = brideName;
  } else {
    clientName = "Valued Client";
  }

  const invitationTitle = inner.eventTitle || clientName;
  const rawDate = inner.countdown?.targetDate || inner.date || "";
  let formattedDate = "";
  if (rawDate) {
    try {
      const parsed = new Date(rawDate);
      if (!isNaN(parsed.getTime())) {
        formattedDate = parsed.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });
      }
    } catch {
      formattedDate = rawDate;
    }
  }

  return { clientName, invitationTitle, eventDate: formattedDate };
}

/**
 * Automates client account provisioning, profile association, and one-time passwordless email delivery.
 */
export async function provisionClientAndSendOnboarding({
  invitationId,
  clientEmail,
  adminDb,
  appBaseUrl,
  forceResend = false,
}: ProvisionClientParams): Promise<ProvisionClientResult> {
  const normalizedEmail = (clientEmail || "").toLowerCase().trim();

  if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
    console.warn(`[Ahvaanam Onboarding] Skipping onboarding for invitation ${invitationId}: Missing or invalid email (${normalizedEmail}).`);
    return {
      success: false,
      error: "Missing or invalid client email address.",
    };
  }

  // 1. Fetch current invitation data
  const { data: invite, error: fetchError } = await adminDb
    .from("invitations")
    .select("id, config, user_id, status, payment_status")
    .eq("id", invitationId)
    .maybeSingle();

  if (fetchError || !invite) {
    console.error(`[Ahvaanam Onboarding] Invitation ${invitationId} not found in database.`);
    return {
      success: false,
      error: "Invitation not found.",
    };
  }

  const config = JSON.parse(JSON.stringify(invite.config || {}));
  const isWrapped = config && typeof config === "object" && "category" in config && "config" in config;
  const innerConfig = isWrapped ? (config.config || {}) : config;

  // 2. Prevent duplicate onboarding emails on repeated publishing
  const existingDelivery = config.onboarding_email || innerConfig.onboarding_email;
  if (!forceResend && existingDelivery?.status === "sent" && existingDelivery?.recipient === normalizedEmail) {
    console.log(`[Ahvaanam Onboarding] Onboarding email already sent to ${normalizedEmail} on ${existingDelivery.sent_at}. Skipping duplicate send.`);
    return {
      success: true,
      emailSent: false,
      alreadySent: true,
      userId: invite.user_id,
      message: "Onboarding email was previously sent. Skipping duplicate send.",
    };
  }

  const { clientName, invitationTitle, eventDate } = extractClientDetails(config);

  // 3. Check if user account already exists in Supabase Auth
  let userId: string | null = null;
  let isNewUser = false;

  try {
    const { data: usersData, error: listError } = await adminDb.auth.admin.listUsers();
    if (listError) {
      console.error("[Ahvaanam Onboarding] Failed to list auth users:", listError.message);
      throw listError;
    }

    const existingUser = (usersData?.users || []).find(
      (u) => u.email?.toLowerCase().trim() === normalizedEmail
    );

    if (existingUser) {
      userId = existingUser.id;
      isNewUser = false;
      console.log(`[Ahvaanam Onboarding] Reusing existing Supabase account for ${normalizedEmail} (ID: ${userId}).`);
    } else {
      // Create new Supabase Auth user without a password
      const { data: newUser, error: createError } = await adminDb.auth.admin.createUser({
        email: normalizedEmail,
        email_confirm: true,
        user_metadata: {
          role: "client",
          full_name: clientName,
        },
      });

      if (createError || !newUser?.user) {
        console.error("[Ahvaanam Onboarding] Failed to create auth user:", createError?.message);
        throw createError || new Error("Failed to create Supabase auth user.");
      }

      userId = newUser.user.id;
      isNewUser = true;
      console.log(`[Ahvaanam Onboarding] Created new Supabase client account for ${normalizedEmail} (ID: ${userId}).`);
    }
  } catch (authErr: any) {
    console.error("[Ahvaanam Onboarding] Auth provisioning failed:", authErr.message);
    return {
      success: false,
      error: authErr.message || "Failed to provision Supabase auth account.",
    };
  }

  // 4. Ensure client profile row exists in public.profiles table
  try {
    const { data: profile } = await adminDb
      .from("profiles")
      .select("id, role")
      .eq("id", userId)
      .maybeSingle();

    if (!profile) {
      console.log(`[Ahvaanam Onboarding] Creating client profile for ${userId}...`);
      await adminDb.from("profiles").insert({
        id: userId,
        email: normalizedEmail,
        full_name: clientName,
        role: "client",
      });
    }
  } catch (profErr: any) {
    // Non-blocking fallback if profile trigger already took care of it
    console.warn("[Ahvaanam Onboarding] Note on profile verification:", profErr.message);
  }

  // 5. Associate invitation with client user ID and clientEmail in config
  config.clientEmail = normalizedEmail;
  if (isWrapped && config.config) {
    config.config.clientEmail = normalizedEmail;
  }

  const { error: linkInviteError } = await adminDb
    .from("invitations")
    .update({
      user_id: userId,
      config,
    })
    .eq("id", invitationId);

  if (linkInviteError) {
    console.error(`[Ahvaanam Onboarding] Failed to associate invitation ${invitationId} with user ${userId}:`, linkInviteError.message);
  }

  // 6. Generate secure, one-time Supabase magic link
  let magicLinkUrl = "";
  try {
    const { data: linkData, error: linkError } = await adminDb.auth.admin.generateLink({
      type: "magiclink",
      email: normalizedEmail,
      options: {
        redirectTo: `${appBaseUrl}/dashboard`,
      },
    });

    if (linkError || !linkData?.properties) {
      console.error("[Ahvaanam Onboarding] Failed to generate magic link:", linkError?.message);
      throw linkError || new Error("Magic link properties not generated.");
    }

    const tokenHash = linkData.properties.hashed_token;
    const verificationType = linkData.properties.verification_type || "magiclink";

    magicLinkUrl = `${appBaseUrl}/auth/callback?token_hash=${encodeURIComponent(tokenHash)}&type=${encodeURIComponent(verificationType)}&next=/dashboard`;
  } catch (linkGenErr: any) {
    console.error("[Ahvaanam Onboarding] Magic link generation failed:", linkGenErr.message);
    return {
      success: false,
      error: linkGenErr.message || "Failed to generate authentication magic link.",
      userId,
      isNewUser,
    };
  }

  // 7. Render and send branded onboarding email from ahvaanam.studio@gmail.com
  const emailHtml = getOnboardingEmailHtml({
    clientName,
    invitationTitle,
    eventDate,
    invitationUrl: `${appBaseUrl}/invites/${invitationId}`,
    dashboardUrl: magicLinkUrl,
    isNewUser,
  });

  const emailText = getOnboardingEmailText({
    clientName,
    invitationTitle,
    invitationUrl: `${appBaseUrl}/invites/${invitationId}`,
    dashboardUrl: magicLinkUrl,
  });

  const emailSubject = "Your invitation is published! Access your Ahvaanam dashboard";

  const emailResult = await sendEmail({
    to: normalizedEmail,
    subject: emailSubject,
    html: emailHtml,
    text: emailText,
  });

  // 8. Record delivery timestamp and status in invitation config & database
  const deliveryStatus = emailResult.success ? "sent" : "failed";
  const nowIso = new Date().toISOString();

  const deliveryMetadata = {
    status: deliveryStatus,
    sent_at: emailResult.success ? nowIso : null,
    last_attempt_at: nowIso,
    recipient: normalizedEmail,
    attempts: (existingDelivery?.attempts || 0) + 1,
    simulated: Boolean(emailResult.simulated),
    error: emailResult.error || null,
  };

  config.onboarding_email = deliveryMetadata;
  if (isWrapped && config.config) {
    config.config.onboarding_email = deliveryMetadata;
  }

  // Persist updated metadata in config
  await adminDb
    .from("invitations")
    .update({ config })
    .eq("id", invitationId);

  // Safely attempt updating additive database columns if they exist in schema
  try {
    await adminDb
      .from("invitations")
      .update({
        onboarding_email_sent_at: emailResult.success ? nowIso : null,
        onboarding_email_status: deliveryStatus,
        onboarding_email_recipient: normalizedEmail,
        onboarding_email_error: emailResult.error || null,
      })
      .eq("id", invitationId);
  } catch {
    // Graceful fallback if database additive columns haven't been migrated yet
  }

  return {
    success: true,
    emailSent: emailResult.success,
    simulated: emailResult.simulated,
    isNewUser,
    userId,
    error: emailResult.error,
  };
}
