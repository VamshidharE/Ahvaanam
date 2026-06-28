"use client";

import { motion } from "framer-motion";

export default function LightRays() {
  return (
    <>
      <motion.div
        animate={{
          rotate: [-15, -10, -15],
          opacity: [0.18, 0.28, 0.18],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        left-[-15%]
        top-[-20%]
        h-[140%]
        w-[220px]
        bg-gradient-to-b
        from-yellow-300/20
        via-yellow-200/5
        to-transparent
        blur-[90px]
        "
      />

      <motion.div
        animate={{
          rotate: [15, 10, 15],
          opacity: [0.12, 0.22, 0.12],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
        absolute
        right-[-15%]
        top-[-20%]
        h-[140%]
        w-[220px]
        bg-gradient-to-b
        from-yellow-300/20
        via-yellow-200/5
        to-transparent
        blur-[90px]
        "
      />
    </>
  );
}