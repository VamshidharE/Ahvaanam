"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { invitation } from "../data/invitation";

export default function RSVP() {
  if (!invitation.rsvp.enabled) return null;

  return (
    <section className="py-24 px-6">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-5xl text-yellow-200 [font-family:var(--great)]"
      >
        RSVP
      </motion.h2>

      <div className="mx-auto mt-5 mb-12 flex w-48 items-center justify-center gap-3">
        <div className="h-px flex-1 bg-yellow-500/40" />
        <span className="text-yellow-300">✦ ✦ ✦</span>
        <div className="h-px flex-1 bg-yellow-500/40" />
      </div>

      <div className="mx-auto max-w-2xl rounded-[36px] border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#24161c] to-[#161015] p-10 text-center">

        <p className="text-lg text-yellow-100/80">
          Your presence is the greatest gift to us.
          Kindly let us know if you will be joining our celebration.
        </p>

        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:justify-center">

          <a
            href={`https://wa.me/${invitation.rsvp.whatsapp}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-[#25D366]/40 bg-[#1b2d22] px-8 py-4 text-white transition hover:scale-105"
          >
            <MessageCircle size={20} />
            WhatsApp
          </a>

          <a
            href={`tel:${invitation.rsvp.phone}`}
            className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-[#d4af37]/40 bg-[#4a2b19] px-8 py-4 text-[#f8e7b5] transition hover:scale-105"
          >
            <Phone size={20} />
            Call
          </a>

        </div>

      </div>

    </section>
  );
}