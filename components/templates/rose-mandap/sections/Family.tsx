"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

export default function Family() {
    const invitation = useRoseMandap();
    const { title, groomFamily, brideFamily, groomParents, brideParents } = invitation.family;

    return (
        <section className="invitation-section family-section">
            <div className="invitation-inner">
                <SectionReveal>
                    <div className="section-heading">
                        <p className="section-kicker">With blessings and love</p>
                        <h2>{title || "Our Families"}</h2>
                        <span className="heading-ornament">✦</span>
                    </div>
                    <div className="family-card">
                        {invitation.couple.primarySide === "bride" ? (
                            <>
                                {/* Bride's Family Card (First) */}
                                <article className="family-side">
                                    <div className="family-portrait-wrap">
                                        <img 
                                            src={invitation.family.bridePortrait || "/wedding/family/bride.png"} 
                                            alt="Bride's Family" 
                                            className="family-portrait-img" 
                                        />
                                    </div>
                                    <h3>Bride&apos;s Family</h3>
                                    {brideFamily && brideFamily.length > 0 ? (
                                        <div className="family-members-list" style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
                                            {brideFamily.map((member, idx) => (
                                                <p key={idx} style={{ margin: 0, fontSize: "clamp(13px, 2.4vw, 15px)", color: "#5a3a14", lineHeight: 1.4 }}>
                                                    {member.relation ? (
                                                        <span style={{ opacity: 0.8, fontSize: "0.92em", fontStyle: "italic", marginRight: "5px" }}>
                                                            {member.relation}:
                                                        </span>
                                                    ) : null}
                                                    <span style={{ fontWeight: 600 }}>{member.name}</span>
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{brideParents}</p>
                                    )}
                                </article>
                                <span className="family-divider">✦</span>
                                {/* Groom's Family Card (Second) */}
                                <article className="family-side">
                                    <div className="family-portrait-wrap">
                                        <img 
                                            src={invitation.family.groomPortrait || "/wedding/family/groom.png"} 
                                            alt="Groom's Family" 
                                            className="family-portrait-img" 
                                        />
                                    </div>
                                    <h3>Groom&apos;s Family</h3>
                                    {groomFamily && groomFamily.length > 0 ? (
                                        <div className="family-members-list" style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
                                            {groomFamily.map((member, idx) => (
                                                <p key={idx} style={{ margin: 0, fontSize: "clamp(13px, 2.4vw, 15px)", color: "#5a3a14", lineHeight: 1.4 }}>
                                                    {member.relation ? (
                                                        <span style={{ opacity: 0.8, fontSize: "0.92em", fontStyle: "italic", marginRight: "5px" }}>
                                                            {member.relation}:
                                                        </span>
                                                    ) : null}
                                                    <span style={{ fontWeight: 600 }}>{member.name}</span>
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{groomParents}</p>
                                    )}
                                </article>
                            </>
                        ) : (
                            <>
                                {/* Groom's Family Card (First) */}
                                <article className="family-side">
                                    <div className="family-portrait-wrap">
                                        <img 
                                            src={invitation.family.groomPortrait || "/wedding/family/groom.png"} 
                                            alt="Groom's Family" 
                                            className="family-portrait-img" 
                                        />
                                    </div>
                                    <h3>Groom&apos;s Family</h3>
                                    {groomFamily && groomFamily.length > 0 ? (
                                        <div className="family-members-list" style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
                                            {groomFamily.map((member, idx) => (
                                                <p key={idx} style={{ margin: 0, fontSize: "clamp(13px, 2.4vw, 15px)", color: "#5a3a14", lineHeight: 1.4 }}>
                                                    {member.relation ? (
                                                        <span style={{ opacity: 0.8, fontSize: "0.92em", fontStyle: "italic", marginRight: "5px" }}>
                                                            {member.relation}:
                                                        </span>
                                                    ) : null}
                                                    <span style={{ fontWeight: 600 }}>{member.name}</span>
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{groomParents}</p>
                                    )}
                                </article>
                                <span className="family-divider">✦</span>
                                {/* Bride's Family Card (Second) */}
                                <article className="family-side">
                                    <div className="family-portrait-wrap">
                                        <img 
                                            src={invitation.family.bridePortrait || "/wedding/family/bride.png"} 
                                            alt="Bride's Family" 
                                            className="family-portrait-img" 
                                        />
                                    </div>
                                    <h3>Bride&apos;s Family</h3>
                                    {brideFamily && brideFamily.length > 0 ? (
                                        <div className="family-members-list" style={{ display: "flex", flexDirection: "column", gap: "5px", marginTop: "4px" }}>
                                            {brideFamily.map((member, idx) => (
                                                <p key={idx} style={{ margin: 0, fontSize: "clamp(13px, 2.4vw, 15px)", color: "#5a3a14", lineHeight: 1.4 }}>
                                                    {member.relation ? (
                                                        <span style={{ opacity: 0.8, fontSize: "0.92em", fontStyle: "italic", marginRight: "5px" }}>
                                                            {member.relation}:
                                                        </span>
                                                    ) : null}
                                                    <span style={{ fontWeight: 600 }}>{member.name}</span>
                                                </p>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>{brideParents}</p>
                                    )}
                                </article>
                            </>
                        )}
                    </div>
                    <p className="family-blessing">
                        With the love and blessings of our families, we invite you to
                        share in this joyous occasion.
                    </p>
                </SectionReveal>
            </div>
        </section>
    );
}
