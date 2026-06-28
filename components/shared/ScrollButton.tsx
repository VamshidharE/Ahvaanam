"use client";

import { motion } from "framer-motion";

interface ScrollButtonProps {
  targetId: string;
  text?: string;
}

export default function ScrollButton({
  targetId,
  text = "View Invitation",
}: ScrollButtonProps) {
  const handleClick = () => {
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className="mt-10 flex flex-col items-center"
    >
      <motion.button
        onClick={handleClick}
        whileHover={{
          scale: 1.04,
          boxShadow: "0 0 40px rgba(255,215,0,.35)",
        }}
        whileTap={{ scale: 0.96 }}
        className="
          rounded-full
          border
          border-yellow-400/40
          bg-gradient-to-r
          from-yellow-500/20
          to-yellow-300/10
          px-12
          py-5
          text-yellow-100
            tracking-wide
            backdrop-blur-xl
            shadow-[0_0_40px_rgba(255,215,0,.12)]
          transition-all
        "
      >
        {text}
      </motion.button>

      <motion.div
        animate={{
          y: [0, 10, 0],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
        }}
        className="mt-5 text-2xl text-yellow-300"
      >
        ↓
      </motion.div>
    </motion.div>
  );
}