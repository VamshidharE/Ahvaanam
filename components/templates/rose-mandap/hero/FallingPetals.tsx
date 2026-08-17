"use client";

import { motion, useReducedMotion } from "framer-motion";

const petals = Array.from({ length: 28 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    size: 7 + ((index * 13) % 8),
    duration: 12 + ((index * 17) % 10),
    delay: -((index * 3.7) % 18),
    drift: -55 + ((index * 29) % 110),
    rotation: -180 + ((index * 47) % 360),
}));

export default function FallingPetals() {
    const reducedMotion = useReducedMotion();

    return (
        <div className="page-petals">
            {petals.map((petal) => (
                <motion.span
                    key={petal.id}
                    className="page-petal"
                    style={{
                        left: petal.left,
                        width: petal.size,
                        height: petal.size * 0.72,
                    }}
                    initial={{
                        y: "-5vh",
                        x: 0,
                        rotate: 0,
                        opacity: 0,
                    }}
                    animate={
                        reducedMotion
                            ? {
                                opacity: 0,
                            }
                            : {
                                y: "110vh",
                                x: [
                                    0,
                                    petal.drift,
                                    petal.drift * -0.55,
                                    petal.drift * 0.75,
                                    0,
                                ],
                                rotate: [
                                    0,
                                    petal.rotation,
                                    petal.rotation * -0.6,
                                    petal.rotation * 1.25,
                                ],
                                opacity: [0, 0.7, 0.8, 0.55, 0],
                            }
                    }
                    transition={{
                        duration: petal.duration,
                        delay: petal.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
}