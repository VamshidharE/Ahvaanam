"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRoseMandap } from "../context";

export default function HeroText() {
    const invitation = useRoseMandap();
    const shouldReduceMotion = useReducedMotion();

    const reveal = (delay: number) =>
        shouldReduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: 0,
            };

    return (
        <div className="hero-text">
            <motion.p
                className="hero-eyebrow"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={reveal(0.35)}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                {invitation.introduction.eyebrow}
            </motion.p>

            <motion.p
                className="hero-eyebrow"
                style={{ marginTop: "4px", fontSize: "0.9em" }}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={reveal(0.45)}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
                {invitation.introduction.message}
            </motion.p>

            <motion.p
                className="hero-family-title"
                style={{
                    fontWeight: 700,
                    margin: "6px 0 0",
                    color: "var(--gold-dark)",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontSize: "clamp(13px, 1.8vw, 19px)",
                    fontFamily: '"Cormorant Garamond", Georgia, serif'
                }}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
                animate={reveal(0.5)}
                transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
                {invitation.introduction.familyTitle}
            </motion.p>

            <motion.div
                className="hero-names"
                initial={
                    shouldReduceMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 0, scale: 0.94 }
                }
                animate={
                    shouldReduceMotion
                        ? { opacity: 1, scale: 1 }
                        : { opacity: 1, scale: 1 }
                }
                transition={{
                    duration: 1.2,
                    delay: 0.55,
                    ease: [0.22, 1, 0.36, 1],
                }}
            >
                <span className="hero-name">{invitation.couple.groom}</span>

                <span className="hero-ampersand">&amp;</span>

                <span className="hero-name">{invitation.couple.bride}</span>
            </motion.div>
        </div>
    );
}