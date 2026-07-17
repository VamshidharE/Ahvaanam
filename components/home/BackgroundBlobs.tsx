"use client";

import { motion } from "framer-motion";

export default function BackgroundBlobs() {
  return (
    <>
      <motion.div
        animate={{
          x: [0, 120, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
        }}
        className="fixed left-[-200px] top-[120px] h-[500px] w-[500px] rounded-full bg-amber-200/20 blur-[140px] pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
        }}
        className="fixed right-[-200px] top-[300px] h-[500px] w-[500px] rounded-full bg-yellow-100/20 blur-[160px] pointer-events-none"
      />
    </>
  );
}
