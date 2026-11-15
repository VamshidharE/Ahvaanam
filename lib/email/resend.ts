import { Resend } from "resend";

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "Ahvaanam <invitations@mail.ahvaanam.in>";

export const DEFAULT_REPLY_TO =
  process.env.RESEND_REPLY_TO || "ahvaanam.studio@gmail.com";

let resendInstance: Resend | null = null;

/**
 * Returns an initialized Resend client if RESEND_API_KEY is configured.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey.includes("your_resend_api_key")) {
    return null;
  }

  if (!resendInstance) {
    resendInstance = new Resend(apiKey.trim());
  }

  return resendInstance;
}
