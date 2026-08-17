"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

interface SectionRevealProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    duration?: number;
    y?: number;
}

export default function SectionReveal({
    children,
    className = "",
    delay = 0,
    duration = 0.8,
    y = 35,
}: SectionRevealProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial={
                shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 0,
                        y,
                    }
            }
            whileInView={
                shouldReduceMotion
                    ? { opacity: 1 }
                    : {
                        opacity: 1,
                        y: 0,
                    }
            }
            viewport={{
                once: true,
                amount: 0.2,
            }}
            transition={{
                duration: shouldReduceMotion ? 0 : duration,
                delay: shouldReduceMotion ? 0 : delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}