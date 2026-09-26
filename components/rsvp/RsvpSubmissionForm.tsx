"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, Send, Check, MessageSquareHeart, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export default function RsvpSubmissionForm({ clientId }: { clientId: string }) {
  const [rsvpStep, setRsvpStep] = useState<"initial" | "select_count" | "confirmed">("initial");
  const [guestCount, setGuestCount] = useState<number>(1);
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpError, setRsvpError] = useState<string | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const [wishName, setWishName] = useState("");
  const [wishPhone, setWishPhone] = useState("");
  const [wishMessage, setWishMessage] = useState("");
  const [wishLoading, setWishLoading] = useState(false);
  const [wishSent, setWishSent] = useState(false);
  const [wishError, setWishError] = useState<string | null>(null);

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
      setRsvpError(err.message || "Failed to confirm attendance.");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleConfirmGuestCount = async (count: number) => {
    setRsvpError(null);
    setRsvpLoading(true);
    emitAnalyticsInteraction("rsvp_submit", "rsvp", { guest_count: count });

    const token = getVisitorToken();

    try {
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

      setGuestCount(count);
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 2000);
      setRsvpStep("confirmed");
    } catch (err: any) {
      setRsvpError(err.message || "Failed to update guest count.");
    } finally {
      setRsvpLoading(false);
    }
  };

  const handleSendWishes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishMessage.trim()) return;

    setWishError(null);
    setWishLoading(true);

    const token = getVisitorToken();
    const finalName = wishName.trim() || "Anonymous Guest";
    const finalPhone = wishPhone.trim() || undefined;

    try {
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
        throw new Error(data.error || "Could not send wishes.");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem(`ahvaanam_wish_${clientId}`, "true");
      }

      setWishSent(true);
      setWishMessage("");
    } catch (err: any) {
      setWishError(err.message || "Failed to send wishes.");
    } finally {
      setWishLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4" id="rsvp">
      <div 
        className="rounded-[24px] sm:rounded-[32px] border border-[#d6a456]/40 p-5 sm:p-7 md:p-8 shadow-[0_6px_28px_rgba(92,68,37,0.07)] bg-white/95"
      >
        {/* MAIN UNIFIED TITLE */}
        <div className="text-center mb-4 sm:mb-5 pb-3 sm:pb-4 border-b border-[#d6a456]/20">
          <h2 className="text-base sm:text-lg md:text-xl font-serif text-[#9a5b14] uppercase tracking-[1.5px] font-medium leading-snug max-w-xl mx-auto">
            We would love to celebrate this beautiful occasion with you.
          </h2>
        </div>

        {/* TWO SIDES IN ONE COMPOSITION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-7 items-center relative">
          
          {/* LEFT: ATTENDANCE */}
          <div className="flex flex-col justify-center h-full space-y-2.5 md:pr-3">
            {rsvpError && (
              <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-[11px] rounded-xl text-center">
                {rsvpError}
              </div>
            )}

            <AnimatePresence mode="wait">
              {rsvpStep === "initial" && (
                <motion.div
                  key="step-initial"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  className="flex flex-col items-center md:items-start"
                >
                  <button
                    type="button"
                    onClick={handleInitialYes}
                    disabled={rsvpLoading}
                    className="w-full max-w-xs py-3 px-6 rounded-full text-white text-xs sm:text-sm font-bold uppercase tracking-[2px] cursor-pointer shadow-md flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #bd7418 0%, #d49b27 50%, #b86e14 100%)",
                    }}
                  >
                    <Heart size={15} className="fill-white text-white" />
                    <span className="font-serif tracking-[2px]">
                      {rsvpLoading ? "Recording..." : "YES, I'LL BE THERE"}
                    </span>
                    <Sparkles size={13} className="text-[#FFE8A3]" />
                  </button>
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
                      className="w-full max-w-xs py-2 px-5 rounded-full text-[11px] font-bold uppercase tracking-[1.5px] text-white shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
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
                  className="space-y-1.5 text-center md:text-left"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold border border-emerald-200">
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

          {/* DIVIDER */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#d6a456]/30 to-transparent -translate-x-1/2" />
          <div className="block md:hidden h-[1px] w-full bg-gradient-to-r from-transparent via-[#d6a456]/30 to-transparent my-1" />

          {/* RIGHT: WISHES */}
          <div className="flex flex-col justify-center h-full space-y-2 md:pl-3">
            <div className="text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[1.5px] font-bold text-[#a06f2d] block">
                A Little Love For The Couple ✨
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!wishSent ? (
                <form
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
                      className="w-full px-3 py-1.5 bg-[#FAF9F6] border border-[#d6a456]/35 rounded-xl text-xs text-[#4a2e12] outline-none font-serif"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number (optional)"
                      value={wishPhone}
                      onChange={(e) => setWishPhone(e.target.value)}
                      maxLength={25}
                      className="w-full px-3 py-1.5 bg-[#FAF9F6] border border-[#d6a456]/35 rounded-xl text-xs text-[#4a2e12] outline-none font-serif"
                    />
                  </div>

                  {/* INLINE TEXTAREA AND SEND BUTTON */}
                  <div className="flex items-center gap-2">
                    <textarea
                      rows={2}
                      required
                      placeholder="Write your wishes for the happy couple..."
                      value={wishMessage}
                      onChange={(e) => setWishMessage(e.target.value)}
                      maxLength={500}
                      style={{ height: "48px" }}
                      className="flex-1 px-3 py-1.5 bg-[#FAF9F6] border border-[#d6a456]/35 rounded-xl text-xs text-[#4a2e12] outline-none font-serif resize-none"
                    />
                    <button
                      type="submit"
                      disabled={wishLoading || !wishMessage.trim()}
                      aria-label="Send Wishes"
                      title="Send Wishes"
                      className="h-[48px] w-[48px] shrink-0 rounded-xl text-white shadow-xs cursor-pointer flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: "linear-gradient(135deg, #bd7418 0%, #c49b27 100%)",
                      }}
                    >
                      <Send size={16} className="text-[#FFE8A3] -translate-x-[1px] translate-y-[1px]" />
                    </button>
                  </div>
                </form>
              ) : (
                <div
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
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
