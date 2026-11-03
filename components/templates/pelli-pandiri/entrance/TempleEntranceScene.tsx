"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  useScroll,
  useTransform,
  useReducedMotion,
  motion,
} from "framer-motion";
import { TempleBackground } from "./TempleBackground";
import { CoupleNameTitle } from "./CoupleNameTitle";
import { WeddingCouple } from "./WeddingCouple";
import { ScrollIndicator } from "./ScrollIndicator";
import { PelliPandiriData } from "../adapter";

export const TempleEntranceScene: React.FC<{ data: PelliPandiriData }> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1440, height: 900 });
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Normalized scroll tracking directly across container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Safe resize listener: ignores mobile URL bar collapse/expansion during scrolling
  useEffect(() => {
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    setIsMobile(lastW < 768);
    setDimensions({ width: lastW, height: lastH });

    const updateSize = () => {
      const curW = window.innerWidth;
      const curH = window.innerHeight;
      const isMob = curW < 768;

      // Ignore minor vertical height fluctuations caused by mobile address bar
      if (Math.abs(curW - lastW) < 4 && Math.abs(curH - lastH) < (isMob ? 130 : 12)) {
        return;
      }

      lastW = curW;
      lastH = curH;
      setDimensions({ width: curW, height: curH });
      setIsMobile(isMob);
    };

    window.addEventListener("resize", updateSize, { passive: true });
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // 1. FULL-LENGTH SKY BACKGROUND SCROLL:
  // Dynamically computes exact pixel travel so that 100% of the background's full length appears,
  // scrolling all the way from the top sky to the bottom landscape using pure GPU translate3d!
  const skyY = useTransform(scrollYProgress, (p) => {
    if (shouldReduceMotion) return 0;
    const isMob = dimensions.width < 768;
    const renderedBgHeight = isMob
      ? dimensions.height * 2.2
      : dimensions.width * (1672 / 940);
    const maxTravelPx = Math.max(0, renderedBgHeight - dimensions.height);

    if (p <= 0) return 0;
    if (p >= 1.0) return -maxTravelPx;
    const t = Math.max(0, Math.min(1, p / 1.0));
    const ease = Math.sin((t * Math.PI) / 2);
    return -maxTravelPx * ease;
  });

  // 2. UNLINKED TEXT LAYER:
  // Visible at 0% over the open sky, fades out cleanly as user starts scrolling toward the pandiri
  const titleOpacity = useTransform(scrollYProgress, (p) => {
    if (p <= 0.05) return 1;
    if (p >= 0.42) return 0;
    const t = (p - 0.05) / (0.42 - 0.05);
    return 1 - t;
  });

  const titleY = useTransform(scrollYProgress, (p) => {
    if (shouldReduceMotion) return 0;
    if (p <= 0.05) return 0;
    if (p >= 0.42) return -45;
    const t = (p - 0.05) / (0.42 - 0.05);
    return -45 * t;
  });

  // Scroll indicator prompt fade
  const scrollIndicatorOpacity = useTransform(scrollYProgress, (p) => {
    if (p <= 0.01) return 1;
    if (p >= 0.08) return 0;
    return 1 - (p - 0.01) / 0.07;
  });

  // 3. PELLI PANDIRI MANDAP STAGE:
  // - Starts with 88% of its own height pushed down below the viewport so only the top peaks peek in at 0%.
  // - Rises smoothly, continuously and settles firmly at bottom: 0 at 100% with zero dead scroll.
  const pandiriTranslateY = useTransform(scrollYProgress, (p) => {
    if (shouldReduceMotion) return 0;
    const isMob = dimensions.width < 768;
    const pandiriHeight = isMob
      ? Math.min(dimensions.width * 1.45, 680) * (1024 / 1536)
      : dimensions.width * (1024 / 1536);
    const initialOffsetPx = pandiriHeight * 0.88;

    if (p <= 0) return initialOffsetPx;
    if (p >= 1.0) return 0;
    const t = Math.max(0, Math.min(1, p));
    const ease = Math.sin((t * Math.PI) / 2);
    return initialOffsetPx * (1 - ease);
  });

  const assets = data.assets;

  return (
    <div
      ref={containerRef}
      id="hero"
      style={{ height: "195vh" }}
      className="relative w-full bg-[#0a0807]"
    >
      {/* Sticky Cinematic Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none">
        {/* LAYER 1: Full-Screen Sunset Sky Backdrop */}
        <TempleBackground skyY={skyY} isMobile={isMobile} data={data} />

        {/* LAYER 2: Unlinked Invitation Text over Open Sky */}
        <CoupleNameTitle
          opacity={titleOpacity}
          y={titleY}
          isMobile={isMobile}
          data={data}
        />

        {/* 
          LAYER 3 & 4: THE PELLI PANDIRI MANDAP STAGE
          - Desktop: Enlarged to fit completely to the sides (w-[100vw] min-w-full).
          - Fixed to bottom (-bottom-[2px]), zero gap below.
          - Starts shifted down so names have open sky, rises smoothly into position.
        */}
        <motion.div
          style={{ y: pandiriTranslateY }}
          className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 z-20 flex items-end justify-center pointer-events-none will-change-transform"
        >
          <div
            className={`relative select-none aspect-[1536/1024] ${
              isMobile
                ? "w-[145vw] max-w-[680px]"
                : "w-[100vw] min-w-full"
            }`}
          >
            {/* The Complete Traditional Pelli Pandiri Background Image (1536x1024) */}
            <Image
              src={assets.pelliPandiri}
              alt="Telugu Pelli Pandiri – Sacred Wedding Mandap"
              fill
              sizes="(max-width: 768px) 145vw, 100vw"
              className={`object-contain object-bottom ${isMobile ? "" : "drop-shadow-[0_16px_48px_rgba(0,0,0,0.75)]"}`}
              unoptimized
              priority
            />

            {/* Mobile soft ambient ground shadow (replaces expensive transparent PNG filter) */}
            {isMobile && (
              <div className="absolute -bottom-2 inset-x-[15%] h-6 bg-black/45 blur-sm rounded-full pointer-events-none" />
            )}

            {/* LAYER 4: COUPLE CUTOUT ENLARGED & GROUNDED ON MANDAP STEPS */}
            <WeddingCouple
              progress={scrollYProgress}
              isMobile={isMobile}
              shouldReduceMotion={shouldReduceMotion}
              data={data}
            />
          </div>
        </motion.div>

        {/* LAYER 5: STATIONARY CORNER FOLIAGE FRAMING ENTRANCE (Non-scrolling framing) */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: [-0.9, 0.9, -0.9],
                  y: [0, 2.5, 0],
                }
          }
          transition={{
            duration: 6.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top left" }}
          className="absolute -top-1.5 -left-1.5 z-25 w-[150px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[370px] aspect-[520/724] pointer-events-none select-none"
        >
          <Image
            src={assets.cornerLeavesLeft}
            alt=""
            fill
            sizes="(max-width: 768px) 200px, 370px"
            className={`object-contain object-left-top ${isMobile ? "" : "drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"}`}
            priority
            unoptimized
          />
        </motion.div>

        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  rotate: [0.9, -0.9, 0.9],
                  y: [0, 2.5, 0],
                }
          }
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "top right" }}
          className="absolute -top-1.5 -right-1.5 z-25 w-[150px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[370px] aspect-[520/724] pointer-events-none select-none"
        >
          <Image
            src={assets.cornerLeavesRight}
            alt=""
            fill
            sizes="(max-width: 768px) 200px, 370px"
            className={`object-contain object-right-top ${isMobile ? "" : "drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"}`}
            priority
            unoptimized
          />
        </motion.div>

        {/* LAYER 6: SCROLL INDICATOR PROMPT */}
        <ScrollIndicator opacity={scrollIndicatorOpacity} />
      </div>
    </div>
  );
};
