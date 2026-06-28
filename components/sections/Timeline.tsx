"use client";

import { motion } from "framer-motion";
import { invitation } from "../data/invitation";

export default function Timeline() {
  const events = invitation.timeline;

  if (events.length === 0) return null;

  return (
    <section className="relative py-24 px-6">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center text-5xl text-yellow-200 [font-family:var(--great)]"
      >
        Wedding Events
      </motion.h2>

      <div className="mx-auto max-w-4xl">

        {events.map((event, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="mb-10"
          >
            {/* Divider */}
            {index !== 0 && (
              <div className="mb-10 flex items-center justify-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
                <span className="text-xl text-[#d4af37]">✦</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
              </div>
            )}

            <div className="rounded-[28px] border border-[#d4af37]/45 bg-gradient-to-b from-[#24161c] to-[#161015] p-2 backdrop-blur-md">

                <div className="rounded-[22px] border border-[#d4af37]/20 p-6">

                    <div className="flex flex-col items-center">
                    <span className="mb-3 text-3xl">{event.icon}</span>

                    <h3 className="text-center text-4xl text-[#f6e7b8] [font-family:var(--great)]">
                        {event.title}
                    </h3>
                    </div>

                    <div className="mt-6 flex flex-col items-center justify-center gap-2 text-center md:flex-row md:gap-10">

                    <div>
                        <p className="text-xs uppercase tracking-[4px] text-yellow-500">
                        Date
                        </p>

                        <p className="mt-2 text-lg text-yellow-100">
                        {event.date}
                        </p>
                    </div>

                    <div className="hidden h-10 w-px bg-yellow-500/30 md:block" />

                    <div>
                        <p className="text-xs uppercase tracking-[4px] text-yellow-500">
                        Time
                        </p>

                        <p className="mt-2 text-lg text-yellow-100">
                        {event.time}
                        </p>
                    </div>

                    </div>

                </div>

                </div>

          </motion.div>
        ))}

      </div>

    </section>
  );
}