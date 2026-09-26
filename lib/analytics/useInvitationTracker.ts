"use client";

import { useEffect, useRef, useCallback } from "react";
import { AnalyticsEventType, AnalyticsTrackPayload, DeviceType } from "./types";
import { ANALYTICS_CONFIG } from "./config";

function getDeviceType(): DeviceType {
  if (typeof window === "undefined") return "desktop";
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobileUa = /iphone|ipod|android.*mobile|windows.*phone|blackberry/i.test(userAgent);
  const isTabletUa = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);

  if (isTabletUa || (width >= 640 && width <= 1024)) return "tablet";
  if (isMobileUa || width < 640) return "mobile";
  return "desktop";
}

function getOrCreateSessionId(clientId: string): string {
  if (typeof window === "undefined") return "anon-session";
  let token = localStorage.getItem("ahvaanam_visitor_token");
  if (!token) {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      token = crypto.randomUUID();
    } else {
      token = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    localStorage.setItem("ahvaanam_visitor_token", token);
  }
  return token;
}

function resolveSectionId(target: HTMLElement): string | null {
  const explicit = target.getAttribute("data-section-id");
  if (explicit) return explicit.toLowerCase();

  const id = (target.id || "").toLowerCase();
  if (id && id !== "root" && id !== "app") {
    if (id === "home") return "hero";
    return id;
  }

  const classList = Array.from(target.classList).map((c) => c.toLowerCase());
  const allClassStr = classList.join(" ");

  if (allClassStr.includes("hero")) return "hero";
  if (allClassStr.includes("story") || allClassStr.includes("announcement")) return "announcement";
  if (allClassStr.includes("events") || allClassStr.includes("ceremony")) return "events";
  if (allClassStr.includes("procession") || allClassStr.includes("baraat")) return "procession";
  if (allClassStr.includes("family") || allClassStr.includes("families")) return "family";
  if (allClassStr.includes("gallery")) return "gallery";
  if (allClassStr.includes("venue")) return "venue";
  if (allClassStr.includes("countdown")) return "countdown";
  if (allClassStr.includes("rsvp")) return "rsvp";
  if (allClassStr.includes("footer")) return "footer";

  return null;
}

export function useInvitationTracker(clientId: string) {
  const sessionIdRef = useRef<string>("");
  const deviceTypeRef = useRef<DeviceType>("desktop");
  const startTimeRef = useRef<number>(0);
  const durationSecondsRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const recordedMilestonesRef = useRef<Set<number>>(new Set());
  const recordedSectionsRef = useRef<Set<string>>(new Set());
  const isInitializedRef = useRef(false);

  // Safe non-blocking beacon sender
  const sendPayload = useCallback(
    (payload: AnalyticsTrackPayload, useBeacon = false) => {
      try {
        if (!clientId) return;
        const endpoint = `/api/invitation/${clientId}/analytics/track`;
        const body = JSON.stringify(payload);

        if (useBeacon && typeof navigator !== "undefined" && navigator.sendBeacon) {
          const blob = new Blob([body], { type: "text/plain;charset=UTF-8" });
          navigator.sendBeacon(endpoint, blob);
        } else {
          fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          }).catch(() => {
            // Silently ignore network failures to prevent UI disruptions
          });
        }
      } catch {
        // Silently swallow any synchronous tracking errors
      }
    },
    [clientId]
  );

  // Interaction tracking helper exposed to components
  const trackInteraction = useCallback(
    (eventType: AnalyticsEventType, sectionId?: string, eventData?: Record<string, any>) => {
      if (!sessionIdRef.current) return;
      sendPayload({
        session_id: sessionIdRef.current,
        device_type: deviceTypeRef.current,
        event_type: eventType,
        section_id: sectionId,
        event_data: eventData,
        duration_seconds: durationSecondsRef.current,
        scroll_depth: maxScrollDepthRef.current,
        completed: maxScrollDepthRef.current >= 100,
      });
    },
    [sendPayload]
  );

  useEffect(() => {
    if (typeof window === "undefined" || !clientId || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const sid = getOrCreateSessionId(clientId);
    sessionIdRef.current = sid;
    deviceTypeRef.current = getDeviceType();
    startTimeRef.current = Date.now();

    // 1. Send initial session_start immediately
    sendPayload({
      session_id: sid,
      device_type: deviceTypeRef.current,
      event_type: "session_start",
      duration_seconds: 0,
      scroll_depth: 0,
    });

    // 2. Active duration heartbeat
    let lastActiveTimestamp = Date.now();
    const handleUserActivity = () => {
      lastActiveTimestamp = Date.now();
    };

    const activityEvents = ["mousemove", "mousedown", "touchstart", "scroll", "keydown"];
    activityEvents.forEach((evt) =>
      window.addEventListener(evt, handleUserActivity, { passive: true })
    );

    const heartbeatInterval = setInterval(() => {
      const now = Date.now();
      const idleTimeSeconds = (now - lastActiveTimestamp) / 1000;

      if (idleTimeSeconds < ANALYTICS_CONFIG.MAX_IDLE_TIMEOUT_SECONDS) {
        durationSecondsRef.current = Math.floor((now - startTimeRef.current) / 1000);

        sendPayload({
          session_id: sid,
          device_type: deviceTypeRef.current,
          event_type: "session_ping",
          duration_seconds: durationSecondsRef.current,
          scroll_depth: maxScrollDepthRef.current,
          completed: maxScrollDepthRef.current >= 100,
        });
      }
    }, ANALYTICS_CONFIG.HEARTBEAT_INTERVAL_MS);

    // 3. Scroll depth & milestone tracking (debounced)
    let scrollTimeout: NodeJS.Timeout | null = null;

    const checkScrollMilestones = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight;
      const docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        windowHeight
      );

      const totalScrollable = docHeight - windowHeight;
      const currentPercent =
        totalScrollable > 0 ? Math.min(100, Math.round((scrollY / totalScrollable) * 100)) : 100;

      if (currentPercent > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = currentPercent;
      }

      // Check milestones
      ANALYTICS_CONFIG.SCROLL_MILESTONES.forEach((milestone) => {
        if (currentPercent >= milestone && !recordedMilestonesRef.current.has(milestone)) {
          recordedMilestonesRef.current.add(milestone);

          sendPayload({
            session_id: sid,
            device_type: deviceTypeRef.current,
            event_type: "scroll_milestone",
            scroll_depth: milestone,
            duration_seconds: durationSecondsRef.current,
            completed: milestone === 100,
            event_data: { milestone_percent: milestone },
          });
        }
      });
    };

    const handleScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(checkScrollMilestones, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial check on mount
    checkScrollMilestones();

    // 4. Section IntersectionObserver for section reach
    let observer: IntersectionObserver | null = null;
    try {
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const target = entry.target as HTMLElement;
                const sectionId = resolveSectionId(target);

                if (sectionId && !recordedSectionsRef.current.has(sectionId)) {
                  recordedSectionsRef.current.add(sectionId);

                  sendPayload({
                    session_id: sid,
                    device_type: deviceTypeRef.current,
                    event_type: "section_view",
                    section_id: sectionId,
                    duration_seconds: durationSecondsRef.current,
                    scroll_depth: maxScrollDepthRef.current,
                  });
                }
              }
            });
          },
          { threshold: 0.15 }
        );

        // Find and observe all section elements
        const observeSections = () => {
          const sectionEls = document.querySelectorAll(
            "section, [data-section-id], .invitation-section, .venue-panel, .rsvp-section, footer, .wedding-hero"
          );
          sectionEls.forEach((el) => observer?.observe(el));
        };

        observeSections();
        // Periodic scan to catch late-rendered template sections
        const scan1 = setTimeout(observeSections, 500);
        const scan2 = setTimeout(observeSections, 1500);
        const scan3 = setTimeout(observeSections, 3000);

        () => {
          clearTimeout(scan1);
          clearTimeout(scan2);
          clearTimeout(scan3);
        };
      }
    } catch {
      // IntersectionObserver fallback
    }

    // 5. Exit flush via pagehide/beforeunload
    const handlePageExit = () => {
      const totalSecs = Math.floor((Date.now() - startTimeRef.current) / 1000);
      sendPayload(
        {
          session_id: sid,
          device_type: deviceTypeRef.current,
          event_type: "session_ping",
          duration_seconds: totalSecs,
          scroll_depth: maxScrollDepthRef.current,
          completed: maxScrollDepthRef.current >= 100,
        },
        true
      );
    };

    // 6. Custom Event listener for global emitAnalyticsInteraction calls
    const handleCustomTrackEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{
        eventType: AnalyticsEventType;
        sectionId?: string;
        eventData?: Record<string, any>;
      }>;
      if (customEvent.detail && customEvent.detail.eventType) {
        trackInteraction(
          customEvent.detail.eventType,
          customEvent.detail.sectionId,
          customEvent.detail.eventData
        );
      }
    };

    window.addEventListener("ahvaanam_track_event", handleCustomTrackEvent);

    return () => {
      clearInterval(heartbeatInterval);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      activityEvents.forEach((evt) => window.removeEventListener(evt, handleUserActivity));
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageExit);
      window.removeEventListener("beforeunload", handlePageExit);
      window.removeEventListener("ahvaanam_track_event", handleCustomTrackEvent);
      if (observer) observer.disconnect();
    };
  }, [clientId, sendPayload, trackInteraction]);

  return { trackInteraction };
}

/**
 * Global helper that any client component can call to emit an analytics interaction event safely.
 */
export function emitAnalyticsInteraction(
  eventType: AnalyticsEventType,
  sectionId?: string,
  eventData?: Record<string, any>
) {
  if (typeof window !== "undefined") {
    try {
      window.dispatchEvent(
        new CustomEvent("ahvaanam_track_event", {
          detail: { eventType, sectionId, eventData },
        })
      );
    } catch {
      // Ignore if CustomEvent dispatch fails
    }
  }
}

