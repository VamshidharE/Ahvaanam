"use client";

import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import { invitation } from "../data/invitation";

export default function Venue() {
  const venue = invitation.wedding;

  return (
    <section className="py-24 px-6">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center text-5xl text-yellow-200 [font-family:var(--great)]"
      >
        Venue
      </motion.h2>

      <div className="mx-auto mt-5 mb-12 flex w-48 items-center justify-center gap-3">
        <div className="h-px flex-1 bg-yellow-500/40" />
        <span className="text-yellow-300">✦ ✦ ✦</span>
        <div className="h-px flex-1 bg-yellow-500/40" />
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-[36px] border-2 border-[#d4af37]/40 bg-gradient-to-b from-[#24161c] to-[#161015] p-3">

        <div className="overflow-hidden rounded-[28px]">
          <iframe
            src={venue.embed}
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="p-10 text-center">

          <div className="mb-5 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#d4af37]/40 bg-[#2a1a12] text-3xl">
              📍
            </div>
          </div>

          <h3 className="text-4xl text-[#f6e7b8] [font-family:var(--great)]">
            {venue.venue}
          </h3>

          <div className="my-6 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-[#d4af37]/40" />
            <span className="text-[#d4af37]">✦ ✦ ✦</span>
            <div className="h-px w-16 bg-[#d4af37]/40" />
          </div>

          <p className="text-lg text-yellow-100/80">
            {venue.address}
          </p>

          <p className="mt-2 text-yellow-100/60">
            {venue.city}
          </p>

          <motion.a
            href={venue.maps}
            target="_blank"
            whileHover={{
              scale: 1.03,
            }}
            whileTap={{
              scale: 0.98,
            }}
            className="
              mt-8
              inline-flex
              items-center
              gap-3
              rounded-xl
              border-2
              border-[#d4af37]/40
              bg-gradient-to-b
              from-[#4a2b19]
              to-[#2b180f]
              px-8
              py-4
              text-[#f8e7b5]
              transition-all
              duration-300
              hover:shadow-[0_0_20px_rgba(212,175,55,.35)]
            "
          >
            <Navigation size={20} />
            Navigate
          </motion.a>

        </div>

      </div>

    </section>
  );
}