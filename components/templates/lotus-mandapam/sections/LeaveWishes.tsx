"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function LeaveWishes({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();
  const [wishText, setWishText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [submittedWishes, setSubmittedWishes] = useState<Array<{ name: string; message: string; time: string }>>([
    {
      name: "Ramesh & Sunita",
      message: `Wishing ${data.couple.bride} & ${data.couple.groom} a lifetime of endless joy, love, and sacred companionship!`,
      time: "Just now",
    },
    {
      name: "Kavita Rao",
      message: "May your union be blessed with immense prosperity and laughter. Congratulations!",
      time: "1 hour ago",
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleSendWish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishText.trim()) return;

    if (!showAuthorInput) {
      setShowAuthorInput(true);
      return;
    }

    const name = authorName.trim() || "Well-wisher";
    const newWish = {
      name,
      message: wishText.trim(),
      time: "Just now",
    };

    setIsSending(true);

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
        // Continue gracefully
      }
    }

    setTimeout(() => {
      setSubmittedWishes((prev) => [newWish, ...prev]);
      setWishText("");
      setAuthorName("");
      setShowAuthorInput(false);
      setIsSending(false);
      setSuccessToast(true);
      setTimeout(() => setSuccessToast(false), 4000);
    }, 400);
  };

  return (
    <section className="ep-wishes-section scroll-mt-16" id="wishes">
      {/* Decorative Hanging Bougainvillea Branch SVG Top Left */}
      <div className="absolute top-0 left-0 w-36 sm:w-48 pointer-events-none opacity-40">
        <svg viewBox="0 0 160 120" fill="none">
          <path d="M 0,0 C 40,20 80,10 140,40 C 160,50 140,80 120,70" stroke="#DFB759" strokeWidth="1" strokeDasharray="3 3" />
          <circle cx="40" cy="20" r="12" fill="#E91E63" opacity="0.6" />
          <circle cx="80" cy="24" r="16" fill="#AD1457" opacity="0.7" />
          <circle cx="120" cy="50" r="14" fill="#F48FB1" opacity="0.8" />
        </svg>
      </div>

      {/* Decorative Warm Fairy Lights Top Bar */}
      <div className="absolute top-2 inset-x-0 flex justify-around pointer-events-none opacity-50">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FFE8A3] shadow-[0_0_8px_#FFE8A3] animate-pulse" />
        ))}
      </div>

      <div className="relative z-10 max-w-xl mx-auto text-center px-4">
        {/* Section Heading */}
        <h2 className="font-cinzel text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#D6AD63] mb-2">
          Leave Your Wishes
        </h2>
        <p className="font-serif text-sm text-[#FFF6E9]/80 mb-6 italic">
          Send your warmest blessings and love to the celebrating couple.
        </p>

        {/* Input Bar */}
        <form onSubmit={handleSendWish} className="w-full">
          {showAuthorInput && (
            <motion.div
              className="mb-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name (e.g. Aunt Rekha & Uncle Mohan)"
                className="w-full bg-[#FFF6E9] border border-[#D6AD63] rounded-full px-4 py-2 text-xs font-serif text-[#542D2A] outline-none shadow-sm text-center"
                autoFocus
              />
            </motion.div>
          )}

          <div className="ep-wishes-input-bar">
            <input
              type="text"
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Write your wishes for the couple..."
              className="ep-wishes-input"
            />
            <button
              type="submit"
              disabled={isSending}
              className="ep-wishes-send-btn"
              aria-label="Send wish"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form>

        {/* Success Alert */}
        <AnimatePresence>
          {successToast && (
            <motion.p
              className="font-cinzel text-xs text-[#FDEAB2] mt-3 tracking-wider font-semibold"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              💌 Thank you! Your warm wishes have been shared with the couple!
            </motion.p>
          )}
        </AnimatePresence>

        {/* Recent Wishes List */}
        {submittedWishes.length > 0 && (
          <div className="mt-8 space-y-3 text-left">
            <span className="font-cinzel text-[10px] uppercase tracking-[0.2em] text-[#D6AD63] block text-center">
              Heartfelt Blessings
            </span>
            {submittedWishes.slice(0, 3).map((w, i) => (
              <div
                key={i}
                className="bg-[#FFF6E9]/10 border border-[#D6AD63]/30 rounded-2xl p-3.5 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between text-xs text-[#FDEAB2] font-cinzel font-semibold mb-1">
                  <span>{w.name}</span>
                  <span className="text-[10px] opacity-70 font-serif">{w.time}</span>
                </div>
                <p className="font-serif text-sm text-[#FFF6E9]/90 italic leading-snug">
                  "{w.message}"
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
export default LeaveWishes;
