"use client";

import { motion, useReducedMotion } from "framer-motion";

interface OrnamentalDividerProps {
    className?: string;
    symbol?: string;
}

export default function OrnamentalDivider({
    className = "",
    symbol = "✦",
}: OrnamentalDividerProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={`ornamental-divider ${className}`}
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scaleX: 0.7 }}
            whileInView={
                shouldReduceMotion
                    ? { opacity: 1 }
                    : { opacity: 1, scaleX: 1 }
            }
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
            <span className="ornamental-divider-line" />

            <span className="ornamental-divider-symbol" aria-hidden="true">
                {symbol}
            </span>

            <span className="ornamental-divider-line" />
        </motion.div>
    );
}