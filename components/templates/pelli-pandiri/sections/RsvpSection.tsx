"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart, Sparkles, Check, Send, ArrowLeft, Phone, MessageSquare } from "lucide-react";
import { PelliPandiriData } from "../adapter";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const GoldMandalaOrnament: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 300 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full pointer-events-none ${className}`}
  >
    <defs>
      <linearGradient id="pelliMandalaGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f7e7c4" />
        <stop offset="35%" stopColor="#d4af37" />
        <stop offset="70%" stopColor="#b88636" />
        <stop offset="100%" stopColor="#8a631e" />
      </linearGradient>
    </defs>
    <circle cx="150" cy="150" r="140" stroke="url(#pelliMandalaGold)" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
    <circle cx="150" cy="150" r="132" stroke="url(#pelliMandalaGold)" strokeWidth="0.8" opacity="0.45" />

    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i} transform={`rotate(${i * 30} 150 150)`}>
        <path
          d="M150 30 C138 65 142 95 150 110 C158 95 162 65 150 30Z"
          fill="url(#pelliMandalaGold)"
          opacity="0.22"
          stroke="url(#pelliMandalaGold)"
          strokeWidth="0.75"
        />
        <circle cx="150" cy="22" r="2.5" fill="url(#pelliMandalaGold)" opacity="0.7" />
      </g>
    ))}

    <circle cx="150" cy="150" r="95" stroke="url(#pelliMandalaGold)" strokeWidth="1.2" opacity="0.5" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={`mid-${i}`} transform={`rotate(${i * 30 + 15} 150 150)`}>
        <path
          d="M150 68 C144 86 146 100 150 112 C154 100 156 86 150 68Z"
          fill="url(#pelliMandalaGold)"
          opacity="0.3"
        />
      </g>
    ))}

    <circle cx="150" cy="150" r="56" stroke="url(#pelliMandalaGold)" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
    <circle cx="150" cy="150" r="42" stroke="url(#pelliMandalaGold)" strokeWidth="1.2" opacity="0.8" />
    <circle cx="150" cy="6" r="6" fill="url(#pelliMandalaGold)" opacity="0.9" />
  </svg>
);

const SparkleBurst: React.FC = () => {
  const particles = Array.from({ length: 16 });
  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 110;
        const y = Math.sin(rad) * 110;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
            animate={{
              opacity: [1, 0.9, 0],
              scale: [0, 1.4, 0.2],
              x,
              y,
            }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute text-[#d4af37] text-base"
          >
            {i % 2 === 0 ? "✨" : "🌸"}
          </motion.span>
        );
      })}
    </div>
  );
};

export const RsvpSection: React.FC<{ data: PelliPandiriData; clientId?: string }> = ({ data, clientId }) => {
  const { countdown, rsvp, details } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [isClient, setIsClient] = useState(false);

  const [step, setStep] = useState<"initial" | "form" | "submitted">("initial");
  const [showBurst, setShowBurst] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestWishes, setGuestWishes] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const targetMs = new Date(countdown.targetDate).getTime();

    const update = () => {
      const now = Date.now();
      const diff = (isNaN(targetMs) ? new Date("2026-11-29T09:15:00").getTime() : targetMs) - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
          isExpired: false,
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [countdown.targetDate]);

  const handleConfirmPresenceClick = () => {
    setShowBurst(true);
    setTimeout(() => {
      setStep("form");
      setShowBurst(false);
    }, 450);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;
    setIsSubmitting(true);

    try {
      if (clientId) {
        await fetch(`/api/invitation/${clientId}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            guest_name: guestName.trim(),
            attending: true,
            guest_count: guestCount,
            message: guestWishes.trim() || undefined,
          }),
        });
      }
    } catch (err) {
      console.warn("RSVP submission error:", err);
    } finally {
      setIsSubmitting(false);
      setStep("submitted");
    }
  };

  const showCountdown = countdown.enabled;
  const showRsvp = rsvp.enabled;

  if (!showCountdown && !showRsvp) return null;

  return (
    <section
      ref={sectionRef}
      id="rsvp"
      aria-label="Wedding Countdown and RSVP"
      className="relative w-full overflow-hidden py-8 sm:py-14 md:py-20 bg-transparent text-[#542D25]"
    >
      <div className="relative z-10 max-w-5xl mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="relative w-full rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#fffefc]/92 via-[#fdf7ee]/88 to-[#fbf1e0]/92 backdrop-blur-xs border border-[#d4af37]/50 shadow-[0_14px_44px_rgba(80,45,20,0.08),inset_0_1px_0_rgba(255,255,255,0.85)] p-4 sm:p-7 md:p-9 overflow-hidden">
          {/* Subtle Golden Corner Brackets */}
          <span className="absolute top-2 left-2 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-l-2 border-[#b88636]/60 rounded-tl pointer-events-none" />
          <span className="absolute top-2 right-2 w-4 sm:w-6 h-4 sm:h-6 border-t-2 border-r-2 border-[#b88636]/60 rounded-tr pointer-events-none" />
          <span className="absolute bottom-2 left-2 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-l-2 border-[#b88636]/60 rounded-bl pointer-events-none" />
          <span className="absolute bottom-2 right-2 w-4 sm:w-6 h-4 sm:h-6 border-b-2 border-r-2 border-[#b88636]/60 rounded-br pointer-events-none" />

          <div className="absolute inset-1.5 sm:inset-2.5 rounded-[14px] sm:rounded-[22px] border border-[#d4af37]/25 pointer-events-none" />

          <div className={`relative z-10 flex flex-col ${showCountdown && showRsvp ? "lg:flex-row" : "items-center text-center"} justify-between gap-5 sm:gap-7 lg:gap-8 xl:gap-10`}>
            {/* SIDE 1: ORNAMENTAL WEDDING COUNTDOWN */}
            {showCountdown && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full ${showRsvp ? "lg:w-[48%]" : "max-w-lg mx-auto"} flex flex-col items-center text-center relative`}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[380px] h-[280px] sm:h-[380px] opacity-35 pointer-events-none select-none -z-0">
                  <GoldMandalaOrnament />
                </div>

                <div className="relative z-10 flex flex-col items-center mb-3 sm:mb-5 px-2">
                  <div className="flex items-center justify-center gap-2 mb-1.5 select-none">
                    <span className="w-6 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#b88636]" />
                    <span className="text-[#b88636] text-xs">✦</span>
                    <span className="w-6 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#b88636]" />
                  </div>

                  <h2 className="font-cinzel text-lg sm:text-2xl md:text-3xl font-extrabold tracking-[0.12em] sm:tracking-[0.16em] text-[#42100b] uppercase leading-tight text-center">
                    {countdown.title || "Wedding Begins In"}
                  </h2>

                  <div className="w-10 sm:w-14 h-0.5 bg-gradient-to-r from-transparent via-[#b88636] to-transparent mt-1.5" />
                </div>

                <div className="grid grid-cols-4 gap-2 sm:gap-3 md:gap-3.5 w-full relative z-10 max-w-[320px] sm:max-w-[380px] md:max-w-[400px] px-1 sm:px-0">
                  {[
                    { label: "DAYS", value: timeLeft.days },
                    { label: "HOURS", value: timeLeft.hours },
                    { label: "MINS", value: timeLeft.minutes },
                    { label: "SECS", value: timeLeft.seconds },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      whileHover={shouldReduceMotion ? {} : { y: -3, transition: { duration: 0.2 } }}
                      className="relative flex flex-col items-center justify-center py-2 sm:py-3.5 md:py-4 px-1 rounded-lg sm:rounded-xl bg-gradient-to-b from-[#FFFDF8]/95 via-[#FDF5E6]/90 to-[#F7E7CE]/95 border border-[#b88636] shadow-[0_4px_14px_rgba(90,45,20,0.1)] overflow-hidden"
                    >
                      <span className="absolute top-0.5 left-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 border-t border-l border-[#b88636] pointer-events-none" />
                      <span className="absolute top-0.5 right-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 border-t border-r border-[#b88636] pointer-events-none" />
                      <span className="absolute bottom-0.5 left-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 border-b border-l border-[#b88636] pointer-events-none" />
                      <span className="absolute bottom-0.5 right-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 border-b border-r border-[#b88636] pointer-events-none" />

                      <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-[#ffd700] to-transparent opacity-90" />

                      <span className="font-cinzel text-lg sm:text-2xl md:text-3xl font-black text-[#42100b] tracking-tight leading-none tabular-nums drop-shadow-xs">
                        {isClient ? String(item.value).padStart(2, "0") : "--"}
                      </span>

                      <span className="font-cinzel text-[8px] sm:text-[9px] md:text-[10px] font-bold tracking-[0.14em] sm:tracking-[0.18em] text-[#805527] uppercase mt-1 sm:mt-1.5">
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <div className="relative z-10 inline-flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 px-3 sm:px-4 py-1 rounded-full bg-[#fbf2e3]/90 border border-[#d4ba9b]/70 text-[#742719] text-[10px] sm:text-xs font-cinzel font-semibold tracking-wide select-none shadow-2xs max-w-[320px] sm:max-w-none">
                  <span className="text-[#b88636] text-[8.5px] sm:text-[9.5px]">✦</span>
                  <span className="truncate">{details.weddingDate} {details.muhurthamTime ? `• ${details.muhurthamTime}` : ""}</span>
                  <span className="text-[#b88636] text-[8.5px] sm:text-[9.5px]">✦</span>
                </div>
              </motion.div>
            )}

            {showCountdown && showRsvp && (
              <>
                <div className="hidden lg:flex flex-col items-center justify-center self-stretch py-4 select-none">
                  <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#b88636]/60 to-[#b88636]" />
                  <div className="my-3 relative flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full border border-[#b88636]/70 flex items-center justify-center bg-[#fff8eb]/90 shadow-xs">
                      <span className="text-[#b88636] text-xs">✦</span>
                    </div>
                  </div>
                  <div className="w-px flex-1 bg-gradient-to-b from-[#b88636] via-[#b88636]/60 to-transparent" />
                </div>

                <div className="lg:hidden flex items-center justify-center gap-2 my-1 w-full max-w-[220px] mx-auto select-none opacity-80">
                  <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#b88636]/70" />
                  <span className="text-[#b88636] text-xs">❦</span>
                  <span className="text-[#b88636] text-xs">✦</span>
                  <span className="text-[#b88636] text-xs">❦</span>
                  <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#b88636]/70" />
                </div>
              </>
            )}

            {/* SIDE 2: RSVP ATTENDANCE & CONTACTS */}
            {showRsvp && (
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full ${showCountdown ? "lg:w-[48%]" : "max-w-lg mx-auto"} flex flex-col items-center text-center relative`}
              >
                {showBurst && <SparkleBurst />}

                <AnimatePresence mode="wait">
                  {step === "initial" && (
                    <motion.div
                      key="step-initial"
                      initial={false}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ duration: 0.35 }}
                      className="flex flex-col items-center justify-center py-1 sm:py-3 px-2 sm:px-4 w-full max-w-md mx-auto"
                    >
                      <div className="flex items-center justify-center gap-2 mb-1.5 sm:mb-2 select-none">
                        <span className="text-[#b88636] text-xs">❦</span>
                        <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-[#805527] uppercase">
                          CELEBRATE WITH US
                        </span>
                        <span className="text-[#b88636] text-xs">❦</span>
                      </div>

                      <p className="font-cormorant text-lg sm:text-2xl md:text-3xl italic font-semibold text-[#42100b] leading-snug tracking-wide max-w-sm mx-auto">
                        &ldquo;{rsvp.heading || "We would be delighted by your presence"}&rdquo;
                      </p>

                      <p className="font-cormorant text-xs sm:text-sm md:text-base italic text-[#744c2c] font-medium mt-1.5 sm:mt-2.5 max-w-xs sm:max-w-sm leading-relaxed">
                        {rsvp.subheading || "Your presence and heartfelt blessings are our greatest treasure as we begin this sacred union"}
                      </p>

                      <div className="flex items-center justify-center gap-2 mt-2 select-none">
                        <span className="w-10 h-px bg-gradient-to-r from-transparent via-[#b88636]/60 to-transparent" />
                        <span className="text-[#b88636] text-[10px]">✦</span>
                        <span className="w-10 h-px bg-gradient-to-r from-transparent via-[#b88636]/60 to-transparent" />
                      </div>

                      <motion.button
                        type="button"
                        onClick={handleConfirmPresenceClick}
                        whileHover={
                          shouldReduceMotion
                            ? {}
                            : { scale: 1.04, boxShadow: "0 10px 28px rgba(99,20,13,0.4)" }
                        }
                        whileTap={{ scale: 0.97 }}
                        className="group relative inline-flex items-center justify-center gap-2 sm:gap-2.5 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#63140d] via-[#7e1d13] to-[#63140d] text-[#fffcf5] border border-[#d4af37]/80 font-cinzel text-[10px] sm:text-xs md:text-[13px] font-extrabold tracking-[0.14em] sm:tracking-[0.18em] uppercase shadow-[0_6px_20px_rgba(99,20,13,0.3)] cursor-pointer transition-all duration-300 overflow-hidden mt-3.5 sm:mt-5 max-w-[290px] sm:max-w-none"
                      >
                        <span className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-[-25deg] -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000" />
                        <Heart size={13} className="text-[#ffd700] fill-[#ffd700] shrink-0" />
                        <span className="truncate">{rsvp.submitLabel || "Confirm Your Presence"}</span>
                        <Sparkles size={13} className="text-[#ffd700] shrink-0" />
                      </motion.button>

                      {/* Or connect directly via message (WhatsApp) */}
                      {(() => {
                        const whatsAppContact = rsvp.contacts?.find((c) => c.type === "whatsapp") || rsvp.contacts?.[0];
                        const rawPhone = rsvp.whatsappNumber || whatsAppContact?.value || "+918688178323";
                        const cleanNum = rawPhone.replace(/[^0-9]/g, "");
                        const groom = data.couple?.groomName || "Groom";
                        const bride = data.couple?.brideName || "Bride";
                        const waUrl = `https://wa.me/${cleanNum}?text=${encodeURIComponent(`Hello, I would like to RSVP for the wedding celebration of ${groom} & ${bride}!`)}`;

                        return (
                          <div className="flex items-center justify-center gap-2.5 mt-4 pt-3 border-t border-[#d9ba9b]/40 w-full select-none">
                            <span className="font-cormorant text-sm sm:text-base italic text-[#744c2c] font-medium">
                              Or connect directly via message
                            </span>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label="Connect directly via WhatsApp"
                              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center text-white shadow-xs hover:scale-110 transition-transform cursor-pointer shrink-0"
                            >
                              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.96.586 1.961.947 2.796.948h.005c3.18 0 5.767-2.587 5.768-5.766.001-3.182-2.585-5.769-5.768-5.769zm3.364 8.163c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.122-.519-1.52-.631-2.484-2.179-2.56-2.28-.074-.102-.61-.813-.61-1.551 0-.737.387-1.1.524-1.25.137-.15.299-.187.4-.187.1 0 .2.001.288.006.09.004.21.034.321.3.114.275.39.95.424 1.02.034.07.057.151.01.242-.047.09-.07.147-.14.228-.07.081-.148.18-.211.242-.07.068-.143.142-.062.28.081.139.36.593.772.96.53.473.978.62 1.117.689.139.07.22.059.302-.036.082-.095.352-.41.446-.55.093-.141.188-.117.315-.07.127.047.807.381.946.451.139.07.232.105.267.164.035.06.035.347-.109.752z" />
                                <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.334 4.981L2 22l5.233-1.372a9.92 9.92 0 004.779 1.22h.004c5.505 0 9.988-4.478 9.989-9.984 0-2.669-1.037-5.176-2.922-7.062A9.925 9.925 0 0012.012 2zm0 18.287h-.003a8.27 8.27 0 01-4.218-1.154l-.302-.18-3.136.822.837-3.056-.197-.314a8.27 8.27 0 01-1.269-4.42c.001-4.571 3.72-8.288 8.288-8.288 2.215 0 4.297.863 5.864 2.43a8.243 8.243 0 012.426 5.864c0 4.572-3.719 8.29-8.288 8.29z" />
                              </svg>
                            </a>
                          </div>
                        );
                      })()}
                    </motion.div>
                  )}

                  {step === "form" && (
                    <motion.form
                      key="step-form"
                      onSubmit={handleFormSubmit}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35 }}
                      className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-7 rounded-2xl bg-[#fffbf2]/92 backdrop-blur-md border border-[#c99f58]/70 shadow-[0_12px_32px_rgba(84,45,37,0.12)] text-left"
                    >
                      <div className="absolute inset-1 rounded-xl border border-[#d4af37]/25 pointer-events-none" />

                      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#d9ba9b]/40 relative z-10">
                        <button
                          type="button"
                          onClick={() => setStep("initial")}
                          className="inline-flex items-center gap-1.5 text-xs font-cinzel font-semibold text-[#805527] hover:text-[#542D25] cursor-pointer transition-colors"
                        >
                          <ArrowLeft size={13} />
                          <span>Back</span>
                        </button>
                        <span className="font-cinzel text-[11px] font-bold tracking-widest text-[#742719] uppercase">
                          Confirm Attendance
                        </span>
                      </div>

                      <div className="mb-3.5 relative z-10">
                        <label className="block text-[11px] font-cinzel font-bold text-[#80644F] uppercase tracking-wider mb-1">
                          Your Full Name / Family Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={guestName}
                          onChange={(e) => setGuestName(e.target.value)}
                          placeholder="e.g., Sri Ram & Family"
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d9ba9b] bg-[#FAF0E0]/80 text-[#2c1d14] font-serif text-sm placeholder:text-[#9e836f] focus:outline-none focus:ring-2 focus:ring-[#8e3622]/40 shadow-2xs transition-all"
                        />
                      </div>

                      <div className="mb-3.5 relative z-10">
                        <label className="block text-[11px] font-cinzel font-bold text-[#80644F] uppercase tracking-wider mb-1">
                          Number of Guests Attending
                        </label>
                        <select
                          value={guestCount}
                          onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#d9ba9b] bg-[#FAF0E0]/80 text-[#2c1d14] font-serif text-sm focus:outline-none focus:ring-2 focus:ring-[#8e3622]/40 shadow-2xs transition-all"
                        >
                          {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                            <option key={num} value={num}>{num} {num === 1 ? "Guest" : "Guests"}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4 relative z-10">
                        <label className="block text-[11px] font-cinzel font-bold text-[#80644F] uppercase tracking-wider mb-1">
                          Your Blessings & Wishes for the Couple
                        </label>
                        <textarea
                          rows={2}
                          value={guestWishes}
                          onChange={(e) => setGuestWishes(e.target.value)}
                          placeholder="Wishing you a lifetime of harmony, health, and abundant joy..."
                          className="w-full px-4 py-2 rounded-xl border border-[#d9ba9b] bg-[#FAF0E0]/80 text-[#2c1d14] font-serif text-sm placeholder:text-[#9e836f] focus:outline-none focus:ring-2 focus:ring-[#8e3622]/40 shadow-2xs transition-all resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="relative z-10 w-full py-3.5 rounded-full bg-gradient-to-r from-[#63140d] via-[#7e1d13] to-[#63140d] text-[#fffcf5] border border-[#d4af37]/80 font-cinzel text-xs sm:text-sm font-bold tracking-widest shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <span>Sending Blessings...</span>
                        ) : (
                          <>
                            <Send size={14} className="text-[#ffd700]" />
                            <span>SEND BLESSINGS &amp; CONFIRM</span>
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}

                  {step === "submitted" && (
                    <motion.div
                      key="step-submitted"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45 }}
                      className="flex flex-col items-center justify-center py-4 px-4 w-full max-w-md mx-auto"
                    >
                      <div className="w-14 h-14 rounded-full bg-gradient-to-b from-[#fbf2e3] to-[#edd6a4] text-[#63140d] border-2 border-[#b88636] flex items-center justify-center mb-3.5 shadow-md">
                        <Check size={28} className="stroke-[2.5]" />
                      </div>

                      <h3 className="font-cinzel text-xl sm:text-2xl font-black text-[#42100b] uppercase">
                        Namaskaram, {guestName}!
                      </h3>

                      <p className="font-cormorant text-base sm:text-lg italic text-[#744c2c] font-semibold mt-1.5 max-w-sm">
                        Your presence is warmly confirmed and your loving blessings have reached our hearts.
                      </p>

                      {guestWishes && (
                        <div className="mt-3.5 p-3.5 rounded-xl bg-[#fffbf2]/90 border border-[#DDC9A6] max-w-sm shadow-2xs">
                          <p className="font-cormorant text-sm italic text-[#542D25]">
                            &ldquo;{guestWishes}&rdquo;
                          </p>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => setStep("form")}
                        className="mt-4 text-xs font-cinzel font-bold tracking-wider text-[#742719] hover:underline cursor-pointer"
                      >
                        Edit Response
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
