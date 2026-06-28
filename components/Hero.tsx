"use client";

import { motion } from "framer-motion";

import Background from "./background/Background";
import CouplePhoto from "./hero/CouplePhoto";
import ScrollButton from "./shared/ScrollButton";

import { invitation } from "./data/invitation";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">

      <Background />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="uppercase tracking-[8px] text-yellow-300 text-sm"
        >
          {invitation.hero.title}
        </motion.p>

        <div className="mt-5 h-px w-40 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />

        <div className="my-4">
          <CouplePhoto />
        </div>

        <div className="mt-4 flex items-center justify-center gap-5 flex-wrap">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl text-yellow-200 [font-family:var(--great)]"
          >
            {invitation.groom.name}
          </motion.h1>

          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-3xl"
          >
            ❤️
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl text-yellow-200 [font-family:var(--great)]"
          >
            {invitation.bride.name}
          </motion.h1>

        </div>

        <div className="my-5 flex items-center justify-center gap-3">
          <div className="h-px w-20 bg-yellow-500/40" />
          <span className="text-yellow-300 text-sm tracking-[4px]">
            ✦ ✦ ✦
          </span>
          <div className="h-px w-20 bg-yellow-500/40" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .8 }}
          className="mx-auto mt-8 max-w-2xl text-xl leading-8 text-yellow-100/85"
        >
          {invitation.hero.subtitle}
        </motion.p>

        <ScrollButton
          targetId="wedding-details"
          text={invitation.hero.buttonText}
        />

      </div>

    </section>
  );
}