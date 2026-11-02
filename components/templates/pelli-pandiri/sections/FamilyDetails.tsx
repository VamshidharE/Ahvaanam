"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { MapPin } from "lucide-react";
import { PelliPandiriData, PelliPandiriFamilySide } from "../adapter";

const PortraitFloralGarland: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg
    viewBox="0 0 320 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto pointer-events-none drop-shadow-[0_4px_12px_rgba(80,45,25,0.3)] ${className}`}
  >
    <defs>
      <radialGradient id="pelliRoseCenter" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#d44b58" />
        <stop offset="50%" stopColor="#b32438" />
        <stop offset="100%" stopColor="#6e0f1e" />
      </radialGradient>
      <radialGradient id="pelliRoseSoft" cx="45%" cy="35%" r="55%">
        <stop offset="0%" stopColor="#f3929b" />
        <stop offset="60%" stopColor="#c7384a" />
        <stop offset="100%" stopColor="#7a1422" />
      </radialGradient>
      <linearGradient id="pelliGoldLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffe699" />
        <stop offset="45%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#8a631e" />
      </linearGradient>
      <linearGradient id="pelliJasmineGrad" x1="20%" y1="0%" x2="80%" y2="100%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="60%" stopColor="#fff8e7" />
        <stop offset="100%" stopColor="#e3cf9a" />
      </linearGradient>
    </defs>

    <path
      d="M30 46 C80 62 120 68 160 68 C200 68 240 62 290 46"
      stroke="url(#pelliGoldLeaf)"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
    <path
      d="M50 52 C95 66 130 72 160 72 C190 72 225 66 270 52"
      stroke="url(#pelliGoldLeaf)"
      strokeWidth="1.2"
      strokeDasharray="2 3"
      fill="none"
      opacity="0.85"
    />

    <g transform="translate(42, 38) rotate(-18)">
      <path d="M0 0 C-12 -8 -18 -2 0 10 C18 -2 12 -8 0 0Z" fill="url(#pelliGoldLeaf)" opacity="0.9" />
      <path d="M-15 4 C-25 -2 -28 6 -12 12 C4 6 2 -2 -15 4Z" fill="url(#pelliGoldLeaf)" opacity="0.75" />
      <circle cx="-6" cy="14" r="3.5" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="-13" cy="11" r="3" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="-2" cy="18" r="2.8" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
    </g>

    <g transform="translate(278, 38) rotate(18) scale(-1, 1)">
      <path d="M0 0 C-12 -8 -18 -2 0 10 C18 -2 12 -8 0 0Z" fill="url(#pelliGoldLeaf)" opacity="0.9" />
      <path d="M-15 4 C-25 -2 -28 6 -12 12 C4 6 2 -2 -15 4Z" fill="url(#pelliGoldLeaf)" opacity="0.75" />
      <circle cx="-6" cy="14" r="3.5" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="-13" cy="11" r="3" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="-2" cy="18" r="2.8" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
    </g>

    <g transform="translate(92, 50)">
      <circle cx="0" cy="0" r="13" fill="url(#pelliRoseSoft)" />
      <path d="M-6 -4 C-4 -10 4 -10 6 -4 C9 2 0 8 -6 -4Z" fill="url(#pelliRoseCenter)" opacity="0.9" />
      <circle cx="0" cy="-1" r="4.5" fill="#ffd7a8" opacity="0.8" />
    </g>

    <g transform="translate(228, 50)">
      <circle cx="0" cy="0" r="13" fill="url(#pelliRoseSoft)" />
      <path d="M-6 -4 C-4 -10 4 -10 6 -4 C9 2 0 8 -6 -4Z" fill="url(#pelliRoseCenter)" opacity="0.9" />
      <circle cx="0" cy="-1" r="4.5" fill="#ffd7a8" opacity="0.8" />
    </g>

    <g transform="translate(160, 52)">
      <circle cx="0" cy="0" r="18" fill="none" stroke="url(#pelliGoldLeaf)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
      <circle cx="0" cy="0" r="16" fill="url(#pelliRoseSoft)" />
      <circle cx="0" cy="-1" r="11" fill="url(#pelliRoseCenter)" />
      <path d="M-4 -3 C-2 -7 2 -7 4 -3 C6 2 0 6 -4 -3Z" fill="#ffccd4" opacity="0.95" />
      <circle cx="0" cy="-1" r="3.5" fill="#ffe3b3" />
      <circle cx="-19" cy="4" r="3.2" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="-25" cy="0" r="2.8" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="19" cy="4" r="3.2" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="25" cy="0" r="2.8" fill="url(#pelliJasmineGrad)" stroke="#c99f58" strokeWidth="0.5" />
      <circle cx="0" cy="22" r="2.5" fill="url(#pelliGoldLeaf)" />
      <line x1="0" y1="16" x2="0" y2="20" stroke="url(#pelliGoldLeaf)" strokeWidth="1" />
    </g>
  </svg>
);

const FamilySideCard: React.FC<{ side: PelliPandiriFamilySide }> = ({ side }) => {
  const memberNames = side.members.map((m) => m.name).filter(Boolean);
  const displayName = memberNames.length > 0 ? memberNames.join(" & ") : "Family";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-[320px] sm:max-w-[380px] md:max-w-[400px] flex flex-col items-center text-center group"
    >
      <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px] mb-6">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-7 h-7 rounded-full bg-gradient-to-b from-[#fff7e6] to-[#edd6a4] border border-[#b88636] flex items-center justify-center shadow-md">
            <span className="text-[#8e3622] text-xs font-serif leading-none">✦</span>
          </div>
        </div>

        <div
          className="relative w-full aspect-[3/4] p-2 sm:p-2.5 rounded-t-[9.5rem] sm:rounded-t-[10.5rem] rounded-b-2xl shadow-[0_16px_36px_rgba(80,45,25,0.22)] transition-transform duration-500 group-hover:scale-[1.02]"
          style={{
            background:
              "linear-gradient(180deg, #f7e7c4 0%, #d4af37 25%, #996f2d 65%, #c99f58 100%)",
          }}
        >
          <div className="relative w-full h-full rounded-t-[9rem] sm:rounded-t-[10rem] rounded-b-xl overflow-hidden bg-[#241711] ring-1 ring-[#ffd700]/60">
            <Image
              src={side.portrait}
              alt={side.title}
              fill
              sizes="(max-width: 640px) 270px, (max-width: 768px) 300px, 320px"
              className="object-cover object-[center_20%] transition-transform duration-700 ease-out group-hover:scale-105"
              priority
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#20140e]/65 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[114%] pointer-events-none z-20">
          <PortraitFloralGarland />
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center">
        <span className="inline-block px-3 py-0.5 rounded-full bg-[#fbf2e3] border border-[#d4ba9b]/60 font-cinzel text-[11px] sm:text-xs font-bold tracking-[0.24em] text-[#742719] uppercase mb-1.5">
          {side.title}
        </span>

        {side.relationLabel && (
          <p className="font-cormorant text-base sm:text-lg italic text-[#805527] font-semibold">
            {side.relationLabel}
          </p>
        )}

        <h3 className="font-cinzel text-lg sm:text-xl md:text-2xl font-black text-[#42100b] tracking-wide mt-0.5 leading-snug">
          {displayName}
        </h3>

        {side.location && (
          <div className="inline-flex items-center gap-1.5 mt-2.5 text-[#744c2c]">
            <MapPin size={13} className="text-[#8e3622] shrink-0" />
            <span className="font-cormorant text-sm sm:text-base font-semibold tracking-wide">
              {side.location}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export const FamilyDetails: React.FC<{ data: PelliPandiriData }> = ({ data }) => {
  const { families, couple } = data;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-10%" });
  const shouldReduceMotion = useReducedMotion();

  const firstSide = couple.primarySide === "bride" ? families.bride : families.groom;
  const secondSide = couple.primarySide === "bride" ? families.groom : families.bride;

  return (
    <section
      ref={sectionRef}
      id="families"
      aria-label="Our Families"
      className="relative w-full overflow-hidden py-16 sm:py-20 md:py-28 bg-transparent text-[#542D25]"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 sm:mb-16 md:mb-20 px-4 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2.5 sm:gap-4 mb-2.5 select-none">
            <span className="w-8 sm:w-16 md:w-24 h-px bg-gradient-to-r from-transparent via-[#b88636] to-[#b88636]" />
            <span className="text-[#b88636] text-xs sm:text-sm">❦</span>
            <p className="font-cinzel text-[10.5px] sm:text-xs md:text-sm font-bold tracking-[0.28em] text-[#805527] uppercase">
              TWO FAMILIES • ONE SACRED BOND
            </p>
            <span className="text-[#b88636] text-xs sm:text-sm">❦</span>
            <span className="w-8 sm:w-16 md:w-24 h-px bg-gradient-to-l from-transparent via-[#b88636] to-[#b88636]" />
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold tracking-[0.16em] text-[#42100b] uppercase leading-tight">
            {families.heading || "Our Families"}
          </h2>

          <p className="font-cormorant text-base sm:text-lg md:text-xl italic text-[#744c2c] font-medium mt-2 max-w-xl leading-relaxed">
            {families.subheading || "Two families united in tradition, blessings, and boundless love"}
          </p>

          <div className="flex items-center justify-center gap-2 mt-3 select-none">
            <span className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#b88636]/50 to-transparent" />
            <span className="text-[#b88636] text-xs">✦</span>
            <span className="w-10 sm:w-16 h-px bg-gradient-to-r from-transparent via-[#b88636]/50 to-transparent" />
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 sm:gap-14 lg:gap-8 xl:gap-14 max-w-5xl mx-auto">
          {/* First Family Side (Respects primarySide) */}
          <FamilySideCard side={firstSide} />

          {/* Central Divider */}
          <div className="hidden lg:flex flex-col items-center justify-center self-stretch py-8 select-none">
            <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#b88636]/60 to-[#b88636]" />

            <motion.div
              animate={shouldReduceMotion ? {} : { rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              className="my-4 relative flex items-center justify-center"
            >
              <div className="w-10 h-10 rounded-full border border-[#b88636]/70 flex items-center justify-center bg-[#fff8eb]/90 shadow-sm">
                <span className="text-[#b88636] text-lg font-serif">✦</span>
              </div>
            </motion.div>

            <p className="font-serif text-[11px] font-bold text-[#8c5a2b] tracking-[0.2em] uppercase writing-vertical-lr my-2 opacity-85">
              ॥ संगमः मङ्गलम् ॥
            </p>

            <div className="w-px flex-1 bg-gradient-to-b from-[#b88636] via-[#b88636]/60 to-transparent" />
          </div>

          <div className="lg:hidden flex items-center justify-center gap-3 my-2 w-full max-w-xs select-none">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[#b88636]/70" />
            <span className="text-[#b88636] text-sm">❦</span>
            <span className="text-[#8e3622] text-xs font-cinzel font-bold tracking-widest uppercase">
              ॥ संगमः ॥
            </span>
            <span className="text-[#b88636] text-sm">❦</span>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[#b88636]/70" />
          </div>

          {/* Second Family Side */}
          <FamilySideCard side={secondSide} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.45 }}
          className="text-center mt-14 sm:mt-18 px-4 flex flex-col items-center"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#b88636] to-transparent mb-3 select-none" />
          <p className="font-cormorant text-base sm:text-lg md:text-xl italic text-[#704d30] font-medium tracking-wide max-w-xl">
            &ldquo;With the love and blessings of our families, we invite you to share in this joyous milestone&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
};
