"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Calendar, MapPin, Sparkles, Heart } from "lucide-react";

interface PremiumHeroProps {
  brideName?: string;
  groomName?: string;
  weddingDate?: string;
  muhurthamTime?: string;
  venueName?: string;
  venueCity?: string;
  welcomeMessage?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

// Particle system generating falling pink rose & lotus flower petals
const FallingPetalsSystem = () => {
  const shouldReduceMotion = useReducedMotion();
  const [petals, setPetals] = useState<Array<{ id: number; left: number; delay: number; duration: number; size: number; rotation: number }>>([]);

  useEffect(() => {
    // Controlled particle count (18 petals for smooth performance & elegance)
    const newPetals = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 95,
      delay: Math.random() * 8,
      duration: 7 + Math.random() * 7,
      size: 10 + Math.random() * 12,
      rotation: Math.random() * 360,
    }));
    setPetals(newPetals);
  }, []);

  if (shouldReduceMotion) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden select-none">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          initial={{
            y: -30,
            x: 0,
            rotate: petal.rotation,
            opacity: 0,
          }}
          animate={{
            y: ["0vh", "105vh"],
            x: [0, Math.sin(petal.id) * 35, 0],
            rotate: [petal.rotation, petal.rotation + 360],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            left: `${petal.left}%`,
            width: `${petal.size}px`,
            height: `${petal.size * 1.3}px`,
            background: "radial-gradient(circle, #FFA0B4 0%, #E85D75 60%, #C42847 100%)",
            borderRadius: "50% 0% 50% 50%",
            boxShadow: "0 2px 6px rgba(217, 78, 103, 0.35)",
            filter: "blur(0.3px)",
          }}
        />
      ))}
    </div>
  );
};

// Diya Agni flame flickers overlay
const FlickeringAgniFlame = ({ style }: { style: React.CSSProperties }) => (
  <motion.div
    animate={{
      scale: [0.95, 1.08, 0.98, 1.05, 0.96],
      opacity: [0.75, 1, 0.85, 0.95, 0.8],
    }}
    transition={{
      duration: 1.8,
      repeat: Infinity,
      repeatType: "mirror",
      ease: "easeInOut",
    }}
    className="absolute pointer-events-none rounded-full"
    style={{
      width: "12px",
      height: "18px",
      background: "radial-gradient(circle, #FFF7D6 0%, #FF9900 45%, #FF3300 85%, transparent 100%)",
      boxShadow: "0 0 14px #FF9900, 0 0 24px #FF5500",
      filter: "blur(0.5px)",
      ...style,
    }}
  />
);

export default function PremiumHinduWeddingHero({
  brideName = "Ananya",
  groomName = "Aarav",
  weddingDate = "Sunday, December 20, 2026",
  muhurthamTime = "10:15 AM",
  venueName = "The Leela Palace",
  venueCity = "Banjara Hills, Hyderabad",
  welcomeMessage = "Together with our families, we invite you to celebrate our union",
  ctaText = "Kindly Respond (RSVP)",
  onCtaClick,
  className = "",
}: PremiumHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={`relative w-full min-h-screen flex flex-col items-center justify-between overflow-hidden select-none ${className}`}
      style={{
        backgroundColor: "#FAF5EE",
        backgroundImage: "radial-gradient(ellipse at 50% 30%, #FFF8EA 0%, #FAF0E4 50%, #F5E8D6 100%)",
      }}
    >
      {/* -------------------------------------------------------------
          LAYER 1: BACKGROUND TEXTURE & WARM SUNLIGHT LEAK (Z-0)
         ------------------------------------------------------------- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft central golden radial highlight */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,#FFF3D1_0%,rgba(255,243,209,0.4)_50%,transparent_70%)] blur-2xl opacity-70" />
        
        {/* Fine background lattice texture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#C59B27 0.75px, transparent 0.75px)`,
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      {/* -------------------------------------------------------------
          LAYER 2: ROTATING CENTRAL MANDALA BACKDROP (Z-1)
         ------------------------------------------------------------- */}
      <motion.div
        className="absolute top-[32%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[480px] aspect-square pointer-events-none z-1 opacity-25"
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ duration: 75, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full text-[#C59B27]" fill="none" stroke="currentColor">
          <circle cx="100" cy="100" r="96" strokeWidth="0.75" strokeDasharray="3 3" />
          <circle cx="100" cy="100" r="88" strokeWidth="1" />
          <circle cx="100" cy="100" r="74" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="58" strokeWidth="0.75" strokeDasharray="2 2" />
          {[...Array(12)].map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x1 = 100 + 58 * Math.cos(angle);
            const y1 = 100 + 58 * Math.sin(angle);
            const x2 = 100 + 88 * Math.cos(angle);
            const y2 = 100 + 88 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.75" />;
          })}
          <path d="M100 20 C110 50, 150 50, 100 80 C50 50, 90 50, 100 20 Z" strokeWidth="0.75" fill="none" />
          <path d="M100 180 C110 150, 150 150, 100 120 C50 150, 90 150, 100 180 Z" strokeWidth="0.75" fill="none" />
          <path d="M20 100 C50 110, 50 150, 80 100 C50 50, 50 90, 20 100 Z" strokeWidth="0.75" fill="none" />
          <path d="M180 100 C150 110, 150 150, 120 100 C150 50, 150 90, 180 100 Z" strokeWidth="0.75" fill="none" />
        </svg>
      </motion.div>

      {/* -------------------------------------------------------------
          LAYER 3: TOP CARVED TEMPLE ARCH & OVERHANGING FLOWERS (Z-2)
         ------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 z-2 pointer-events-none flex justify-center">
        <img
          src="/images/hero-theme/top_arch_flowers.png"
          alt="Traditional Temple Arch with Flowers"
          className="w-full max-w-4xl h-auto object-contain object-top drop-shadow-md"
        />
      </div>

      {/* -------------------------------------------------------------
          LAYER 4: INDIVIDUAL SWAYING BRASS BELLS (Z-3)
         ------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 z-3 pointer-events-none h-44 flex justify-between max-w-3xl mx-auto px-4 md:px-12">
        {/* Left Bell 1 */}
        <motion.div
          className="relative origin-top"
          animate={shouldReduceMotion ? {} : { rotate: [-2.2, 2.2, -2.2] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/hero-theme/bell_l1.png" alt="Brass Bell Left 1" className="h-28 md:h-36 w-auto object-contain drop-shadow-sm" />
        </motion.div>

        {/* Left Bell 2 */}
        <motion.div
          className="relative origin-top mt-2"
          animate={shouldReduceMotion ? {} : { rotate: [2.5, -2.5, 2.5] }}
          transition={{ duration: 4.1, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/hero-theme/bell_l2.png" alt="Brass Bell Left 2" className="h-32 md:h-40 w-auto object-contain drop-shadow-sm" />
        </motion.div>

        {/* Left Bell 3 */}
        <motion.div
          className="relative origin-top"
          animate={shouldReduceMotion ? {} : { rotate: [-1.8, 1.8, -1.8] }}
          transition={{ duration: 3.6, delay: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/hero-theme/bell_l3.png" alt="Brass Bell Left 3" className="h-26 md:h-34 w-auto object-contain drop-shadow-sm" />
        </motion.div>

        {/* Right Bell 1 */}
        <motion.div
          className="relative origin-top"
          animate={shouldReduceMotion ? {} : { rotate: [2.0, -2.0, 2.0] }}
          transition={{ duration: 3.8, delay: 0.7, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/hero-theme/bell_r1.png" alt="Brass Bell Right 1" className="h-26 md:h-34 w-auto object-contain drop-shadow-sm" />
        </motion.div>

        {/* Right Bell 2 */}
        <motion.div
          className="relative origin-top mt-2"
          animate={shouldReduceMotion ? {} : { rotate: [-2.4, 2.4, -2.4] }}
          transition={{ duration: 4.3, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/hero-theme/bell_r2.png" alt="Brass Bell Right 2" className="h-32 md:h-40 w-auto object-contain drop-shadow-sm" />
        </motion.div>

        {/* Right Bell 3 */}
        <motion.div
          className="relative origin-top"
          animate={shouldReduceMotion ? {} : { rotate: [1.9, -1.9, 1.9] }}
          transition={{ duration: 3.4, delay: 1.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <img src="/images/hero-theme/bell_r3.png" alt="Brass Bell Right 3" className="h-28 md:h-36 w-auto object-contain drop-shadow-sm" />
        </motion.div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 5: SEATED LORD GANESHA WITH FLOATING GLOW (Z-4)
         ------------------------------------------------------------- */}
      <motion.div
        className="absolute top-[4.5%] left-1/2 -translate-x-1/2 z-4 pointer-events-none flex flex-col items-center"
        animate={shouldReduceMotion ? {} : { y: [0, -4, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="relative">
          {/* Subtle Ganesha Aura Glow */}
          <div className="absolute inset-0 rounded-full bg-[#FFD700] blur-xl opacity-40 animate-pulse" />
          <img
            src="/images/hero-theme/ganesha.png"
            alt="Lord Ganesha"
            className="w-24 md:w-32 h-auto object-contain drop-shadow-[0_4px_12px_rgba(212,175,55,0.45)] relative z-10"
          />
        </div>
      </motion.div>

      {/* -------------------------------------------------------------
          LAYER 6: ROYAL DECORATED ELEPHANTS (LEFT & RIGHT) (Z-5)
         ------------------------------------------------------------- */}
      {/* Left Elephant */}
      <motion.div
        className="absolute top-[25%] left-0 md:left-6 z-5 pointer-events-none max-w-[130px] md:max-w-[190px]"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.015, 1], y: [0, -2, 0] }}
        transition={{ duration: 6.0, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/images/hero-theme/elephant_left.png"
          alt="Royal Decorated Elephant Left"
          className="w-full h-auto object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* Right Elephant */}
      <motion.div
        className="absolute top-[25%] right-0 md:right-6 z-5 pointer-events-none max-w-[130px] md:max-w-[190px]"
        animate={shouldReduceMotion ? {} : { scale: [1, 1.015, 1], y: [0, -2, 0] }}
        transition={{ duration: 6.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/images/hero-theme/elephant_right.png"
          alt="Royal Decorated Elephant Right"
          className="w-full h-auto object-contain drop-shadow-lg"
        />
      </motion.div>

      {/* -------------------------------------------------------------
          LAYER 7: LUSH BANANA LEAVES & TROPICAL FOLIAGE (Z-6)
         ------------------------------------------------------------- */}
      {/* Left Banana Leaves */}
      <motion.div
        className="absolute top-[42%] left-0 z-6 pointer-events-none max-w-[140px] md:max-w-[210px] origin-bottom-left"
        animate={shouldReduceMotion ? {} : { rotate: [0, 1.8, 0, -1.5, 0] }}
        transition={{ duration: 8.0, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/images/hero-theme/banana_leaves_left.png"
          alt="Banana Leaves Left"
          className="w-full h-auto object-contain drop-shadow-md"
        />
      </motion.div>

      {/* Right Banana Leaves */}
      <motion.div
        className="absolute top-[42%] right-0 z-6 pointer-events-none max-w-[140px] md:max-w-[210px] origin-bottom-right"
        animate={shouldReduceMotion ? {} : { rotate: [0, -1.8, 0, 1.5, 0] }}
        transition={{ duration: 8.8, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <img
          src="/images/hero-theme/banana_leaves_right.png"
          alt="Banana Leaves Right"
          className="w-full h-auto object-contain drop-shadow-md"
        />
      </motion.div>

      {/* -------------------------------------------------------------
          LAYER 8: FALLING FLOWER PETALS ENGINE (Z-10)
         ------------------------------------------------------------- */}
      <FallingPetalsSystem />

      {/* -------------------------------------------------------------
          LAYER 9: CENTRAL INVITATION TEXT & TYPOGRAPHY CANVAS (Z-20)
         ------------------------------------------------------------- */}
      <main className="relative z-20 w-full max-w-xl mx-auto px-6 pt-36 md:pt-44 pb-72 text-center flex flex-col items-center space-y-6">
        
        {/* Sacred Mantra Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-1"
        >
          <span className="text-xl md:text-2xl font-serif text-[#C59B27] tracking-wider block font-bold">
            ॐ श्री गणेशाय नमः
          </span>
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#8C6615] font-semibold font-serif">
            Shri Ganeshaya Namah
          </p>
        </motion.div>

        {/* Ornate Gold Divider */}
        <div className="flex items-center justify-center gap-3 my-1">
          <div className="w-12 md:w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C59B27]" />
          <div className="w-2 h-2 rotate-45 bg-[#C59B27]" />
          <div className="w-12 md:w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C59B27]" />
        </div>

        {/* Welcome Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-xs md:text-sm text-[#5C451D] max-w-xs md:max-w-md mx-auto leading-relaxed font-serif italic"
        >
          {welcomeMessage}
        </motion.p>

        {/* Main Couple Names */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.0, delay: 0.6 }}
          className="py-2 space-y-1"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal uppercase tracking-[0.08em] font-serif leading-tight">
            <span className="bg-gradient-to-r from-[#7A5005] via-[#C59B27] to-[#7A5005] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              {groomName}
            </span>
          </h1>

          <div className="flex items-center justify-center gap-4 my-2">
            <div className="w-10 h-[1px] bg-[#C59B27]/40" />
            <span className="text-2xl md:text-3xl font-serif text-[#C59B27] italic font-normal">&</span>
            <div className="w-10 h-[1px] bg-[#C59B27]/40" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal uppercase tracking-[0.08em] font-serif leading-tight">
            <span className="bg-gradient-to-r from-[#7A5005] via-[#C59B27] to-[#7A5005] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(255,255,255,0.8)]">
              {brideName}
            </span>
          </h1>
        </motion.div>

        {/* Wedding Tagline */}
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] font-bold text-[#8C6615] font-serif">
          Wedding Invitation
        </p>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="w-full max-w-sm border border-[#C59B27]/40 rounded-2xl p-5 bg-white/70 backdrop-blur-md shadow-[0_10px_30px_rgba(197,155,39,0.12)] space-y-3 relative overflow-hidden"
        >
          {/* Subtle card shine */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/50 to-transparent pointer-events-none" />

          <div className="flex items-center justify-center gap-2 text-[#C59B27]">
            <Calendar size={16} />
            <span className="text-xs uppercase font-bold tracking-[1.5px] font-serif">{weddingDate}</span>
          </div>

          <p className="text-xs text-[#5C451D] font-semibold">
            Muhurtham: <span className="text-[#8C6615] font-bold">{muhurthamTime}</span>
          </p>

          <div className="w-12 h-[1px] bg-[#C59B27]/30 mx-auto" />

          <div className="flex items-center justify-center gap-1.5 text-xs text-[#5C451D] font-medium">
            <MapPin size={14} className="text-[#C59B27] shrink-0" />
            <span>{venueName}, {venueCity}</span>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <a
            href="#rsvp"
            onClick={onCtaClick}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#B8860B] text-white text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-serif cursor-pointer"
          >
            <Sparkles size={14} />
            <span>{ctaText}</span>
          </a>
        </motion.div>

      </main>

      {/* -------------------------------------------------------------
          LAYER 10: GRAND WEDDING MANDAP & BRIDE/GROOM STAGE (Z-21)
         ------------------------------------------------------------- */}
      <div className="absolute bottom-[3%] left-0 right-0 z-21 pointer-events-none flex justify-center">
        <div className="relative w-full max-w-4xl">
          <img
            src="/images/hero-theme/mandap_stage.png"
            alt="Traditional Wedding Mandap with Bride and Groom"
            className="w-full h-auto object-contain object-bottom drop-shadow-xl"
          />

          {/* Diya Agni Flames flickering over Havan Kund and lamps */}
          <FlickeringAgniFlame style={{ bottom: "21%", left: "49.8%", transform: "translateX(-50%)" }} />
          <FlickeringAgniFlame style={{ bottom: "12%", left: "34.5%" }} />
          <FlickeringAgniFlame style={{ bottom: "12%", right: "34.5%" }} />
        </div>
      </div>

      {/* -------------------------------------------------------------
          LAYER 11: FOREGROUND LOTUS FLOWERS & BRASS DIYAS (Z-23)
         ------------------------------------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 z-23 pointer-events-none flex justify-center">
        <img
          src="/images/hero-theme/foreground_lotus_diyas.png"
          alt="Foreground Pink Lotus Flowers and Diyas"
          className="w-full max-w-4xl h-auto object-contain object-bottom drop-shadow-2xl"
        />
      </div>

    </div>
  );
}
