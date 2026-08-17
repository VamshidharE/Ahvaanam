"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

function getEventImage(title: string) {
    const lower = (title || "").toLowerCase();
    if (lower.includes("haldi")) return "/wedding/events/haldi.png";
    if (lower.includes("mehendi") || lower.includes("mehndi")) return "/wedding/events/mehendi.png";
    if (lower.includes("sangeet") || lower.includes("sangeeth")) return "/wedding/events/sangeeth.png";
    if (lower.includes("wedding") || lower.includes("muhurtham") || lower.includes("vivah")) return "/wedding/events/wedding.png";
    if (lower.includes("reception")) return "/wedding/events/reception.png";
    return "/wedding/events/wedding.png";
}

export default function Events() {
    const invitation = useRoseMandap();
    const activeEvents = (invitation.events || []).filter(event => (event as any).enabled !== false);
    if (activeEvents.length === 0) return null;

    return (
        <section className="invitation-section celebrations-section">
            <div className="invitation-inner">
                <SectionReveal>
                    <div className="section-heading">
                        <p className="section-kicker">Save the dates</p>
                        <h2>Wedding Celebrations</h2>
                        <span className="heading-ornament">✦</span>
                    </div>
                    <div className="celebration-grid">
                            {activeEvents.map((event, index) => (
                                <SectionReveal
                                    key={`${event.title}-${index}`}
                                    delay={index * 0.1}
                                >
                                    <article className="celebration-card">
                                        <div className="celebration-icon-wrap">
                                            <img
                                                src={getEventImage(event.title)}
                                                alt={event.title}
                                                className="celebration-icon-img"
                                            />
                                        </div>
                                        <h3>{event.title}</h3>
                                        <p className="celebration-date">{event.date}</p>
                                        <p className="celebration-time">{event.time}</p>
                                        <span className="celebration-rule" />
                                        <p className="celebration-venue">{event.venue}</p>
                                        <span className="card-ornament">✦</span>
                                    </article>
                                </SectionReveal>
                            ))}
                    </div>
                </SectionReveal>
            </div>
        </section>
    );
}
