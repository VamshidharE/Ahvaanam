"use client";

import React, { useState, useEffect } from "react";
import Tilt from "react-parallax-tilt";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Parallax } from "react-scroll-parallax";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

export default function Hero() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    return (
        <section className="relative isolate min-h-screen overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#FFF6DD,transparent_60%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(255,248,235,.5),white)]" />

            {/* Background Glow */}
            <div className="absolute inset-0 overflow-hidden opacity-90">

                <motion.div
                    animate={{
                        x: [0, 60, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                    }}
                    className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-amber-300/20 blur-[140px]"
                />

                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 40, 0],
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                    }}
                    className="absolute right-0 top-10 h-[450px] w-[450px] rounded-full bg-yellow-100/25"
                />

            </div>

            <div className="relative mx-auto flex min-h-screen max-w-[1500px] items-center justify-between px-12 lg:px-20">

                {/* Left */}

                <div className="w-1/2">

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: .8 }}
                        className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/50 bg-white/70 px-5 py-2 backdrop-blur-xl"
                    >
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        Luxury Digital Invitations
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: .2, duration: .8 }}
                        className="text-5xl md:text-6xl xl:text-7xl font-bold leading-tight text-gray-900"
                    >
                        Celebrate Every
                        <br />
                        Moment In Style
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: .35 }}
                        className="mt-10 max-w-xl text-xl leading-9 text-gray-600"
                    >
                        We design premium digital invitations for weddings, engagements,
                        birthdays and every celebration with elegant templates,
                        beautiful animations and effortless sharing. Personalized for your event.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: .45 }}
                        className="mt-12 flex flex-wrap items-center gap-5"
                    >
                        <Link href={user ? "/create" : "/login?redirect=/create"} className="group rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 px-8 py-4 font-semibold text-white shadow-[0_12px_35px_rgba(234,179,8,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_rgba(234,179,8,.45)] text-center">
                            Create Invitation
                        </Link>

                        <Link href="/contact" className="group flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-8 py-4 font-medium text-gray-700 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-amber-500 text-center">
                            Contact Us
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </motion.div>

                </div>
                {/* Right */}

                <div className="relative flex w-1/2 items-center justify-center">

                    {/* Glow */}

                    <motion.div
                        animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.35, 0.55, 0.35],
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                        }}
                        className="absolute h-[650px] w-[650px] rounded-full bg-yellow-300/40 blur-[220px]"
                    />

                    {/* Floating Invitation */}

                    <Parallax speed={-8}>
                        <Tilt
                            tiltMaxAngleX={8}
                            tiltMaxAngleY={8}
                            perspective={1200}
                            glareEnable={true}
                            glareMaxOpacity={0.18}
                            scale={1.02}
                        >
                            <motion.div
                                animate={{
                                    y: [0, -18, 0],
                                    rotate: [-1, 1, -1],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative z-20 -translate-y-10"
                            >
                                <div className="absolute -top-6 right-4 z-30 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-sm font-medium shadow-xl backdrop-blur-xl">
                                    ✨ Premium Template
                                </div>
                                <div className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/90 p-3 backdrop-blur-xl shadow-[0_50px_120px_rgba(0,0,0,.18)]">
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-yellow-100/20 pointer-events-none"></div>
                                    <img
                                        src="/images/hero-invitation.png"
                                        alt="Invitation"
                                        className="w-[680px] xl:w-[770px] rounded-[22px]"
                                    />
                                </div>

                                {/* Shine */}
                                <motion.div
                                    animate={{
                                        x: [-350, 420],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                        ease: "easeInOut",
                                    }}
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                    style={{
                                        transform: "skewX(-25deg)",
                                        width: "120px",
                                    }}
                                />
                            </motion.div>
                        </Tilt>
                    </Parallax>

                </div>

            </div>

            {/* Scroll Indicator */}

            <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{
                    repeat: Infinity,
                    duration: 1.8,
                }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
            >
                <div className="flex h-14 w-8 justify-center rounded-full border border-yellow-300">
                    <motion.div
                        animate={{
                            y: [6, 22, 6],
                        }}
                        transition={{
                            duration: 1.8,
                            repeat: Infinity,
                        }}
                        className="mt-2 h-3 w-3 rounded-full bg-yellow-500"
                    />
                </div>
            </motion.div>

        </section>
    );
}