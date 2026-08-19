"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./styles/rose-mandap.css";
import { mapInvitationConfigToRoseMandap, RoseMandapData } from "./adapter";
import { RoseMandapProvider } from "./context";

import FallingPetals from "./hero/FallingPetals";
import WeddingHero from "./hero/WeddingHero";
import WeddingAnnouncement from "./sections/WeddingAnnouncement";
import Family from "./sections/Family";
import Gallery from "./sections/Gallery";
import Events from "./sections/Events";
import Procession from "./sections/Procession";
import Venue from "./sections/Venue";
import Countdown from "./sections/Countdown";
import RSVP from "./sections/RSVP";
import Footer from "./sections/Footer";

export interface RoseMandapTemplateProps {
  invitationData: any;
  clientId?: string;
}

export default function RoseMandapTemplate({
  invitationData,
  clientId,
}: RoseMandapTemplateProps) {
  const data: RoseMandapData = mapInvitationConfigToRoseMandap(invitationData);

  const [isOpen, setIsOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Automatic invitation opening timer
  useEffect(() => {
    // Lock body scroll while opening overlay is active
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2200);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, []);

  // Auto-play theme music on page mount, during opening, and on any early user gesture
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.55;

    const attemptPlay = () => {
      if (audio && musicEnabled && audio.paused) {
        audio
          .play()
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch(() => {
            // Will trigger on user interaction if browser enforces autoplay restrictions
          });
      }
    };

    // 1. Immediate attempt on mount
    attemptPlay();

    // 2. Register gesture listeners to start audio on first touch, click, pointerdown, or scroll
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
  }, [musicEnabled]);

  // Unlock scroll and ensure music is playing when opening transition completes
  useEffect(() => {
    if (isOpen) {
      const unlockTimer = setTimeout(() => {
        document.body.style.overflow = "";
      }, 800);

      if (musicEnabled && audioRef.current && audioRef.current.paused && !document.hidden) {
        audioRef.current
          .play()
          .then(() => setIsMusicPlaying(true))
          .catch(() => {});
      }

      return () => clearTimeout(unlockTimer);
    }
  }, [isOpen, musicEnabled]);

  // Pause audio when tab is minimized or switched to another app, and resume when returning
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

    const handlePageHide = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        setIsMusicPlaying(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("focus", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("focus", handleVisibilityChange);
    };
  }, [musicEnabled]);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
      setMusicEnabled(false);
    } else {
      audio.volume = 0.55;
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          setMusicEnabled(true);
        })
        .catch(() => {});
    }
  };

  return (
    <RoseMandapProvider data={data}>
      <div className="wedding-page rose-mandap-template select-none">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              className="invitation-overlay"
              initial={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0.85, ease: [0.4, 0, 0.2, 1] },
              }}
            >
              <motion.div
                className="overlay-envelope"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 1.05,
                  filter: "blur(6px)",
                  transition: { duration: 0.7, ease: [0.4, 0, 0.2, 1] },
                }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Corner Accents */}
                <div className="overlay-corner overlay-corner-tl" aria-hidden="true" />
                <div className="overlay-corner overlay-corner-tr" aria-hidden="true" />
                <div className="overlay-corner overlay-corner-bl" aria-hidden="true" />
                <div className="overlay-corner overlay-corner-br" aria-hidden="true" />

                {/* 1. Ganesha Reveal */}
                <motion.div
                  className="overlay-ganesha-wrap"
                  initial={{ opacity: 0, scale: 0.88, filter: "blur(6px)", y: -6 }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src="/wedding/ganesha/Ganesha.png"
                    alt="Ganesha"
                    className="overlay-ganesha"
                  />
                </motion.div>

                {/* 2. Mantra Reveal */}
                <motion.p
                  className="overlay-mantra wedding-devanagari"
                  initial={{ opacity: 0, filter: "blur(4px)", y: 4 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.65, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {data.introduction.mantra}
                </motion.p>

                {/* 3. Invitation Line */}
                <motion.p
                  className="overlay-eyebrow"
                  initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.65, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {data.introduction.eyebrow}
                </motion.p>

                {/* 4. Couple Names */}
                <motion.h1
                  className="overlay-names"
                  initial={{ opacity: 0, scale: 0.94, filter: "blur(8px)", y: 8 }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.8, delay: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  {data.couple.groom} &amp; {data.couple.bride}
                </motion.h1>

                {/* 5. Date & Gold Rule */}
                <motion.div
                  className="overlay-footer-details"
                  initial={{ opacity: 0, filter: "blur(4px)", y: 6 }}
                  animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                  transition={{ duration: 0.65, delay: 0.95, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    className="overlay-rule"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.7, delay: 1.05, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <p className="overlay-date">{data.wedding.date}</p>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* One continuous background for the entire invitation */}
        <div className="wedding-page-background" aria-hidden="true">
          <img src="/wedding/background/bg.png" alt="" />
        </div>

        {/* Petals belong to the page, not the viewport */}
        <div className="wedding-page-petals" aria-hidden="true">
          <FallingPetals />
        </div>

        <div className="wedding-page-content">
          <WeddingHero />

          <main className="invitation-body">
            {/* Scroll Indicator at the transition boundary */}
            {(data.sections.showAnnouncement ||
              data.sections.showEvents ||
              data.sections.showProcession ||
              data.sections.showFamily ||
              data.sections.showGallery ||
              data.sections.showVenue ||
              data.sections.showCountdown ||
              data.sections.showRSVP) && (
              <div className="body-scroll-indicator" aria-hidden="true">
                <span className="body-scroll-text">Scroll</span>
                <span className="body-scroll-line" />
              </div>
            )}

            {data.sections.showAnnouncement && <WeddingAnnouncement />}
            {data.sections.showEvents && <Events />}
            {data.sections.showProcession && <Procession />}
            {data.sections.showFamily && <Family />}
            {data.sections.showGallery && <Gallery />}
            {data.sections.showVenue && <Venue />}
            {data.sections.showCountdown && <Countdown />}
            {data.sections.showRSVP && <RSVP clientId={clientId} />}
          </main>

          {data.sections.showFooter && <Footer />}
        </div>

        {/* Background Theme Music Audio */}
        <audio
          ref={audioRef}
          src={data.music?.themeMusic || "/theme-music.MP3"}
          loop
          preload="auto"
        />

        {/* Floating Music Enable/Disable Button */}
        <motion.button
          className={`floating-music-btn ${isMusicPlaying ? "playing" : "muted"}`}
          onClick={toggleMusic}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          aria-label={isMusicPlaying ? "Mute Background Music" : "Play Background Music"}
          title={isMusicPlaying ? "Mute Background Music" : "Play Background Music"}
        >
          <span className="music-icon-symbol">
            {isMusicPlaying ? "🎵" : "🔇"}
          </span>
          {isMusicPlaying && (
            <span className="music-pulse-ring" aria-hidden="true" />
          )}
        </motion.button>
      </div>
    </RoseMandapProvider>
  );
}
