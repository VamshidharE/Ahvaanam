"use client";

import SectionReveal from "../shared/SectionReveal";
import OrnamentalDivider from "../shared/OrnamentalDivider";
import DecorativeFlower from "../shared/DecorativeFlower";
import { useRoseMandap } from "../context";

export default function WeddingStory() {
    const invitation = useRoseMandap();

    return (
        <section className="wedding-section">
            <div className="wedding-container wedding-section-inner">
                <SectionReveal>
                    <div className="relative mx-auto max-w-4xl text-center">
                        <DecorativeFlower
                            className="absolute left-0 top-0 md:left-8"
                            size={36}
                            color="#D88997"
                        />

                        <DecorativeFlower
                            className="absolute right-0 top-16 md:right-8"
                            size={30}
                            color="#E2A1A9"
                            delay={0.2}
                        />

                        <p className="section-eyebrow">A Beautiful Journey</p>

                        <h2 className="section-title">
                            {invitation.story.title}
                        </h2>

                        <OrnamentalDivider symbol="✦" />

                        {/* Stand/Pedestal displaying the couple's portrait */}
                        <div className="story-couple-container">
                            <img
                                src={invitation.story.couplePhoto}
                                alt="Groom and Bride"
                                className="story-couple-photo"
                            />
                            <img
                                src="/wedding/Pedestal/pedestal.png"
                                alt="Pedestal Base"
                                className="story-pedestal-base"
                            />
                        </div>

                        <div className="mx-auto mt-12 max-w-2xl rounded-[32px] border border-[#b8892d]/20 bg-[#fffaf1]/70 px-7 py-10 shadow-[0_20px_60px_rgba(92,68,37,0.07)] md:px-14 md:py-14">
                            <p className="wedding-serif text-xl leading-[1.8] text-[#6a5637] md:text-2xl">
                                {invitation.story.text}
                            </p>

                            <div className="mt-8 flex items-center justify-center gap-3">
                                <span className="h-px w-10 bg-[#b8892d]/45" />
                                <span className="text-[#b8892d]">✦</span>
                                <span className="h-px w-10 bg-[#b8892d]/45" />
                            </div>

                            <p className="mt-6 wedding-serif text-lg italic text-[#806335]">
                                {invitation.couple.groom} &amp; {invitation.couple.bride}
                            </p>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}