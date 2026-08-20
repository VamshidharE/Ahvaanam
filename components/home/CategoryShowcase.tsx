"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { 
  Heart, Sparkles, Cake, Home as HomeIcon, Baby, Shirt, Award, Briefcase, ArrowRight 
} from "lucide-react";

export const CATEGORIES = [
  {
    id: "wedding",
    name: "Wedding",
    badge: "✦ PERFECT FOR YOUR BIG DAY",
    titlePrefix: "ELEGANT CUSTOM",
    titleHighlight: "WEDDING DESIGNS",
    desc: "Luxury multi-page digital wedding cards with traditional background music, calendars, RSVP, maps and custom love stories.",
    image: "/images/categories/wedding.jpg",
    icon: Heart,
    featureBadges: ["🎵 MUSIC", "☑ RSVP", "📅 EVENTS", "📍 MAPS"],
    ctaText: "GET CUSTOM WEDDING INVITE",
    link: "/contact"
  },
  {
    id: "engagement",
    name: "Engagement",
    badge: "✦ RING CEREMONY & ROKA",
    titlePrefix: "TIMELESS ROMANTIC",
    titleHighlight: "ENGAGEMENT CARDS",
    desc: "Timeless layouts, animations, and photos tailored for modern ring ceremonies, ring highlights, and Roka celebrations.",
    image: "/images/categories/engagement.jpg",
    icon: Sparkles,
    featureBadges: ["🎵 MUSIC", "📷 GALLERY", "☑ RSVP", "📍 VENUE"],
    ctaText: "GET CUSTOM ENGAGEMENT INVITE",
    link: "/contact"
  },
  {
    id: "birthday",
    name: "Birthday",
    badge: "✦ MILESTONE CELEBRATIONS",
    titlePrefix: "PLAYFUL & JOYFUL",
    titleHighlight: "BIRTHDAY INVITATIONS",
    desc: "Playful milestone grids, custom countdown timer modules, and animated guest lists for kids and adult birthdays.",
    image: "/images/categories/birthday.jpg",
    icon: Cake,
    featureBadges: ["⏱ COUNTDOWN", "📷 PHOTO GRID", "☑ RSVP", "🎵 MUSIC"],
    ctaText: "GET CUSTOM BIRTHDAY INVITE",
    link: "/contact"
  },
  {
    id: "housewarming",
    name: "Housewarming",
    badge: "✦ SACRED HOME BLESSINGS",
    titlePrefix: "AUSPICIOUS GRACE",
    titleHighlight: "HOUSEWARMING CARDS",
    desc: "Blessing templates with auspicious elements like marigold garlands, mango leaf banners, and simple guest directions.",
    image: "/images/categories/housewarming.jpg",
    icon: HomeIcon,
    featureBadges: ["🌿 MARIGOLDS", "📍 MAP ROUTE", "☑ RSVP", "🎵 MANTRAS"],
    ctaText: "GET CUSTOM HOUSEWARMING INVITE",
    link: "/contact"
  },
  {
    id: "baby",
    name: "Baby Shower",
    badge: "✦ WELCOMING LITTLE ANGELS",
    titlePrefix: "WARM PASTEL",
    titleHighlight: "BABY SHOWER CARDS",
    desc: "Warm pastel templates featuring floating clouds, stars, soft animations, and integrated gift registry links.",
    image: "/images/categories/baby.jpg",
    icon: Baby,
    featureBadges: ["☁ PASTELS", "🎁 GIFT REGISTRY", "☑ RSVP", "🎵 LULLABY"],
    ctaText: "GET CUSTOM BABY SHOWER INVITE",
    link: "/contact"
  },
  {
    id: "halfsaree",
    name: "Half Saree",
    badge: "✦ TRADITIONAL RITU KALA",
    titlePrefix: "VIBRANT CULTURAL",
    titleHighlight: "HALF SAREE CARDS",
    desc: "Traditional saree function invitations with vibrant color palettes, photo sliders, and auspicious ceremony schedules.",
    image: "/images/categories/halfsaree.jpg",
    icon: Shirt,
    featureBadges: ["🌺 TRADITIONAL", "📷 GALLERY", "☑ RSVP", "📍 VENUE"],
    ctaText: "GET CUSTOM HALF SAREE INVITE",
    link: "/contact"
  },
  {
    id: "retirement",
    name: "Retirement",
    badge: "✦ HONORING A LIFETIME",
    titlePrefix: "DISTINGUISHED FORMAL",
    titleHighlight: "RETIREMENT CARDS",
    desc: "Elegant milestone invitation cards featuring career timeline highlights, memory photo grids, and formal reception schedules.",
    image: "/images/categories/retirement.jpg",
    icon: Award,
    featureBadges: ["🏆 HIGHLIGHTS", "📷 PHOTOS", "☑ RSVP", "📍 VENUE"],
    ctaText: "GET CUSTOM RETIREMENT INVITE",
    link: "/contact"
  },
  {
    id: "corporate",
    name: "Corporate",
    badge: "✦ FORMAL BUSINESS EVENTS",
    titlePrefix: "PREMIUM EXECUTIVE",
    titleHighlight: "CORPORATE INVITATIONS",
    desc: "Geometric gold outline accents, deep luxury background styles, speaker bios, and formal downloadable event schedules.",
    image: "/images/categories/corporate.jpg",
    icon: Briefcase,
    featureBadges: ["💼 SPEAKER BIOS", "📄 AGENDA PDF", "☑ RSVP", "📍 MAP"],
    ctaText: "GET CUSTOM CORPORATE INVITE",
    link: "/contact"
  }
];

export default function CategoryShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1); // 1 = forward, -1 = backward
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const shouldReduceMotion = useReducedMotion();
  const activeCategory = CATEGORIES[activeIndex];

  const pillRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // 4.5s Auto-Slideshow Timer with smooth progress updates
  useEffect(() => {
    if (isPaused) return;

    const intervalTime = 4500;
    const stepTime = 50;
    const increment = (stepTime / intervalTime) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setSlideDirection(1);
          setActiveIndex((current) => (current + 1) % CATEGORIES.length);
          return 0;
        }
        return prev + increment;
      });
    }, stepTime);

    return () => clearInterval(timer);
  }, [isPaused, activeIndex]);

  // Scroll active pill internally within horizontal container on mobile (without pulling page viewport)
  useEffect(() => {
    const currentPill = pillRefs.current[activeIndex];
    const container = containerRef.current;
    if (currentPill && container) {
      const pillLeft = currentPill.offsetLeft;
      const pillWidth = currentPill.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: pillLeft - containerWidth / 2 + pillWidth / 2,
        behavior: "smooth"
      });
    }
  }, [activeIndex]);

  const handleSelectCategory = (index: number) => {
    if (index === activeIndex) return;
    setSlideDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setProgress(0);
  };

  // Variants for seamless sliding direction
  const textVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? -30 : 30
    }),
    center: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.45, ease: "easeInOut" as const }
    },
    exit: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? 30 : -30,
      transition: { duration: 0.35, ease: "easeInOut" as const }
    })
  };

  const imageVariants = {
    enter: (direction: number) => ({
      opacity: 0,
      scale: 0.97,
      x: direction > 0 ? 40 : -40
    }),
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" as const }
    },
    exit: (direction: number) => ({
      opacity: 0,
      scale: 1.03,
      x: direction > 0 ? -30 : 30,
      transition: { duration: 0.4, ease: "easeInOut" as const }
    })
  };

  return (
    <section 
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="py-24 max-w-7xl mx-auto w-full px-6 md:px-12 space-y-12 z-30 relative select-none"
    >
      
      {/* Background Soft Glow Blobs */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(circle_at_center,#FFF4D4_0%,transparent_70%)] opacity-70 blur-3xl pointer-events-none" />

      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3 relative z-10"
      >
        <span className="text-xs font-bold uppercase tracking-[4px] text-[#C49B27] block">
          ✣ LUXURY MULTI-PAGE CELEBRATIONS ✣
        </span>

        <h2 className="text-3xl md:text-5xl font-normal uppercase tracking-[0.5px] font-cinzel text-[#241E1C] leading-tight">
          EVERY EVENT DESERVES <br />
          <span className="text-[#C49B27]">A BEAUTIFUL INVITATION</span>
        </h2>

        {/* Small gold floral divider */}
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]/50" />
          <span className="text-[#C49B27] text-xs">❦</span>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]/50" />
        </div>

        <p className="text-xs sm:text-sm text-zinc-500 max-w-xl mx-auto font-semibold leading-relaxed">
          From weddings to birthdays and every milestone in between, create experiences that your loved ones will cherish forever.
        </p>
      </motion.div>

      {/* 2. Category Navigation Pills */}
      <div className="relative z-20 max-w-6xl mx-auto">
        <div ref={containerRef} className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 px-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden justify-start md:justify-center">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            const isActive = activeIndex === idx;

            return (
              <button
                key={cat.id}
                ref={(el) => { pillRefs.current[idx] = el; }}
                onClick={() => handleSelectCategory(idx)}
                onMouseEnter={() => handleSelectCategory(idx)}
                className={`relative px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[1px] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
                  isActive 
                    ? "text-white border-transparent" 
                    : "text-zinc-700 bg-white/90 border-zinc-200/80 hover:border-[#C49B27]/50 shadow-xs"
                }`}
              >
                {/* Active Indicator Sliding Gold Pill */}
                {isActive && (
                  <motion.div
                    layoutId="activeCategoryPill"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#C49B27] shadow-lg shadow-[#C49B27]/30 z-0"
                  />
                )}

                <span className="relative z-10 flex items-center gap-1.5">
                  <Icon size={13} className={isActive ? "text-white" : "text-[#C49B27]"} />
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Thin Gold Progress Bar */}
        <div className="w-full max-w-2xl mx-auto h-[2px] bg-zinc-200/50 rounded-full overflow-hidden mt-1">
          <div 
            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#C49B27] transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 3. Category Showcase Card Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-6xl mx-auto rounded-[36px] border border-white/90 bg-[#FFFDF9]/95 p-8 md:p-12 shadow-2xl shadow-amber-900/5 backdrop-blur-md relative z-10 overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-6 text-left space-y-6">
            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={activeCategory.id}
                custom={slideDirection}
                variants={shouldReduceMotion ? undefined : textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-6"
              >
                {/* Badge */}
                <span className="px-3.5 py-1 rounded-full bg-[#C49B27]/10 border border-[#C49B27]/25 text-[8.5px] font-bold uppercase tracking-[1.5px] text-[#C49B27] inline-block">
                  {activeCategory.badge}
                </span>

                {/* Heading */}
                <h3 className="text-3xl sm:text-4xl font-normal font-cinzel text-[#241E1C] uppercase leading-tight">
                  {activeCategory.titlePrefix} <br />
                  <span className="text-[#C49B27]">{activeCategory.titleHighlight}</span>
                </h3>

                {/* Decorative Line */}
                <div className="w-16 h-[1.5px] bg-[#D4AF37]/40" />

                {/* Description */}
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-semibold">
                  {activeCategory.desc}
                </p>

                {/* Feature Badges */}
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {activeCategory.featureBadges.map((badge) => (
                    <span 
                      key={badge}
                      className="px-3.5 py-1.5 rounded-full bg-white border border-zinc-200/80 text-[8.5px] font-bold uppercase tracking-[1px] text-zinc-700 shadow-xs"
                    >
                      {badge}
                    </span>
                  ))}
                </div>

                {/* CTA Link */}
                <div className="pt-2">
                  <Link
                    href={activeCategory.link}
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[2px] text-[#C49B27] hover:text-[#B0871B] hover:gap-3 transition-all group"
                  >
                    {activeCategory.ctaText}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Image Column */}
          <div className="lg:col-span-6 flex justify-center items-center relative">
            
            {/* Soft Warm Glow Behind Image */}
            <div className="absolute w-[350px] h-[350px] bg-[radial-gradient(circle,#FFF3D1_0%,transparent_70%)] opacity-80 blur-2xl pointer-events-none" />

            <AnimatePresence mode="wait" custom={slideDirection}>
              <motion.div
                key={activeCategory.id}
                custom={slideDirection}
                variants={shouldReduceMotion ? undefined : imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden border border-white bg-white shadow-2xl p-2 group"
              >
                <div className="w-full h-full relative rounded-2xl overflow-hidden shadow-inner bg-amber-50">
                  <Image
                    src={activeCategory.image}
                    alt={activeCategory.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority={activeIndex === 0}
                    className="object-cover transform group-hover:scale-[1.025] transition-transform duration-700 ease-out"
                  />
                  {/* Subtle inner gold vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5 pointer-events-none" />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </motion.div>

    </section>
  );
}
