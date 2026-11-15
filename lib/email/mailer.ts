import nodemailer, { type Transporter } from "nodemailer";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  simulated?: boolean;
}

let cachedTransporter: Transporter | null = null;

/**
 * Returns a configured Nodemailer transporter for Gmail SMTP.
 */
function getTransporter(): Transporter | null {
  const user = process.env.GMAIL_USER || "ahvaanam.studio@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass || pass.trim() === "" || pass.includes("your_google_app_password")) {
    return null;
  }

  if (cachedTransporter) {
    return cachedTransporter;
  }

  cachedTransporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: user.trim(),
      pass: pass.trim(),
    },
  });

  return cachedTransporter;
}

/**
 * Sends a transactional email using Gmail SMTP and Nodemailer.
 * Falls back to simulation mode with clear server-side logging if GMAIL_APP_PASSWORD is not configured.
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
  const user = (process.env.GMAIL_USER || "ahvaanam.studio@gmail.com").trim();
  const pass = process.env.GMAIL_APP_PASSWORD;

  // Graceful simulation when Gmail App Password is not yet provided
  if (!pass || pass.trim() === "" || pass.includes("your_google_app_password")) {
    console.warn(
      `[Ahvaanam Email] GMAIL_APP_PASSWORD is not configured in .env. Simulated delivery to: ${options.to} for subject: "${options.subject}".`
    );
    return {
      success: true,
      simulated: true,
      messageId: `simulated-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return {
      success: false,
      error: "Gmail transporter could not be initialized. Verify GMAIL_USER and GMAIL_APP_PASSWORD.",
    };
  }

  const mailOptions = {
    from: `"Ahvaanam" <${user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  let lastError: any = null;
  const maxAttempts = 2;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log(`[Ahvaanam Email] Successfully sent email to ${options.to}. (MessageId: ${info.messageId})`);
      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (err: any) {
      lastError = err;
      console.warn(`[Ahvaanam Email] Delivery attempt ${attempt}/${maxAttempts} to ${options.to} failed: ${err.message}`);
      if (attempt < maxAttempts) {
        // Wait 1 second before retry
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || "Failed to deliver email via Gmail SMTP.",
  };
}
