import { getResendClient, DEFAULT_FROM_EMAIL, DEFAULT_REPLY_TO } from "./resend";
import nodemailer, { type Transporter } from "nodemailer";

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  messageId?: string;
  provider: "resend" | "gmail";
  simulated?: boolean;
  error?: string;
}

let cachedGmailTransporter: Transporter | null = null;

function getGmailTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER || "ahvaanam.studio@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass || pass.trim() === "" || pass.includes("your_google_app_password")) {
    return null;
  }

  if (!cachedGmailTransporter) {
    cachedGmailTransporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: user.trim(),
        pass: pass.trim(),
      },
    });
  }

  return cachedGmailTransporter;
}

/**
 * Server-side transactional email sender.
 * Primary: Resend API (if RESEND_API_KEY is configured).
 * Fallback: Gmail SMTP (if GMAIL_APP_PASSWORD is configured).
 * Simulation: If neither is configured, logs safely to console without crashing.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const from = (options.from || DEFAULT_FROM_EMAIL).trim();
  const replyTo = (options.replyTo || DEFAULT_REPLY_TO).trim();
  const to = Array.isArray(options.to) ? options.to : [options.to];
  const recipientList = to.map((e) => e.trim().toLowerCase());

  const resend = getResendClient();

  // 1. PRIMARY: Resend
  if (resend) {
    const payload: any = {
      from,
      to: recipientList,
      subject: options.subject,
      html: options.html,
      reply_to: replyTo,
    };

    if (options.text) {
      payload.text = options.text;
    }

    if (options.tags && options.tags.length > 0) {
      payload.tags = options.tags;
    }

    let lastError: any = null;
    const maxAttempts = 2;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await resend.emails.send(payload);

        if (response.error) {
          lastError = response.error;
          console.warn(
            `[Ahvaanam Email] Resend API attempt ${attempt}/${maxAttempts} failed: ${response.error.message || response.error.name}`
          );
        } else if (response.data?.id) {
          console.log(
            `[Ahvaanam Email] Successfully dispatched email via Resend to [${recipientList.join(", ")}]. (Email ID: ${response.data.id})`
          );
          return {
            success: true,
            id: response.data.id,
            messageId: response.data.id,
            provider: "resend",
          };
        }
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[Ahvaanam Email] Resend network attempt ${attempt}/${maxAttempts} failed: ${err.message}`
        );
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.warn(`[Ahvaanam Email] Resend delivery failed (${lastError?.message}). Attempting Gmail SMTP fallback...`);
  }

  // 2. SECONDARY / FALLBACK: Gmail SMTP
  const gmailTransporter = getGmailTransporter();
  if (gmailTransporter) {
    const gmailUser = (process.env.GMAIL_USER || "ahvaanam.studio@gmail.com").trim();
    const mailOptions = {
      from: `"Ahvaanam" <${gmailUser}>`,
      to: recipientList.join(", "),
      replyTo,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    try {
      const info = await gmailTransporter.sendMail(mailOptions);
      console.log(`[Ahvaanam Email] Successfully dispatched email via Gmail SMTP to [${recipientList.join(", ")}]. (MessageId: ${info.messageId})`);
      return {
        success: true,
        id: info.messageId,
        messageId: info.messageId,
        provider: "gmail",
      };
    } catch (smtpErr: any) {
      console.error(`[Ahvaanam Email] Gmail SMTP delivery failed: ${smtpErr.message}`);
    }
  }

  // 3. SIMULATION (Only if neither Resend nor Gmail SMTP is configured)
  console.warn(
    `[Ahvaanam Email] Neither RESEND_API_KEY nor GMAIL_APP_PASSWORD is set. Simulated delivery to: [${recipientList.join(", ")}] for subject: "${options.subject}".`
  );
  return {
    success: true,
    simulated: true,
    id: `simulated-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    provider: "resend",
  };
}
