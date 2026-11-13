"use client";

import React, { useMemo } from "react";
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
  rotationY: number;
  blur: number;
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

  const petals: PetalItem[] = useMemo(() => {
    // 18 controlled particles for rich cinematic presence without mobile CPU lag
    return Array.from({ length: 18 }).map((_, i) => {
      const imgIndex = i % 4;
      const depth = (i % 3); // 0 = foreground, 1 = mid, 2 = background
      
      let size = 22;
      let blur = 0;
      let zIndex = 25;
      let opacity = 0.85;

      if (depth === 0) {
        // Foreground: large, crisp, closer to camera
        size = 30 + (i % 3) * 4;
        blur = 0;
        zIndex = 30;
        opacity = 0.95;
      } else if (depth === 1) {
        // Midground
        size = 20 + (i % 3) * 3;
        blur = 0.3;
        zIndex = 20;
        opacity = 0.8;
      } else {
        // Background: smaller, softer blur for optical depth
        size = 14 + (i % 3) * 2;
        blur = 1.2;
        zIndex = 15;
        opacity = 0.65;
      }

      return {
        id: i,
        image: PETAL_IMAGES[imgIndex],
        name: ["rose", "blush", "jasmine", "marigold"][imgIndex],
        left: `${(i * 5.5 + 2) % 94}%`,
        size,
        duration: 9 + (i % 6) * 1.8,
        delay: -(i * 1.2), // pre-distributed across viewport so page loads with falling petals already visible
        drift: ((i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 12)),
        rotation: (i * 68) % 360,
        rotationY: (i * 90) % 360,
        blur,
        opacity,
        zIndex,
      };
    });
  }, []);

  if (reducedMotion) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 h-full w-full pointer-events-none overflow-hidden z-20"
      aria-hidden="true"
    >
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 pointer-events-none select-none will-change-transform"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            zIndex: p.zIndex,
            filter: p.blur > 0 ? `blur(${p.blur}px)` : "none",
          }}
          initial={{
            y: "-10vh",
            x: 0,
            rotate: 0,
            rotateY: 0,
            opacity: 0,
          }}
          animate={{
            y: "115vh",
            x: [0, p.drift, p.drift * -0.6, p.drift * 0.8, 0],
            rotate: [0, p.rotation, p.rotation * -0.5, p.rotation * 1.3],
            rotateY: [0, 180, 360],
            opacity: [0, p.opacity, p.opacity, p.opacity * 0.8, 0],
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
            className="w-full h-full object-contain pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.18)]"
            loading="eager"
            decoding="async"
          />
        </motion.div>
      ))}
    </div>
  );
}

export default JasminePetals;
