"use client";

import { motion } from "framer-motion";

export default function Glow() {
  return (
    <>
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        left-1/2
        top-1/2
        h-[950px]
        w-[950px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-yellow-500/10
        blur-[240px]
        "
      />

      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.18, 0.1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        left-1/2
        top-1/2
        h-[900px]
        w-[900px]
        -translate-x-1/2
        -translate-y-1/2
        rounded-full
        bg-orange-400/5
        blur-[220px]
        "
      />
    </>
  );
}