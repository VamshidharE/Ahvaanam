"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useGopuram } from "./context";
import { OpeningHeader } from "./OpeningHeader";
import { CoupleCutout } from "./CoupleCutout";
import { ScrollIndicator } from "./ScrollIndicator";
import { ProgressHud } from "./ProgressHud";
import { TopDecorationBar } from "./decoration/TopDecorationBar";

export const GopuramScene: React.FC = () => {
  const { data } = useGopuram();
  const { animation, layout, assets } = data;

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [viewport, setViewport] = useState<{ width: number; height: number }>({
    width: 1440,
    height: 900,
  });
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const shouldReduceMotion = useReducedMotion();

  // Framer Motion normalized scroll tracking on container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progressMotionValue = useMotionValue(0);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (latest) => {
      progressMotionValue.set(latest);
    });
    return () => unsub();
  }, [scrollYProgress, progressMotionValue]);

  useEffect(() => {
    setIsMounted(true);
    const updateViewport = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setIsMobile(w < 768);
      setViewport({ width: w, height: h });
    };
    updateViewport();
    window.addEventListener("resize", updateViewport);

    // Support ?progress=0.30 for direct verification and testing
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const progressParam = params.get("progress");
      if (progressParam !== null) {
        const target = parseFloat(progressParam);
        if (!isNaN(target)) {
          const clamped = Math.max(0, Math.min(1, target));
          progressMotionValue.set(clamped);
        }
      }
    }

    return () => window.removeEventListener("resize", updateViewport);
  }, [progressMotionValue]);

  const gopuramWidthPct = isMobile
    ? (layout.mobile.gopuramWidthPercent ?? 92)
    : (layout.desktop.gopuramWidthPercent ?? 38);
  const gopuramMaxW = isMobile
    ? (layout.mobile.gopuramMaxWidthPx ?? 380)
    : (layout.desktop.gopuramMaxWidthPx ?? 480);

  const gopuramWidthPx = Math.min((viewport.width * gopuramWidthPct) / 100, gopuramMaxW);
  const gopuramHeightPx = gopuramWidthPx * 3; // aspect-[1/3]
  const gopuramInitialTopPx = isMobile
    ? viewport.height * ((layout.mobile.gopuramInitialTopVh ?? 26) / 100)
    : Math.max(215, viewport.height * 0.27);

  const targetBottomOffset = isMobile ? 36 : 60;
  const targetBottomPx = viewport.height + targetBottomOffset;
  const travelDistance = isMounted
    ? Math.max(0, gopuramInitialTopPx + gopuramHeightPx - targetBottomPx)
    : isMobile
      ? animation.gopuramTravelMobilePx
      : animation.gopuramTravelDesktopPx;

  const actualTravel = shouldReduceMotion ? travelDistance * 0.2 : travelDistance;
  const skyTravel = actualTravel * animation.skyParallaxIntensity;

  // Sky Parallax
  const desktopScaledHeight = (viewport.width * 1831) / 724;
  const desktopSkyTravel = Math.max(0, 0.35 * desktopScaledHeight - viewport.height);
  const desktopContainerHeight = viewport.height + desktopSkyTravel;

  const skyStartY = 0;
  const skyEndY = isMobile
    ? -skyTravel
    : (shouldReduceMotion ? -desktopSkyTravel * 0.2 : -desktopSkyTravel);

  const skyY = useTransform(
    progressMotionValue,
    [0, animation.coupleRevealComplete, 1],
    [skyStartY, skyEndY, skyEndY]
  );

  // Gopuram Travel
  const gopuramY = useTransform(progressMotionValue, (p) => {
    const travel = shouldReduceMotion ? actualTravel * 0.2 : actualTravel;
    const progressClamped = Math.min(Math.max(p, 0), 1);
    return -progressClamped * travel;
  });

  // Opening Header fade & drift
  const headerOpacity = useTransform(
    progressMotionValue,
    [animation.headerFadeStart, animation.headerFadeEnd],
    [1, 0]
  );

  const headerY = useTransform(
    progressMotionValue,
    [animation.headerFadeStart, animation.headerFadeEnd],
    [0, shouldReduceMotion ? 0 : -35]
  );

  // Scroll indicator fade
  const scrollIndicatorOpacity = useTransform(
    progressMotionValue,
    [0, animation.headerFadeStart * 2],
    [1, 0]
  );

  const scrollToProgress = (targetProgress: number, smooth: boolean = true) => {
    progressMotionValue.set(targetProgress);
    if (!containerRef.current) return;
    const totalScrollableDistance =
      containerRef.current.scrollHeight - window.innerHeight;
    const targetScrollY = totalScrollableDistance * targetProgress;
    window.scrollTo({
      top: targetScrollY,
      behavior: smooth ? "smooth" : "instant",
    });
  };

  return (
    <div
      ref={containerRef}
      style={{ height: `${animation.scrollTrackHeightVh}vh` }}
      className="relative w-full bg-[#0a0807]"
    >
      {/* Sacred hanging corner decoration */}
      <TopDecorationBar />

      {/* Verification HUD (when query param or dev) */}
      {isMounted && (
        <ProgressHud
          progressValue={progressMotionValue}
          scrollToProgress={(p) => scrollToProgress(p, true)}
          showProgressHud={false}
        />
      )}

      {/* Sticky Cinematic Viewport Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center select-none pointer-events-none">
        {/* LAYER 1: SKY BACKGROUND */}
        <motion.div
          style={{
            y: skyY,
            height: isMobile ? "135vh" : `${desktopContainerHeight}px`,
            top: isMobile ? "-12vh" : 0,
          }}
          className="absolute inset-x-0 w-full z-10"
        >
          <Image
            src={assets.skyBackground}
            alt="Majestic South Indian sunset sky"
            fill
            sizes="100vw"
            className={`filter brightness-[0.97] contrast-[1.04] ${
              isMobile ? "object-cover object-top" : "object-cover object-bottom"
            }`}
            unoptimized
            priority
          />

          {/* Warm atmospheric depth overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-950/20 via-transparent to-black/25 opacity-70" />

          {/* Golden sunbeam radial glow behind upper tower */}
          <div
            className="absolute top-[22%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-40 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(245,210,120,0.5) 0%, rgba(220,160,50,0.2) 45%, transparent 70%)",
            }}
          />
        </motion.div>

        {/* LAYER 2: TALL GOPURAM & SYNCHRONIZED COUPLE STAGE */}
        <motion.div
          style={{
            top: isMounted
              ? `${gopuramInitialTopPx}px`
              : isMobile
                ? `${layout.mobile.gopuramInitialTopVh}vh`
                : "max(215px, 27vh)",
            y: gopuramY,
          }}
          className="absolute inset-x-0 z-20 flex justify-center pointer-events-none"
        >
          <div
            className="relative aspect-[1/3] drop-shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
            style={{
              width: isMobile
                ? `${layout.mobile.gopuramWidthPercent}vw`
                : `${layout.desktop.gopuramWidthPercent}vw`,
              maxWidth: isMobile
                ? `${layout.mobile.gopuramMaxWidthPx}px`
                : `${layout.desktop.gopuramMaxWidthPx}px`,
            }}
          >
            {/* The Gopuram Image (Full 1:3 height from top pinnacle to bottom doorway) */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src={assets.gopuramOverlay}
                alt="Tall Dravidian Temple Gopuram Tower"
                fill
                sizes="(max-width: 768px) 76vw, 440px"
                className="object-contain object-top filter contrast-[1.03] brightness-[1.01]"
                unoptimized
                priority
              />
            </div>

            {/* The Couple Cutout */}
            <CoupleCutout
              progress={progressMotionValue}
              isMobile={isMobile}
            />
          </div>
        </motion.div>

        {/* LAYER 5: OPENING HEADER */}
        <OpeningHeader opacity={headerOpacity} y={headerY} />

        {/* Scroll down prompt */}
        <ScrollIndicator opacity={scrollIndicatorOpacity} />
      </div>
    </div>
  );
};
