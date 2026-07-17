"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const templates = [
    {
        title: "Royal Temple Layout",
        slug: "royal-temple",
        type: "Traditional",
        image: "/images/themes/royal-temple.jpg",
    },
    {
        title: "Floral Garden Layout",
        slug: "floral-garden",
        type: "Elegant",
        image: "/images/themes/floral-garden.jpg",
    },
    {
        title: "South Indian Traditional",
        slug: "south-indian",
        type: "Traditional",
        image: "/images/themes/south-indian.jpg",
    },
    {
        title: "Palace Luxury Layout",
        slug: "palace-luxury",
        type: "Royal",
        image: "/images/themes/palace-luxury.jpg",
    },
    {
        title: "Lotus Serenity Layout",
        slug: "lotus-serenity",
        type: "Spiritual",
        image: "/images/themes/lotus-serenity.jpg",
    },
];

export default function TemplateGallery() {

    const [active, setActive] = useState(2);

    return (

        <section className="relative overflow-hidden bg-white py-32">

            <div className="mx-auto max-w-7xl px-6">

                <div className="text-center">

                    <p className="text-sm uppercase tracking-[0.35em] text-amber-500">
                        Premium Collection
                    </p>

                    <h2 className="mt-4 text-6xl font-bold">
                        Choose A Template
                        <br />
                        You'll Love
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-500">
                        Professionally designed invitation templates for every celebration.
                    </p>

                </div>
                <div className="mt-24 flex items-center justify-center gap-10">

                    {templates.map((template, index) => {

                        const activeCard = active === index;

                        return (

                            <Link href={`/templates/${template.slug}`} key={index} passHref legacyBehavior>
                                <motion.a
                                    onMouseEnter={() => setActive(index)}
                                    whileHover={{
                                        y: -12,
                                        scale: 1.05,
                                    }}
                                    animate={{
                                        scale: activeCard ? 1.1 : 0.88,
                                        opacity: activeCard ? 1 : 0.55,
                                        rotate: activeCard ? 0 : index < active ? -8 : 8,
                                    }}
                                    transition={{
                                        duration: .45,
                                    }}
                                    className="relative cursor-pointer block"
                                >

                                {/* Glow */}

                                {activeCard && (

                                    <div className="absolute -inset-10 rounded-full bg-amber-200/30 blur-[90px]" />

                                )}

                                {/* Card */}

                                <div className="relative overflow-hidden rounded-[34px] border border-white/70 bg-white p-4 shadow-[0_40px_100px_rgba(0,0,0,.15)]">

                                    <img
                                        src={template.image}
                                        className="w-[280px] rounded-[24px]"
                                        alt=""
                                    />

                                    <div className="mt-5">

                                        <p className="text-sm uppercase tracking-widest text-amber-500">

                                            {template.type}

                                        </p>

                                        <h3 className="mt-2 text-2xl font-bold">

                                            {template.title}

                                        </h3>

                                    </div>

                                </div>

                                </motion.a>
                            </Link>

                        );

                    })}

                </div>
                {/* Bottom Info */}

                <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mt-20 flex flex-col items-center"
                >

                    <div className="inline-flex rounded-full bg-amber-100 px-5 py-2 text-sm font-semibold text-amber-700">
                        {templates[active].type}
                    </div>

                    <h3 className="mt-6 text-4xl font-bold text-slate-900">
                        {templates[active].title}
                    </h3>

                    <p className="mt-5 max-w-2xl text-center text-lg leading-8 text-slate-500">
                        Beautiful handcrafted invitation template with premium typography,
                        elegant floral decorations and luxury styling. Fully customizable in
                        just a few clicks.
                    </p>

                    <a href="#footer" className="group mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-500 transition-colors">
                        Request This Design
                        <ArrowRight
                            size={16}
                            className="transition group-hover:translate-x-1"
                        />
                    </a>

                </motion.div>

            </div>

        </section>

    );
}