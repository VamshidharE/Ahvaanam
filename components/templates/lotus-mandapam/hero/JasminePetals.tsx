"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface PetalItem {
  id: number;
  image: string;
  name: string;
  left: string;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  rotation: number;
  opacity: number;
  zIndex: number;
}

const PETAL_IMAGES = [
  "/templates/emerald-palace/petal-rose.png",
  "/templates/emerald-palace/petal-blush.png",
  "/templates/emerald-palace/petal-jasmine.png",
  "/templates/emerald-palace/petal-marigold.png",
];

export function JasminePetals() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Pause petal animation loop when hero is scrolled out of viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const petals: PetalItem[] = useMemo(() => {
    // 8 particles on mobile, 14 on desktop for buttery 60 FPS performance
    const count = isMobile ? 8 : 14;
    return Array.from({ length: count }).map((_, i) => {
      const imgIndex = i % 4;
      const size = isMobile ? 18 + (i % 3) * 4 : 22 + (i % 3) * 6;
      return {
        id: i,
        image: PETAL_IMAGES[imgIndex],
        name: ["rose", "blush", "jasmine", "marigold"][imgIndex],
        left: `${(i * (100 / count) + 3) % 94}%`,
        size,
        duration: 9 + (i % 5) * 1.6,
        delay: -(i * 1.4),
        drift: ((i % 2 === 0 ? 1 : -1) * (18 + (i % 4) * 10)),
        rotation: (i * 68) % 360,
        opacity: isMobile ? 0.8 : 0.88,
        zIndex: 20 + (i % 10),
      };
    });
  }, [isMobile]);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-[125vh] pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {isInView &&
        petals.map((p) => (
          <motion.div
            key={p.id}
            className="absolute top-0 pointer-events-none select-none will-change-transform"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              zIndex: p.zIndex,
            }}
            initial={{
              y: "-10vh",
              x: 0,
              rotate: 0,
              opacity: 0,
            }}
            animate={{
              y: "120vh",
              x: [0, p.drift, p.drift * -0.6, p.drift * 0.8, 0],
              rotate: [0, p.rotation, p.rotation * -0.5, p.rotation],
              opacity: [0, p.opacity, p.opacity, p.opacity * 0.7, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={p.image}
              alt=""
              className="w-full h-full object-contain pointer-events-none"
              loading="eager"
              decoding="async"
            />
          </motion.div>
        ))}
    </div>
  );
}

export default JasminePetals;
