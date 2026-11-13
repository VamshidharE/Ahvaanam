"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEmeraldPalace } from "../context";

interface WishItem {
  id: string;
  name: string;
  message: string;
  time: string;
}

export function GuestbookBlessings({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();

  const [wishText, setWishText] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [showAuthorInput, setShowAuthorInput] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [wishSuccess, setWishSuccess] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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
    {
      id: "w3",
      name: "Karthik & Sneha",
      message: "So thrilled to celebrate this magnificent union with you both in Hyderabad!",
      time: "Yesterday",
    },
  ]);

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
      setWishesList((prev) => [newWish, ...prev]);
      setWishText("");
      setAuthorName("");
      setShowAuthorInput(false);
      setIsSending(false);
      setWishSuccess(true);
      setTimeout(() => setWishSuccess(false), 3500);
    }, 350);
  };

  const displayedWishes = isExpanded ? wishesList : wishesList.slice(0, 2);

  return (
    <section
      className="relative w-full py-10 sm:py-14 px-4 sm:px-6 scroll-mt-16 bg-[#FFF6E9]"
      id="guestbook"
    >
      <div className="max-w-5xl mx-auto">
        {/* ========================================================
            REFINED GUESTBOOK: LUXURY BURGUNDY SILK SUITE
            Dimensional lighting, champagne-gold separators, zero generic SVGs
            ======================================================== */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-9 ep-bg-burgundy-brocade shadow-[0_20px_50px_rgba(101,24,47,0.35)] border border-[#DFB759]/60">
          {/* Subtle architectural gold trim at top */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#DFB759] to-transparent opacity-80" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ----------------------------------------------------
                LEFT SIDE: INPUT & PROCLAMATION (6 Cols)
                ---------------------------------------------------- */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#DFB759] font-bold block mb-1">
                Guestbook
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FFF6E9] mb-1.5 leading-tight">
                Share Your Warmest Blessings
              </h3>
              <p className="font-serif text-xs sm:text-sm text-[#FFF6E9]/85 italic mb-5 leading-relaxed">
                Leave your heartfelt wishes and blessings for {data.couple.bride} &amp; {data.couple.groom}.
              </p>

              {/* Single Elegant Message Input Bar */}
              <form onSubmit={handleSendWish} className="w-full max-w-md mx-auto lg:mx-0">
                {showAuthorInput && (
                  <motion.div
                    className="mb-2.5"
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your Name (e.g. Aunt Rekha & Uncle Mohan)"
                      className="w-full bg-[#FFF6E9] border border-[#DFB759] rounded-full px-4 py-2 text-xs font-serif text-[#542D2A] outline-none shadow-sm text-center focus:ring-1 focus:ring-[#DFB759]"
                      autoFocus
                    />
                  </motion.div>
                )}

                <div className="flex items-center bg-[#FFFDF9] rounded-full p-1 pl-4 border-2 border-[#DFB759] shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
                  <input
                    type="text"
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    placeholder="Write your wishes for the couple..."
                    className="flex-1 bg-transparent border-none outline-none font-serif text-xs sm:text-sm text-[#542D2A] placeholder:text-[#A38481]"
                  />
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-9 h-9 rounded-full bg-[#781D36] text-[#DFB759] hover:bg-[#541424] hover:text-[#FFF6E9] flex items-center justify-center transition-all duration-200 hover:scale-105 border border-[#DFB759]/60 shrink-0 shadow-sm"
                    aria-label="Send wish"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="w-4 h-4 fill-none stroke-current"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>

                <AnimatePresence>
                  {wishSuccess && (
                    <motion.p
                      className="font-cinzel text-xs text-[#DFB759] mt-2.5 font-semibold text-center lg:text-left"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      ✨ Your blessings have been received with love!
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>

            {/* Subtle Vertical Champagne-Gold Separator (Desktop Only) */}
            <div className="hidden lg:flex lg:col-span-1 justify-center items-center self-stretch">
              <div className="w-[1px] h-full min-h-[160px] bg-gradient-to-b from-transparent via-[#DFB759]/40 to-transparent" />
            </div>

            {/* ----------------------------------------------------
                RIGHT SIDE: RECENT BLESSINGS (5 Cols)
                ---------------------------------------------------- */}
            <div className="lg:col-span-5 flex flex-col justify-start">
              <span className="font-cinzel text-[10px] uppercase tracking-[0.25em] text-[#DFB759] font-bold block mb-3 text-center lg:text-left">
                Recent Blessings
              </span>

              {/* Message Cards */}
              <div className="space-y-2.5">
                {displayedWishes.map((w) => (
                  <motion.div
                    key={w.id}
                    className="bg-black/30 backdrop-blur-sm border border-[#DFB759]/25 rounded-2xl p-3 sm:p-3.5 shadow-sm text-left transition-all hover:border-[#DFB759]/45"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-[#DFB759]/25 text-[#DFB759] flex items-center justify-center text-[10px] font-bold shrink-0">
                          {w.name.charAt(0).toUpperCase()}
                        </div>
                        <h4 className="font-cinzel text-xs font-bold text-[#FFF6E9] truncate">
                          {w.name}
                        </h4>
                      </div>
                      <span className="font-serif text-[10px] text-[#DFB759]/80 shrink-0 italic">
                        {w.time}
                      </span>
                    </div>

                    <p className="font-serif text-xs text-[#FFF6E9]/90 italic leading-relaxed pl-7">
                      "{w.message}"
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* View All Action */}
              {wishesList.length > 2 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="font-cinzel text-[11px] text-[#DFB759] hover:text-[#FFF6E9] hover:underline transition-colors mt-3 self-center lg:self-start font-semibold"
                >
                  {isExpanded ? "← Show Less" : `View All (${wishesList.length}) Blessings →`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GuestbookBlessings;
