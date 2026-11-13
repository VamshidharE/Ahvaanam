"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useGopuram } from "../context";

/**
 * Floating Petal Component for Grand Couple Showcase
 */
interface ShowcasePetal {
  id: number;
  left: string;
  size: number;
  duration: number;
  delay: number;
  driftX: number;
  rotateEnd: number;
  color: string;
}

const SHOWCASE_PETALS: ShowcasePetal[] = [
  { id: 1, left: "12%", size: 12, duration: 8.5, delay: 0.3, driftX: 30, rotateEnd: 280, color: "#f43f5e" },
  { id: 2, left: "22%", size: 15, duration: 9.8, delay: 2.1, driftX: -25, rotateEnd: 360, color: "#fb7185" },
  { id: 3, left: "38%", size: 10, duration: 7.2, delay: 4.0, driftX: 20, rotateEnd: 210, color: "#fbbf24" },
  { id: 4, left: "62%", size: 14, duration: 8.9, delay: 1.2, driftX: -30, rotateEnd: 340, color: "#f43f5e" },
  { id: 5, left: "76%", size: 11, duration: 7.8, delay: 3.5, driftX: 25, rotateEnd: 270, color: "#fb7185" },
  { id: 6, left: "86%", size: 13, duration: 9.2, delay: 0.8, driftX: -22, rotateEnd: 390, color: "#f59e0b" },
];

/**
 * GrandCoupleShowcase
 *
 * Exact signature full-length South Indian wedding portrait section from Gopuram template.
 * Features:
 * - Natural unconfined full-length bride and groom cutout
 * - Rotating sacred Lotus Mandala halo backdrop anchored at bottom center in foreground
 * - Luminous warm golden backlight separating couple from background
 * - Deep maroon Cinzel typography with subtle subtitle
 * - Floating flower petals
 */
export const GrandCoupleShowcase: React.FC = () => {
  const { data } = useGopuram();
  const { couple, assets } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const firstPersonName = couple.firstPersonName || couple.groomName || "ARJUN";
  const secondPersonName = couple.secondPersonName || couple.brideName || "MEERA";
  const coupleCutout = assets.coupleCutout || "/templates/gopuram/Couple.png";

  return (
    <section
      ref={sectionRef}
      id="grand-couple-showcase"
      aria-label="Grand Couple Showcase"
      className="relative w-full overflow-hidden bg-[#faeed8] pt-14 pb-0 sm:pt-20 sm:pb-0 md:pt-24 md:pb-0 text-[#42100b] select-none"
    >
      {/* User-Requested Auspicious Indian Temple Arch Background */}
      <div aria-hidden="true" className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/templates/gopuram/decoration/couple-showcase-bg.jpg"
          alt="Auspicious Indian Temple Arch Background"
          fill
          sizes="100vw"
          className="object-cover object-top"
          priority
          unoptimized
        />
      </div>

      {/* Half-Visible Rotating Golden Mandala anchored at bottom center in foreground */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[360px] sm:w-[480px] md:w-[600px] aspect-square pointer-events-none z-30 select-none"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isInView
              ? {
                  opacity: 0.98,
                  scale: 1,
                  rotate: shouldReduceMotion ? 0 : 360,
                }
              : { opacity: 0, scale: 0.9 }
          }
          transition={{
            opacity: { duration: 1.0, ease: "easeOut" },
            scale: { duration: 1.0, ease: "easeOut" },
            rotate: {
              repeat: Infinity,
              duration: 75,
              ease: "linear",
            },
          }}
          className="relative w-full h-full"
        >
          <Image
            src="/templates/gopuram/decoration/Lotus-Mandala.png"
            alt="Sacred Rotating Mandala"
            fill
            sizes="(max-width: 640px) 360px, (max-width: 1024px) 480px, 600px"
            className="object-contain drop-shadow-[0_0_28px_rgba(200,130,30,0.4)]"
            priority
            unoptimized
          />
        </motion.div>
      </div>

      {/* Ambient Floating Flower Petals */}
      {!shouldReduceMotion && (
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden z-25">
          {SHOWCASE_PETALS.map((petal) => (
            <motion.div
              key={petal.id}
              initial={{ y: -20, x: 0, opacity: 0, rotate: 0 }}
              animate={{
                y: ["0vh", "105vh"],
                x: [0, petal.driftX, 0],
                opacity: [0, 0.85, 0.9, 0],
                rotate: [0, petal.rotateEnd],
              }}
              transition={{
                duration: petal.duration,
                delay: petal.delay,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                left: petal.left,
                width: `${petal.size}px`,
                height: `${petal.size * 1.4}px`,
              }}
              className="absolute"
            >
              <svg viewBox="0 0 24 32" className="w-full h-full drop-shadow-xs">
                <path
                  d="M12 2 C18 10 22 18 20 25 C18 30 14 31 12 31 C10 31 6 30 4 25 C2 18 6 10 12 2 Z"
                  fill={petal.color}
                  opacity="0.88"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col items-center text-center">
        {/* ============================================================ */}
        {/* 1. SECTION PRE-HEADER & AUSPICIOUS SYMBOLS */}
        {/* ============================================================ */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center mb-3 sm:mb-4"
        >
          <div className="flex items-center justify-center gap-2 mb-1 select-none">
            <span className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-[#b88636]" />
            <span className="text-[#b88636] text-xs sm:text-sm">❦</span>
            <span className="font-cinzel text-[10px] sm:text-xs font-bold tracking-[0.26em] text-[#8c5021] uppercase px-1">
              THE BRIDE &amp; GROOM
            </span>
            <span className="text-[#b88636] text-xs sm:text-sm">❦</span>
            <span className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-[#b88636]" />
          </div>

          {/* Couple Names - Grand Majestic Maroon Typography */}
          <h2 className="font-cinzel text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#42100b] uppercase leading-tight mt-1">
            <span>{firstPersonName}</span>
            <span className="font-cormorant italic text-2xl sm:text-4xl md:text-5xl text-[#b88636] font-normal mx-2 sm:mx-3.5 lowercase">
              &amp;
            </span>
            <span>{secondPersonName}</span>
          </h2>

          {/* Subtitle Line */}
          <p className="font-cormorant italic text-base sm:text-xl md:text-2xl text-[#7c2d12] font-semibold mt-1 tracking-wide">
            &ldquo;Together begins forever.&rdquo;
          </p>

          {/* Delicate Divider Ornament */}
          <div className="flex items-center justify-center gap-2 mt-2 select-none">
            <span className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-[#b88636]/60 to-transparent" />
            <span className="text-[#b88636] text-xs">✦</span>
            <span className="w-12 sm:w-20 h-px bg-gradient-to-r from-transparent via-[#b88636]/60 to-transparent" />
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* 2. GRAND COUPLE COMPOSITION (UNCONFINED, DOMINANT FOCAL POINT) */}
        {/* ============================================================ */}
        <div className="relative w-full max-w-2xl sm:max-w-3xl flex items-center justify-center mt-2 sm:mt-4">
          {/* Luminous Warm Golden Backlight Glow */}
          <div
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] md:w-[620px] h-[340px] sm:h-[520px] md:h-[620px] rounded-full pointer-events-none -z-10 blur-3xl opacity-60"
            style={{
              background:
                "radial-gradient(circle, rgba(255,215,120,0.7) 0%, rgba(230,160,50,0.35) 45%, rgba(180,100,30,0.1) 65%, transparent 75%)",
            }}
          />

          {/* Ground Soft Ambient Shadow */}
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[240px] sm:w-[380px] md:w-[460px] h-[28px] sm:h-[40px] rounded-full bg-black/25 blur-lg pointer-events-none -z-5"
          />

          {/* Full-Length Bride & Groom Cutout Image (Middle Layer: z-10) */}
          <motion.div
            initial={{ opacity: 0, y: 45, scale: 0.95 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: 0, y: 45, scale: 0.95 }
            }
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative w-full max-w-[320px] sm:max-w-[440px] md:max-w-[540px] aspect-[1024/1536] flex items-end justify-center select-none z-10"
          >
            <Image
              src={coupleCutout}
              alt={`${firstPersonName} & ${secondPersonName} - South Indian Wedding Couple`}
              fill
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 440px, 540px"
              className="object-contain object-bottom filter contrast-[1.03] brightness-[1.01] drop-shadow-[0_16px_36px_rgba(60,20,10,0.35)]"
              priority
              unoptimized
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
