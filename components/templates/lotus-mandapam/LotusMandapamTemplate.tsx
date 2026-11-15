"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/lotus-mandapam.css";
import { mapInvitationConfigToEmeraldPalace, EmeraldPalaceData } from "./adapter";
import { EmeraldPalaceProvider } from "./context";

import RoyalOpening from "./hero/RoyalOpening";
import EmeraldNav from "./EmeraldNav";
import EmeraldHero from "./hero/EmeraldHero";
import JasminePetals from "./hero/JasminePetals";
import FamilyBlessings from "./sections/FamilyBlessings";
import CoupleSection from "./sections/CoupleSection";
import AuspiciousEvents from "./sections/AuspiciousEvents";
import RoyalGallery from "./sections/RoyalGallery";
import WeddingFilm from "./sections/WeddingFilm";
import CountdownAndRsvp from "./sections/CountdownAndRsvp";
import VenueConcierge from "./sections/VenueConcierge";
import RoyalFooter from "./sections/RoyalFooter";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export interface LotusMandapamTemplateProps {
  invitationData: any;
  clientId?: string;
}

export default function LotusMandapamTemplate({
  invitationData,
  clientId,
}: LotusMandapamTemplateProps) {
  const data: EmeraldPalaceData = mapInvitationConfigToEmeraldPalace(invitationData);

  const [isOpen, setIsOpen] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const wasPlayingBeforeHiddenRef = useRef(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showFloatingRsvp, setShowFloatingRsvp] = useState(false);

  // Detect embedding on client to avoid SSR hydration mismatch
  useEffect(() => {
    const embedded = typeof window !== "undefined" && (
      window.self !== window.top ||
      window.location.search.includes("embed=1") ||
      window.location.search.includes("preview=1")
    );
    setIsEmbedded(embedded);
    if (embedded) {
      setIsOpen(true);
      setMusicEnabled(false);
    }
  }, []);

  // Floating RSVP visibility calculation using IntersectionObserver (zero scroll layout thrashing)
  useEffect(() => {
    if (isEmbedded) return;

    let isRsvpInView = false;
    let isPastHero = false;

    const updateFloating = () => {
      const shouldShow = isPastHero && !isRsvpInView;
      setShowFloatingRsvp((prev) => (prev !== shouldShow ? shouldShow : prev));
    };

    // 1. Observe RSVP element to hide button when RSVP form is already in view
    const rsvpEl = document.getElementById("rsvp");
    let rsvpObserver: IntersectionObserver | null = null;
    if (rsvpEl && typeof IntersectionObserver !== "undefined") {
      rsvpObserver = new IntersectionObserver(
        ([entry]) => {
          isRsvpInView = entry.isIntersecting;
          updateFloating();
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0 }
      );
      rsvpObserver.observe(rsvpEl);
    }

    // 2. Observe Hero element to show button only after user scrolls past the hero
    const heroEl = document.getElementById("hero");
    let heroObserver: IntersectionObserver | null = null;
    if (heroEl && typeof IntersectionObserver !== "undefined") {
      heroObserver = new IntersectionObserver(
        ([entry]) => {
          isPastHero = !entry.isIntersecting;
          updateFloating();
        },
        { threshold: 0.1 }
      );
      heroObserver.observe(heroEl);
    } else {
      isPastHero = true;
      updateFloating();
    }

    return () => {
      if (rsvpObserver) rsvpObserver.disconnect();
      if (heroObserver) heroObserver.disconnect();
    };
  }, [isEmbedded, isOpen]);

  const scrollToRsvp = () => {
    emitAnalyticsInteraction("rsvp_open", "rsvp");
    const rsvpEl = document.getElementById("rsvp");
    if (rsvpEl) {
      rsvpEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Audio Playback
  useEffect(() => {
    if (isEmbedded || !musicEnabled) return;

    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.5;

    const attemptPlay = () => {
      // Do not auto-play if page/tab is currently minimized or hidden
      if (typeof document !== "undefined" && document.hidden) return;
      if (audio && musicEnabled && audio.paused) {
        audio
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
    };

    if (isOpen) {
      attemptPlay();
    }

    const handleGesture = () => attemptPlay();
    const events = ["click", "touchstart", "touchend", "pointerdown", "scroll", "keydown"];
    events.forEach((evt) => window.addEventListener(evt, handleGesture, { passive: true }));
    document.addEventListener("click", handleGesture, { passive: true });

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleGesture));
      document.removeEventListener("click", handleGesture);
    };
  }, [musicEnabled, isEmbedded, isOpen]);

  // Pause audio and suspend activity when page/window is minimized or switched away
  useEffect(() => {
    if (isEmbedded) return;

    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        // Tab switched away or window minimized to background
        if (!audio.paused) {
          wasPlayingBeforeHiddenRef.current = true;
          audio.pause();
          setIsMusicPlaying(false);
        }
      } else {
        // Tab restored or window brought back into focus
        if (wasPlayingBeforeHiddenRef.current && musicEnabled) {
          audio
            .play()
            .then(() => setIsMusicPlaying(true))
            .catch(() => {});
          wasPlayingBeforeHiddenRef.current = false;
        }
      }
    };

    const handlePageHide = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        wasPlayingBeforeHiddenRef.current = true;
        audio.pause();
        setIsMusicPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [musicEnabled, isEmbedded]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
      setMusicEnabled(false);
    } else {
      audio.volume = 0.5;
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          setMusicEnabled(true);
          emitAnalyticsInteraction("music_play", "music");
        })
        .catch(() => {});
    }
  };

  // Section dynamic rendering lookup synced with Editor reordering
  const renderSection = (id: string) => {
    switch (id) {
      case "hero":
        if (data.sections.showHero === false) return null;
        return (
          <div key="hero" data-section-id="hero">
            <EmeraldHero />
          </div>
        );
      case "family":
      case "families":
        if (data.sections.showFamily === false && data.sections.showFamilies === false) return null;
        return (
          <div key="family" data-section-id="family">
            <FamilyBlessings />
          </div>
        );
      case "couple":
        if (data.sections.showCouple === false) return null;
        return (
          <div key="couple" data-section-id="couple">
            <CoupleSection />
          </div>
        );
      case "events":
        if (data.sections.showEvents === false) return null;
        return (
          <div key="events" data-section-id="events">
            <AuspiciousEvents />
          </div>
        );
      case "film":
      case "story":
      case "video":
        if (data.video?.enabled === false && data.sections.showStory === false && data.sections.showVideo === false) return null;
        return (
          <div key="film" data-section-id="film">
            <WeddingFilm />
          </div>
        );
      case "gallery":
        if (data.sections.showGallery === false) return null;
        return (
          <div key="gallery" data-section-id="gallery">
            <RoyalGallery />
          </div>
        );
      case "countdown":
      case "rsvp":
        if (data.sections.showRSVP === false && data.sections.showCountdown === false) return null;
        return (
          <div key="rsvp" data-section-id="rsvp">
            <CountdownAndRsvp clientId={clientId} />
          </div>
        );
      case "venue":
      case "venues":
        if (data.sections.showVenue === false) return null;
        return (
          <div key="venue" data-section-id="venue">
            <VenueConcierge />
          </div>
        );
      case "footer":
        if (data.sections.showFooter === false) return null;
        return (
          <div key="footer" data-section-id="footer">
            <RoyalFooter clientId={clientId} />
          </div>
        );
      default:
        return null;
    }
  };

  // Ensure hero is always rendered at the top if sectionOrder doesn't start with hero
  const hasHeroInOrder = data.sectionOrder.includes("hero");
  const renderedSet = new Set<string>();

  return (
    <EmeraldPalaceProvider data={data}>
      <div className="lotus-mandapam-template emerald-palace-template relative select-none min-h-screen bg-[#FFF6E9] text-[#542D2A] w-full max-w-[100vw] overflow-x-hidden">
        {/* Interactive Wax Seal Opening Envelope (skips if embedded in editor) */}
        <AnimatePresence>
          {!isOpen && (
            <RoyalOpening
              onOpen={() => setIsOpen(true)}
              onPlayAudio={() => {
                const audio = audioRef.current;
                if (audio && musicEnabled) {
                  audio.volume = 0.5;
                  audio
                    .play()
                    .then(() => setIsMusicPlaying(true))
                    .catch(() => {});
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Global Floating Jasmine & Rose Petals */}
        <JasminePetals />

        {/* Fixed Top Navigation Bar */}
        <EmeraldNav />

        {/* Main Content Layout - Dynamically Rendered & Ordered */}
        <main className="relative z-10 w-full overflow-hidden">
          {/* Top Hero if not in sectionOrder */}
          {!hasHeroInOrder && data.sections.showHero !== false && (
            <div data-section-id="hero">
              <EmeraldHero />
            </div>
          )}

          {/* Dynamic Sections in order */}
          {data.sectionOrder.map((sectionId) => {
            // Deduplicate combined sections
            if (sectionId === "family" || sectionId === "families") {
              if (renderedSet.has("family-done")) return null;
              renderedSet.add("family-done");
            }
            if (sectionId === "film" || sectionId === "story" || sectionId === "video") {
              if (renderedSet.has("film-done")) return null;
              renderedSet.add("film-done");
            }
            if (sectionId === "countdown" || sectionId === "rsvp") {
              if (renderedSet.has("rsvp-countdown-done")) return null;
              renderedSet.add("rsvp-countdown-done");
            }
            if (sectionId === "venue" || sectionId === "venues") {
              if (renderedSet.has("venue-done")) return null;
              renderedSet.add("venue-done");
            }
            if (renderedSet.has(sectionId)) return null;
            renderedSet.add(sectionId);

            return renderSection(sectionId);
          })}
        </main>

        {/* Background Theme Audio */}
        <audio
          ref={audioRef}
          src={data.music.themeMusic || "/wedding/rose-mandap/theme-music.MP3"}
          loop
          preload="auto"
        />

        {/* Floating Quick RSVP Button */}
        <AnimatePresence>
          {data.sections.showRSVP && showFloatingRsvp && (
            <motion.button
              className="ep-floating-rsvp-btn"
              onClick={scrollToRsvp}
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              transition={{ duration: 0.3 }}
              aria-label="Join Us"
            >
              <span>💌</span>
              <span>Join Us</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Floating Music Toggle Button */}
        <motion.button
          className="ep-floating-music-btn"
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          aria-label={isMusicPlaying ? "Mute Background Music" : "Play Background Music"}
        >
          <span>{isMusicPlaying ? "🎵" : "🔇"}</span>
        </motion.button>
      </div>
    </EmeraldPalaceProvider>
  );
}

export { LotusMandapamTemplate as EmeraldPalaceTemplate };
