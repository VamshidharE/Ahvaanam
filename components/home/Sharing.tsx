"use client";

import { motion } from "framer-motion";
import {
    Smartphone,
    QrCode,
    Share2,
    Download,
    Globe,
    MessageCircle,
} from "lucide-react";
import Link from "next/link";

const shareItems = [
    {
        icon: MessageCircle,
        title: "WhatsApp",
        desc: "Share instantly",
        href: "https://api.whatsapp.com/send?text=Check%20out%20our%20premium%20invitation%20demo%20at%20http%3A%2F%2Flocalhost%3A3000%2Fdemo",
        isExternal: true
    },
    {
        icon: Globe,
        title: "Website",
        desc: "Personal invitation URL",
        href: "/demo",
        isExternal: false
    },
    {
        icon: QrCode,
        title: "QR Code",
        desc: "Quick access",
        href: "/demo",
        isExternal: false
    },
    {
        icon: Download,
        title: "Download",
        desc: "Image & PDF",
        href: "/sample-invitation.pdf",
        isExternal: true,
        download: true
    },
];

export default function Sharing() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-[#FFF9F2] py-32">

            <div className="mx-auto max-w-7xl px-6">

                <div className="text-center">

                    <p className="uppercase tracking-[0.35em] text-sm text-amber-500">
                        Share Anywhere
                    </p>

                    <h2 className="mt-4 text-6xl font-bold">
                        Send Your Invitation
                        <br />
                        In Seconds
                    </h2>

                </div>
                <div className="mt-24 grid items-center gap-20 lg:grid-cols-2">

                    {/* Left */}

                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >

                        {shareItems.map((item, index) => {

                            const Icon = item.icon;

                            const cardContent = (
                                <motion.div
                                    whileHover={{
                                        x: 8,
                                        scale: 1.02,
                                    }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-center gap-5 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl backdrop-blur-xl cursor-pointer w-full text-left"
                                >
                                    <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 p-4 text-white">
                                        <Icon size={26} />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold">
                                            {item.title}
                                        </h3>
                                        <p className="text-slate-500">
                                            {item.desc}
                                        </p>
                                    </div>
                                </motion.div>
                            );

                            return item.isExternal ? (
                                <a key={item.title} href={item.href} target="_blank" rel="noopener noreferrer" download={item.download} className="block w-full">
                                    {cardContent}
                                </a>
                            ) : (
                                <Link key={item.title} href={item.href} className="block w-full">
                                    {cardContent}
                                </Link>
                            );

                        })}

                    </motion.div>

                    {/* Right */}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative flex justify-center"
                    >

                        <div className="absolute h-[500px] w-[500px] rounded-full bg-amber-200/30 blur-[120px]" />

                        <motion.div
                            animate={{
                                y: [0, -12, 0],
                            }}
                            transition={{
                                duration: 5,
                                repeat: Infinity,
                            }}
                            className="relative z-10"
                        >

                            <img
                                src="/images/phone-preview.png"
                                alt="Phone Preview"
                                className="w-[320px] drop-shadow-[0_40px_80px_rgba(0,0,0,.22)]"
                            />

                        </motion.div>

                    </motion.div>

                </div>
                {/* Bottom CTA */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-20 text-center"
                >
                    <p className="mx-auto max-w-2xl text-lg leading-8 text-slate-500">
                        Every invitation includes instant sharing through WhatsApp, QR Code, personal link and downloadable PDF.
                    </p>
                </motion.div>

            </div>

        </section>

    );
}