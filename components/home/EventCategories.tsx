"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart,
    Cake,
    Home,
    Baby,
    Sparkles,
    Landmark,
    Briefcase,
    Gift,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

const categories = [
    {
        id: "wedding",
        title: "Wedding",
        icon: Heart,
        count: "65+",
        description:
            "Traditional and modern wedding invitation collections.",
        image: "/images/categories/wedding.jpg",
    },
    {
        id: "engagement",
        title: "Engagement",
        icon: Sparkles,
        count: "22+",
        description:
            "Elegant engagement invitation templates.",
        image: "/images/categories/engagement.jpg",
    },
    {
        id: "birthday",
        title: "Birthday",
        icon: Cake,
        count: "40+",
        description:
            "Colorful birthday invitation templates.",
        image: "/images/categories/birthday.jpg",
    },
    {
        id: "housewarming",
        title: "Housewarming",
        icon: Home,
        count: "18+",
        description:
            "Beautiful Gruhapravesam invitations.",
        image: "/images/categories/housewarming.jpg",
    },
    {
        id: "baby",
        title: "Baby Shower",
        icon: Baby,
        count: "15+",
        description:
            "Cute baby shower invitations.",
        image: "/images/categories/baby.jpg",
    },
    {
        id: "halfsaree",
        title: "Half Saree",
        icon: Gift,
        count: "12+",
        description:
            "Traditional ceremony invitations.",
        image: "/images/categories/halfsaree.jpg",
    },
    {
        id: "retirement",
        title: "Retirement",
        icon: Landmark,
        count: "10+",
        description:
            "Memorable retirement celebration invitations.",
        image: "/images/categories/retirement.jpg",
    },
    {
        id: "corporate",
        title: "Corporate",
        icon: Briefcase,
        count: "20+",
        description:
            "Professional event invitations.",
        image: "/images/categories/corporate.jpg",
    },
];

export default function EventCategories() {
    const [selected, setSelected] = useState(categories[0]);

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FFF9F1] py-28">

            <div className="mx-auto max-w-7xl px-6">

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >

                    <p className="text-sm uppercase tracking-[0.35em] text-amber-500">
                        Choose Your Celebration
                    </p>

                    <h2 className="mt-4 text-6xl xl:text-7xl font-bold">
                        Every Event Deserves
                        <br />
                        A Beautiful Invitation
                    </h2>

                </motion.div>
                {/* Category Selector */}

                <div className="mt-16 flex items-center justify-center gap-4">

                    {categories.map((item) => {
                        const Icon = item.icon;

                        const active = selected.id === item.id;

                        return (
                            <Link href="/contact" key={item.id} passHref legacyBehavior>
                                <motion.a
                                    onMouseEnter={() => setSelected(item)}
                                    whileHover={{ y: -3 }}
                                    whileTap={{ scale: 0.96 }}
                                    className={`flex items-center gap-3 rounded-full border px-6 py-3 transition-all duration-300 cursor-pointer ${active
                                        ? "border-amber-400 bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-xl"
                                        : "border-white/60 bg-white/70 backdrop-blur-xl hover:bg-white text-gray-700"
                                        }`}
                                >
                                    <Icon size={18} />

                                    <span className="font-medium">
                                        {item.title}
                                    </span>
                                </motion.a>
                            </Link>
                        );
                    })}

                </div>

                {/* Preview */}

                <div className="mt-20 grid items-center gap-16 lg:grid-cols-2">

                    {/* Left */}

                    <AnimatePresence mode="wait">

                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, x: -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            transition={{ duration: 0.35 }}
                            className="space-y-6"
                        >

                            <span className="text-sm font-bold uppercase tracking-[3px] text-[#C49B27]">
                                {selected.title} Category
                            </span>

                            <h3 className="text-4xl md:text-5xl font-normal uppercase font-cinzel leading-tight">
                                Elegant Custom
                                <br />
                                {selected.title} Designs
                            </h3>

                            <p className="text-lg leading-8 text-slate-500">
                                <div className="flex flex-wrap gap-2.5 mb-5">
                                    {["Traditional", "Royal", "Minimal", "Luxury"].map((tag) => (
                                        <div
                                            key={tag}
                                            className="rounded-full border border-amber-200 bg-white/80 px-4 py-2 text-sm shadow-md"
                                        >
                                            {tag}
                                        </div>
                                    ))}

                                </div>
                                {selected.description}
                            </p>

                            <Link href="/contact" className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors">
                                View Collection
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>

                        </motion.div>

                    </AnimatePresence>
                    {/* Right */}

                    <AnimatePresence mode="wait">

                        <motion.div
                            key={selected.id}
                            initial={{ opacity: 0, scale: 0.9, x: 40 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: -40 }}
                            transition={{ duration: 0.45 }}
                            className="relative flex justify-center"
                        >

                            {/* Glow */}

                            <div className="absolute h-[520px] w-[520px] rounded-full bg-amber-200/30 blur-[120px]" />

                            {/* Floating Card */}

                            <motion.div
                                animate={{
                                    y: [0, -12, 0],
                                    rotate: [-1, 1, -1],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="relative z-20 overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-4 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,.16)]"
                            >

                                <img
                                    src={selected.image}
                                    alt={selected.title}
                                    className="w-[620px] rounded-[28px]"
                                />

                                <motion.div
                                    animate={{
                                        x: [-250, 450],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        repeatDelay: 3,
                                    }}
                                    className="absolute inset-y-0 w-24 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                />

                            </motion.div>

                        </motion.div>

                    </AnimatePresence>

                </div>

            </div>

        </section>

    );
}