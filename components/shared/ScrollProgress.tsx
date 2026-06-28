"use client";

import { motion, useScroll } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "0%",
      }}
      className="
      fixed
      top-0
      left-0
      z-[100]
      h-1
      w-full
      bg-gradient-to-r
      from-yellow-300
      via-yellow-500
      to-yellow-300
      "
    />
  );
}