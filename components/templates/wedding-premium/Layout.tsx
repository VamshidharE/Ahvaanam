"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useInvitationData } from "../../context/InvitationDataContext";
import { mockData } from "./mockData";
import { GaneshaSymbol, HangingLamp } from "./decorations";

// Import local bespoke sections
import HeroSection from "./sections/Hero";
import CoupleSection from "./sections/Couple";
import CountdownSection from "./sections/Countdown";
import StorySection from "./sections/Story";
import EventsSection from "./sections/Events";
import GallerySection from "./sections/Gallery";
import FamiliesSection from "./sections/Families";
import VenueSection from "./sections/Venue";
import RSVPSection from "./sections/RSVP";
import FooterSection from "./sections/Footer";

// --- TEMPLATE SPECIFIC STYLES ---

// Falling flower petal animation particles
const FallingPetals = () => {
  const petalsCount = 10;
  return (
    <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
      {[...Array(petalsCount)].map((_, i) => {
        const leftVal = `${Math.random() * 100}%`;
        const delayVal = Math.random() * 8;
        const durationVal = 6 + Math.random() * 6;
        
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: 0, rotate: 0, opacity: 0 }}
            animate={{ 
              y: "105vh", 
              x: [0, Math.random() * 60 - 30, 0],
              rotate: [0, 360],
              opacity: [0, 0.7, 0.7, 0]
            }}
            transition={{
              duration: durationVal,
              delay: delayVal,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-br from-[#E6A817]/60 to-[#ffb300]/40"
            style={{ left: leftVal }}
          />
        );
      })}
    </div>
  );
};

// Top Marigold flower garland decor
const TopMarigolds = () => (
  <div className="absolute top-0 left-0 right-0 h-6 pointer-events-none z-20 overflow-hidden flex justify-around items-start pt-0.5 bg-gradient-to-b from-[#e6a817]/15 to-transparent">
    {[...Array(9)].map((_, i) => (
      <div key={i} className="flex flex-col items-center">
        <div className="w-3.5 h-3.5 rounded-full bg-[#ff9800] border border-[#ff5722]/30 shadow-xs" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#ffc107] -mt-1 shadow-xs" />
      </div>
    ))}
  </div>
);

export default function WeddingPremiumLayout({ onBackToHub }: { onBackToHub?: () => void }) {
  const { invitationData } = useInvitationData();
  const [isOpen, setIsOpen] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch SQLite data config or fall back to local mock data
  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const config = isWrapped ? (invitationData as any).config : (invitationData || mockData);

  const groomName = config.couple?.groomName || mockData.couple.groomName;
  const brideName = config.couple?.brideName || mockData.couple.brideName;
  const weddingDate = config.hero?.date || mockData.hero.date;

  useEffect(() => {
    // Automatically trigger the curtain opening sequence after 1.5 seconds on load
    const timer = setTimeout(() => {
      setIsOpen(true);
      // Auto play music on reveal if enabled
      if (config.music?.enabled && config.music?.file && audioRef.current) {
        audioRef.current.play().then(() => {
          setPlayingMusic(true);
        }).catch(() => {});
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [config.music]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlayingMusic(!playingMusic);
  };

  const handleNavigation = (secId: string) => {
    setActiveSection(secId);
    const element = document.getElementById(secId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const dummyBack = onBackToHub || (() => {});

  // Custom visual section wrapper card styling
  const renderCardSection = (sectionId: string, component: React.ReactNode) => {
    if (!component) return null;

    if (sectionId === "hero" || sectionId === "footer") {
      return (
        <div key={sectionId} id={sectionId} className="w-full relative">
          {component}
        </div>
      );
    }

    return (
      <div 
        key={sectionId} 
        id={sectionId} 
        className="border-2 border-[#E6A817]/25 rounded-2xl p-6 mx-4 my-6 bg-[#3A080A]/80 shadow-xl backdrop-blur-md relative z-10 text-left overflow-hidden transition-all duration-300"
      >
        {component}
      </div>
    );
  };

  const navigationSections = ["story", "events", "gallery", "venue", "rsvp"];
  const navLabels: Record<string, string> = {
    story: "Story",
    events: "Program",
    gallery: "Moments",
    venue: "Venue",
    rsvp: "RSVP"
  };

  return (
    <div className="min-h-screen w-full bg-[#050209] flex justify-center items-start overflow-y-auto font-serif">
      {/* Swaying lamps CSS animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes sway-lamp-anim {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        .lamp-sway {
          animation: sway-lamp-anim 2.8s ease-in-out infinite;
          transform-origin: top center;
        }
      `}} />

      {/* Main card viewport */}
      <div 
        className="w-full max-w-[480px] min-h-screen relative flex flex-col shadow-2xl border-x border-white/5 overflow-hidden"
        style={{
          backgroundColor: "#3A080A",
          backgroundImage: "linear-gradient(to bottom, rgba(58, 8, 10, 0.95), rgba(30, 4, 5, 0.98))"
        }}
      >
        {/* Absolute hanging lamps on sides */}
        {isOpen && (
          <>
            <HangingLamp className="lamp-sway absolute top-0 left-3 z-20" />
            <HangingLamp className="lamp-sway absolute top-0 right-3 z-20" style={{ animationDelay: "1.4s" }} />
            <TopMarigolds />
            <FallingPetals />
          </>
        )}

        {/* Scrollable content container */}
        <div className="relative z-10 w-full flex-1 flex flex-col overflow-y-auto scrollbar-none pb-20">
          {config.music?.enabled && config.music?.file && (
            <audio ref={audioRef} loop src={config.music.file} />
          )}

          {/* Golden Stage Curtain Opening Animation */}
          <AnimatePresence>
            {!isOpen && (
              <div className="absolute inset-0 z-50 flex overflow-hidden cursor-pointer select-none">
                {/* Left Curtain Flap */}
                <motion.div 
                  className="w-1/2 h-full border-r border-[#E6A817]/25 relative"
                  exit={{ x: "-100%" }}
                  transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
                  style={{
                    backgroundColor: "#3A080A",
                    backgroundImage: "linear-gradient(to right, #4a0d10, #300608)"
                  }}
                >
                  <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/70 to-transparent pointer-events-none" />
                </motion.div>
                
                {/* Right Curtain Flap */}
                <motion.div 
                  className="w-1/2 h-full border-l border-[#E6A817]/25 relative"
                  exit={{ x: "100%" }}
                  transition={{ duration: 1.3, ease: [0.77, 0, 0.175, 1] }}
                  style={{
                    backgroundColor: "#3A080A",
                    backgroundImage: "linear-gradient(to left, #4a0d10, #300608)"
                  }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/70 to-transparent pointer-events-none" />
                </motion.div>
                
                {/* Center Mandap Crest Badge */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 flex flex-col items-center justify-center p-6 rounded-full border-2 border-[#E6A817] shadow-2xl w-44 h-44 text-center select-none bg-[#3A080A] bg-gradient-to-b from-[#4a0d10] to-[#250305]"
                  exit={{ opacity: 0, scale: 0.6, y: "-50%", x: "-50%" }}
                  transition={{ duration: 0.8 }}
                >
                  <GaneshaSymbol size={50} />
                  <div className="w-10 h-[1px] bg-[#E6A817]/40 my-2" />
                  <span className="text-[#FFF7E6] text-[8px] uppercase tracking-[2.5px] leading-tight font-extrabold">{groomName}<br/>&<br/>{brideName}</span>
                  <span className="text-[#E6A817] text-[6.5px] uppercase tracking-[1px] font-bold mt-1.5">{weddingDate}</span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Dynamic visual sections */}
          {isOpen && (
            <div className="space-y-2 pt-4 relative z-10">
              {renderCardSection("hero", <HeroSection data={config.hero} />)}
              {renderCardSection("couple", <CoupleSection data={config.couple} />)}
              {renderCardSection("countdown", <CountdownSection data={config.countdown} />)}
              {renderCardSection("story", <StorySection data={config.story} />)}
              {renderCardSection("events", <EventsSection data={config.events} />)}
              {renderCardSection("gallery", <GallerySection data={config.gallery} />)}
              {renderCardSection("families", <FamiliesSection data={config.families} />)}
              {renderCardSection("venue", <VenueSection data={config.venue} />)}
              {renderCardSection("rsvp", <RSVPSection data={config.rsvp} />)}
              {renderCardSection("footer", <FooterSection data={config.footer} />)}
            </div>
          )}
        </div>

        {/* Floating Utility actions */}
        <div className="fixed bottom-20 right-6 z-45 flex flex-col gap-4">
          <button
            onClick={dummyBack}
            className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#E6A817] shadow-xl hover:bg-black/80 transition-all cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          {isOpen && config.music?.enabled && (
            <button
              onClick={toggleMusic}
              className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#E6A817] shadow-xl hover:bg-black/80 transition-all cursor-pointer"
              aria-label="Toggle music"
            >
              {playingMusic ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          )}
        </div>

        {/* Bottom Floating Navigation bar */}
        {isOpen && (
          <div 
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 z-30 flex items-center justify-around px-2 shadow-2xl border-t border-[#E6A817]/25 backdrop-blur-md"
            style={{
              backgroundColor: "rgba(58, 8, 10, 0.9)",
            }}
          >
            {navigationSections.map(secId => {
              const isSelected = activeSection === secId;
              return (
                <button
                  key={secId}
                  onClick={() => handleNavigation(secId)}
                  className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] uppercase tracking-[1.5px] transition-all cursor-pointer ${
                    isSelected 
                      ? "text-[#E6A817] font-extrabold scale-105 border-b-2 border-[#E6A817]" 
                      : "text-[#FFF7E6]/50 hover:text-[#FFF7E6]"
                  }`}
                >
                  {navLabels[secId] || secId}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
