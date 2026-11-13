"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RoyalDivider } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export function RoyalRSVP({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();

  const [attending, setAttending] = useState<"yes" | "maybe" | "no">("yes");
  const [guestName, setGuestName] = useState("");
  const [guestCount, setGuestCount] = useState("2");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSending(true);

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
            wishes: message,
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

    const responseText = `Namaste! I/We (${guestName}, ${guestCount} Guests) ${textStatus} the wedding celebrations of ${data.couple.bride} & ${data.couple.groom}! ${message ? `Message: "${message}"` : ""}`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(responseText)}`;

    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      window.open(waUrl, "_blank");
    }, 500);
  };

  return (
    <section className="ep-section bg-[#FFF6E9] scroll-mt-16" id="rsvp">
      {/* Section Header */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="ep-section-heading">Will You Be Joining Us?</h2>
        <p className="ep-section-subtitle">
          Please let us know your plans so we can make your celebration delightful.
        </p>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <div className="max-w-md mx-auto px-4">
        {submitted ? (
          <motion.div
            className="bg-[#FFFDF9] border-2 border-[#D6AD63] rounded-3xl p-6 sm:p-8 text-center shadow-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-4xl mb-2">💌</div>
            <h3 className="font-cinzel text-lg font-bold text-[#781D36] mb-2">
              Thank You, {guestName}!
            </h3>
            <p className="font-serif text-sm text-[#7E5B58] mb-6 leading-relaxed">
              Your response has been conveyed to the hospitality desk. We look forward to celebrating together!
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="ep-btn-gold text-xs py-2 px-5"
            >
              Update Response
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {/* 3 Choice Buttons */}
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

            {/* Form Fields Card */}
            <motion.form
              onSubmit={handleSubmit}
              className="bg-[#FFFDF9] border border-[#D6AD63]/60 rounded-3xl p-5 sm:p-6 shadow-md space-y-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Ramesh & Sangeeta Rao"
                  className="w-full bg-[#FFF6E9] border border-[#D6AD63]/50 rounded-xl px-3.5 py-2 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36]"
                />
              </div>

              {attending !== "no" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                      Attending Guests
                    </label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-[#FFF6E9] border border-[#D6AD63]/50 rounded-xl px-3 py-2 text-xs font-serif text-[#542D2A] outline-none"
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5+ Family</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765..."
                      className="w-full bg-[#FFF6E9] border border-[#D6AD63]/50 rounded-xl px-3 py-2 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36]"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-cinzel text-[11px] uppercase tracking-wider text-[#781D36] font-semibold mb-1">
                  Optional Note / Wishes
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Leave a sweet blessing..."
                  className="w-full bg-[#FFF6E9] border border-[#D6AD63]/50 rounded-xl px-3 py-2 text-xs font-serif text-[#542D2A] outline-none focus:border-[#781D36] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="ep-btn-burgundy w-full text-xs py-2.5"
              >
                <span>{isSending ? "Confirming..." : "Confirm & Send via WhatsApp"}</span>
                <span>✨</span>
              </button>
            </motion.form>
          </div>
        )}
      </div>
    </section>
  );
}
export default RoyalRSVP;
