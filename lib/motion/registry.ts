import { MotionPack } from "./types";

const MOTIONS: Record<string, MotionPack> = {
  // --- BASE MOTION ---
  "motion-base": {
    id: "motion-base",
    name: "Base Motion",
    presets: {
      reveal: {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-100px" },
        transition: { duration: 0.8, ease: "easeOut" },
      },
      hover: {
        scale: 1.02,
        transition: { duration: 0.3 },
      },
      tap: {
        scale: 0.98,
      },
      stagger: 0.1,
    },
  },

  // --- LUXURY MOTION ---
  "luxury-motion": {
    id: "luxury-motion",
    name: "Luxury Motion",
    baseId: "motion-base",
    presets: {
      reveal: {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }, // elegant cubic bezier
      },
      hover: {
        scale: 1.01,
        transition: { duration: 0.4 },
      },
      tap: {
        scale: 0.99,
      },
    },
  },

  // --- CELEBRATION MOTION ---
  "celebration-motion": {
    id: "celebration-motion",
    name: "Celebration Motion",
    baseId: "motion-base",
    presets: {
      reveal: {
        initial: { opacity: 0, scale: 0.95, y: 15 },
        whileInView: { opacity: 1, scale: 1, y: 0 },
        transition: { type: "spring", stiffness: 100, damping: 15 }, // bouncy spring
      },
      hover: {
        scale: 1.05,
        rotate: 1,
        transition: { duration: 0.2 },
      },
      tap: {
        scale: 0.95,
      },
    },
  },

  // --- MINIMAL MOTION ---
  "minimal-motion": {
    id: "minimal-motion",
    name: "Minimal Motion",
    baseId: "motion-base",
    presets: {
      reveal: {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        transition: { duration: 0.5, ease: "linear" }, // simple subtle fade
      },
      hover: {
        scale: 1.0,
      },
      tap: {
        scale: 1.0,
      },
    },
  },

  // --- GLASS MOTION ---
  "glass-motion": {
    id: "glass-motion",
    name: "Glass Motion",
    baseId: "motion-base",
    presets: {
      reveal: {
        initial: { opacity: 0, backdropFilter: "blur(0px)" },
        whileInView: { opacity: 1, backdropFilter: "blur(12px)" },
        transition: { duration: 1.0 },
      },
      hover: {
        scale: 1.03,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
      },
      tap: {
        scale: 0.97,
      },
    },
  },
};

export function getMotionPack(id: string): MotionPack | null {
  const pack = MOTIONS[id];
  if (!pack) return null;

  // Resolve inheritance recursively:
  if (pack.baseId) {
    const base = getMotionPack(pack.baseId);
    if (base) {
      return {
        ...base,
        ...pack,
        presets: {
          ...base.presets,
          ...pack.presets,
        },
      };
    }
  }
  return pack;
}

export function listMotionPacks(): MotionPack[] {
  return Object.values(MOTIONS);
}
