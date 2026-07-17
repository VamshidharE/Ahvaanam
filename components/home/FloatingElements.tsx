"use client";

import { motion } from "framer-motion";

const items = [
  { left: "8%", top: "20%", size: 18, delay: 0 },
  { left: "82%", top: "15%", size: 24, delay: 2 },
  { left: "15%", top: "65%", size: 14, delay: 1 },
  { left: "88%", top: "72%", size: 22, delay: 4 },
  { left: "45%", top: "10%", size: 16, delay: 3 },
];

export default function FloatingElements() {
  return (
    <>
      {items.map((item, i) => (
        <motion.div
          key={i}
          className="fixed pointer-events-none z-0"
          style={{
            left: item.left,
            top: item.top,
          }}
          animate={{
            y: [0, -35, 0],
            rotate: [0, 180, 360],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 8 + item.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div
            className="rounded-full bg-gradient-to-br from-amber-300/30 to-yellow-200/20 backdrop-blur-xl"
            style={{
              width: item.size,
              height: item.size,
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
