"use client";

import SectionReveal from "../shared/SectionReveal";
import OrnamentalDivider from "../shared/OrnamentalDivider";
import DecorativeFlower from "../shared/DecorativeFlower";
import { useRoseMandap } from "../context";

export default function Couple() {
    const invitation = useRoseMandap();

    return (
        <section className="wedding-section">
            <div className="wedding-container wedding-section-inner">
                <SectionReveal>
                    <div className="relative mx-auto max-w-4xl text-center">
                        <DecorativeFlower
                            className="absolute -left-2 top-0 md:left-8"
                            size={38}
                        />

                        <DecorativeFlower
                            className="absolute -right-2 top-12 md:right-8"
                            size={32}
                            color="#E2A1A9"
                            delay={0.15}
                        />

                        <p className="section-eyebrow">The Couple</p>

                        <h2 className="section-title">
                            Two Hearts, One Journey
                        </h2>

                        <OrnamentalDivider symbol="✦" />

                        <div className="mt-12 grid grid-cols-1 items-center gap-8 md:grid-cols-[1fr_auto_1fr]">
                            <div className="text-center">
                                <p className="mb-2 font-serif text-sm uppercase tracking-[0.25em] text-[#8b6a32]">
                                    The Groom
                                </p>

                                <h3 className="wedding-serif text-5xl font-medium text-[#76521b] md:text-6xl">
                                    {invitation.couple.groom}
                                </h3>

                                <div className="mx-auto mt-5 h-px w-16 bg-[#b8892d]/50" />
                            </div>

                            <div className="flex justify-center">
                                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#b8892d]/35 bg-[#fffaf0] shadow-[0_10px_30px_rgba(92,68,37,0.08)]">
                                    <span className="font-serif text-3xl italic text-[#b8892d]">
                                        &amp;
                                    </span>
                                </div>
                            </div>

                            <div className="text-center">
                                <p className="mb-2 font-serif text-sm uppercase tracking-[0.25em] text-[#8b6a32]">
                                    The Bride
                                </p>

                                <h3 className="wedding-serif text-5xl font-medium text-[#76521b] md:text-6xl">
                                    {invitation.couple.bride}
                                </h3>

                                <div className="mx-auto mt-5 h-px w-16 bg-[#b8892d]/50" />
                            </div>
                        </div>

                        <p className="mx-auto mt-12 max-w-2xl font-serif text-lg leading-relaxed text-[#6a5637]">
                            Together, they begin a beautiful new chapter surrounded by
                            family, friends, love and blessings.
                        </p>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}