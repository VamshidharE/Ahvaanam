"use client";

import React, { useState, useEffect, useRef } from "react";
import { Star, Send, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TraditionalCornerKolam } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalFooter({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();

  const isBrideFirst = data.couple.primarySide === "bride";
  const firstName = isBrideFirst ? data.couple.bride : data.couple.groom;
  const secondName = isBrideFirst ? data.couple.groom : data.couple.bride;

  const quoteText = data.footer?.quote || data.footer?.blessing || "";
  const brandName = data.footer?.designer || "Ahvaanam";
  const serviceSubtitle = data.footer?.service || "Digital Wedding Invitations";
  const brandDisplay =
    brandName && brandName.toLowerCase() !== "ahvaanam"
      ? `${brandName} • ${serviceSubtitle}`
      : serviceSubtitle;

  const effectiveClientId =
    clientId ||
    (typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : undefined);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [hasRated, setHasRated] = useState<boolean>(false);
  const [feedbackId, setFeedbackId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [isSendingFeedback, setIsSendingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const feedbackIdRef = useRef<string | null>(null);
  const pendingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const storageKey = effectiveClientId ? `ahvaanam_feedback_${effectiveClientId}` : null;

  const getOrCreateDeviceId = () => {
    if (typeof window === "undefined") return "";
    try {
      let devId = localStorage.getItem("ahvaanam_device_id");
      if (!devId) {
        devId = "dev_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
        localStorage.setItem("ahvaanam_device_id", devId);
      }
      return devId;
    } catch {
      return "";
    }
  };

  // Restore previous rating from this device/session if already rated
  useEffect(() => {
    if (!storageKey || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.id) {
          setFeedbackId(saved.id);
          feedbackIdRef.current = saved.id;
        }
        if (saved.rating) {
          setRating(saved.rating);
          setHasRated(true);
          setShowFeedbackInput(true);
        }
        if (saved.feedback) {
          setFeedbackText(saved.feedback);
        }
        if (saved.submitted) {
          setFeedbackSubmitted(true);
        }
      }
    } catch {}
  }, [storageKey]);

  const handleRate = (star: number) => {
    setRating(star);
    setHasRated(true);
    setShowFeedbackInput(true);

    // Save locally immediately to guarantee instant response and state persistence
    if (storageKey && typeof window !== "undefined") {
      try {
        const current = JSON.parse(localStorage.getItem(storageKey) || "{}");
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...current,
            id: feedbackIdRef.current || current.id,
            rating: star,
          })
        );
      } catch {}
    }

    // Debounce network dispatch to collapse rapid taps into a single update
    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
    }

    pendingTimerRef.current = setTimeout(async () => {
      if (
        effectiveClientId &&
        !effectiveClientId.startsWith("preview") &&
        !effectiveClientId.startsWith("demo")
      ) {
        const deviceId = getOrCreateDeviceId();
        const activeId =
          feedbackIdRef.current ||
          (typeof window !== "undefined" && storageKey
            ? JSON.parse(localStorage.getItem(storageKey) || "{}").id
            : undefined);

        try {
          const res = await fetch(`/api/invitation/${effectiveClientId}/feedback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: activeId || undefined,
              deviceId,
              rating: star,
              feedback: feedbackText.trim(),
            }),
          });
          const resData = await res.json();
          if (resData.feedback?.id) {
            setFeedbackId(resData.feedback.id);
            feedbackIdRef.current = resData.feedback.id;
            if (storageKey && typeof window !== "undefined") {
              const current = JSON.parse(localStorage.getItem(storageKey) || "{}");
              localStorage.setItem(
                storageKey,
                JSON.stringify({
                  ...current,
                  id: resData.feedback.id,
                  rating: star,
                })
              );
            }
          }
        } catch (e) {
          console.warn("Feedback submission error:", e);
        }
      }
    }, 280);
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    if (pendingTimerRef.current) {
      clearTimeout(pendingTimerRef.current);
    }

    setIsSendingFeedback(true);
    const deviceId = getOrCreateDeviceId();
    const activeId =
      feedbackIdRef.current ||
      (typeof window !== "undefined" && storageKey
        ? JSON.parse(localStorage.getItem(storageKey) || "{}").id
        : undefined);

    if (
      effectiveClientId &&
      !effectiveClientId.startsWith("preview") &&
      !effectiveClientId.startsWith("demo")
    ) {
      try {
        const res = await fetch(`/api/invitation/${effectiveClientId}/feedback`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: activeId || undefined,
            deviceId,
            rating: rating || 5,
            feedback: feedbackText.trim(),
          }),
        });
        const resData = await res.json();
        if (resData.feedback?.id) {
          setFeedbackId(resData.feedback.id);
          feedbackIdRef.current = resData.feedback.id;
          if (storageKey && typeof window !== "undefined") {
            localStorage.setItem(
              storageKey,
              JSON.stringify({
                id: resData.feedback.id,
                rating: rating || 5,
                feedback: feedbackText.trim(),
                submitted: true,
              })
            );
          }
        }
      } catch (e) {
        console.warn("Feedback submission error:", e);
      }
    }
    setIsSendingFeedback(false);
    setFeedbackSubmitted(true);
  };

  return (
    <footer
      className="relative w-full ep-bg-footer-silk text-[#FFF6E9] py-10 sm:py-12 px-4 overflow-hidden border-t-2 border-[#D6AD63]"
      role="contentinfo"
    >
      {/* Authentic Corner Kolam Linework in Footer with Gold Glow */}
      <div className="absolute top-2 left-2 w-24 sm:w-36 opacity-35 pointer-events-none brightness-150 filter drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>
      <div className="absolute top-2 right-2 w-24 sm:w-36 opacity-35 pointer-events-none scale-x-[-1] brightness-150 filter drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]">
        <TraditionalCornerKolam className="w-full h-auto" />
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center flex flex-col items-center">
        {/* Illuminated Royal Couple Names */}
        <h3 className="font-cinzel text-xl sm:text-2xl lg:text-3xl text-[#FDEAB2] font-bold tracking-wider uppercase leading-tight my-1 drop-shadow-[0_2px_14px_rgba(223,183,89,0.5)]">
          {firstName} &amp; {secondName}
        </h3>

        {/* Short Closing Message (dynamically synced with editor) */}
        {quoteText && (
          <p className="font-serif text-xs sm:text-sm text-[#FFF6E9]/90 italic max-w-md mx-auto leading-relaxed mb-3">
            &ldquo;{quoteText}&rdquo;
          </p>
        )}

        {/* Fine Gold Divider */}
        <div className="w-28 h-[1px] bg-gradient-to-r from-transparent via-[#DFB759]/80 to-transparent my-3" />

        {/* 5-Star Interactive Rating Widget */}
        <div className="flex flex-col items-center my-2 w-full max-w-sm px-2">
          <span className="font-cinzel text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#DFB759] uppercase mb-1">
            {hasRated
              ? rating === 5
                ? "Thank you for the love! ❤️"
                : "Thank you for your rating! ✨"
              : "A Little Love For Ahvaanam ✨"}
          </span>
          <div className="flex items-center justify-center gap-1.5 py-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating ?? rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  aria-label={`Rate ${star} stars`}
                  className="p-1 text-[#DFB759]/60 hover:text-[#FFD700] transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                >
                  <Star
                    size={20}
                    className={`transition-colors ${
                      active
                        ? "fill-[#FFD700] text-[#FFD700] drop-shadow-[0_0_8px_rgba(255,215,0,0.8)]"
                        : "text-[#DFB759]/40"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Feedback Form - Revealed at the same place after pressing any star */}
          <AnimatePresence>
            {showFeedbackInput && !feedbackSubmitted && (
              <motion.form
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                onSubmit={handleFeedbackSubmit}
                className="w-full flex items-center gap-1.5 mt-2 overflow-hidden"
              >
                <input
                  type="text"
                  placeholder="Share a wish or feedback... (optional)"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  maxLength={200}
                  className="flex-1 bg-black/40 text-[#FFF6E9] placeholder-[#DFB759]/50 text-xs py-1.5 px-3.5 rounded-full border border-[#D6AD63]/50 focus:border-[#DFB759] focus:outline-none focus:ring-1 focus:ring-[#DFB759] font-serif shadow-inner transition-colors"
                />
                <button
                  type="submit"
                  disabled={isSendingFeedback || !feedbackText.trim()}
                  aria-label="Send feedback"
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    feedbackText.trim()
                      ? "bg-gradient-to-r from-[#DFB759] to-[#C49B27] text-[#542D2A] hover:scale-110 shadow-md cursor-pointer"
                      : "bg-[#DFB759]/20 text-[#DFB759]/40 cursor-not-allowed"
                  }`}
                >
                  <Send size={13} className={feedbackText.trim() ? "translate-x-0.5" : ""} />
                </button>
              </motion.form>
            )}

            {feedbackSubmitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-1.5 text-[11px] font-serif italic text-[#FDEAB2] mt-2"
              >
                <Check size={13} className="text-[#DFB759]" />
                <span>Feedback received with love! Thank you! ❤️</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Fine Gold Divider */}
        <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#DFB759]/50 to-transparent my-2" />

        {/* Ahvaanam Official Brand Section & Website Link */}
        <a
          href="https://www.ahvaanam.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center gap-1.5 transition-transform hover:scale-105 group"
        >
          {/* Ahvaanam Logo */}
          <img
            src="/images/logo.png"
            alt="Ahvaanam"
            className="h-7 sm:h-8 w-auto object-contain brightness-110 drop-shadow-[0_2px_8px_rgba(223,183,89,0.3)]"
            loading="lazy"
            decoding="async"
          />

          {/* Dynamic Editable Designer & Service Credits */}
          <span className="font-cinzel text-[9px] uppercase tracking-[0.22em] text-[#DFB759]/90 font-semibold">
            {brandDisplay}
          </span>

          {/* Ahvaanam Website Link */}
          <span className="font-cinzel text-[10px] tracking-[0.2em] text-[#D6AD63] font-bold group-hover:text-[#FFF6E9] transition-colors underline-offset-4 group-hover:underline">
            www.ahvaanam.in
          </span>
        </a>
      </div>
    </footer>
  );
}

export default RoyalFooter;
