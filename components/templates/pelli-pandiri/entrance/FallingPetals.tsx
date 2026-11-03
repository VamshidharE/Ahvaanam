"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PetalConfig {
  id: number;
  leftPercent: number;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  rotateEnd: number;
  flipDuration: number;
  petalType: "rose" | "lotus" | "marigold";
  opacity: number;
}

const PETALS_DATA: PetalConfig[] = [
  { id: 1, leftPercent: 6, size: 13, duration: 8.5, delay: 0.2, driftX: 35, rotateEnd: 320, flipDuration: 3.2, petalType: "rose", opacity: 0.88 },
  { id: 2, leftPercent: 14, size: 11, duration: 7.2, delay: 2.8, driftX: -28, rotateEnd: 260, flipDuration: 2.8, petalType: "lotus", opacity: 0.9 },
  { id: 3, leftPercent: 22, size: 15, duration: 9.8, delay: 1.1, driftX: 42, rotateEnd: 410, flipDuration: 4.1, petalType: "rose", opacity: 0.86 },
  { id: 4, leftPercent: 29, size: 10, duration: 6.8, delay: 4.2, driftX: -32, rotateEnd: 190, flipDuration: 3.0, petalType: "marigold", opacity: 0.82 },
  { id: 5, leftPercent: 37, size: 14, duration: 8.9, delay: 0.6, driftX: 30, rotateEnd: 350, flipDuration: 3.7, petalType: "rose", opacity: 0.92 },
  { id: 6, leftPercent: 45, size: 12, duration: 7.6, delay: 3.5, driftX: -36, rotateEnd: 280, flipDuration: 3.1, petalType: "lotus", opacity: 0.88 },
  { id: 7, leftPercent: 53, size: 16, duration: 10.4, delay: 1.8, driftX: 34, rotateEnd: 440, flipDuration: 4.3, petalType: "rose", opacity: 0.9 },
  { id: 8, leftPercent: 61, size: 10, duration: 7.0, delay: 4.9, driftX: -22, rotateEnd: 210, flipDuration: 2.7, petalType: "marigold", opacity: 0.84 },
  { id: 9, leftPercent: 69, size: 15, duration: 9.2, delay: 2.1, driftX: 40, rotateEnd: 380, flipDuration: 3.9, petalType: "rose", opacity: 0.88 },
  { id: 10, leftPercent: 77, size: 12, duration: 8.1, delay: 0.9, driftX: -34, rotateEnd: 310, flipDuration: 3.3, petalType: "lotus", opacity: 0.86 },
  { id: 11, leftPercent: 85, size: 15, duration: 10.0, delay: 3.2, driftX: 28, rotateEnd: 420, flipDuration: 4.0, petalType: "rose", opacity: 0.9 },
  { id: 12, leftPercent: 93, size: 11, duration: 7.4, delay: 1.5, driftX: -30, rotateEnd: 240, flipDuration: 2.9, petalType: "lotus", opacity: 0.87 },
  { id: 13, leftPercent: 18, size: 13, duration: 8.7, delay: 5.4, driftX: 32, rotateEnd: 360, flipDuration: 3.6, petalType: "rose", opacity: 0.88 },
  { id: 14, leftPercent: 33, size: 9, duration: 6.5, delay: 6.1, driftX: -24, rotateEnd: 180, flipDuration: 2.6, petalType: "marigold", opacity: 0.82 },
  { id: 15, leftPercent: 49, size: 14, duration: 9.5, delay: 4.7, driftX: 36, rotateEnd: 390, flipDuration: 3.8, petalType: "rose", opacity: 0.9 },
  { id: 16, leftPercent: 65, size: 12, duration: 8.3, delay: 6.8, driftX: -32, rotateEnd: 290, flipDuration: 3.4, petalType: "lotus", opacity: 0.89 },
  { id: 17, leftPercent: 81, size: 10, duration: 7.8, delay: 5.9, driftX: 28, rotateEnd: 330, flipDuration: 3.0, petalType: "marigold", opacity: 0.85 },
  { id: 18, leftPercent: 89, size: 14, duration: 9.0, delay: 7.3, driftX: -26, rotateEnd: 370, flipDuration: 3.7, petalType: "rose", opacity: 0.91 },
];

interface FallingPetalsProps {
  isMobile?: boolean;
}

export const FallingPetals: React.FC<FallingPetalsProps> = ({ isMobile = false }) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  // On mobile, render 8 well-spaced petals instead of 18 to cut particle rendering load by ~60%
  const petals = isMobile ? PETALS_DATA.slice(0, 8) : PETALS_DATA;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-25"
    >
      <svg className="absolute w-0 h-0" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient id="pelliRoseGrad" cx="30%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fecdd3" />
            <stop offset="45%" stopColor="#fb7185" />
            <stop offset="85%" stopColor="#e11d48" />
            <stop offset="100%" stopColor="#9f1239" />
          </radialGradient>
          <radialGradient id="pelliLotusGrad" cx="30%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="50%" stopColor="#f472b6" />
            <stop offset="85%" stopColor="#db2777" />
            <stop offset="100%" stopColor="#831843" />
          </radialGradient>
          <radialGradient id="pelliMarigoldGrad" cx="30%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="45%" stopColor="#f59e0b" />
            <stop offset="85%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>
        </defs>
      </svg>

      {petals.map((p) => {
        const fillId =
          p.petalType === "rose"
            ? "url(#pelliRoseGrad)"
            : p.petalType === "lotus"
            ? "url(#pelliLotusGrad)"
            : "url(#pelliMarigoldGrad)";

        return (
          <motion.div
            key={p.id}
            initial={{ y: -40, x: 0, opacity: 0, rotate: 0 }}
            animate={{
              y: ["-5vh", "110vh"],
              x: [0, p.driftX, 0, -p.driftX * 0.5, 0],
              opacity: [0, p.opacity, p.opacity, p.opacity * 0.9, 0],
              rotate: [0, p.rotateEnd],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{
              left: `${p.leftPercent}%`,
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
            }}
            className="absolute pointer-events-none select-none"
          >
            <motion.div
              animate={{ rotateY: [0, 180, 360] }}
              transition={{
                duration: p.flipDuration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 24 36" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
                <path
                  d="M12 2 C18 10 22 20 19 28 C16 34 13 35 12 35 C11 35 8 34 5 28 C2 20 6 10 12 2 Z"
                  fill={fillId}
                />
              </svg>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
