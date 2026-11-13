"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/emerald-palace.css";
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

  const [isOpen, setIsOpen] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  // Floating RSVP visibility calculation based on scroll progress
  useEffect(() => {
    if (isEmbedded) return;

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollFraction = totalHeight > 0 ? scrollY / totalHeight : 0;

      const rsvpEl = document.getElementById("rsvp");
      let isRsvpVisible = false;
      if (rsvpEl) {
        const rect = rsvpEl.getBoundingClientRect();
        isRsvpVisible = rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0;
      }

      if (scrollFraction >= 0.15 && !isRsvpVisible) {
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
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }
    };

    attemptPlay();

    const handleGesture = () => attemptPlay();
    const events = ["click", "touchstart", "touchend", "pointerdown", "scroll", "keydown"];
    events.forEach((evt) => window.addEventListener(evt, handleGesture, { passive: true }));
    document.addEventListener("click", handleGesture, { passive: true });

    return () => {
      events.forEach((evt) => window.removeEventListener(evt, handleGesture));
      document.removeEventListener("click", handleGesture);
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

  return (
    <EmeraldPalaceProvider data={data}>
      <div className="emerald-palace-template relative select-none min-h-screen bg-[#FFF6E9] text-[#542D2A]">
        {/* Interactive Wax Seal Opening Envelope (skips if embedded in editor) */}
        <AnimatePresence>
          {!isOpen && (
            <RoyalOpening onOpen={() => setIsOpen(true)} />
          )}
        </AnimatePresence>

        {/* Global Floating Jasmine & Rose Petals */}
        <JasminePetals />

        {/* Fixed Top Navigation Bar */}
        <EmeraldNav />

        {/* Main Content Layout */}
        <main className="relative z-10 w-full overflow-hidden">
          {/* A. Hero Section – Cinematic Temple Experience */}
          <div data-section-id="hero">
            <EmeraldHero />
          </div>

          {/* B. Family Blessings – Restored Heritage Invitation */}
          {data.sections.showFamily !== false && (
            <div data-section-id="family">
              <FamilyBlessings />
            </div>
          )}

          {/* C. Couple Introduction – Sacred Union */}
          {data.sections.showCouple && (
            <div data-section-id="couple">
              <CoupleSection />
            </div>
          )}

          {/* D. Wedding Celebrations (4 Ornamental Event Cards with Map Preview & Directions) */}
          {data.sections.showEvents && (
            <div data-section-id="events">
              <AuspiciousEvents />
            </div>
          )}

          {/* E. Wedding Film – Cinematic Highlights */}
          {data.video?.enabled !== false && (
            <div data-section-id="film">
              <WeddingFilm />
            </div>
          )}

          {/* G. Our Moments – Interactive Photographic Gallery */}
          {data.sections.showGallery && (
            <div data-section-id="gallery">
              <RoyalGallery />
            </div>
          )}

          {/* H. Countdown and RSVP */}
          {(data.sections.showRSVP !== false || data.sections.showCountdown !== false) && (
            <div data-section-id="rsvp">
              <CountdownAndRsvp clientId={clientId} />
            </div>
          )}

          {/* I. Compact Footer */}
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
