import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { isAdminUser } from "@/lib/auth/isAdmin";
import { sendEmail } from "@/lib/email/send-email";
import { DEFAULT_FROM_EMAIL, DEFAULT_REPLY_TO } from "@/lib/email/resend";

export async function POST(request: Request) {
  // 1. Authenticate user
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Strict admin authorization check - do not allow public or regular clients to trigger emails
  if (!isAdminUser(user.email)) {
    return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
  }

  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch {
      body = {};
    }

    const recipient = (body.recipient || user.email || "ahvaanam.studio@gmail.com").trim().toLowerCase();

    const testSubject = `[Ahvaanam Test] Resend Verified Domain Delivery - ${new Date().toLocaleTimeString()}`;
    const testHtml = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #FAF9F6; border: 1px solid #EADBCC; border-radius: 8px;">
        <h2 style="color: #C49B27; margin-bottom: 8px;">Ahvaanam Resend Integration Test</h2>
        <p style="color: #241E1C; line-height: 1.6;">
          This email confirms transactional email routing is functioning properly via verified domain <strong>mail.ahvaanam.in</strong>.
        </p>
        <div style="background: #FFFFFF; border-left: 3px solid #C49B27; padding: 12px 16px; margin: 16px 0;">
          <p style="margin: 4px 0; font-size: 13px;"><strong>Sender:</strong> ${DEFAULT_FROM_EMAIL}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Reply-To:</strong> ${DEFAULT_REPLY_TO}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Recipient:</strong> ${recipient}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        </div>
        <p style="color: #8C7B70; font-size: 12px;">© Ahvaanam. Bespoke Digital Celebrations.</p>
      </div>
    `;

    const result = await sendEmail({
      to: recipient,
      subject: testSubject,
      html: testHtml,
      text: `Ahvaanam Resend Integration Test\nTimestamp: ${new Date().toISOString()}\nSender: ${DEFAULT_FROM_EMAIL}`,
      tags: [{ name: "type", value: "admin_test" }],
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to send email via Resend",
          sender: DEFAULT_FROM_EMAIL,
          replyTo: DEFAULT_REPLY_TO,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: result.id,
      simulated: result.simulated,
      recipient,
      sender: DEFAULT_FROM_EMAIL,
      replyTo: DEFAULT_REPLY_TO,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to execute email test" },
      { status: 500 }
    );
  }
}
