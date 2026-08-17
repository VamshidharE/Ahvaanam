"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Bell {
    src: string;
    left: string;
    size: string;
    delay: number;
    duration: number;
    direction: number;
    top?: string;
}

const bells: Bell[] = [
    {
        src: "/wedding/bells/bell 1.png",
        left: "5%",
        size: "clamp(58px, 9vw, 105px)",
        delay: 0,
        duration: 4.2,
        direction: 1,
        top: "0%",
    },
    {
        src: "/wedding/bells/bell 2.png",
        left: "16%",
        size: "clamp(65px, 10vw, 115px)",
        delay: 0.8,
        duration: 5.1,
        direction: -1,
        top: "2%",
    },
    {
        src: "/wedding/bells/bell 1.png",
        left: "28%",
        size: "clamp(55px, 8vw, 95px)",
        delay: 1.5,
        duration: 4.7,
        direction: 1,
        top: "0%",
    },
    {
        src: "/wedding/bells/bell 1.png",
        left: "66%",
        size: "clamp(55px, 8vw, 95px)",
        delay: 1.1,
        duration: 4.9,
        direction: -1,
        top: "0%",
    },
    {
        src: "/wedding/bells/bell 2.png",
        left: "78%",
        size: "clamp(65px, 10vw, 115px)",
        delay: 0.4,
        duration: 5.3,
        direction: 1,
        top: "2%",
    },
    {
        src: "/wedding/bells/bell 2.png",
        left: "90%",
        size: "clamp(58px, 9vw, 105px)",
        delay: 1.8,
        duration: 4.4,
        direction: -1,
        top: "0%",
    },
];

function Bell({ bell }: { bell: Bell }) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className="hanging-decoration"
            style={{
                left: bell.left,
                top: bell.top,
                width: bell.size,
            }}
            animate={
                shouldReduceMotion
                    ? undefined
                    : {
                        rotate: [
                            0,
                            bell.direction * 2.2,
                            bell.direction * -1.6,
                            bell.direction * 1.1,
                            0,
                        ],
                    }
            }
            transition={{
                duration: bell.duration,
                delay: bell.delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <div
                style={{
                    width: "2px",
                    height: "clamp(20px, 4vw, 45px)",
                    margin: "0 auto",
                    background:
                        "linear-gradient(to bottom, #e8cc75, #9a6d1d, #d8b650)",
                    opacity: 0.85,
                }}
            />

            <img
                src={bell.src}
                alt=""
                className="hanging-bell"
                style={{
                    width: "100%",
                    height: "auto",
                }}
            />
        </motion.div>
    );
}

export default function HangingDecorations() {
    return (
        <div
            className="absolute inset-0 z-[7] pointer-events-none overflow-hidden"
            aria-hidden="true"
        >
            {bells.map((bell) => (
                <Bell key={bell.src} bell={bell} />
            ))}
        </div>
    );
}