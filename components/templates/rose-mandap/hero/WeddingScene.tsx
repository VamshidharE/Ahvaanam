"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRoseMandap } from "../context";

const garlands = [
    {
        className: "garland-1",
        src: "/wedding/garlands/garland-left.png",
        duration: 8,
        delay: 0,
    },
    {
        className: "garland-2",
        src: "/wedding/garlands/garland-right.png",
        duration: 8.5,
        delay: 0.6,
    },
    {
        className: "garland-3",
        src: "/wedding/garlands/garland-left.png",
        duration: 9,
        delay: 1.2,
    },
    {
        className: "garland-4",
        src: "/wedding/garlands/garland-right.png",
        duration: 9.5,
        delay: 1.8,
    },
    {
        className: "garland-5",
        src: "/wedding/garlands/garland-left.png",
        duration: 8.5,
        delay: 2.2,
    },
    {
        className: "garland-6",
        src: "/wedding/garlands/garland-right.png",
        duration: 9,
        delay: 2.7,
    },
    {
        className: "garland-7",
        src: "/wedding/garlands/garland-left.png",
        duration: 8,
        delay: 3,
    },
    {
        className: "garland-8",
        src: "/wedding/garlands/garland-right.png",
        duration: 8.8,
        delay: 3.4,
    },
] as const;

function AnimatedGarland({
    src,
    className,
    duration,
    delay,
}: {
    src: string;
    className: string;
    duration: number;
    delay: number;
}) {
    const reducedMotion = useReducedMotion();

    return (
        <motion.div
            className={`scene-garland ${className}`}
            animate={
                reducedMotion
                    ? undefined
                    : {
                        rotate: [-1.8, 2, -1.2, 1.6, -1.8],
                        x: [0, 3, -2, 2, 0],
                        y: [0, 1, -1, 1, 0],
                    }
            }
            transition={{
                duration,
                delay,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            <img src={src} alt="" />
        </motion.div>
    );
}

export default function WeddingScene() {
    const invitation = useRoseMandap();
    const reducedMotion = useReducedMotion();

    return (
        <div className="wedding-scene" aria-hidden="true">

            {/* =====================================================
                GANESHA
            ===================================================== */}

            {/* Mantra positioned cleanly above Ganesha */}
            <motion.p
                className="scene-mantra wedding-devanagari"
                style={{ x: "-50%" }}
                initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
                {invitation.introduction.mantra}
            </motion.p>

            <motion.div
                className="scene-ganesha"
                style={{ x: "-50%" }}
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            y: [0, -4, 0, -2, 0],
                            scale: [1, 1.015, 1, 1.01, 1],
                        }
                }
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <div className="ganesha-aura" />

                <img
                    src="/wedding/ganesha/Ganesha.png"
                    alt=""
                />
            </motion.div>

            {/* =====================================================
                GARLAND CANOPY
            ===================================================== */}

            <div className="scene-garland-canopy">
                {garlands.map((garland) => (
                    <AnimatedGarland
                        key={garland.className}
                        {...garland}
                    />
                ))}
            </div>

            {/* =====================================================
                BELLS
            ===================================================== */}

            <motion.div
                className="scene-bell scene-bell-1"
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            rotate: [-3, 3, -2, 2, -3],
                        }
                }
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/wedding/bells/bell 1.png"
                    alt=""
                />
            </motion.div>

            <motion.div
                className="scene-bell scene-bell-2"
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            rotate: [2.5, -2.5, 1.5, -2, 2.5],
                        }
                }
                transition={{
                    duration: 5.6,
                    delay: 0.7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/wedding/bells/bell 2.png"
                    alt=""
                />
            </motion.div>

            <motion.div
                className="scene-bell scene-bell-3"
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            rotate: [-2, 2.5, -1.5, 2, -2],
                        }
                }
                transition={{
                    duration: 4.8,
                    delay: 1.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/wedding/bells/bell 1.png"
                    alt=""
                />
            </motion.div>

            <motion.div
                className="scene-bell scene-bell-4"
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            rotate: [2, -3, 1.5, -2, 2],
                        }
                }
                transition={{
                    duration: 5.3,
                    delay: 1.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/wedding/bells/bell 2.png"
                    alt=""
                />
            </motion.div>

            {/* =====================================================
                SIDE FLOWERS
            ===================================================== */}

            <motion.div
                className="scene-flower scene-flower-left"
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            rotate: [-1.5, 1.5, -1, 1, -1.5],
                            y: [0, -2, 0, -1, 0],
                        }
                }
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/wedding/flowers/flower left.png"
                    alt=""
                />
            </motion.div>

            <motion.div
                className="scene-flower scene-flower-right"
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            rotate: [1.5, -1.5, 1, -1, 1.5],
                            y: [0, -1, 0, -2, 0],
                        }
                }
                transition={{
                    duration: 7.5,
                    delay: 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >
                <img
                    src="/wedding/flowers/flower right.png"
                    alt=""
                />
            </motion.div>

            {/* =====================================================
                MANDAP + COUPLE
                SINGLE RESPONSIVE COMPOSITION
            ===================================================== */}

            <motion.div
                className="scene-mandap-composition"
                style={{ x: "-50%" }}
                animate={
                    reducedMotion
                        ? undefined
                        : {
                            y: [0, -1.5, 0, -0.8, 0],
                        }
                }
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            >

                {/* =================================================
                    MANDAP ARTWORK
                ================================================= */}

                <div className="mandap-art">

                    <img
                        src="/wedding/mandap/mandap-arch.png"
                        alt=""
                    />

                    {/* =============================================
                        COUPLE
                    ============================================= */}

                    <motion.div
                        className="scene-couple"
                        style={{ x: "-50%" }}
                        initial={
                            reducedMotion
                                ? undefined
                                : {
                                    opacity: 0,
                                    y: 24,
                                    scale: 0.94,
                                }
                        }
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={{
                            duration: 1.5,
                            delay: 0.6,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                    >
                        <img
                            src="/wedding/mandap-couple/couple.png"
                            alt=""
                        />
                    </motion.div>

                    {/* =============================================
                        COUPLE GLOW
                    ============================================= */}

                    <motion.div
                        className="couple-glow"
                        style={{ x: "-50%" }}
                        animate={
                            reducedMotion
                                ? undefined
                                : {
                                    opacity: [0.2, 0.32, 0.2],
                                    scale: [0.97, 1.03, 0.97],
                                }
                        }
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                </div>

                {/* =================================================
                    MANDAP GLOW
                ================================================= */}

                <motion.div
                    className="mandap-glow"
                    animate={
                        reducedMotion
                            ? undefined
                            : {
                                opacity: [0.18, 0.3, 0.18],
                                scale: [0.97, 1.03, 0.97],
                            }
                    }
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

            </motion.div>

        </div>
    );
}