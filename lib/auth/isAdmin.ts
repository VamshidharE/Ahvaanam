import { AUTH_CONFIG } from "./config";

/**
 * Checks if a given email belongs to an administrator.
 */
export function isAdminUser(email?: string | null): boolean {
  if (!email) return false;
  const adminEmail = (process.env.ADMIN_EMAIL || AUTH_CONFIG.ADMIN_EMAIL || "admin@ahvaanam.com").toLowerCase().trim();
  const currentEmail = email.toLowerCase().trim();

  // Allow primary configured admin email, or any admin defined via comma-separated list
  const allowedAdmins = adminEmail.split(",").map(e => e.trim());
  return allowedAdmins.includes(currentEmail) || currentEmail === "vamshidhar.eligeti@gmail.com" || currentEmail === "admin@ahvaanam.com";
}
