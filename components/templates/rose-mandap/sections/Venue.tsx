"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";
import { emitAnalyticsInteraction } from "@/lib/analytics/useInvitationTracker";

export default function Venue() {
    const invitation = useRoseMandap();
    const weddingMapsUrl = invitation.wedding.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${invitation.wedding.venue}, ${invitation.wedding.city}`)}`;

    const reception = invitation.reception;
    const hasReception = Boolean(reception && reception.enabled);
    const receptionMapsUrl = reception?.mapsLink || (reception ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${reception.venue}, ${reception.city}`)}` : "");

    return (
        <section className="invitation-section detail-panel venue-panel">
            <div className="invitation-inner">
                <SectionReveal>
                    <div className={`venues-grid ${hasReception ? "dual-venues" : "single-venue"}`}>
                        {/* --- 1. WEDDING VENUE --- */}
                        <div className="venue-block">
                            <div className="detail-heading">
                                <h2>The Wedding Venue</h2>
                                <span>✦</span>
                            </div>
                            <div className="venue-card">
                                <div className="venue-copy">
                                    <span className="venue-pin">⌖</span>
                                    <h3>{invitation.wedding.venue}</h3>
                                    <p>{invitation.wedding.city}</p>
                                    <span className="venue-rule" />
                                    <p className="venue-date">{invitation.wedding.date}</p>
                                    <p>Muhurtham · {invitation.wedding.time}</p>
                                    <a
                                        href={weddingMapsUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="venue-button"
                                        onClick={() => emitAnalyticsInteraction("map_click", "venue", { venue: invitation.wedding.venue })}
                                    >
                                        View Location
                                    </a>
                                </div>
                                <div className="venue-illustration" style={{ background: "none", padding: 0 }}>
                                    <iframe
                                        src={invitation.wedding.mapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(`${invitation.wedding.venue}, ${invitation.wedding.city}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, minHeight: "235px", display: "block" }}
                                        allowFullScreen={false}
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* --- 2. RECEPTION VENUE --- */}
                        {reception && reception.enabled && (
                            <div className="venue-block">
                                <div className="detail-heading">
                                    <h2>{reception.title || "Reception Venue"}</h2>
                                    <span>✦</span>
                                </div>
                                <div className="venue-card">
                                    <div className="venue-copy">
                                        <span className="venue-pin">⌖</span>
                                        <h3>{reception.venue}</h3>
                                        <p>{reception.city}</p>
                                        <span className="venue-rule" />
                                        <p className="venue-date">{reception.date}</p>
                                        <p>Reception · {reception.time}</p>
                                        <a
                                            href={receptionMapsUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="venue-button"
                                            onClick={() => emitAnalyticsInteraction("map_click", "venue", { venue: reception.venue })}
                                        >
                                            View Location
                                        </a>
                                    </div>
                                    <div className="venue-illustration" style={{ background: "none", padding: 0 }}>
                                        <iframe
                                            src={reception.mapsEmbedUrl || `https://maps.google.com/maps?q=${encodeURIComponent(`${reception.venue}, ${reception.city}`)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0, minHeight: "235px", display: "block" }}
                                            allowFullScreen={false}
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}
