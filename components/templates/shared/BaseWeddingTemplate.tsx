"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Music, Volume2, VolumeX, MapPin, Calendar, Clock, Heart,
  Users, Camera, ChevronDown, ExternalLink, MessageCircle
} from "lucide-react";
import { getTheme, type ThemeTokens } from "@/lib/theme/registry";
import { mapInvitationToWeddingData, type WeddingTemplateData } from "./adapter";
import RsvpSubmissionForm from "@/components/rsvp/RsvpSubmissionForm";

/* ─────────────────────────────────────────────
   Base Wedding Template — Token-Driven
   Works for ALL themes except rose-mandap
   ───────────────────────────────────────────── */

export interface BaseWeddingTemplateProps {
  invitationData: any;
  clientId?: string;
}

export default function BaseWeddingTemplate({ invitationData, clientId }: BaseWeddingTemplateProps) {
  const data = mapInvitationToWeddingData(invitationData);
  const theme = getTheme(data.themeId);
  const shouldReduceMotion = useReducedMotion();

  const [isPlaying, setIsPlaying] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if in iframe/preview
  useEffect(() => {
    if (typeof window !== "undefined") {
      const inIframe = window.self !== window.top;
      const params = new URLSearchParams(window.location.search);
      if (inIframe || params.get("embed") === "1" || params.get("preview") === "1") {
        setIsPreview(true);
        setOverlayVisible(false);
      }
    }
  }, []);

  // Open envelope
  const handleOpenInvitation = () => {
    setOverlayVisible(false);
    // Attempt autoplay
    if (audioRef.current && data.music.themeMusic) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  // CSS variables from theme tokens
  const cssVars = {
    "--t-bg": theme.colors.background,
    "--t-text": theme.colors.text,
    "--t-accent": theme.colors.accent,
    "--t-border": theme.colors.border,
    "--t-secondary": theme.colors.secondaryText,
    "--t-card": theme.colors.cardBg,
    "--t-radius": theme.radius.card,
    "--t-btn-radius": theme.radius.button,
    "--t-shadow": theme.shadows.card,
    "--t-btn-shadow": theme.shadows.button,
    "--t-heading": theme.typography.fontHeading,
    "--t-body": theme.typography.fontBody,
  } as React.CSSProperties;

  // Determine if theme is dark or light
  const isDarkTheme = isColorDark(theme.colors.background);

  // Couple name ordering
  const firstName = data.couple.primarySide === "bride" ? data.couple.bride : data.couple.groom;
  const secondName = data.couple.primarySide === "bride" ? data.couple.groom : data.couple.bride;

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
    : { initial: { opacity: 0, y: 25 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  return (
    <div className="base-wedding-template" style={cssVars}>
      {/* Audio Element */}
      {data.music.themeMusic && (
        <audio ref={audioRef} src={data.music.themeMusic} loop preload="auto" />
      )}

      {/* ═══════════ OPENING OVERLAY ═══════════ */}
      <AnimatePresence>
        {overlayVisible && !isPreview && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center px-6"
            style={{ background: theme.colors.background }}
          >
            {/* Ganesha / Sacred Symbol */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-4xl mb-4"
              style={{ color: theme.colors.accent }}
            >
              ॐ
            </motion.div>

            {/* Mantra */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-xs uppercase tracking-[3px] mb-8 font-semibold"
              style={{ color: theme.colors.secondaryText, fontFamily: "var(--t-body)" }}
            >
              {data.introduction.mantra}
            </motion.p>

            {/* Couple Names */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-4xl md:text-6xl uppercase tracking-wide mb-2"
              style={{ color: theme.colors.text, fontFamily: "var(--t-heading)" }}
            >
              {firstName} <span style={{ color: theme.colors.accent }}>&</span> {secondName}
            </motion.h1>

            {/* Family Title */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-[10px] uppercase tracking-[3px] font-bold mb-10"
              style={{ color: theme.colors.accent }}
            >
              {data.introduction.familyTitle}
            </motion.p>

            {/* Open Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              onClick={handleOpenInvitation}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl text-xs font-bold uppercase tracking-[2px] border transition-all cursor-pointer"
              style={{
                background: theme.colors.accent,
                color: isDarkTheme ? theme.colors.background : "#FFFFFF",
                borderColor: theme.colors.accent,
                boxShadow: theme.shadows.button,
                borderRadius: theme.radius.button,
              }}
            >
              Open Invitation
            </motion.button>

            {/* Scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="absolute bottom-8"
            >
              <ChevronDown size={20} style={{ color: theme.colors.secondaryText }} className="animate-bounce" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ MAIN INVITATION CONTENT ═══════════ */}
      <div
        className="min-h-screen relative overflow-hidden"
        style={{ background: theme.colors.background }}
      >
        {/* Background Image Layer */}
        <div className="fixed inset-0 z-0 opacity-30">
          <Image
            src={theme.backgroundImage}
            alt="background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0" style={{ background: theme.gradients.backdrop }} />
        </div>

        {/* Content Container */}
        <div className="relative z-10">

          {/* ─── HERO SECTION ─── */}
          <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 py-20 relative">
            <motion.div {...fadeIn} transition={{ ...fadeIn.transition, delay: overlayVisible ? 0 : 0.3 }}>
              {/* Sacred Symbol */}
              <div className="text-3xl mb-4" style={{ color: theme.colors.accent }}>ॐ</div>

              {/* Mantra */}
              <p
                className="text-[10px] uppercase tracking-[3px] mb-6 font-semibold"
                style={{ color: theme.colors.secondaryText, fontFamily: "var(--t-body)" }}
              >
                {data.introduction.mantra}
              </p>

              {/* Eyebrow */}
              <p
                className="text-xs uppercase tracking-[2px] mb-4 font-bold"
                style={{ color: theme.colors.secondaryText, fontFamily: "var(--t-body)" }}
              >
                {data.introduction.eyebrow}
              </p>

              {/* Names */}
              <h1
                className="text-5xl md:text-7xl uppercase tracking-wider mb-3"
                style={{ color: theme.colors.text, fontFamily: "var(--t-heading)" }}
              >
                {firstName}
              </h1>
              <div className="text-2xl mb-3" style={{ color: theme.colors.accent }}>&</div>
              <h1
                className="text-5xl md:text-7xl uppercase tracking-wider mb-6"
                style={{ color: theme.colors.text, fontFamily: "var(--t-heading)" }}
              >
                {secondName}
              </h1>

              {/* Divider */}
              <div className="w-20 h-[1px] mx-auto mb-4" style={{ background: theme.colors.border }} />

              {/* Date & Venue */}
              <p
                className="text-sm font-semibold uppercase tracking-[2px] mb-1"
                style={{ color: theme.colors.accent, fontFamily: "var(--t-body)" }}
              >
                {data.wedding.date}
              </p>
              <p
                className="text-xs uppercase tracking-[1.5px]"
                style={{ color: theme.colors.secondaryText, fontFamily: "var(--t-body)" }}
              >
                {data.wedding.venue}, {data.wedding.city}
              </p>
            </motion.div>
          </section>

          {/* ─── COUPLE SECTION ─── */}
          {(data.couple.groomImage || data.couple.brideImage) && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="text-center space-y-8">
                <SectionTitle theme={theme}>The Couple</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-lg mx-auto">
                  {[
                    { name: firstName, image: data.couple.primarySide === "bride" ? data.couple.brideImage : data.couple.groomImage, bio: data.couple.primarySide === "bride" ? data.couple.brideBio : data.couple.groomBio },
                    { name: secondName, image: data.couple.primarySide === "bride" ? data.couple.groomImage : data.couple.brideImage, bio: data.couple.primarySide === "bride" ? data.couple.groomBio : data.couple.brideBio },
                  ].map((person, i) => person.image && (
                    <div key={i} className="text-center space-y-3">
                      <div className="w-36 h-36 mx-auto rounded-full overflow-hidden border-2" style={{ borderColor: theme.colors.border }}>
                        <Image src={person.image} alt={person.name} width={144} height={144} className="object-cover w-full h-full" />
                      </div>
                      <h3 className="text-xl uppercase tracking-wide" style={{ color: theme.colors.text, fontFamily: "var(--t-heading)" }}>{person.name}</h3>
                      {person.bio && <p className="text-xs leading-relaxed" style={{ color: theme.colors.secondaryText }}>{person.bio}</p>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </SectionCard>
          )}

          {/* ─── STORY SECTION ─── */}
          {data.sections.showAnnouncement && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="text-center space-y-6">
                <SectionTitle theme={theme}>{data.story.title}</SectionTitle>
                {data.story.couplePhoto && (
                  <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border" style={{ borderColor: theme.colors.border, borderRadius: theme.radius.card }}>
                    <Image src={data.story.couplePhoto} alt="Our Story" width={192} height={192} className="object-cover w-full h-full" />
                  </div>
                )}
                <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: theme.colors.secondaryText, fontFamily: "var(--t-body)" }}>
                  {data.story.text}
                </p>
              </motion.div>
            </SectionCard>
          )}

          {/* ─── COUNTDOWN SECTION ─── */}
          {data.sections.showCountdown && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="text-center space-y-6">
                <SectionTitle theme={theme}>Counting The Days</SectionTitle>
                <CountdownTimer target={data.wedding.countdownTarget} theme={theme} />
              </motion.div>
            </SectionCard>
          )}

          {/* ─── EVENTS SECTION ─── */}
          {data.sections.showEvents && data.events.filter(e => e.enabled).length > 0 && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="space-y-6">
                <SectionTitle theme={theme}>Wedding Events</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {data.events.filter(e => e.enabled).map((event, i) => (
                    <div
                      key={i}
                      className="p-5 border text-center space-y-2"
                      style={{
                        borderColor: theme.colors.border,
                        background: theme.glass.background,
                        backdropFilter: `blur(${theme.glass.blur})`,
                        borderRadius: theme.radius.card,
                      }}
                    >
                      <h4 className="text-base uppercase tracking-wider font-semibold" style={{ color: theme.colors.accent, fontFamily: "var(--t-heading)" }}>
                        {event.title}
                      </h4>
                      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: theme.colors.secondaryText }}>
                        <Calendar size={12} /> {event.date}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: theme.colors.secondaryText }}>
                        <Clock size={12} /> {event.time}
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: theme.colors.secondaryText }}>
                        <MapPin size={12} /> {event.venue}
                      </div>
                      {event.description && (
                        <p className="text-[11px] mt-2 leading-relaxed" style={{ color: theme.colors.secondaryText }}>
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </SectionCard>
          )}

          {/* ─── FAMILY SECTION ─── */}
          {data.sections.showFamily && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="text-center space-y-8">
                <SectionTitle theme={theme}>{data.family.title}</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
                  {[
                    { title: data.family.groomFamilyTitle || "Groom's Family", members: data.family.groomFamily, parents: data.family.groomParents, portrait: data.family.groomPortrait },
                    { title: data.family.brideFamilyTitle || "Bride's Family", members: data.family.brideFamily, parents: data.family.brideParents, portrait: data.family.bridePortrait },
                  ].map((side, i) => (
                    <div key={i} className="space-y-3 text-center">
                      {side.portrait && (
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border" style={{ borderColor: theme.colors.border }}>
                          <Image src={side.portrait} alt={side.title} width={80} height={80} className="object-cover w-full h-full" />
                        </div>
                      )}
                      <h4 className="text-sm uppercase tracking-wider font-bold" style={{ color: theme.colors.accent }}>{side.title}</h4>
                      {side.members.length > 0 ? (
                        <div className="space-y-1">
                          {side.members.map((m, j) => (
                            <p key={j} className="text-xs" style={{ color: theme.colors.secondaryText }}>
                              {m.relation && <span className="font-semibold">{m.relation}: </span>}{m.name}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs" style={{ color: theme.colors.secondaryText }}>{side.parents}</p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </SectionCard>
          )}

          {/* ─── GALLERY SECTION ─── */}
          {data.sections.showGallery && data.gallery.length > 0 && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="space-y-6">
                <SectionTitle theme={theme}>Gallery</SectionTitle>
                <div className="grid grid-cols-2 gap-3 max-w-lg mx-auto">
                  {data.gallery.map((img, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl overflow-hidden border"
                      style={{ borderColor: theme.colors.border, borderRadius: theme.radius.card }}
                    >
                      <Image src={img.src} alt={img.alt} width={300} height={300} className="object-cover w-full h-full" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </SectionCard>
          )}

          {/* ─── VENUE SECTION ─── */}
          {data.sections.showVenue && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="space-y-6">
                <SectionTitle theme={theme}>Venue</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  {/* Wedding Venue */}
                  <VenueCard
                    theme={theme}
                    title="Wedding Venue"
                    venue={data.wedding.venue}
                    city={data.wedding.city}
                    date={data.wedding.date}
                    time={data.wedding.time}
                    mapsLink={data.wedding.mapsLink}
                  />
                  {/* Reception Venue */}
                  {data.reception?.enabled && (
                    <VenueCard
                      theme={theme}
                      title={data.reception.title}
                      venue={data.reception.venue}
                      city={data.reception.city}
                      date={data.reception.date}
                      time={data.reception.time}
                      mapsLink={data.reception.mapsLink}
                    />
                  )}
                </div>
              </motion.div>
            </SectionCard>
          )}

          {/* ─── RSVP SECTION ─── */}
          {data.sections.showRSVP && clientId && (
            <SectionCard theme={theme}>
              <motion.div {...fadeIn} className="text-center space-y-6">
                <SectionTitle theme={theme}>{data.rsvp.title}</SectionTitle>
                <p className="text-sm max-w-md mx-auto leading-relaxed" style={{ color: theme.colors.secondaryText }}>
                  {data.rsvp.message}
                </p>
                <RsvpSubmissionForm clientId={clientId} />
                {/* WhatsApp Quick Link */}
                {data.rsvp.whatsappNumber && (
                  <a
                    href={`https://wa.me/${data.rsvp.whatsappNumber}?text=${encodeURIComponent(`Hi! I'd like to RSVP for ${firstName} & ${secondName}'s wedding.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-[1.5px] border transition-all hover:scale-105"
                    style={{
                      color: theme.colors.accent,
                      borderColor: theme.colors.border,
                      borderRadius: theme.radius.button,
                    }}
                  >
                    <MessageCircle size={14} /> {data.rsvp.whatsappLabel || "RSVP on WhatsApp"}
                  </a>
                )}
              </motion.div>
            </SectionCard>
          )}

          {/* ─── FOOTER SECTION ─── */}
          {data.sections.showFooter && (
            <section className="py-16 px-6 text-center space-y-6">
              <div className="w-16 h-[1px] mx-auto" style={{ background: theme.colors.border }} />
              <p className="text-sm italic max-w-md mx-auto leading-relaxed" style={{ color: theme.colors.secondaryText, fontFamily: "var(--t-heading)" }}>
                &ldquo;{data.footer.quote}&rdquo;
              </p>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-[2px] font-bold" style={{ color: theme.colors.accent }}>
                  {data.footer.designer}
                </p>
                <p className="text-[9px] uppercase tracking-[1.5px]" style={{ color: theme.colors.secondaryText }}>
                  {data.footer.service}
                </p>
                <p className="text-[9px]" style={{ color: theme.colors.secondaryText }}>
                  {data.footer.location}
                </p>
                <p className="text-[9px]" style={{ color: theme.colors.secondaryText }}>
                  {data.footer.contact}
                </p>
              </div>
            </section>
          )}

        </div>
      </div>

      {/* ─── FLOATING MUSIC TOGGLE ─── */}
      {data.music.themeMusic && !isPreview && !overlayVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
          onClick={toggleMusic}
          className="fixed bottom-6 right-6 z-[100] w-12 h-12 rounded-full flex items-center justify-center border shadow-lg cursor-pointer transition-all hover:scale-110"
          style={{
            background: theme.colors.cardBg,
            borderColor: theme.colors.border,
            color: theme.colors.accent,
          }}
          aria-label={isPlaying ? "Pause music" : "Play music"}
        >
          {isPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </motion.button>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   HELPER COMPONENTS
   ════════════════════════════════════════════ */

function SectionCard({ theme, children }: { theme: ThemeTokens; children: React.ReactNode }) {
  return (
    <section className="py-12 px-6">
      <div
        className="max-w-2xl mx-auto p-8 md:p-10 border"
        style={{
          background: theme.colors.cardBg,
          borderColor: theme.colors.border,
          borderRadius: theme.radius.card,
          boxShadow: theme.shadows.card,
          backdropFilter: `blur(${theme.glass.blur})`,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function SectionTitle({ theme, children }: { theme: ThemeTokens; children: React.ReactNode }) {
  return (
    <div className="text-center mb-2">
      <h2
        className="text-2xl md:text-3xl uppercase tracking-wider"
        style={{ color: theme.colors.text, fontFamily: "var(--t-heading)" }}
      >
        {children}
      </h2>
      <div className="w-12 h-[1px] mx-auto mt-3" style={{ background: theme.colors.accent }} />
    </div>
  );
}

function VenueCard({ theme, title, venue, city, date, time, mapsLink }: {
  theme: ThemeTokens; title: string; venue: string; city: string; date: string; time: string; mapsLink: string;
}) {
  return (
    <div
      className="p-5 border text-center space-y-3"
      style={{
        borderColor: theme.colors.border,
        background: theme.glass.background,
        backdropFilter: `blur(${theme.glass.blur})`,
        borderRadius: theme.radius.card,
      }}
    >
      <h4 className="text-sm uppercase tracking-wider font-bold" style={{ color: theme.colors.accent }}>{title}</h4>
      <p className="text-base font-semibold" style={{ color: theme.colors.text, fontFamily: "var(--t-heading)" }}>{venue}</p>
      <p className="text-xs" style={{ color: theme.colors.secondaryText }}>{city}</p>
      <div className="flex items-center justify-center gap-4 text-xs" style={{ color: theme.colors.secondaryText }}>
        <span className="flex items-center gap-1"><Calendar size={12} /> {date}</span>
        <span className="flex items-center gap-1"><Clock size={12} /> {time}</span>
      </div>
      {mapsLink && (
        <a
          href={mapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[1.5px] hover:underline"
          style={{ color: theme.colors.accent }}
        >
          <MapPin size={12} /> View on Maps <ExternalLink size={10} />
        </a>
      )}
    </div>
  );
}

function CountdownTimer({ target, theme }: { target: string; theme: ThemeTokens }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(target).getTime();
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [target]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Mins", value: timeLeft.minutes },
    { label: "Secs", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {units.map((u) => (
        <div key={u.label} className="text-center">
          <div
            className="text-3xl md:text-4xl font-bold mb-1"
            style={{ color: theme.colors.accent, fontFamily: "var(--t-heading)" }}
          >
            {String(u.value).padStart(2, "0")}
          </div>
          <div className="text-[9px] uppercase tracking-[2px] font-bold" style={{ color: theme.colors.secondaryText }}>
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Utility: Determine if a hex color is dark */
function isColorDark(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return false;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
