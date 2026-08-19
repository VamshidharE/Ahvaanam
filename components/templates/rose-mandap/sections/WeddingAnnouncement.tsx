"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

export default function WeddingAnnouncement() {
    const invitation = useRoseMandap();

    return (
        <section className="invitation-section story-section">
            <div className="invitation-inner story-inner">
                <SectionReveal>
                    <div className="section-heading">
                        <p className="section-kicker">A beautiful beginning</p>
                        <h2>{invitation.story.title || "Our Story"}</h2>
                        <span className="heading-ornament">✦</span>
                    </div>

                    {/* Stand/Pedestal displaying the couple's portrait */}
                    <div className="story-couple-container">
                        <img
                            src={invitation.story.couplePhoto || "/wedding/couple/couple.png"}
                            alt="Groom and Bride"
                            className="story-couple-photo"
                        />
                        <img
                            src="/wedding/Pedestal/pedestal.png"
                            alt="Pedestal Base"
                            className="story-pedestal-base"
                        />
                    </div>

                    <p className="story-copy">{invitation.story.text}</p>
                    <div className="story-signature">
                        <span>✦</span>
                        <p>
                            {invitation.couple.primarySide === "bride" 
                                ? `${invitation.couple.bride} & ${invitation.couple.groom}` 
                                : `${invitation.couple.groom} & ${invitation.couple.bride}`}
                        </p>
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}
