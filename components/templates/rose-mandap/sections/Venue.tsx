"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

export default function Venue() {
    const invitation = useRoseMandap();
    const mapsUrl = invitation.wedding.mapsLink || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${invitation.wedding.venue}, ${invitation.wedding.city}`)}`;

    return (
        <section className="invitation-section detail-panel venue-panel">
            <div className="invitation-inner">
                <SectionReveal>
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
                                    href={mapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="venue-button"
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
                </SectionReveal>
            </div>
        </section>
    );
}
