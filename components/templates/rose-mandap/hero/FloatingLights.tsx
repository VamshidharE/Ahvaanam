"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Light {
    left: string;
    bottom: string;
    size: number;
    delay: number;
    duration: number;
}

const lights: Light[] = [
    { left: "12%", bottom: "18%", size: 9, delay: 0, duration: 2.4 },
    { left: "24%", bottom: "11%", size: 7, delay: 0.8, duration: 2.8 },
    { left: "37%", bottom: "17%", size: 8, delay: 1.4, duration: 2.2 },
    { left: "50%", bottom: "13%", size: 10, delay: 0.5, duration: 2.6 },
    { left: "63%", bottom: "17%", size: 8, delay: 1.1, duration: 2.9 },
    { left: "76%", bottom: "11%", size: 7, delay: 1.8, duration: 2.3 },
    { left: "88%", bottom: "18%", size: 9, delay: 0.3, duration: 2.7 },
];

function FloatingLight({ light }: { light: Light }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.span
            className="absolute rounded-full pointer-events-none"
            style={{
                left: light.left,
                bottom: light.bottom,
                width: light.size,
                height: light.size,
                background:
                    "radial-gradient(circle, #FFF9D5 0%, #FFD45C 38%, #F2A62C 68%, transparent 100%)",
                boxShadow: `
          0 0 8px rgba(255, 208, 78, 0.9),
          0 0 18px rgba(255, 171, 37, 0.55),
          0 0 30px rgba(255, 145, 20, 0.2)
        `,
            }}
            animate={
                shouldReduceMotion
                    ? { opacity: 0.8 }
                    : {
                        opacity: [0.35, 1, 0.55, 0.95, 0.35],
                        scale: [0.8, 1.15, 0.9, 1.05, 0.8],
                        y: [0, -4, 1, -3, 0],
                    }
            }
            transition={{
                duration: light.duration,
                delay: light.delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            aria-hidden="true"
        />
    );
}

export default function FloatingLights() {
    const shouldReduceMotion = useReducedMotion();

    return (
        <div
            className="absolute inset-0 z-[24] pointer-events-none overflow-hidden"
            aria-hidden="true"
        >
            {/* Warm ambient glow */}
            <motion.div
                className="hero-glow"
                animate={
                    shouldReduceMotion
                        ? { opacity: 0.6 }
                        : {
                            opacity: [0.45, 0.75, 0.5, 0.7, 0.45],
                            scale: [1, 1.04, 1, 1.03, 1],
                        }
                }
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Small floating light particles */}
            {lights.map((light, index) => (
                <FloatingLight key={index} light={light} />
            ))}
        </div>
    );
}