"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider, RoyalCornerOrnament } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

interface WishItem {
  id: string;
  name: string;
  message: string;
  time: string;
}

export function RsvpAndWishes({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();

  // --- Wishes State ---
  const [wishText, setWishText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [wishesList, setWishesList] = useState<WishItem[]>([
    {
      id: "w1",
      name: "Ramesh & Sunita",
      message: `Wishing ${data.couple.bride} & ${data.couple.groom} a lifetime of endless joy, love and togetherness.`,
      time: "Just now",
    },
    {
      id: "w2",
      name: "Sumitra Rao",
      message: "May your journey be blessed with happiness, health and prosperity. Congratulations!",
      time: "2 hours ago",
    },
  ]);
  const [isSendingWish, setIsSendingWish] = useState(false);
  const [wishToast, setWishToast] = useState(false);

  // --- RSVP State ---
  const [attending, setAttending] = useState<"yes" | "maybe" | "no">("yes");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [rsvpNote, setRsvpNote] = useState("");
  const [isSendingRsvp, setIsSendingRsvp] = useState(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  // Submit Wish
  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    if (!showAuthorInput) {
      setShowAuthorInput(true);
      return;
    }

    const name = authorName.trim() || "Well-wisher";
    const newWish: WishItem = {
      id: String(Date.now()),
      name,
      message: wishText.trim(),
      time: "Just now",
    };

    setIsSendingWish(true);

    if (clientId) {
      try {
        await fetch(`/api/invitation/${clientId}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            wishes: wishText.trim(),
            status: "yes",
          }),
        });
      } catch (err) {
        // Fallback gracefully
      }
    }

    setTimeout(() => {
      setWishesList((prev) => [newWish, ...prev]);
      setWishText("");
      setAuthorName("");
      setShowAuthorInput(false);
      setIsSendingWish(false);
      setWishToast(true);
      setTimeout(() => setWishToast(false), 4000);
    }, 350);
  };

  // Submit RSVP
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

    // WhatsApp forwarding
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
    }, 450);
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* ========================================================
          PART 1: LEAVE YOUR WISHES (Burgundy Ribbon)
          ======================================================== */}
      <section
        className="relative bg-gradient-to-b from-[#781D36] via-[#65182F] to-[#541424] text-[#FFF6E9] py-14 sm:py-20 px-4 sm:px-6 scroll-mt-16 overflow-hidden"
        id="wishes"
      >
        {/* Soft Gold Star Sparkles in Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#DFB759_1px,transparent_1px)] [background-size:28px_28px]" />

        {/* Hanging Warm Garland Lights */}
        <div className="absolute top-2 inset-x-0 flex justify-around pointer-events-none opacity-45">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#FFE8A3] shadow-[0_0_8px_#FFE8A3] animate-pulse"
              style={{ animationDelay: `${(i % 4) * 0.4}s` }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-xl mx-auto text-center">
          {/* Header */}
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#DFB759] font-bold">
            Heartfelt Blessings
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FFF6E9] mt-1 mb-2 font-bold">
            Leave Your Wishes
          </h2>
          <p className="font-serif text-xs sm:text-sm text-[#FFF6E9]/80 italic mb-6">
            Send your heartfelt blessings and wishes for the couple.
          </p>

          {/* Wish Input Bar */}
          <form onSubmit={handleSendWish} className="w-full">
            {showAuthorInput && (
              <motion.div
                className="mb-3"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Your Name (e.g. Aunt Rekha & Uncle Mohan)"
                  className="w-full bg-[#FFF6E9] border border-[#D6AD63] rounded-full px-5 py-2.5 text-xs font-serif text-[#542D2A] outline-none shadow-md text-center focus:ring-2 focus:ring-[#DFB759]"
                  autoFocus
                />
              </motion.div>
            )}

            <div className="flex items-center bg-white rounded-full p-1.5 pl-5 border-2 border-[#D6AD63]/80 shadow-[0_8px_25px_rgba(0,0,0,0.3)] max-w-lg mx-auto">
              <input
                type="text"
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your wishes for the couple..."
                className="flex-1 bg-transparent border-none outline-none font-serif text-xs sm:text-sm text-[#542D2A] placeholder:text-[#A38481]"
              />
              <button
                type="submit"
                disabled={isSendingWish}
                className="w-10 h-10 rounded-full bg-[#781D36] text-[#DFB759] hover:bg-[#541424] flex items-center justify-center transition-all duration-200 hover:scale-105 border border-[#DFB759]/60 shrink-0"
                aria-label="Send wish"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>

          {/* Success Toast */}
          <AnimatePresence>
            {wishToast && (
              <motion.p
                className="font-cinzel text-xs text-[#DFB759] mt-3 tracking-wider font-semibold"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                ✨ Thank you! Your warm blessings have been conveyed.
              </motion.p>
            )}
          </AnimatePresence>

          {/* Recent Blessings Wall */}
          <div className="mt-8 text-left">
            <span className="block font-cinzel text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#DFB759]/90 font-bold mb-3 text-center">
              Recent Blessings
            </span>
            <div className="space-y-2.5 max-w-lg mx-auto">
              {wishesList.slice(0, 3).map((w) => (
                <motion.div
                  key={w.id}
                  className="bg-black/25 backdrop-blur-sm border border-[#DFB759]/25 rounded-2xl p-3.5 flex items-start gap-3 shadow-inner"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="w-8 h-8 rounded-full bg-[#DFB759]/20 border border-[#DFB759]/40 flex items-center justify-center text-[#DFB759] text-xs font-bold shrink-0 mt-0.5">
                    {w.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-cinzel text-xs font-bold text-[#FFF6E9] truncate">
                        {w.name}
                      </h4>
                      <span className="font-serif text-[10px] text-[#FFF6E9]/60 shrink-0 italic">
                        {w.time}
                      </span>
                    </div>
                    <p className="font-serif text-xs text-[#FFF6E9]/90 mt-1 leading-relaxed">
                      "{w.message}"
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Wave Transition to Ivory RSVP */}
        <div className="absolute -bottom-1 inset-x-0 w-full overflow-hidden leading-none pointer-events-none">
          <svg
            viewBox="0 0 1200 48"
            className="w-full h-8 sm:h-12 text-[#FFF6E9] fill-current"
            preserveAspectRatio="none"
          >
            <path d="M0,0 C300,48 900,48 1200,0 L1200,48 L0,48 Z" />
          </svg>
        </div>
      </section>

      {/* ========================================================
          PART 2: WILL YOU BE JOINING US? (Ivory RSVP Card)
          ======================================================== */}
      <section className="ep-section bg-[#FFF6E9] scroll-mt-16 pt-8 pb-16" id="rsvp">
        <div className="text-center mb-6 sm:mb-8">
          <span className="font-cinzel text-xs uppercase tracking-[0.25em] text-[#B88A3B] font-bold">
            RSVP
          </span>
          <h2 className="ep-section-heading mt-1">Will You Be Joining Us?</h2>
          <p className="ep-section-subtitle">
            Please let us know your plans so we can make your celebration even more special.
          </p>
          <RoyalDivider className="my-3 scale-90" />
        </div>

        <div className="max-w-xl mx-auto px-4">
          {rsvpSubmitted ? (
            <motion.div
              className="bg-[#FFFDF9] border-2 border-[#D6AD63] rounded-3xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <RoyalCornerOrnament position="tl" className="w-6 h-6 opacity-70" />
              <RoyalCornerOrnament position="tr" className="w-6 h-6 opacity-70" />
              <RoyalCornerOrnament position="bl" className="w-6 h-6 opacity-70" />
              <RoyalCornerOrnament position="br" className="w-6 h-6 opacity-70" />

              <div className="text-4xl mb-3">💌</div>
              <h3 className="font-cinzel text-xl font-bold text-[#781D36] mb-2">
                Thank You, {guestName}!
              </h3>
              <p className="font-serif text-sm text-[#7E5B58] mb-6 leading-relaxed max-w-md mx-auto">
                Your response has been confirmed and conveyed to the hospitality desk. We are thrilled to celebrate this sacred milestone with you!
              </p>
              <button
                onClick={() => setRsvpSubmitted(false)}
                className="ep-btn-gold text-xs py-2 px-6"
              >
                Update Response
              </button>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* 3 Choice Tabs */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setAttending("yes")}
                  className={`ep-rsvp-choice-btn ${
                    attending === "yes"
                      ? "ep-rsvp-choice-selected"
                      : "ep-rsvp-choice-unselected"
                  }`}
                >
                  <span>✓</span>
                  <span>Yes, I'll Be There</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending("maybe")}
                  className={`ep-rsvp-choice-btn ${
                    attending === "maybe"
                      ? "ep-rsvp-choice-selected"
                      : "ep-rsvp-choice-unselected"
                  }`}
                >
                  <span>□</span>
                  <span>Maybe</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAttending("no")}
                  className={`ep-rsvp-choice-btn ${
                    attending === "no"
                      ? "ep-rsvp-choice-selected"
                      : "ep-rsvp-choice-unselected"
                  }`}
                >
                  <span>✕</span>
                  <span>Sorry, Can't Make It</span>
                </button>
              </div>

              {/* Form Card */}
              <motion.form
                onSubmit={handleRsvpSubmit}
                className="bg-[#FFFDF9] border border-[#D6AD63]/60 rounded-3xl p-5 sm:p-8 shadow-lg space-y-4 relative overflow-hidden"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <RoyalCornerOrnament position="tl" className="w-5 h-5 opacity-60" />
                <RoyalCornerOrnament position="tr" className="w-5 h-5 opacity-60" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="sm:col-span-2">
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Eg: Rajesh Kumar"
                      className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Guest Count */}
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                      Attending Guests
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Guests</option>
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Eg: 9876543210"
                      className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all shadow-inner"
                    />
                  </div>

                  {/* Note / Wishes */}
                  <div className="sm:col-span-2">
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                      Optional Note / Dietary
                    </label>
                    <textarea
                      rows={2}
                      value={rsvpNote}
                      onChange={(e) => setRsvpNote(e.target.value)}
                      placeholder="Leave a special note or dietary preferences for the host..."
                      className="w-full bg-[#FFF6E9]/60 border border-[#D6AD63]/70 rounded-xl px-3.5 py-2.5 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] focus:bg-white transition-all resize-none shadow-inner"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSendingRsvp}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-[#781D36] to-[#65182F] hover:from-[#65182F] hover:to-[#541424] text-[#FFF6E9] font-cinzel text-xs font-bold uppercase tracking-[0.2em] shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] border border-[#DFB759]/60 flex items-center justify-center gap-2"
                  >
                    <span>{isSendingRsvp ? "Sending..." : "Confirm & Send Response"}</span>
                    <span>→</span>
                  </button>
                </div>
              </motion.form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default RsvpAndWishes;
