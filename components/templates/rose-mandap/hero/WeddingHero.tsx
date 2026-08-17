"use client";

import { motion, useReducedMotion } from "framer-motion";
import WeddingScene from "./WeddingScene";
import FallingPetals from "./FallingPetals";
import FloatingLights from "./FloatingLights";
import HeroText from "./HeroText";

interface WeddingHeroProps {
    className?: string;
}

export default function WeddingHero({
    className = "",
}: WeddingHeroProps) {
    const shouldReduceMotion = useReducedMotion();

    return (
        <section
            id="home"
            className={`wedding-hero ${className}`}
            aria-label="Wedding invitation"
        >
            {/* Background atmosphere */}
            <div className="hero-background">
                <div className="hero-light" />
            </div>

            {/* Main illustrated wedding scene */}
            <WeddingScene />

            {/* Central invitation typography */}
            <HeroText />

            {/* Falling flowers across the complete scene */}
            <FallingPetals />

            {/* Warm diya and ambient light effects */}
            <FloatingLights />

            {/* Very subtle entrance veil */}
            {!shouldReduceMotion && (
                <motion.div
                    className="absolute inset-0 z-[40] pointer-events-none bg-[#fbf6ec]"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{
                        duration: 1.6,
                        ease: [0.76, 0, 0.24, 1],
                    }}
                />
            )}
        </section>
    );
}