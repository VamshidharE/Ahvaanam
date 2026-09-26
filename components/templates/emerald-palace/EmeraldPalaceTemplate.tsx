"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/emerald-palace.css";
import { mapInvitationConfigToEmeraldPalace, EmeraldPalaceData } from "./adapter";
import { EmeraldPalaceProvider } from "./context";

import RoyalOpening from "./hero/RoyalOpening";
import EmeraldHero from "./hero/EmeraldHero";
import JasminePetals from "./hero/JasminePetals";
import Invocation from "./sections/Invocation";
import CoupleSection from "./sections/CoupleSection";
import AuspiciousEvents from "./sections/AuspiciousEvents";
import RoyalCountdown from "./sections/RoyalCountdown";
import FamilyLineage from "./sections/FamilyLineage";
import LoveChronicle from "./sections/LoveChronicle";
import RoyalGallery from "./sections/RoyalGallery";
import VenueConcierge from "./sections/VenueConcierge";
import RoyalRSVP from "./sections/RoyalRSVP";
import RoyalFooter from "./sections/RoyalFooter";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export interface EmeraldPalaceTemplateProps {
  invitationData: any;
  clientId?: string;
}

export default function EmeraldPalaceTemplate({
  invitationData,
  clientId,
}: EmeraldPalaceTemplateProps) {
  const data: EmeraldPalaceData = mapInvitationConfigToEmeraldPalace(invitationData);

  const isEmbedded = typeof window !== "undefined" && (
    window.self !== window.top ||
    window.location.search.includes("embed=1") ||
    window.location.search.includes("preview=1")
  );

  const [isOpen, setIsOpen] = useState(isEmbedded);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(!isEmbedded);
  const [showFloatingRsvp, setShowFloatingRsvp] = useState(false);

  // Floating RSVP visibility calculation based on scroll progress and RSVP section visibility
  useEffect(() => {
    if (isEmbedded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = totalHeight > 0 ? scrollY / totalHeight : 0;

      // Check if RSVP section is in viewport
      const rsvpEl = document.getElementById("rsvp");
      let isRsvpVisible = false;
      if (rsvpEl) {
        const rect = rsvpEl.getBoundingClientRect();
        isRsvpVisible = rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0;
      }

      if (scrollFraction >= 0.2 && !isRsvpVisible) {
        setShowFloatingRsvp(true);
      } else {
        setShowFloatingRsvp(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEmbedded]);

  const scrollToRsvp = () => {
    emitAnalyticsInteraction("rsvp_open", "rsvp");
    const rsvpEl = document.getElementById("rsvp");
    if (rsvpEl) {
      rsvpEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Automatic opening timer
  useEffect(() => {
    if (isEmbedded) return;

    // Lock body scroll while opening overlay is active
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2800);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [isEmbedded]);

  // Audio Playback
  useEffect(() => {
    if (isEmbedded || !musicEnabled) return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.5;

    const attemptPlay = () => {
      if (audio && musicEnabled && audio.paused) {
        audio
          .play()
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(() => {});
      }
    };

    attemptPlay();

    const handleGesture = () => {
      attemptPlay();
    };

    const events = ["click", "touchstart", "touchend", "pointerdown", "scroll", "keydown"];
    events.forEach((evt) => window.addEventListener(evt, handleGesture, { passive: true }));
    document.addEventListener("click", handleGesture, { passive: true });

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleGesture));
      document.removeEventListener("click", handleGesture);
    };
  }, [musicEnabled, isEmbedded]);

  // Unlock scroll on open
  useEffect(() => {
    if (isOpen) {
      const unlockTimer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 700);

      if (musicEnabled && audioRef.current && audioRef.current.paused && !document.hidden) {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }

      return () => clearTimeout(unlockTimer);
    }
  }, [isOpen, musicEnabled]);

  // Pause audio on tab change
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
          setIsMusicPlaying(false);
        }
      } else {
        if (musicEnabled) {
          audio
            .play()
            .then(() => setIsMusicPlaying(true))
            .catch(() => {});
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [musicEnabled]);

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

  return (
    <EmeraldPalaceProvider data={data}>
      <div className="emerald-palace-template select-none">
        {/* Interactive Wax Seal Opening Envelope */}
        <AnimatePresence>
          {!isOpen && (
            <RoyalOpening onOpen={() => setIsOpen(true)} />
          )}
        </AnimatePresence>

        {/* Continuous Page Wallpaper Background */}
        <div className="ep-page-background" aria-hidden="true" />

        {/* Global Floating Jasmine Petals */}
        <JasminePetals />

        {/* Main Content Layout */}
        <main className="relative z-10 w-full">
          {/* Grand Courtyard Hero */}
          <div data-section-id="hero">
            <EmeraldHero />
          </div>

          <div className="ep-body-container">
            {/* 1. Royal Farman Invocation */}
            {data.sections.showAnnouncement && (
              <div data-section-id="announcement">
                <Invocation />
              </div>
            )}

            {/* 2. Couple Section */}
            {data.sections.showCouple && (
              <div data-section-id="couple">
                <CoupleSection />
              </div>
            )}

            {/* 3. Auspicious Events Itinerary */}
            {data.sections.showEvents && (
              <div data-section-id="events">
                <AuspiciousEvents />
              </div>
            )}

            {/* 4. Live Muhurtham Countdown */}
            {data.sections.showCountdown && (
              <div data-section-id="countdown">
                <RoyalCountdown />
              </div>
            )}

            {/* 5. Family Lineage & Kutumb */}
            {data.sections.showFamily && (
              <div data-section-id="family">
                <FamilyLineage />
              </div>
            )}

            {/* 6. Love Chronicle Story */}
            {data.sections.showStory && (
              <div data-section-id="story">
                <LoveChronicle />
              </div>
            )}

            {/* 7. Royal Photo Gallery */}
            {data.sections.showGallery && (
              <div data-section-id="gallery">
                <RoyalGallery />
              </div>
            )}

            {/* 8. Venue & Concierge */}
            {data.sections.showVenue && (
              <div data-section-id="venue">
                <VenueConcierge />
              </div>
            )}

            {/* 9. Interactive RSVP & Wishes */}
            {data.sections.showRSVP && (
              <div data-section-id="rsvp">
                <RoyalRSVP clientId={clientId} />
              </div>
            )}
          </div>

          {/* 10. Royal Footer */}
          {data.sections.showFooter && (
            <div data-section-id="footer">
              <RoyalFooter />
            </div>
          )}
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
              aria-label="Confirm Attendance"
            >
              <span>💌</span>
              <span>RSVP</span>
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
