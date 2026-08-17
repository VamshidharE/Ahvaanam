"use client";

import { motion, useReducedMotion } from "framer-motion";

interface DecorativeFlowerProps {
    className?: string;
    size?: number;
    delay?: number;
    color?: string;
}

export default function DecorativeFlower({
    className = "",
    size = 42,
    delay = 0,
    color = "#D88997",
}: DecorativeFlowerProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <motion.div
            className={`pointer-events-none ${className}`}
            style={{
                width: size,
                height: size,
            }}
            initial={
                shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 0, scale: 0.7 }
            }
            whileInView={
                shouldReduceMotion
                    ? { opacity: 1, scale: 1 }
                    : { opacity: 1, scale: 1 }
            }
            viewport={{ once: true, amount: 0.3 }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <svg
                viewBox="0 0 100 100"
                width="100%"
                height="100%"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <g transform="translate(50 50)">
                    <ellipse
                        cx="0"
                        cy="-24"
                        rx="12"
                        ry="25"
                        fill={color}
                        opacity="0.88"
                    />

                    <ellipse
                        cx="24"
                        cy="0"
                        rx="12"
                        ry="25"
                        transform="rotate(90 24 0)"
                        fill={color}
                        opacity="0.78"
                    />

                    <ellipse
                        cx="0"
                        cy="24"
                        rx="12"
                        ry="25"
                        fill={color}
                        opacity="0.88"
                    />

                    <ellipse
                        cx="-24"
                        cy="0"
                        rx="12"
                        ry="25"
                        transform="rotate(90 -24 0)"
                        fill={color}
                        opacity="0.78"
                    />

                    <ellipse
                        cx="17"
                        cy="-17"
                        rx="10"
                        ry="22"
                        transform="rotate(45 17 -17)"
                        fill={color}
                        opacity="0.65"
                    />

                    <ellipse
                        cx="17"
                        cy="17"
                        rx="10"
                        ry="22"
                        transform="rotate(135 17 17)"
                        fill={color}
                        opacity="0.65"
                    />

                    <ellipse
                        cx="-17"
                        cy="17"
                        rx="10"
                        ry="22"
                        transform="rotate(45 -17 17)"
                        fill={color}
                        opacity="0.65"
                    />

                    <ellipse
                        cx="-17"
                        cy="-17"
                        rx="10"
                        ry="22"
                        transform="rotate(135 -17 -17)"
                        fill={color}
                        opacity="0.65"
                    />

                    <circle cx="0" cy="0" r="9" fill="#E5B94F" />

                    <circle cx="0" cy="0" r="4" fill="#FFF2B8" />
                </g>
            </svg>
        </motion.div>
    );
}