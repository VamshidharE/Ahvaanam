"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInvitationData } from "../context/InvitationDataContext";
import { ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getTheme } from "@/lib/theme/registry";
import ThemeProvider from "../theme/ThemeProvider";

// Import reusable section components
import HeroSection from "../sections/hero";
import CoupleSection from "../sections/couple";
import CountdownSection from "../sections/countdown";
import StorySection from "../sections/story";
import EventsSection from "../sections/events";
import GallerySection from "../sections/gallery";
import VenueSection from "../sections/venue";
import FamiliesSection from "../sections/families";
import RSVPSection from "../sections/rsvp";
import FAQSection from "../sections/faq";
import DressCodeSection from "../sections/dressCode";
import FooterSection from "../sections/footer";

// --- CUSTOM DECORATIVE ORNAMENTS FOR ALL THEMES ---

// 1. Swaying Gold Bells (Royal Temple & Muhurtham Curtain)
const SwayingBells = () => (
  <div className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-20 overflow-hidden flex justify-between px-6">
    <svg className="bell-sway w-8 h-20 text-[#E6A817]/85" viewBox="0 0 24 24" fill="none">
      <line x1="12" y1="0" x2="12" y2="12" stroke="#E6A817" strokeWidth="2" />
      <path d="M12 12c-3.3 0-6 2.7-6 6v2h12v-2c0-3.3-2.7-6-6-6z" fill="#E6A817" />
      <circle cx="12" cy="21" r="1.5" fill="#E6A817" />
    </svg>
    <svg className="bell-sway w-8 h-20 text-[#E6A817]/85" viewBox="0 0 24 24" fill="none" style={{ animationDelay: "1.5s" }}>
      <line x1="12" y1="0" x2="12" y2="12" stroke="#E6A817" strokeWidth="2" />
      <path d="M12 12c-3.3 0-6 2.7-6 6v2h12v-2c0-3.3-2.7-6-6-6z" fill="#E6A817" />
      <circle cx="12" cy="21" r="1.5" fill="#E6A817" />
    </svg>
  </div>
);

// 2. Draped Curtains (Muhurtham Curtain)
const DrapedCurtains = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
    {/* Left Curtain */}
    <div 
      className="absolute top-0 left-0 bottom-0 w-10 bg-gradient-to-r from-[#5a080c] via-[#3a0406] to-transparent opacity-95"
      style={{
        borderRight: "2px double #D49E17",
        boxShadow: "4px 0 10px rgba(0,0,0,0.5)"
      }}
    />
    {/* Right Curtain */}
    <div 
      className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-l from-[#5a080c] via-[#3a0406] to-transparent opacity-95"
      style={{
        borderLeft: "2px double #D49E17",
        boxShadow: "-4px 0 10px rgba(0,0,0,0.5)"
      }}
    />
    {/* Top gold bar border */}
    <div 
      className="absolute top-0 left-0 right-0 h-4 bg-[#D49E17]/25 backdrop-blur-xs flex justify-around items-center"
      style={{ borderBottom: "1.5px solid #D49E17" }}
    >
      {[...Array(6)].map((_, i) => (
        <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#D49E17]" />
      ))}
    </div>
  </div>
);

// 3. Traditional South Indian Ornaments (Banana Leaves & Marigolds)
const SouthIndianOrnaments = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
    {/* Left Banana Leaf Frame */}
    <div 
      className="absolute left-0 top-12 bottom-12 w-5 bg-gradient-to-r from-[#1b5e20]/85 to-transparent flex flex-col justify-around py-4 pl-0.5"
      style={{ borderRight: "1px dashed rgba(242, 187, 22, 0.25)" }}
    >
      {[...Array(12)].map((_, i) => (
        <div key={i} className="w-3.5 h-[1.5px] bg-[#4caf50]/40 rotate-12" />
      ))}
    </div>
    {/* Right Banana Leaf Frame */}
    <div 
      className="absolute right-0 top-12 bottom-12 w-5 bg-gradient-to-l from-[#1b5e20]/85 to-transparent flex flex-col justify-around py-4 pr-0.5"
      style={{ borderLeft: "1px dashed rgba(242, 187, 22, 0.25)" }}
    >
      {[...Array(12)].map((_, i) => (
        <div key={i} className="w-3.5 h-[1.5px] bg-[#4caf50]/40 -rotate-12" />
      ))}
    </div>
    {/* Top Marigold Garlands */}
    <div className="absolute top-0 left-0 right-0 h-7 flex justify-around items-start pt-1 bg-gradient-to-b from-[#ff9800]/10 to-transparent">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-3.5 h-3.5 rounded-full bg-[#ff9800] border border-[#ff5722]/30 shadow-xs" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffc107] -mt-1 shadow-xs" />
        </div>
      ))}
    </div>
  </div>
);

// 4. Peacock Accents (Peacock & Royal)
const PeacockOrnaments = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
    {/* Left Peacock Eye */}
    <div className="absolute top-6 left-3 w-10 h-10 rounded-full border border-[#E2AD19]/35 bg-[#051D24]/90 flex items-center justify-center shadow-lg">
      <div className="w-7 h-7 rounded-full bg-[#00838f] flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-[#0d47a1]" />
      </div>
    </div>
    {/* Right Peacock Eye */}
    <div className="absolute top-6 right-3 w-10 h-10 rounded-full border border-[#E2AD19]/35 bg-[#051D24]/90 flex items-center justify-center shadow-lg">
      <div className="w-7 h-7 rounded-full bg-[#00838f] flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-[#0d47a1]" />
      </div>
    </div>
  </div>
);

// 5. Marigold Elephant Silhouettes (Marigold Celebration)
const MarigoldOrnaments = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
    {/* Hanging marigolds from top */}
    <div className="absolute top-0 left-0 right-0 h-8 flex justify-between px-8 bg-gradient-to-b from-[#e27d16]/10 to-transparent">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-[1.5px] h-5 bg-[#ffc107]/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff9800] -mt-1" />
          <div className="w-2 h-2 rounded-full bg-[#ffc107] -mt-0.5" />
        </div>
      ))}
    </div>
    {/* Left Elephant Silhouette at bottom */}
    <div className="absolute bottom-20 left-3 w-14 h-10 opacity-70 text-[#E27D16]/30">
      <svg viewBox="0 0 100 80" fill="currentColor">
        <path d="M10 50c5-5 15-5 20-5s10 5 15 5 10-10 15-5 5 15 10 10 5-15 10-5c5 10 0 20-5 25H10V50z" />
        <circle cx="20" cy="40" r="2" fill="white" />
      </svg>
    </div>
    {/* Right Elephant Silhouette at bottom */}
    <div className="absolute bottom-20 right-3 w-14 h-10 opacity-70 text-[#E27D16]/30 scale-x-[-1]">
      <svg viewBox="0 0 100 80" fill="currentColor">
        <path d="M10 50c5-5 15-5 20-5s10 5 15 5 10-10 15-5 5 15 10 10 5-15 10-5c5 10 0 20-5 25H10V50z" />
        <circle cx="20" cy="40" r="2" fill="white" />
      </svg>
    </div>
  </div>
);

// 6. Lotus Accents (Lotus & Pastel / Lotus Pond)
const LotusOrnaments = () => (
  <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
    {/* Left Lotus bottom corner */}
    <div className="absolute bottom-20 left-2 w-10 h-10 text-[#D96C75]/25 opacity-70">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C11.5 6 8 8 8 12c0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-3.5-6-4-10z" />
        <path d="M12 6c-3 3-5 5-5 8 0 2.8 2.2 5 5 5s5-2.2 5-5c0-3-2-5-5-8z" opacity="0.6" />
      </svg>
    </div>
    {/* Right Lotus bottom corner */}
    <div className="absolute bottom-20 right-2 w-10 h-10 text-[#D96C75]/25 opacity-70">
      <svg viewBox="0 0 24 24" fill="currentColor" className="scale-x-[-1]">
        <path d="M12 2C11.5 6 8 8 8 12c0 2.2 1.8 4 4 4s4-1.8 4-4c0-4-3.5-6-4-10z" />
        <path d="M12 6c-3 3-5 5-5 8 0 2.8 2.2 5 5 5s5-2.2 5-5c0-3-2-5-5-8z" opacity="0.6" />
      </svg>
    </div>
  </div>
);

interface LegacyOrchestratorProps {
  themeId: string;
  onBackToHub: () => void;
  particlesComponent?: React.ComponentType<any>;
  themeBgClass?: string;
  loadingTitle?: string;
  loadingSubtitle?: string;
}

export default function LegacyOrchestrator({
  themeId,
  onBackToHub,
  particlesComponent: Particles,
  themeBgClass = "bg-stone-900",
  loadingTitle = "Invitation",
  loadingSubtitle = "Celebrating Love"
}: LegacyOrchestratorProps) {
  const { invitationData } = useInvitationData();
  const [loading, setLoading] = useState(true);
  const [playingMusic, setPlayingMusic] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const theme = getTheme(themeId);

  useEffect(() => {
    if (invitationData) {
      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [invitationData]);

  if (!invitationData) return null;

  const isWrapped = invitationData && "category" in invitationData && "config" in invitationData;
  const invitation = isWrapped ? (invitationData as any).config : invitationData;

  const groomName = invitation.couple?.groomName || "Karthik";
  const brideName = invitation.couple?.brideName || "Anusha";
  const coupleNames = `${groomName} & ${brideName}`;
  const weddingDate = invitation.events?.[0]?.date || "24.07.2026";

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (playingMusic) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setPlayingMusic(!playingMusic);
  };

  const handleOpenInvitation = () => {
    setIsOpen(true);
    if (invitation.music?.enabled && audioRef.current && !document.hidden) {
      audioRef.current.play().then(() => {
        setPlayingMusic(true);
      }).catch(() => {});
    }
  };

  // Pause audio when tab is minimized or switched to another app, and resume when returning
  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = audioRef.current;
      if (!audio) return;

      if (document.hidden) {
        if (!audio.paused) {
          audio.pause();
          setPlayingMusic(false);
        }
      } else {
        if (isOpen && invitation.music?.enabled) {
          audio
            .play()
            .then(() => setPlayingMusic(true))
            .catch(() => {});
        }
      }
    };

    const handlePageHide = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.pause();
        setPlayingMusic(false);
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
  }, [isOpen, invitation?.music?.enabled]);

  const handleNavigation = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const sectionOrder = invitation.sectionOrder || [];

  const renderSectionComponent = (sectionId: string) => {
    const sectionConfig = invitation[sectionId];
    const isEnabled = sectionConfig?.enabled !== false;
    if (!isEnabled) return null;

    const properties = sectionConfig || {};
    const bindings = sectionConfig || {};

    switch (sectionId) {
      case "hero":
        return (
          <HeroSection
            key={sectionId}
            properties={properties}
            bindings={bindings}
            themeId={themeId}
            layoutId="hero-center"
            motionId="luxury-motion"
          />
        );
      case "couple":
        return <CoupleSection key={sectionId} properties={properties} bindings={bindings} />;
      case "countdown":
        return <CountdownSection key={sectionId} properties={properties} bindings={bindings} />;
      case "story":
        return <StorySection key={sectionId} properties={properties} bindings={bindings} />;
      case "events":
        return <EventsSection key={sectionId} properties={properties} bindings={bindings} />;
      case "gallery":
        return <GallerySection key={sectionId} properties={properties} bindings={bindings} />;
      case "venue":
        return <VenueSection key={sectionId} properties={properties} bindings={bindings} />;
      case "families":
        return <FamiliesSection key={sectionId} properties={properties} bindings={bindings} />;
      case "rsvp":
        return <RSVPSection key={sectionId} properties={properties} bindings={bindings} />;
      case "faq":
        return <FAQSection key={sectionId} properties={properties} bindings={bindings} />;
      case "dressCode":
        return <DressCodeSection key={sectionId} properties={properties} bindings={bindings} />;
      case "footer":
        return <FooterSection key={sectionId} properties={properties} bindings={bindings} />;
      default:
        return null;
    }
  };

  const renderSectionWithThemeCard = (sectionId: string) => {
    const component = renderSectionComponent(sectionId);
    if (!component) return null;

    if (sectionId === "hero" || sectionId === "footer") {
      return (
        <div key={sectionId} id={sectionId} className="w-full">
          {component}
        </div>
      );
    }

    let cardWrapperClass = "p-6 mx-4 my-6 backdrop-blur-xs relative overflow-hidden transition-all duration-300 z-10";
    let cardStyle: React.CSSProperties = {
      backgroundColor: "var(--theme-card-bg)",
      borderColor: "var(--theme-border)",
      color: "var(--theme-text)",
      fontFamily: "var(--theme-font-body)",
    };

    if (themeId === "royal-temple" || themeId === "peacock" || themeId === "grand-mandap") {
      cardWrapperClass += " border-2 rounded-2xl shadow-xl";
    } else if (themeId === "floral-garden" || themeId === "palace-luxury" || themeId === "lotus-serenity") {
      cardWrapperClass += " border rounded-[28px] shadow-sm";
    } else {
      cardWrapperClass += " border rounded-xl shadow-md";
    }

    return (
      <div key={sectionId} id={sectionId} className={cardWrapperClass} style={cardStyle}>
        {component}
      </div>
    );
  };

  const renderThemeOrnaments = () => {
    if (!isOpen) return null;
    switch (themeId) {
      case "royal-temple":
        return <SwayingBells />;
      case "grand-mandap":
        return (
          <>
            <DrapedCurtains />
            <SwayingBells />
          </>
        );
      case "south-indian":
        return <SouthIndianOrnaments />;
      case "peacock":
        return <PeacockOrnaments />;
      case "marigold":
        return <MarigoldOrnaments />;
      case "lotus-serenity":
      case "moonlight":
        return <LotusOrnaments />;
      default:
        return null;
    }
  };

  const renderIntroOverlay = () => {
    if (isOpen) return null;

    const transitionSpec = { duration: 1.2, ease: [0.77, 0, 0.175, 1] as const };

    switch (theme.openingEffect) {
      case "gate-fold":
        return (
          <div className="absolute inset-0 z-50 flex overflow-hidden cursor-pointer select-none" onClick={handleOpenInvitation}>
            <motion.div 
              className="w-1/2 h-full border-r border-[#E6A817]/25 relative"
              exit={{ x: "-100%" }}
              transition={transitionSpec}
              style={{
                backgroundImage: `url(${theme.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "left center",
                backgroundColor: theme.colors.background
              }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black/60 to-transparent pointer-events-none" />
            </motion.div>
            <motion.div 
              className="w-1/2 h-full border-l border-[#E6A817]/25 relative"
              exit={{ x: "100%" }}
              transition={transitionSpec}
              style={{
                backgroundImage: `url(${theme.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "right center",
                backgroundColor: theme.colors.background
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
            </motion.div>
            
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-55 flex flex-col items-center justify-center p-6 rounded-full border-2 border-[#E6A817] shadow-2xl w-44 h-44 text-center select-none"
              style={{ backgroundColor: theme.colors.background }}
              exit={{ opacity: 0, scale: 0.6, y: "-50%", x: "-50%" }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-[#E6A817] font-semibold text-2xl tracking-[2px] font-serif leading-none">K&A</span>
              <div className="w-10 h-[1px] bg-[#E6A817]/40 my-2" />
              <span className="text-[#FFF7E6] text-[8px] uppercase tracking-[2px] leading-tight font-medium">Sacred Union<br/>Invitation</span>
              <button className="mt-3 px-4 py-1.5 bg-[#E6A817] text-[#3A080A] text-[8px] font-extrabold uppercase tracking-[1px] rounded-full animate-pulse shadow-md">Open</button>
            </motion.div>
          </div>
        );

      case "envelope-unfold":
        return (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-6 cursor-pointer select-none" style={{ backgroundColor: theme.colors.background }} onClick={handleOpenInvitation}>
            <motion.div 
              className="w-full aspect-[4/3] rounded-2xl shadow-2xl relative flex flex-col items-center justify-center p-6 border overflow-hidden"
              style={{
                backgroundImage: `url(${theme.backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.cardBg
              }}
              exit={{ y: "100vh", opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] as const }}
            >
              <div className="absolute inset-0 bg-black/10 z-0 pointer-events-none" />
              <div className="relative z-10 text-center space-y-3 p-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <span className="text-[9px] uppercase tracking-[3px] font-bold" style={{ color: theme.colors.accent }}>Wedding Invitation</span>
                <h3 className="text-2xl font-bold leading-none font-serif" style={{ color: theme.colors.text }}>{coupleNames}</h3>
                <p className="text-[8px] uppercase tracking-[1.5px]" style={{ color: theme.colors.secondaryText }}>Save The Date • {weddingDate}</p>
                <div className="inline-block px-5 py-1.5 text-[8px] font-bold uppercase tracking-[2px] rounded-full shadow-md" style={{ backgroundColor: theme.colors.accent, color: "#FFFFFF" }}>Open Card</div>
              </div>
            </motion.div>
          </div>
        );

      case "scroll-roll":
        return (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden select-none" style={{ backgroundColor: theme.colors.background }} onClick={handleOpenInvitation}>
            <motion.div 
              className="flex flex-col items-center justify-center relative"
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            >
              <div className="w-52 h-4 bg-[#F2BB16] rounded-full shadow-md border-b border-black/20" />
              <div 
                className="w-48 h-36 border-x-2 border-[#F2BB16] flex flex-col items-center justify-center p-4 shadow-2xl relative"
                style={{
                  backgroundImage: `url(${theme.backgroundImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: theme.colors.cardBg
                }}
              >
                <div className="absolute inset-0 bg-[#FFFDF2]/65 z-0" />
                <div className="relative z-10 flex flex-col items-center text-center">
                  <span className="text-[8px] uppercase tracking-[3.5px] font-extrabold text-[#5C061F]">Royal Scroll</span>
                  <div className="w-12 h-[1.5px] bg-[#5C061F]/30 my-2" />
                  <span className="text-[7px] uppercase tracking-[1px] text-[#5C061F]/60 font-semibold mb-3">Click to Unroll Card</span>
                  <div className="px-3.5 py-1 bg-[#5C061F] text-white text-[7px] font-bold uppercase tracking-[1px] rounded-md shadow-sm">Unroll</div>
                </div>
              </div>
              <div className="w-52 h-4 bg-[#F2BB16] rounded-full shadow-md border-t border-black/20" />
            </motion.div>
          </div>
        );

      case "fade-reveal":
      default:
        return (
          <motion.div 
            className="absolute inset-0 z-50 flex flex-col items-center justify-center p-8 cursor-pointer select-none"
            style={{
              backgroundImage: `url(${theme.backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: theme.colors.background
            }}
            exit={{ opacity: 0, y: "-20px" }}
            transition={{ duration: 0.8 }}
            onClick={handleOpenInvitation}
          >
            <div className="absolute inset-0 bg-black/15 z-0 pointer-events-none" />
            <div className="relative z-10 text-center space-y-4 max-w-xs p-8 rounded-3xl bg-black/35 border border-white/10 backdrop-blur-md text-white">
              <span className="text-[8px] uppercase tracking-[3px] font-bold text-white/60">Invitation Cover</span>
              <h2 className="text-3xl font-extrabold tracking-[1px] leading-tight font-serif">{groomName}<br/>&<br/>{brideName}</h2>
              <div className="w-8 h-[1px] bg-white/20 mx-auto" />
              <p className="text-[8px] uppercase tracking-[1.5px] text-white/50">{weddingDate}</p>
              <button className="px-6 py-2 text-[8px] font-extrabold uppercase tracking-[1px] rounded-full mt-4 shadow-md" style={{ backgroundColor: theme.colors.accent, color: "#FFFFFF" }}>Enter</button>
            </div>
          </motion.div>
        );
    }
  };

  const renderBottomNavigation = () => {
    if (!isOpen) return null;

    const navSections = (sectionOrder as string[]).filter((id: string) => ["story", "events", "gallery", "venue", "rsvp"].includes(id));
    if (navSections.length === 0) return null;

    const navLabels: Record<string, string> = {
      story: "Story",
      events: "Program",
      gallery: "Moments",
      venue: "Venue",
      rsvp: "RSVP"
    };

    let navContainerClass = "fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-16 z-30 flex items-center justify-around px-2 shadow-2xl border-t transition-all duration-300";
    let navStyle: React.CSSProperties = {
      backgroundColor: "var(--theme-card-bg)",
      borderColor: "var(--theme-border)",
      backdropFilter: "blur(8px)",
      WebkitBackdropFilter: "blur(8px)"
    };

    const getBtnClass = (secId: string) => {
      const isSelected = activeSection === secId;
      if (themeId === "royal-temple" || themeId === "peacock" || themeId === "grand-mandap") {
        return isSelected 
          ? "text-[#E6A817] font-bold scale-105 border-b-2 border-[#E6A817]" 
          : "text-[#FFF7E6]/50 hover:text-[#FFF7E6]";
      }
      if (themeId === "floral-garden" || themeId === "palace-luxury" || themeId === "lotus-serenity") {
        return isSelected 
          ? "text-[#D68C7A] font-extrabold scale-105 bg-[#D68C7A]/10 px-3 py-1 rounded-full" 
          : "text-[#2F4A3E]/60 hover:text-[#2F4A3E]";
      }
      return isSelected 
        ? "text-[#E27D16] font-bold scale-105 border-b-2 border-[#E27D16]" 
        : "text-[#5C3E0E]/50 hover:text-[#5C3E0E]";
    };

    return (
      <div className={navContainerClass} style={navStyle}>
        {navSections.map(secId => (
          <button
            key={secId}
            onClick={() => handleNavigation(secId)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[9px] uppercase tracking-[1.5px] transition-all cursor-pointer font-serif ${getBtnClass(secId)}`}
          >
            {navLabels[secId] || secId}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#050209] flex justify-center items-start">
      <ThemeProvider themeId={themeId} />
      
      {/* Swaying bells keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bell-sway-anim {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
        .bell-sway {
          animation: bell-sway-anim 2.5s ease-in-out infinite;
          transform-origin: top center;
        }
      `}} />
      
      <div 
        className="w-full max-w-[480px] min-h-screen relative flex flex-col shadow-2xl border-x border-white/5"
        style={{
          backgroundImage: "var(--theme-bg-image)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundColor: "var(--theme-bg)"
        }}
      >
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: "var(--theme-gradient-backdrop)"
          }}
        />

        {/* Custom theme ornaments (curtains, banana leaves, elephants, peacocks, bells) */}
        {renderThemeOrnaments()}

        <div className="relative z-10 w-full flex-1 flex flex-col pb-20">
          {invitation.music?.enabled && invitation.music?.file && (
            <audio ref={audioRef} loop src={invitation.music.file} />
          )}

          {/* Loading overlay */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-[#FFFDF5] flex flex-col items-center justify-center text-center p-6"
              >
                <h2 className="text-[#FF8800] text-xs uppercase tracking-[4px] mb-1 font-bold">{loadingTitle}</h2>
                <p className="text-amber-900/40 text-xs font-semibold">{loadingSubtitle}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Card Opening Overlay */}
          <AnimatePresence>
            {renderIntroOverlay()}
          </AnimatePresence>

          {/* Particles canvas overlay */}
          {isOpen && invitation.themeSettings?.showParticles && Particles && <Particles />}

          {/* Floating utility buttons */}
          <div className="fixed bottom-20 right-6 z-45 flex flex-col gap-4">
            <button
              onClick={onBackToHub}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-white/20 transition-all cursor-pointer"
              aria-label="Go back"
            >
              <ArrowLeft size={18} />
            </button>
            {isOpen && invitation.music?.enabled && (
              <button
                onClick={toggleMusic}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg hover:bg-white/20 transition-all cursor-pointer"
                aria-label="Toggle music"
              >
                {playingMusic ? <Volume2 size={18} /> : <VolumeX size={18} />}
              </button>
            )}
          </div>

          {/* Dynamic sections container - only render items when invitation is opened */}
          {isOpen && (
            <div className="space-y-4 pt-4 relative z-10">
              {sectionOrder.map((sectionId: string) => renderSectionWithThemeCard(sectionId))}
            </div>
          )}
        </div>
        
        {/* Dynamic bottom navigation menu matching the card design */}
        {renderBottomNavigation()}
      </div>
    </div>
  );
}