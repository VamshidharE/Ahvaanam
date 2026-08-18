"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    ImageIcon,
    Music2,
    MapPin,
    QrCode,
    Palette,
    Type,
    Sparkles,
    Clock3,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

const leftTools = [
    { icon: ImageIcon, text: "Add Photos" },
    { icon: Music2, text: "Add Music" },
    { icon: MapPin, text: "Add Map" },
    { icon: QrCode, text: "Add QR Code" },
];

const rightTools = [
    { icon: Type, text: "Font" },
    { icon: Palette, text: "Colors" },
    { icon: Music2, text: "Music" },
    { icon: Clock3, text: "Countdown" },
];

export default function BuilderShowcase() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
        });
    }, []);

    return (

        <section className="relative py-32 bg-gradient-to-b from-[#FFF9F1] to-white">

            <div className="mx-auto max-w-7xl px-6">

                <div className="text-center">

                    <p className="uppercase tracking-[0.35em] text-sm text-amber-500">
                        Customization Service
                    </p>

                    <h2 className="mt-4 text-6xl font-bold">
                        Every Invitation Is
                        <br />
                        <span className="text-amber-500">
                            Customized For You
                        </span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
                        Our team takes care of all the details. Share your event details, and we will deliver a bespoke invitation.
                    </p>

                </div>
                <div className="mt-24 grid items-center gap-10 lg:grid-cols-[220px_1fr_220px]">

                    {/* LEFT TOOLS */}

                    <div className="space-y-5">

                        {leftTools.map((tool, index) => {

                            const Icon = tool.icon;

                            return (

                                <motion.div
                                    key={tool.text}
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * .1 }}
                                    whileHover={{
                                        x: 8,
                                        scale: 1.03
                                    }}
                                    className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/80 px-5 py-5 shadow-xl backdrop-blur-xl cursor-pointer"
                                >

                                    <div className="rounded-xl bg-amber-100 p-3">

                                        <Icon className="text-amber-600" size={20} />

                                    </div>

                                    <div>

                                        <p className="font-semibold">

                                            {tool.text}

                                        </p>

                                        <p className="text-sm text-slate-500">

                                            Tailored Layout

                                        </p>

                                    </div>

                                </motion.div>

                            );

                        })}

                    </div>

                    {/* CENTER */}

                    <motion.div
                        initial={{ opacity: 0, scale: .95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: .5 }}
                        className="relative"
                    >

                        <div className="absolute -inset-16 rounded-full bg-amber-200/30 blur-[120px]" />

                        <div className="relative overflow-hidden rounded-[36px] border border-white/70 bg-white p-6 shadow-[0_40px_120px_rgba(0,0,0,.16)]">

                            <img
                                src="/images/editor-preview.png"
                                alt=""
                                className="w-full rounded-3xl"
                            />

                        </div>

                    </motion.div>

                    {/* RIGHT TOOLS */}

                    <div className="space-y-5">

                        {rightTools.map((tool, index) => {

                            const Icon = tool.icon;

                            return (

                                <motion.div
                                    key={tool.text}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * .1 }}
                                    whileHover={{
                                        x: -8,
                                        scale: 1.03
                                    }}
                                    className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/80 px-5 py-5 shadow-xl backdrop-blur-xl cursor-pointer"
                                >

                                    <div className="rounded-xl bg-amber-100 p-3">

                                        <Icon className="text-amber-600" size={20} />

                                    </div>

                                    <div>

                                        <p className="font-semibold">

                                            {tool.text}

                                        </p>

                                        <p className="text-sm text-slate-500">

                                            Professional Easing

                                        </p>

                                    </div>

                                </motion.div>

                            )

                        })}

                    </div>

                </div>
                {/* Bottom Features */}

                <div className="mt-16 flex flex-wrap items-center justify-center gap-4">

                    {[
                        "✓ Personalized Names",
                        "✓ Family Details",
                        "✓ Photos",
                        "✓ Background Music",
                        "✓ Google Maps",
                        "✓ QR Code",
                        "✓ Countdown",
                        "✓ RSVP",
                        "✓ Custom Theme",
                    ].map((item) => (

                        <motion.div
                            key={item}
                            whileHover={{
                                y: -4,
                                scale: 1.03,
                            }}
                            className="rounded-full border border-white/70 bg-white/80 px-5 py-3 shadow-lg backdrop-blur-xl font-medium text-slate-700"
                        >
                            {item}
                        </motion.div>

                    ))}

                </div>

                {/* CTA */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-16 flex justify-center"
                >

                    <div className="flex flex-col items-center gap-3">
                        <Link href="/contact" className="group inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 px-10 py-5 text-lg font-semibold text-white shadow-[0_20px_50px_rgba(234,179,8,.35)] transition-all duration-300 hover:-translate-y-1 text-center">
                            Request Custom Invitation
                            <Sparkles
                                size={18}
                                className="transition-transform duration-300 group-hover:rotate-12"
                            />
                        </Link>
                        <p className="text-sm text-slate-400 mt-2 font-medium">
                            No design skills required. Our team customizes everything for you.
                        </p>
                    </div>

                </motion.div>

            </div>

        </section>

    );
}