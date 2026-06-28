"use client";

import { motion } from "framer-motion";
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { invitation } from "../data/invitation";

export default function WeddingDetails() {
  const wedding = invitation.wedding;

  return (
    <section
      id="wedding-details"
      className="relative py-24 px-6"
    >
      <div className="mx-auto max-w-5xl rounded-[40px] border border-yellow-500/20 bg-white/5 p-12 backdrop-blur-xl">

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-5xl text-yellow-200 [font-family:var(--great)]"
        >
          Wedding Ceremony
        </motion.h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">

          <div className="flex items-center gap-4">
            <CalendarDays className="text-yellow-400" size={30} />

            <div>
              <p className="text-xs uppercase tracking-[4px] text-yellow-300">
                Date
              </p>

              <h3 className="text-2xl text-white">
                {wedding.date}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Clock3 className="text-yellow-400" size={30} />

            <div>
              <p className="text-xs uppercase tracking-[4px] text-yellow-300">
                Time
              </p>

              <h3 className="text-2xl text-white">
                {wedding.time}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="text-yellow-400" size={30} />

            <div>
              <p className="text-xs uppercase tracking-[4px] text-yellow-300">
                Venue
              </p>

              <h3 className="text-2xl text-white">
                {wedding.venue}
              </h3>

              <p className="text-yellow-100/70">
                {wedding.city}
              </p>
            </div>
          </div>

        </div>

        <motion.a
          href={wedding.maps}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 30px rgba(255,215,0,.3)",
          }}
          whileTap={{ scale: 0.97 }}
          className="
            mx-auto
            mt-16
            flex
            w-fit
            rounded-full
            border
            border-yellow-400/30
            bg-yellow-500/10
            px-8
            py-4
            text-yellow-100
          "
        >
          Open Google Maps
        </motion.a>

      </div>
    </section>
  );
}