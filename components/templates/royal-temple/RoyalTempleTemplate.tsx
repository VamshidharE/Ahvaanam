"use client";

import React, { useState, useEffect, useRef } from "react";
import "./styles/royal-temple.css";
import { TemplateRenderProps } from "@/lib/template-engine/types";
import TempleGateOpening from "./hero/TempleGateOpening";
import RoyalTempleHero from "./hero/RoyalTempleHero";
import Announcement from "./sections/Announcement";
import Couple from "./sections/Couple";
import Family from "./sections/Family";
import Events from "./sections/Events";
import Story from "./sections/Story";
import Gallery from "./sections/Gallery";
import Venue from "./sections/Venue";
import Countdown from "./sections/Countdown";
import RSVP from "./sections/RSVP";
import Footer from "./sections/Footer";
import { Volume2, VolumeX, MessageCircle } from "lucide-react";

export default function RoyalTempleTemplate({ data, clientId }: TemplateRenderProps) {
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio setup
  const musicUrl = data.music.themeMusic || "/wedding/rose-mandap/theme-music.MP3";

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio(musicUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [musicUrl]);

  const handleOpenInvitation = () => {
    setIsOpened(true);
    if (audioRef.current && data.music.enabled !== false) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay may be blocked by browser policy
      });
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
    }
  };

  // Section mapping
  const sectionMap: Record<string, React.ReactNode> = {
    hero: <RoyalTempleHero key="hero" data={data} />,
    announcement: <Announcement key="announcement" data={data} />,
    couple: <Couple key="couple" data={data} />,
    story: <Story key="story" data={data} />,
    countdown: <Countdown key="countdown" data={data} />,
    events: <Events key="events" data={data} />,
    gallery: <Gallery key="gallery" data={data} />,
    families: <Family key="families" data={data} />,
    venue: <Venue key="venue" data={data} />,
    rsvp: <RSVP key="rsvp" data={data} clientId={clientId} />,
    footer: <Footer key="footer" data={data} />,
  };

  const activeSectionOrder = data.sectionOrder && data.sectionOrder.length > 0
    ? data.sectionOrder
    : ["hero", "announcement", "couple", "countdown", "story", "events", "gallery", "venue", "families", "rsvp", "footer"];

  return (
    <main className="rt-page relative">
      {/* 1. Temple Gate Opening Reveal */}
      <TempleGateOpening
        isOpen={isOpened}
        onOpen={handleOpenInvitation}
        mantra={data.introduction.mantra}
        groomName={data.couple.groom.name}
        brideName={data.couple.bride.name}
        weddingDate={data.wedding.date}
      />

      {/* 2. Floating Ambient Sound Toggle */}
      {data.music.enabled !== false && (
        <button
          onClick={toggleMusic}
          aria-label="Toggle Soundtrack"
          className="fixed top-5 right-5 z-[9000] p-3 rounded-full bg-[#68121A]/90 text-[#FFF8EB] border border-[#C59B27] shadow-xl hover:scale-110 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? <Volume2 size={16} className="text-[#E8C15A]" /> : <VolumeX size={16} />}
        </button>
      )}

      {/* 3. Floating Quick RSVP button (if scrolling down) */}
      {data.rsvp.enabled && (
        <a
          href="#rsvp-section"
          aria-label="Jump to RSVP"
          className="fixed bottom-5 right-5 z-[9000] px-4 py-2.5 rounded-full bg-gradient-to-r from-[#C59B27] to-[#8C6B12] text-white text-[10px] font-bold uppercase tracking-[1.5px] border border-white/40 shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform"
        >
          <MessageCircle size={14} /> RSVP
        </a>
      )}

      {/* 4. Ordered Autonomous Sections */}
      <div className="w-full flex flex-col">
        {activeSectionOrder.map((sectionId) => {
          if (sectionId === "hero") return <RoyalTempleHero key="hero" data={data} />;
          if (sectionId === "rsvp") {
            return (
              <div key="rsvp" id="rsvp-section">
                <RSVP data={data} clientId={clientId} />
              </div>
            );
          }
          return sectionMap[sectionId] || null;
        })}
      </div>
    </main>
  );
}
