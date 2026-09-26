/**
 * Single source of truth configuration for Ahvaanam Invitation Analytics.
 */

export const ANALYTICS_CONFIG = {
  // Engaged Visit Criteria: visitor active for at least 10s AND reached at least 25% scroll depth
  ENGAGED_VISIT_MIN_SECONDS: 10,
  ENGAGED_VISIT_MIN_SCROLL_PERCENT: 25,

  // Milestones to record for scroll depth progression
  SCROLL_MILESTONES: [10, 25, 50, 75, 90, 100] as const,

  // Minimum heartbeat interval (in milliseconds)
  HEARTBEAT_INTERVAL_MS: 5000,

  // Maximum idle timeout before pausing heartbeat tracking (in seconds)
  MAX_IDLE_TIMEOUT_SECONDS: 60,

  // Default section order when dynamically mapping template sections
  DEFAULT_SECTION_ORDER: [
    "hero",
    "couple",
    "announcement",
    "story",
    "events",
    "procession",
    "family",
    "gallery",
    "venue",
    "countdown",
    "rsvp",
    "footer",
  ],
} as const;

/**
 * Checks if a session qualifies as an engaged visit based on duration and scroll depth.
 */
export function isSessionEngaged(durationSeconds: number, maxScrollDepth: number): boolean {
  return (
    durationSeconds >= ANALYTICS_CONFIG.ENGAGED_VISIT_MIN_SECONDS &&
    maxScrollDepth >= ANALYTICS_CONFIG.ENGAGED_VISIT_MIN_SCROLL_PERCENT
  );
}
