/**
 * Type definitions for Ahvaanam Advanced Invitation Engagement Analytics.
 */

export type DeviceType = "mobile" | "tablet" | "desktop";

export type ScrollMilestone = 10 | 25 | 50 | 75 | 90 | 100;

export type AnalyticsEventType =
  | "session_start"
  | "session_ping"
  | "scroll_milestone"
  | "section_view"
  | "music_play"
  | "gallery_open"
  | "gallery_image_view"
  | "map_click"
  | "contact_click"
  | "whatsapp_click"
  | "rsvp_open"
  | "rsvp_submit"
  | "share_click";

export interface AnalyticsTrackPayload {
  session_id: string;
  device_type?: DeviceType;
  event_type: AnalyticsEventType;
  section_id?: string;
  event_data?: Record<string, any>;
  scroll_depth?: number;
  duration_seconds?: number;
  completed?: boolean;
}

export interface AnalyticsSessionRow {
  id: string;
  invitation_id: string;
  session_id: string;
  device_type: DeviceType;
  started_at: string;
  last_active_at: string;
  duration_seconds: number;
  max_scroll_depth: number;
  completed: boolean;
  is_engaged: boolean;
  created_at: string;
}

export interface AnalyticsEventRow {
  id: string;
  invitation_id: string;
  session_id: string;
  event_type: AnalyticsEventType;
  section_id: string | null;
  event_data: Record<string, any>;
  created_at: string;
}

export interface FunnelStep {
  milestone: string;
  label: string;
  percent: number;
  count: number;
  conversionRate: number; // % of total unique sessions
  dropOffRate: number; // % dropped from previous step
}

export interface SectionEngagementItem {
  sectionId: string;
  label: string;
  viewCount: number;
  percentage: number;
  dropOffFromPrevious: number;
  isHighestDropOff: boolean;
}

export interface InteractionMetrics {
  musicPlayed: number;
  galleryOpened: number;
  galleryImagesViewed: number;
  mapClicked: number;
  contactClicked: number;
  whatsappClicked: number;
  rsvpOpened: number;
  rsvpSubmitted: number;
  shareClicked: number;
  [key: string]: number;
}

export interface DeviceDistribution {
  mobile: number;
  desktop: number;
  tablet: number;
}

export interface AdvancedEngagementOverview {
  totalViews: number;
  uniqueSessions: number;
  engagedVisits: number;
  engagementRate: number; // %
  averageEngagementTime: number; // seconds
  averageScrollDepth: number; // %
  completionRate: number; // % (reached 100%)
  scrollReach: {
    reach25: number;
    reach50: number;
    reach75: number;
    reach90: number;
    reach100: number;
  };
}

export interface AdvancedAnalyticsResponse {
  success: boolean;
  invitationId: string;
  overview: AdvancedEngagementOverview;
  funnel: FunnelStep[];
  sections: SectionEngagementItem[];
  interactions: InteractionMetrics;
  devices: DeviceDistribution;
  highestDropOffSection: SectionEngagementItem | null;
}
