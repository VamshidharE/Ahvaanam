/**
 * Returns the public canonical base URL for social link previews and metadata.
 * Ensures localhost is never used in production Open Graph tags.
 */
export function getBaseUrl(): string {
  // 1. Explicit custom domain if set in environment
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  // 2. Vercel deployment production URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  // 3. Fallback default Ahvaanam production domain
  return "https://ahvaanam-liart.vercel.app";
}
