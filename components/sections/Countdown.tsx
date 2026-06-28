"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { invitation } from "../data/invitation";

export default function Countdown() {
  if (!invitation.countdown.enabled) return null;

  const weddingDate = new Date(invitation.countdown.date);

  function getTimeLeft() {
    const now = new Date().getTime();
    const distance = weddingDate.getTime() - now;

    if (distance <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(distance / (1000 * 60 * 60 * 24)),
      hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((distance / (1000 * 60)) % 60),
      seconds: Math.floor((distance / 1000) % 60),
    };
  }

  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const Item = ({
    value,
    label,
  }: {
    value: number;
    label: string;
  }) => (
    <motion.div
      whileHover={{ scale: 1.04 }}
      className="rounded-3xl border border-yellow-500/20 bg-white/5 p-8 backdrop-blur-xl text-center"
    >
      <div className="text-5xl font-bold text-yellow-200">
        {String(value).padStart(2, "0")}
      </div>

      <div className="mt-3 text-xs uppercase tracking-[5px] text-yellow-300">
        {label}
      </div>
    </motion.div>
  );

  return (
    <section className="py-24 px-6">

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14 text-center text-5xl text-yellow-200 [font-family:var(--great)]"
      >
        Countdown To Forever
      </motion.h2>

      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4">

        <Item value={time.days} label="Days" />
        <Item value={time.hours} label="Hours" />
        <Item value={time.minutes} label="Minutes" />
        <Item value={time.seconds} label="Seconds" />

      </div>

    </section>
  );
}