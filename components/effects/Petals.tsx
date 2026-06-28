"use client";

import { motion } from "framer-motion";

const petals = Array.from({ length: 18 });

export default function Petals() {
  return (
    <>
      {petals.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            y: -150,
            x: `${Math.random() * 100}vw`,
            rotate: 0,
            opacity: Math.random() * 0.6 + 0.2,
          }}
          animate={{
            y: "120vh",
            x: [
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
              Math.random() * window.innerWidth,
            ],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 8,
            ease: "linear",
          }}
          className="absolute z-10"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="#FFD8E8"
          >
            <path d="M12 2C8 4 6 8 6 12c0 5 4 10 6 10s6-5 6-10c0-4-2-8-6-10z"/>
          </svg>
        </motion.div>
      ))}
    </>
  );
}