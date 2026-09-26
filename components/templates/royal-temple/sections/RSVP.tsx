"use client";

import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, HeartHandshake, Phone, Mail } from "lucide-react";
import { InvitationData } from "@/lib/template-engine/types";
import RsvpSubmissionForm from "@/components/rsvp/RsvpSubmissionForm";

interface RSVPProps {
  data: InvitationData;
  clientId?: string;
}

export default function RSVP({ data, clientId }: RSVPProps) {
  const shouldReduceMotion = useReducedMotion();
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  const fadeIn = shouldReduceMotion
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : { initial: { opacity: 0, y: 25 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } };

  const { rsvp } = data;
  if (!rsvp.enabled) return null;

  const whatsappPhone = rsvp.whatsappNumber?.replace(/[^0-9+]/g, "") || "+919866767100";
  const whatsappText = encodeURIComponent(
    `Namaste! We are honored to receive the wedding invitation of ${data.couple.groom.name} & ${data.couple.bride.name}. We look forward to celebrating with you!`
  );
  const whatsappUrl = `https://wa.me/${whatsappPhone.replace("+", "")}?text=${whatsappText}`;

  return (
    <section className="relative py-16 px-4 flex justify-center bg-[#FCF8F0]">
      <div className="max-w-2xl w-full text-center">
        
        <motion.div {...fadeIn} className="rt-card p-8 sm:p-12">
          
          <div className="text-3xl text-[#C59B27] mb-2 font-serif">❦</div>
          
          <p className="text-[10px] uppercase tracking-[3px] font-bold text-[#8C6B12] font-serif">
            Warmest Wishes
          </p>

          <h2 className="text-3xl sm:text-4xl font-bold text-[#68121A] font-serif mt-1 mb-3">
            {rsvp.title || "Will You Celebrate With Us?"}
          </h2>

          <div className="rt-divider">
            <span className="rt-divider-line" />
            <span className="rt-divider-icon">𑁍</span>
            <span className="rt-divider-line" />
          </div>

          <p className="text-xs sm:text-sm text-[#5C4838] leading-relaxed max-w-md mx-auto mb-8 font-serif italic">
            "{rsvp.message || "Your esteemed presence and auspicious blessings are the greatest gift to our union."}"
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            
            {/* WhatsApp RSVP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rt-btn text-xs w-full sm:w-auto"
            >
              <MessageCircle size={15} />
              <span>{rsvp.whatsappLabel || "RSVP on WhatsApp"}</span>
            </a>

            {/* In-app Guest RSVP Form */}
            {clientId && (
              <button
                onClick={() => setShowRsvpModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#C59B27] bg-white text-[#68121A] text-xs font-bold uppercase tracking-[1.5px] hover:bg-[#FAF6EE] transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-sm"
              >
                <HeartHandshake size={15} />
                <span>Confirm Attendance</span>
              </button>
            )}

          </div>

          {/* Additional Contact details */}
          {rsvp.contacts && rsvp.contacts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-[#C59B27]/20 flex flex-wrap items-center justify-center gap-6 text-xs text-[#5C4838]">
              {rsvp.contacts.map((contact, idx) => (
                <div key={idx} className="flex items-center gap-1.5 font-medium">
                  {contact.type === "email" ? (
                    <Mail size={13} className="text-[#C59B27]" />
                  ) : (
                    <Phone size={13} className="text-[#C59B27]" />
                  )}
                  <span>{contact.label}:</span>
                  <span className="text-[#68121A] font-semibold">{contact.value}</span>
                </div>
              ))}
            </div>
          )}

        </motion.div>

        {/* Modal form */}
        {showRsvpModal && clientId && (
          <div className="fixed inset-0 z-[10000] bg-black/80 flex items-center justify-center p-4">
            <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#C59B27]">
              <button
                onClick={() => setShowRsvpModal(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black text-sm font-bold p-2"
              >
                ✕ Close
              </button>
              <div className="mt-2">
                <RsvpSubmissionForm clientId={clientId} />
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
