"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RoyalDivider,
  TraditionalPulliKolam,
  TraditionalSikkuKolam,
  TraditionalCornerKolam,
} from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export function CountdownAndRsvp({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();

  // Mode: "invite" | "rsvp"
  const [viewMode, setViewMode] = useState<"invite" | "rsvp">("invite");

  // --- Countdown State ---
  const targetDateStr = data.wedding.countdownTarget || "2026-12-28T09:12:00";
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(targetDateStr).getTime();
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  // --- RSVP State ---
  const [attending, setAttending] = useState<"yes" | "maybe" | "no">("yes");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rsvpNote, setRsvpNote] = useState("");
  const [isSendingRsvp, setIsSendingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Handle RSVP Submit
  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSendingRsvp(true);

    if (clientId) {
      try {
        await fetch(`/api/invitation/${clientId}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: guestName,
            status: attending,
            guestCount: parseInt(guestCount, 10) || 1,
            phone: phoneNumber,
            wishes: rsvpNote,
          }),
        });
      } catch (err) {
        // Fallback gracefully
      }
    }

    emitAnalyticsInteraction("rsvp_submit", "rsvp");

    const cleanPhone = (data.rsvp.whatsappNumber || "919866767100").replace(/[^0-9]/g, "");
    let textStatus = "will be delighted to attend";
    if (attending === "maybe") textStatus = "will try our best to attend";
    if (attending === "no") textStatus = "regretfully won't be able to attend in person";

    const responseText = `Namaste! I/We (${guestName}, ${guestCount} Guests) ${textStatus} the wedding celebrations of ${data.couple.bride} & ${data.couple.groom}! ${rsvpNote ? `Note: "${rsvpNote}"` : ""}`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(responseText)}`;

    setTimeout(() => {
      setIsSendingRsvp(false);
      setRsvpSubmitted(true);
      window.open(waUrl, "_blank");
    }, 400);
  };

  const cleanPhone = (data.rsvp.whatsappNumber || "919866767100").replace(/[^0-9]/g, "");

  return (
    <section
      className="relative w-full py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 ep-bg-rsvp-stationery-section overflow-hidden border-b border-[#D6AD63]/30"
      id="rsvp"
    >
      {/* Authentic South Indian Pulli & Sikku Kolam Accents along Section Margins */}
      <div className="absolute -bottom-12 -left-12 pointer-events-none z-0 opacity-35 ep-kolam-breathe w-48 sm:w-64">
        <TraditionalPulliKolam className="w-full h-auto" />
      </div>
      <div className="absolute -bottom-12 -right-12 pointer-events-none z-0 opacity-35 ep-kolam-breathe w-48 sm:w-64">
        <TraditionalSikkuKolam className="w-full h-auto" />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* ========================================================
            REFINED HORIZONTAL INVITATION PANEL: COUNTDOWN & RSVP
            Stationery Cardstock with 24k Gold Foil Embossed Temple Trims
            ======================================================== */}
        <div className="relative ep-rsvp-card-stationery rounded-3xl p-6 sm:p-10 shadow-[0_25px_60px_rgba(84,45,42,0.16)] overflow-hidden">
          {/* Subtle architectural border accent */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-[#D6AD63]/30 via-[#781D36] to-[#D6AD63]/30" />

          {/* Corner Kolam Accents on Panel */}
          <div className="absolute top-2 left-2 w-8 h-8 opacity-45 pointer-events-none">
            <TraditionalCornerKolam className="w-full h-full" />
          </div>
          <div className="absolute top-2 right-2 w-8 h-8 opacity-45 pointer-events-none scale-x-[-1]">
            <TraditionalCornerKolam className="w-full h-full" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ----------------------------------------------------
                LEFT COLUMN: MUHURTHAM COUNTDOWN (5 Cols)
                ---------------------------------------------------- */}
            <div className="lg:col-span-5 text-center flex flex-col items-center justify-start pt-1">
              <span className="font-cinzel text-[10px] uppercase tracking-[0.28em] text-[#B88A3B] font-bold block mb-1">
                ✦ Sumuhurtham Timepiece ✦
              </span>
              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#781D36] tracking-tight mb-1 uppercase">
                Muhurtham Countdown
              </h3>
              <p className="font-serif text-xs sm:text-sm italic text-[#7E5B58] mb-4">
                {data.wedding.date} • {data.wedding.time}
              </p>

              {/* Four Gilded Countdown Units */}
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5 w-full max-w-sm mx-auto mb-4">
                {/* Days */}
                <div className="ep-countdown-unit-gilded rounded-xl py-3 px-1 flex flex-col items-center">
                  <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#781D36] leading-none mb-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    {String(timeLeft.days).padStart(2, "0")}
                  </span>
                  <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-bold">
                    Days
                  </span>
                </div>

                {/* Hours */}
                <div className="ep-countdown-unit-gilded rounded-xl py-3 px-1 flex flex-col items-center">
                  <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#781D36] leading-none mb-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-bold">
                    Hours
                  </span>
                </div>

                {/* Mins */}
                <div className="ep-countdown-unit-gilded rounded-xl py-3 px-1 flex flex-col items-center">
                  <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#781D36] leading-none mb-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-bold">
                    Mins
                  </span>
                </div>

                {/* Secs */}
                <div className="ep-countdown-unit-gilded rounded-xl py-3 px-1 flex flex-col items-center">
                  <span className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#781D36] leading-none mb-1 drop-shadow-[0_1px_1px_rgba(255,255,255,0.9)]">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                  <span className="font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-bold">
                    Secs
                  </span>
                </div>
              </div>

              {/* Venue Name Underneath */}
              <div className="flex items-center justify-center gap-1.5 text-xs font-serif text-[#7E5B58] px-2">
                <span className="text-[#781D36] text-xs">🏛️</span>
                <span className="font-semibold text-[#542D2A] text-center">
                  {data.wedding.venue}
                </span>
              </div>
            </div>

            {/* Subtle Vertical Divider (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-1 justify-center items-center self-stretch">
              <div className="w-[1px] h-full min-h-[220px] bg-gradient-to-b from-transparent via-[#D6AD63]/50 to-transparent" />
            </div>

            {/* ----------------------------------------------------
                RIGHT COLUMN: CELEBRATE WITH US / RSVP FORM (6 Cols)
                ---------------------------------------------------- */}
            <div className="lg:col-span-6 pt-1">
              <AnimatePresence mode="wait">
                {viewMode === "invite" ? (
                  /* State A: Sacred Invitation Proclamation */
                  <motion.div
                    key="invite-view"
                    className="text-center lg:text-left flex flex-col justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#B88A3B] font-bold block mb-1">
                      ✦ Sacred Invitation ✦
                    </span>
                    <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-[#781D36] mb-2 leading-tight uppercase">
                      Celebrate With Us
                    </h3>

                    <p className="font-serif text-sm sm:text-base text-[#542D2A] leading-relaxed italic mb-2">
                      &ldquo;We request the honour of your esteemed presence to celebrate the holy matrimony and shower your divine blessings upon the newlyweds.&rdquo;
                    </p>

                    <p className="font-serif text-xs text-[#7E5B58] leading-relaxed mb-5">
                      Your gracious presence will make our celebration complete and memorable.
                    </p>

                    {/* Action Buttons: Confirm Presence & Circular WhatsApp Symbol */}
                    <div className="flex items-center gap-3 justify-center lg:justify-start">
                      <button
                        onClick={() => {
                          setViewMode("rsvp");
                          emitAnalyticsInteraction("rsvp_open", "rsvp");
                        }}
                        className="flex-1 sm:flex-initial px-7 py-3 rounded-full bg-gradient-to-r from-[#781D36] via-[#65182F] to-[#541424] hover:from-[#65182F] hover:to-[#450F1D] text-[#FFF6E9] font-cinzel text-xs font-bold uppercase tracking-[0.2em] shadow-[0_4px_18px_rgba(120,29,54,0.35)] transition-all duration-200 hover:scale-105 border-2 border-[#DFB759] flex items-center justify-center gap-2"
                      >
                        <span>Confirm Your Presence</span>
                        <span>→</span>
                      </button>

                      {data.rsvp?.whatsappNumber && (
                        <a
                          href={`https://wa.me/${cleanPhone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 flex-shrink-0 border-2 border-white/80 group"
                          aria-label="Contact via WhatsApp"
                          title="Contact via WhatsApp"
                        >
                          <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current transition-transform group-hover:scale-110">
                            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15C10.56 20.15 9.11 19.76 7.85 19L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 15 3.8 13.47 3.8 11.91C3.81 7.37 7.5 3.67 12.05 3.67M9.13 7.33C8.96 7.33 8.68 7.39 8.44 7.65C8.2 7.91 7.53 8.54 7.53 9.83C7.53 11.12 8.47 12.36 8.6 12.53C8.73 12.7 10.45 15.36 13.09 16.5C15.28 17.45 15.73 17.26 16.21 17.22C16.69 17.18 17.76 16.59 17.98 15.96C18.2 15.33 18.2 14.79 18.14 14.68C18.08 14.57 17.91 14.5 17.65 14.37C17.39 14.24 16.12 13.61 15.88 13.52C15.64 13.43 15.47 13.39 15.3 13.65C15.13 13.91 14.65 14.47 14.5 14.64C14.35 14.81 14.21 14.83 13.95 14.7C13.69 14.57 12.85 14.3 11.86 13.41C11.09 12.72 10.57 11.87 10.42 11.61C10.27 11.35 10.4 11.21 10.53 11.08C10.65 10.96 10.79 10.78 10.92 10.63C11.05 10.48 11.1 10.37 11.19 10.2C11.28 10.03 11.23 9.88 11.17 9.75C11.11 9.62 10.63 8.45 10.43 7.97C10.23 7.5 10.03 7.57 9.88 7.56C9.74 7.55 9.57 7.55 9.4 7.55C9.23 7.55 8.96 7.61 8.79 7.78L9.13 7.33Z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  /* State B: Responsive RSVP Form */
                  <motion.div
                    key="rsvp-view"
                    className="flex flex-col justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-[#D6AD63]/30">
                      <div>
                        <span className="font-cinzel text-[9px] uppercase tracking-[0.2em] text-[#B88A3B] font-bold block">
                          Response Desk
                        </span>
                        <h4 className="font-cinzel text-sm sm:text-base font-bold text-[#781D36]">
                          Confirm Attendance
                        </h4>
                      </div>
                      <button
                        onClick={() => setViewMode("invite")}
                        className="font-cinzel text-[11px] font-semibold text-[#781D36] hover:text-[#541424] flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-[#FFF6E9]"
                      >
                        <span>← Back</span>
                      </button>
                    </div>

                    {rsvpSubmitted ? (
                      <div className="text-center py-4">
                        <div className="text-2xl mb-1.5">💌</div>
                        <h4 className="font-cinzel text-base font-bold text-[#781D36] mb-1">
                          Thank You, {guestName}!
                        </h4>
                        <p className="font-serif text-xs text-[#7E5B58] mb-3 leading-relaxed">
                          Your response has been confirmed. We eagerly look forward to welcoming you!
                        </p>
                        <button
                          onClick={() => setRsvpSubmitted(false)}
                          className="ep-btn-gold text-[10px] py-1 px-4"
                        >
                          Edit Response
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleRsvpSubmit} className="space-y-3">
                        {/* Name & Guests */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-semibold mb-0.5">
                              Full Name / Family *
                            </label>
                            <input
                              type="text"
                              required
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Eg: Rajesh & Family"
                              className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-lg px-2.5 py-1.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                            />
                          </div>

                          <div>
                            <label className="block font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-semibold mb-0.5">
                              Number of Guests
                            </label>
                            <select
                              value={guestCount}
                              onChange={(e) => setGuestCount(e.target.value)}
                              className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-lg px-2.5 py-1.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                            >
                              <option value="1">1 Guest</option>
                              <option value="2">2 Guests</option>
                              <option value="3">3 Guests</option>
                              <option value="4">4 Guests</option>
                              <option value="5">5+ Guests</option>
                            </select>
                          </div>
                        </div>

                        {/* Phone & Wishes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-semibold mb-0.5">
                              Phone / WhatsApp
                            </label>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="Eg: 9876543210"
                              className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-lg px-2.5 py-1.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                            />
                          </div>

                          <div>
                            <label className="block font-cinzel text-[9px] uppercase tracking-wider text-[#781D36] font-semibold mb-0.5">
                              Optional Wishes / Note
                            </label>
                            <input
                              type="text"
                              value={rsvpNote}
                              onChange={(e) => setRsvpNote(e.target.value)}
                              placeholder="Leave a note..."
                              className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-lg px-2.5 py-1.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSendingRsvp}
                          className="w-full py-2 rounded-full bg-gradient-to-r from-[#781D36] to-[#65182F] hover:from-[#65182F] text-[#FFF6E9] font-cinzel text-xs font-bold uppercase tracking-[0.18em] shadow-md transition-all border border-[#DFB759]/60 flex items-center justify-center gap-1.5 mt-1"
                        >
                          <span>{isSendingRsvp ? "Transmitting..." : "Confirm RSVP via WhatsApp"}</span>
                          <span>→</span>
                        </button>
                      </form>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CountdownAndRsvp;
