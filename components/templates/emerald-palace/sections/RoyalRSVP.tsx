"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { RoyalDivider, RoyalCornerOrnament } from "../assets/Ornaments";
import { useEmeraldPalace } from "../context";

export function RoyalRSVP({ clientId }: { clientId?: string }) {
  const data = useEmeraldPalace();

  const [guestName, setGuestName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "">("yes");
  const [guestCount, setGuestCount] = useState("2");
  const [blessingMessage, setBlessingMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim()) return;

    setIsSending(true);

    // If client ID is present, optionally push to RSVP endpoint safely
    if (clientId) {
      try {
        await fetch(`/api/invitation/${clientId}/rsvp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: guestName,
            status: attending,
            guestCount: parseInt(guestCount, 10) || 1,
            wishes: blessingMessage,
          }),
        });
      } catch (err) {
        // Continue gracefully
      }
    }

    // Direct WhatsApp message integration
    const cleanPhone = (data.rsvp.whatsappNumber || "919876543210").replace(/[^0-9]/g, "");
    const responseText = attending === "yes"
      ? `Namaste! I/We (${guestName}, ${guestCount} Guests) will be delighted to attend the wedding celebrations of ${data.couple.bride} & ${data.couple.groom}! Warm wishes: "${blessingMessage || "Heartiest congratulations!"}"`
      : `Namaste! Regretfully I/We (${guestName}) won't be able to attend in person, but sending our warmest blessings to ${data.couple.bride} & ${data.couple.groom}!`;
    
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(responseText)}`;
    
    setTimeout(() => {
      setIsSending(false);
      setSubmitted(true);
      window.open(waUrl, "_blank");
    }, 600);
  };

  return (
    <section className="ep-section" id="rsvp">
      <div className="text-center mb-6">
        <span className="ep-section-tag">Gracious Response</span>
        <h2 className="ep-section-title ep-gold-text">{data.rsvp.title}</h2>
        <p className="ep-section-subtitle">{data.rsvp.message}</p>
        <RoyalDivider className="my-3 scale-90" />
      </div>

      <motion.div
        className="ep-royal-card max-w-xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="ep-card-inner-border" />
        <RoyalCornerOrnament position="tl" className="absolute top-2 left-2 opacity-60" />
        <RoyalCornerOrnament position="tr" className="absolute top-2 right-2 opacity-60" />
        <RoyalCornerOrnament position="bl" className="absolute bottom-2 left-2 opacity-60" />
        <RoyalCornerOrnament position="br" className="absolute bottom-2 right-2 opacity-60" />

        <div className="relative z-10 px-2 sm:px-4">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">💌</div>
              <h3 className="font-cinzel text-xl font-bold text-[#0C2B22] mb-2">
                Thank You for Responding!
              </h3>
              <p className="font-serif text-sm text-[#6B5C50] leading-relaxed mb-6">
                Your RSVP and heartfelt wishes have been conveyed to the family desk. We eagerly look forward to celebrating with you!
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="ep-btn-gold text-xs"
              >
                Send Another Response
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs uppercase tracking-wider font-cinzel font-semibold text-[#0C2B22] mb-1.5">
                  Guest Name(s) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh & Mrs. Sunita Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="ep-input"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-cinzel font-semibold text-[#0C2B22] mb-1.5">
                  Will You Grace Us With Your Presence? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending("yes")}
                    className={`p-3 rounded-xl border text-xs font-cinzel font-bold tracking-wider transition-all ${
                      attending === "yes"
                        ? "bg-[#0C2B22] text-[#DFB759] border-[#DFB759] shadow-md"
                        : "bg-white text-[#4A3B32] border-[#DFB759]/40 hover:bg-[#FAF5EB]"
                    }`}
                  >
                    🌸 Joyfully Attending
                  </button>
                  <button
                    type="button"
                    onClick={() => setAttending("no")}
                    className={`p-3 rounded-xl border text-xs font-cinzel font-bold tracking-wider transition-all ${
                      attending === "no"
                        ? "bg-[#8B1E2F] text-white border-[#8B1E2F] shadow-md"
                        : "bg-white text-[#4A3B32] border-[#DFB759]/40 hover:bg-[#FAF5EB]"
                    }`}
                  >
                    🕊️ Regretfully Cannot
                  </button>
                </div>
              </div>

              {attending === "yes" && (
                <div>
                  <label className="block text-xs uppercase tracking-wider font-cinzel font-semibold text-[#0C2B22] mb-1.5">
                    Number of Attending Guests
                  </label>
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="ep-input"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                    <option value="5">5+ Guests (Family)</option>
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs uppercase tracking-wider font-cinzel font-semibold text-[#0C2B22] mb-1.5">
                  Blessings &amp; Message for the Couple
                </label>
                <textarea
                  rows={3}
                  placeholder="Share your warm wishes and blessings..."
                  value={blessingMessage}
                  onChange={(e) => setBlessingMessage(e.target.value)}
                  className="ep-input resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSending}
                  className="ep-btn-gold w-full text-center"
                >
                  {isSending ? "Confirming..." : `✦ ${data.rsvp.buttonText} ✦`}
                </button>
              </div>

              {/* Contact Assistance */}
              <div className="mt-6 pt-4 border-t border-[#DFB759]/30 text-center">
                <p className="text-xs text-[#6B5C50] font-serif mb-2">
                  For travel or accommodation queries:
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-cinzel font-semibold text-[#0C2B22]">
                  {data.rsvp.contacts.map((c, i) => (
                    <a
                      key={i}
                      href={`tel:${c.value}`}
                      className="hover:text-[#9C7723] transition-colors inline-flex items-center gap-1"
                    >
                      <span>📞 {c.label}: {c.value}</span>
                    </a>
                  ))}
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  );
}
export default RoyalRSVP;
