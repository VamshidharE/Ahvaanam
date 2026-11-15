/**
 * Backward compatibility re-export.
 * Primary transactional email delivery is managed by Resend via @/lib/email/send-email.
 */
export { sendEmail } from "./send-email";
export type { SendEmailOptions as EmailOptions, SendEmailResult } from "./send-email";
