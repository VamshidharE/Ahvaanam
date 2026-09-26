"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, Send, Check, MessageSquareHeart, Users } from "lucide-react";
import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export default function RSVP({ clientId }: { clientId?: string }) {
  const invitation = useRoseMandap();

  // RSVP Step States: "initial" | "select_count" | "confirmed"
  const [rsvpStep, setRsvpStep] = useState<"initial" | "select_count" | "confirmed">("initial");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  // Wishes States
  const [wishName, setWishName] = useState("");
  const [wishPhone, setWishPhone] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const [wishError, setWishError] = useState<string | null>(null);

  // Check saved localStorage state on client mount
  useEffect(() => {
    if (typeof window !== "undefined" && clientId) {
      const savedStatus = localStorage.getItem(`ahvaanam_rsvp_${clientId}`);
      const savedCount = localStorage.getItem(`ahvaanam_rsvp_count_${clientId}`);
      if (savedStatus === "true") {
        setRsvpStep("confirmed");
        if (savedCount) {
          setGuestCount(parseInt(savedCount, 10) || 1);
        }
      }
      const savedWish = localStorage.getItem(`ahvaanam_wish_${clientId}`);
      if (savedWish === "true") {
        setWishSent(true);
      }
    }
  }, [clientId]);

  // Helper to retrieve or create visitor token
  const getVisitorToken = () => {
    if (typeof window === "undefined") return "guest";
    let token = localStorage.getItem("ahvaanam_visitor_token");
    if (!token) {
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        token = crypto.randomUUID();
      } else {
        token = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
          const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        });
      }
      localStorage.setItem("ahvaanam_visitor_token", token);
    }
    return token;
  };

  // 1. Initial "YES, I'LL BE THERE" Tap -> Immediately record attendance with default 1 guest
  const handleInitialYes = async () => {
    setRsvpError(null);
    setRsvpLoading(true);
    emitAnalyticsInteraction("rsvp_open", "rsvp");

    const token = getVisitorToken();

    try {
      if (clientId) {
        const res = await fetch(`/api/invitation/${clientId}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attending: true,
            guest_name: "Guest",
            guest_count: 1,
            visitor_token: token,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to record attendance.");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(`ahvaanam_rsvp_${clientId}`, "true");
          localStorage.setItem(`ahvaanam_rsvp_count_${clientId}`, "1");
        }
      }

      setGuestCount(1);
      setRsvpStep("select_count");
    } catch (err: any) {
      console.error("RSVP error:", err);
      setRsvpError(err.message || "Failed to confirm attendance. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };

  // 2. Refined Flow: Update same RSVP record with chosen count
  const handleConfirmGuestCount = async (count: number) => {
    setRsvpError(null);
    setRsvpLoading(true);
    emitAnalyticsInteraction("rsvp_submit", "rsvp", { guest_count: count });

    const token = getVisitorToken();

    try {
      if (clientId) {
        const res = await fetch(`/api/invitation/${clientId}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            attending: true,
            guest_name: "Guest",
            guest_count: count,
            visitor_token: token,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to update guest count.");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(`ahvaanam_rsvp_${clientId}`, "true");
          localStorage.setItem(`ahvaanam_rsvp_count_${clientId}`, count.toString());
        }
      }

      setGuestCount(count);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      setRsvpStep("confirmed");
    } catch (err: any) {
      console.error("RSVP count update error:", err);
      setRsvpError(err.message || "Failed to update count. Please try again.");
    } finally {
      setRsvpLoading(false);
    }
  };

  // 3. Send Wishes Handler
  const handleSendWishes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) return;

    setWishError(null);
    setWishLoading(true);

    const token = getVisitorToken();
    const finalName = wishName.trim() || "Anonymous Guest";
    const finalPhone = wishPhone.trim() || undefined;

    try {
      if (clientId) {
        const res = await fetch(`/api/invitation/${clientId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            feedback: wishMessage.trim(),
            guestName: finalName,
            phone: finalPhone,
            rating: 5,
            visitor_token: token,
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to send wishes.");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem(`ahvaanam_wish_${clientId}`, "true");
        }
      }

      setWishSent(true);
      setWishMessage("");
    } catch (err: any) {
      console.error("Wish submission error:", err);
      setWishError(err.message || "Failed to send wishes. Please try again.");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <section id="rsvp" className="invitation-section rsvp-section relative overflow-hidden py-6 md:py-8">
      
      {/* Subtle Warm Ivory Radial Glow */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          background: "radial-gradient(ellipse at 50% 30%, rgba(247, 219, 167, 0.3) 0%, rgba(255, 240, 245, 0.1) 60%, transparent 80%)"
        }}
      />

      <div className="invitation-inner relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          
          {/* ======================================================== */}
          {/* ONE UNIFIED INVITATION PANEL                             */}
          {/* ======================================================== */}
          <div 
            className="rounded-[24px] sm:rounded-[32px] border border-[#d6a456]/40 p-5 sm:p-7 md:p-8 shadow-[0_6px_28px_rgba(92,68,37,0.07)] relative overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(255, 253, 248, 0.97) 0%, rgba(255, 247, 236, 0.93) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* MAIN UNIFIED TITLE */}
            <div className="text-center mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[#d6a456]/20">
              <h2 className="text-base sm:text-lg md:text-xl font-serif text-[#9a5b14] uppercase tracking-[1.5px] font-medium leading-snug max-w-xl mx-auto">
                We would love to celebrate this beautiful occasion with you.
              </h2>
            </div>

            {/* TWO SIDES IN ONE COMPOSITION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 items-center relative">
              
              {/* ======================================================== */}
              {/* LEFT: ATTENDANCE (PRIMARY ACTION)                       */}
              {/* ======================================================== */}
              <div className="flex flex-col justify-center h-full space-y-2.5 md:pr-3">

                {rsvpError && (
                  <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-xl text-center">
                    {rsvpError}
                  </div>
                )}

                {/* Attendance Interaction States */}
                <div>
                  <AnimatePresence mode="wait">
                    {rsvpStep === "initial" && (
                      <motion.div
                        key="step-initial"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        className="flex flex-col items-center md:items-start"
                      >
                        <motion.button
                          type="button"
                          onClick={handleInitialYes}
                          disabled={rsvpLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full max-w-xs py-3 px-6 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-[2px] cursor-pointer shadow-md transition-all duration-300 flex items-center justify-center gap-2 border border-[#F3CF65]/60"
                          style={{
                            background: "linear-gradient(135deg, #bd7418 0%, #d49b27 50%, #b86e14 100%)",
                          }}
                        >
                          <Heart size={15} className="fill-white text-white" />
                          <span className="font-serif tracking-[2px]">
                            {rsvpLoading ? "Recording..." : "YES, I'LL BE THERE"}
                          </span>
                          <Sparkles size={13} className="text-[#FFE8A3]" />
                        </motion.button>
                      </motion.div>
                    )}

                    {rsvpStep === "select_count" && (
                      <motion.div
                        key="step-count"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-2 text-center md:text-left"
                      >
                        <div className="text-xs font-serif font-bold text-[#4a2e12] uppercase tracking-[1px]">
                          HOW MANY ARE JOINING?
                        </div>

                        <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto md:mx-0">
                          {[1, 2, 3, 4].map((num) => {
                            const isSelected = guestCount === num;
                            const label = num === 4 ? "4+" : num.toString();
                            return (
                              <button
                                key={num}
                                type="button"
                                onClick={() => setGuestCount(num)}
                                className={`py-1.5 rounded-xl text-xs font-bold font-serif transition-all cursor-pointer border ${
                                  isSelected
                                    ? "bg-[#bd7418] text-white border-[#bd7418] shadow-xs"
                                    : "bg-white text-[#4a2e12] border-[#d6a456]/40 hover:border-[#bd7418]"
                                }`}
                              >
                                {label}
                              </button>
                            );
                          })}
                        </div>

                        <div className="pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleConfirmGuestCount(guestCount)}
                            disabled={rsvpLoading}
                            className="w-full max-w-xs py-2 px-5 rounded-full text-[11px] font-bold uppercase tracking-[1.5px] text-white shadow-xs cursor-pointer flex items-center justify-center gap-1.5 border border-[#F3CF65]/50"
                            style={{
                              background: "linear-gradient(135deg, #bd7418 0%, #c49b27 100%)",
                            }}
                          >
                            <Check size={12} strokeWidth={2.5} />
                            <span>{rsvpLoading ? "Updating..." : "CONFIRM ATTENDANCE"}</span>
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {rsvpStep === "confirmed" && (
                      <motion.div
                        key="step-confirmed"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-1.5 text-center md:text-left relative"
                      >
                        {showCelebration && (
                          <div className="absolute inset-0 pointer-events-none overflow-hidden">
                            {[...Array(4)].map((_, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 10, x: (i - 1.5) * 25, scale: 0.4 }}
                                animate={{ opacity: [0, 1, 0], y: -30, scale: [0.4, 1.2, 0.8] }}
                                transition={{ duration: 1.4, delay: i * 0.15, ease: "easeOut" }}
                                className="absolute bottom-2 left-1/2 md:left-4 text-xs"
                              >
                                {i % 2 === 0 ? "🌸" : "✨"}
                              </motion.span>
                            ))}
                          </div>
                        )}

                        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#52875a]/10 border border-[#52875a]/25 text-[#2e5d34] text-[10px] font-semibold">
                          <Check size={11} strokeWidth={2.5} />
                          <span>Attendance Confirmed</span>
                        </div>

                        <h3 className="text-sm font-serif font-bold text-[#4a2e12] uppercase tracking-[1px]">
                          WE&apos;LL SEE YOU THERE ❤️
                        </h3>
                        <p className="text-[11px] text-[#6d5133] font-serif italic">
                          Thank you for celebrating this special day with us.
                        </p>

                        <div className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-[#a06f2d]">
                          <Users size={11} />
                          <span>{guestCount === 4 ? "4+ guests" : `${guestCount} ${guestCount === 1 ? "guest" : "guests"}`}</span>
                          <span className="mx-1 opacity-40">•</span>
                          <button
                            type="button"
                            onClick={() => setRsvpStep("select_count")}
                            className="underline hover:text-[#bd7418] cursor-pointer"
                          >
                            Change
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* DELICATE VERTICAL DIVIDER ON DESKTOP, HORIZONTAL ON MOBILE */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#d6a456]/30 to-transparent -translate-x-1/2" />
              <div className="block md:hidden h-[1px] w-full bg-gradient-to-r from-transparent via-[#d6a456]/30 to-transparent my-1" />

              {/* ======================================================== */}
              {/* RIGHT: A LITTLE LOVE FOR THE COUPLE (WISHES)             */}
              {/* ======================================================== */}
              <div className="flex flex-col justify-center h-full space-y-2 md:pl-3">
                <div className="text-center md:text-left">
                  <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#a06f2d] block">
                    A Little Love For The Couple ✨
                  </span>
                </div>

                <AnimatePresence mode="wait">
                  {!wishSent ? (
                    <motion.form
                      key="wishes-form"
                      onSubmit={handleSendWishes}
                      className="space-y-2"
                    >
                      {wishError && (
                        <div className="p-1 bg-rose-50 border border-rose-200 text-rose-800 text-[10px] rounded-lg text-center">
                          {wishError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        <input
                          type="text"
                          placeholder="Your name (optional)"
                          value={wishName}
                          onChange={(e) => setWishName(e.target.value)}
                          maxLength={60}
                          className="w-full px-3 py-1.5 bg-white border border-[#d6a456]/35 rounded-xl text-xs text-[#4a2e12] placeholder-[#785323]/45 outline-none focus:border-[#bd7418] font-serif"
                        />
                        <input
                          type="tel"
                          placeholder="Phone number (optional)"
                          value={wishPhone}
                          onChange={(e) => setWishPhone(e.target.value)}
                          maxLength={25}
                          className="w-full px-3 py-1.5 bg-white border border-[#d6a456]/35 rounded-xl text-xs text-[#4a2e12] placeholder-[#785323]/45 outline-none focus:border-[#bd7418] font-serif"
                        />
                      </div>

                      {/* MESSAGE TEXTAREA WITH INLINE SEND BUTTON TO THE RIGHT */}
                      <div className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          required
                          placeholder="Write your wishes for the happy couple..."
                          value={wishMessage}
                          onChange={(e) => setWishMessage(e.target.value)}
                          maxLength={500}
                          style={{ height: "48px" }}
                          className="flex-1 px-3 py-1.5 bg-white border border-[#d6a456]/35 rounded-xl text-xs text-[#4a2e12] placeholder-[#785323]/45 outline-none focus:border-[#bd7418] font-serif resize-none"
                        />
                        <button
                          type="submit"
                          disabled={wishLoading || !wishMessage.trim()}
                          aria-label="Send Wishes"
                          title="Send Wishes"
                          className="h-[48px] w-[48px] shrink-0 rounded-xl text-white shadow-xs cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed border border-[#F3CF65]/50"
                          style={{
                            background: "linear-gradient(135deg, #bd7418 0%, #c49b27 100%)",
                          }}
                        >
                          <Send size={16} className="text-[#FFE8A3] -translate-x-[1px] translate-y-[1px]" />
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="wishes-sent"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-2 text-center md:text-left space-y-1"
                    >
                      <div className="inline-flex items-center gap-1 text-[#c49b27]">
                        <MessageSquareHeart size={14} />
                        <span className="text-xs font-serif font-bold uppercase tracking-[1px] text-[#4a2e12]">
                          YOUR WISHES HAVE BEEN SENT ✨
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6d5133] font-serif italic">
                        Thank you for your warm blessings and heartfelt love.
                      </p>
                      <div>
                        <button
                          type="button"
                          onClick={() => setWishSent(false)}
                          className="text-[10px] text-[#a06f2d] hover:underline font-serif cursor-pointer"
                        >
                          Send another wish
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* DIRECT WHATSAPP CONNECT (OPTIONAL) */}
            {invitation.rsvp?.whatsappNumber && (
              <div className="mt-3.5 pt-2.5 border-t border-[#d6a456]/20 flex items-center justify-center gap-2 text-center">
                <span className="text-[11px] text-[#785323]/85 font-medium font-serif">
                  Or connect directly via message
                </span>
                <a
                  href={`https://wa.me/${invitation.rsvp.whatsappNumber}?text=${encodeURIComponent(
                    `Hi, I received the wedding invitation for ${invitation.couple.groom} & ${invitation.couple.bride}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  title="Chat on WhatsApp"
                  onClick={() => emitAnalyticsInteraction("whatsapp_click", "rsvp")}
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#25D366] text-white shadow-xs hover:scale-110 active:scale-95 transition-transform"
                >
                  <svg
                    className="w-3 h-3 fill-current"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </a>
              </div>
            )}

          </div>

        </SectionReveal>
      </div>
    </section>
  );
}
