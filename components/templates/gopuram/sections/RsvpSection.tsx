"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Check, Send, X, Phone, MessageSquare } from "lucide-react";
import { useGopuram } from "../context";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

export const RsvpSection: React.FC = () => {
  const { data, clientId } = useGopuram();
  const { countdown, rsvp, couple } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Countdown state
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [isClient, setIsClient] = useState(false);

  // RSVP Form Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestWishes, setGuestWishes] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [attendance, setAttendance] = useState<"attending" | "regrets">("attending");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groomName = couple.groomName || "Arjun";
  const brideName = couple.brideName || "Meera";

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

  const handleSubmit = async (e: React.FormEvent) => {
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
            attending: attendance === "attending",
            guest_count: guestCount,
            message: guestWishes.trim() || undefined,
          }),
        });
      }
    } catch (err) {
      console.warn("RSVP submission error:", err);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const whatsappLink = rsvp.whatsappNumber
    ? `https://wa.me/${rsvp.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
        `Hello! Delighted to RSVP for the wedding of ${groomName} & ${brideName}.`
      )}`
    : "";

  return (
    <section
      ref={sectionRef}
      id="rsvp-countdown"
      aria-label="Wedding Countdown and RSVP"
      className="relative w-full overflow-hidden bg-transparent py-8 sm:py-10 md:py-12 text-[#42100b] select-none"
    >
      {/* Decorative Artwork */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0">
        <div className="absolute -top-10 -left-10 w-48 sm:w-64 h-48 sm:h-64 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        <div className="absolute -top-10 -right-10 w-48 sm:w-64 h-48 sm:h-64 opacity-[0.18]">
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt=""
            fill
            className="object-contain filter sepia"
            unoptimized
          />
        </div>

        <div className="absolute bottom-6 left-4 sm:left-10 w-22 sm:w-28 h-22 sm:h-28 opacity-[0.22]">
          <Image
            src="/templates/gopuram/events/lotus-corner.png"
            alt=""
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-7 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fbf2e3] border border-[#d4af37]/70 shadow-2xs mb-2.5">
            <span className="text-[#b88636] text-[10px]">✦</span>
            <span className="font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.22em] text-[#742719] uppercase">
              Auspicious Celebration
            </span>
            <span className="text-[#b88636] text-[10px]">✦</span>
          </div>

          <div className="relative inline-flex items-center justify-center px-5 sm:px-8 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-[#5a1012] via-[#7e181e] to-[#5a1012] border-2 border-[#d4af37] shadow-[0_6px_20px_rgba(90,20,10,0.22)]">
            <div className="absolute top-1 left-1.5 w-2.5 h-2.5 border-t border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute top-1 right-1.5 w-2.5 h-2.5 border-t border-r border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 left-1.5 w-2.5 h-2.5 border-b border-l border-[#ffd700]/70 pointer-events-none" />
            <div className="absolute bottom-1 right-1.5 w-2.5 h-2.5 border-b border-r border-[#ffd700]/70 pointer-events-none" />

            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent mr-2.5" />

            <h2 className="font-cinzel text-lg sm:text-xl md:text-2xl lg:text-[1.75rem] font-black tracking-[0.18em] sm:tracking-[0.22em] text-[#fffdf8] uppercase leading-tight [text-shadow:_0_1px_3px_rgba(0,0,0,0.6),_0_0_12px_rgba(255,215,0,0.35)]">
              {countdown.title || "Wedding Begins In"}
            </h2>

            <span className="hidden sm:inline-block w-6 sm:w-10 h-px bg-gradient-to-r from-transparent via-[#ffd700] to-transparent ml-2.5" />
          </div>

          <p className="font-cormorant italic text-sm sm:text-base md:text-lg text-[#6e3a1f] font-bold tracking-wide mt-2 max-w-xl">
            &ldquo;{rsvp.subheading || `Countdown to the sacred union of ${groomName} & ${brideName}`}&rdquo;
          </p>
        </div>

        {/* Sculpted Cartouche Card */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl p-1 bg-gradient-to-b from-[#ffd700] via-[#c99f58] to-[#8a5822] shadow-[0_12px_32px_rgba(80,45,20,0.18)]">
          <div className="relative w-full rounded-[14px] sm:rounded-[22px] bg-[#fffcf7]/95 px-4 sm:px-6 py-4 sm:py-5 flex flex-col md:flex-row items-center justify-between gap-5">
            
            {/* 4 Countdown Boxes */}
            <div className="flex items-center justify-center gap-2 sm:gap-3 w-full md:w-auto">
              <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px] py-1.5 px-1 rounded-xl bg-[#faf2e4] border border-[#d9ba9b]/80 shadow-2xs">
                <span className="font-cinzel text-lg sm:text-xl font-black text-[#541c15] leading-none">
                  {isClient ? String(timeLeft.days).padStart(2, "0") : "00"}
                </span>
                <span className="font-cinzel text-[8px] sm:text-[9px] font-bold text-[#805527] uppercase tracking-wider mt-0.5">
                  Days
                </span>
              </div>

              <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px] py-1.5 px-1 rounded-xl bg-[#faf2e4] border border-[#d9ba9b]/80 shadow-2xs">
                <span className="font-cinzel text-lg sm:text-xl font-black text-[#541c15] leading-none">
                  {isClient ? String(timeLeft.hours).padStart(2, "0") : "00"}
                </span>
                <span className="font-cinzel text-[8px] sm:text-[9px] font-bold text-[#805527] uppercase tracking-wider mt-0.5">
                  Hours
                </span>
              </div>

              <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px] py-1.5 px-1 rounded-xl bg-[#faf2e4] border border-[#d9ba9b]/80 shadow-2xs">
                <span className="font-cinzel text-lg sm:text-xl font-black text-[#541c15] leading-none">
                  {isClient ? String(timeLeft.minutes).padStart(2, "0") : "00"}
                </span>
                <span className="font-cinzel text-[8px] sm:text-[9px] font-bold text-[#805527] uppercase tracking-wider mt-0.5">
                  Minutes
                </span>
              </div>

              <div className="flex flex-col items-center justify-center min-w-[50px] sm:min-w-[60px] py-1.5 px-1 rounded-xl bg-[#faf2e4] border border-[#d9ba9b]/80 shadow-2xs">
                <span className="font-cinzel text-lg sm:text-xl font-black text-[#541c15] leading-none">
                  {isClient ? String(timeLeft.seconds).padStart(2, "0") : "00"}
                </span>
                <span className="font-cinzel text-[8px] sm:text-[9px] font-bold text-[#805527] uppercase tracking-wider mt-0.5">
                  Seconds
                </span>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden md:flex flex-col items-center justify-center h-14 select-none opacity-60">
              <div className="w-px h-full bg-gradient-to-b from-transparent via-[#b88636] to-transparent" />
            </div>

            {/* RSVP Buttons */}
            <div className="flex flex-col items-center md:items-end justify-center text-center md:text-right gap-2.5">
              <p className="font-cormorant italic text-sm sm:text-base text-[#7c4a2d] font-semibold">
                &ldquo;{rsvp.heading || "We would be delighted by your presence!"}&rdquo;
              </p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setIsModalOpen(true);
                  }}
                  className="group inline-flex items-center justify-center gap-2 py-2 px-6 sm:px-8 rounded-full bg-gradient-to-r from-[#63140d] via-[#7e1d13] to-[#63140d] text-[#fffcf5] border border-[#d4af37] shadow-md hover:shadow-lg font-cinzel text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:scale-[1.03] active:scale-98 cursor-pointer"
                >
                  <span>{rsvp.submitLabel || "Confirm Your Presence"}</span>
                  <span className="text-xs transition-transform duration-300 group-hover:translate-x-1">➔</span>
                </button>

                {whatsappLink && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-full bg-[#25D366] text-white font-cinzel text-xs font-bold uppercase tracking-wider shadow-sm hover:scale-105 transition-all"
                  >
                    <MessageSquare size={14} />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Contacts row if any */}
        {rsvp.contacts && rsvp.contacts.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-xs text-[#6e3a1f]">
            {rsvp.contacts.map((contact, idx) => (
              <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#faf2e4] border border-[#d9ba9b]">
                {contact.type === "phone" ? <Phone size={12} className="text-[#8e3622]" /> : <MessageSquare size={12} className="text-[#25D366]" />}
                <span className="font-semibold text-[#541c15]">{contact.label}:</span>
                <a href={contact.type === "phone" ? `tel:${contact.value.replace(/\s+/g, "")}` : `https://wa.me/${contact.value.replace(/[^0-9]/g, "")}`} className="hover:underline font-mono">
                  {contact.value}
                </a>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 px-2 select-none pointer-events-none opacity-70">
          <div className="relative w-8 h-8">
            <Image src="/templates/gopuram/decoration/Lotus-Mandala.png" alt="Lotus" fill className="object-contain" unoptimized />
          </div>
          <div className="relative w-8 h-8">
            <Image src="/templates/gopuram/decoration/Lotus-Mandala.png" alt="Lotus" fill className="object-contain" unoptimized />
          </div>
        </div>
      </div>

      {/* RSVP Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-3xl bg-[#fffdf8] p-6 sm:p-8 border-2 border-[#b88636] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#faeed8] text-[#541c15] transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {isSubmitted ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-700">
                    <Check size={28} />
                  </div>
                  <h3 className="font-cinzel text-xl font-bold text-[#541c15] uppercase tracking-wide">
                    Thank You, {guestName}!
                  </h3>
                  <p className="font-cormorant italic text-base text-[#7c4a2d]">
                    Your presence and blessings are our greatest joy. We look forward to celebrating together!
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mt-4 px-6 py-2 rounded-full bg-[#5a1012] text-[#ffd700] border border-[#d4af37] font-cinzel text-xs font-bold uppercase tracking-wider"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="font-cinzel text-xl font-bold text-[#541c15] uppercase tracking-wide">
                      Confirm Your Presence
                    </h3>
                    <p className="font-cormorant italic text-sm text-[#7c4a2d] mt-1">
                      Wedding celebrations of {groomName} &amp; {brideName}
                    </p>
                  </div>

                  <div>
                    <label className="block font-cinzel text-[11px] font-bold text-[#541c15] uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Ramesh Varma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf2e4] border border-[#d9ba9b] text-sm text-[#42100b] outline-none focus:border-[#7a1818]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-cinzel text-[11px] font-bold text-[#541c15] uppercase tracking-wider mb-1">
                        Attendance
                      </label>
                      <select
                        value={attendance}
                        onChange={(e) => setAttendance(e.target.value as any)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#faf2e4] border border-[#d9ba9b] text-sm text-[#42100b] outline-none"
                      >
                        <option value="attending">Joyfully Attending</option>
                        <option value="regrets">Regretfully Decline</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-cinzel text-[11px] font-bold text-[#541c15] uppercase tracking-wider mb-1">
                        Number of Guests
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10}
                        value={guestCount}
                        onChange={(e) => setGuestCount(parseInt(e.target.value) || 1)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf2e4] border border-[#d9ba9b] text-sm text-[#42100b] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-cinzel text-[11px] font-bold text-[#541c15] uppercase tracking-wider mb-1">
                      Heartfelt Wishes / Message
                    </label>
                    <textarea
                      rows={3}
                      value={guestWishes}
                      onChange={(e) => setGuestWishes(e.target.value)}
                      placeholder="Share your warm blessings with the couple..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf2e4] border border-[#d9ba9b] text-sm text-[#42100b] outline-none focus:border-[#7a1818] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#63140d] via-[#7e1d13] to-[#63140d] text-[#fffcf5] border border-[#d4af37] shadow-md font-cinzel text-xs font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={14} className={isSubmitting ? "animate-spin" : ""} />
                    <span>{isSubmitting ? "Submitting..." : "Send RSVP & Blessings"}</span>
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
