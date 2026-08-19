"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

function getEventImage(title: string, customImage?: string) {
    if (customImage && typeof customImage === "string" && customImage.trim() !== "") {
        const cleanImg = customImage.trim();
        const lowerImg = cleanImg.toLowerCase();
        if (
            lowerImg.includes("akshint") ||
            lowerImg.includes("akshat") ||
            lowerImg.includes("akshit") ||
            lowerImg.includes("akshin") ||
            lowerImg.includes("talamb") ||
            lowerImg.includes("thalamb") ||
            lowerImg.includes("jeelakarra") ||
            lowerImg.includes("jilakara")
        ) {
            return "/wedding/events/akshintalu.png";
        }
        if (cleanImg.startsWith("/") || cleanImg.startsWith("http")) {
            return cleanImg;
        }
    }
    const lower = (title || "").toLowerCase().trim();
    if (
        lower.includes("akshint") ||
        lower.includes("akshat") ||
        lower.includes("akshit") ||
        lower.includes("akshin") ||
        lower.includes("talamb") ||
        lower.includes("thalamb") ||
        lower.includes("jeelakarra") ||
        lower.includes("jilakara")
    ) {
        return "/wedding/events/akshintalu.png";
    }
    if (lower.includes("haldi") || lower.includes("pasupu") || lower.includes("pellikoduku") || lower.includes("pellikuthuru")) return "/wedding/events/haldi.png";
    if (lower.includes("mehendi") || lower.includes("mehndi") || lower.includes("henna")) return "/wedding/events/mehendi.png";
    if (lower.includes("sangeet") || lower.includes("sangeeth") || lower.includes("music") || lower.includes("garba")) return "/wedding/events/sangeeth.png";
    if (lower.includes("reception") || lower.includes("dinner") || lower.includes("party")) return "/wedding/events/reception.png";
    if (lower.includes("wedding") || lower.includes("muhurtham") || lower.includes("vivah") || lower.includes("kalyanam") || lower.includes("pradhan") || lower.includes("ceremony")) return "/wedding/events/wedding.png";
    return "/wedding/events/wedding.png";
}

export default function Events() {
    const invitation = useRoseMandap();
    const activeEvents = (invitation.events || []).filter(event => (event as any).enabled !== false);
    if (activeEvents.length === 0) return null;

    const isSingle = activeEvents.length === 1;
    const kicker = isSingle ? "Save the date" : "Save the dates";
    const title = isSingle ? "Wedding Celebration" : "Wedding Celebrations";

    return (
        <section className={`invitation-section celebrations-section ${isSingle ? "single-celebration-section" : ""}`}>
            <div className="invitation-inner">
                <SectionReveal>
                    <div className="section-heading">
                        <p className="section-kicker">{kicker}</p>
                        <h2>{title}</h2>
                        <span className="heading-ornament">✦</span>
                    </div>
                    <div className={`celebration-grid ${isSingle ? "single-celebration-grid" : ""}`}>
                        {activeEvents.map((event, index) => (
                            <SectionReveal
                                key={`${event.title}-${index}`}
                                delay={index * 0.1}
                            >
                                <article className={`celebration-card ${isSingle ? "single-celebration-card" : ""}`}>
                                    <div className="celebration-icon-wrap">
                                        <img
                                            src={getEventImage(event.title, (event as any).image || (event as any).icon)}
                                            alt={event.title}
                                            className="celebration-icon-img"
                                        />
                                    </div>
                                    <h3>{event.title}</h3>
                                    <p className="celebration-date">{event.date}</p>
                                    <p className="celebration-time">{event.time}</p>
                                    <span className="celebration-rule" />
                                    <p className="celebration-venue">{event.venue}</p>
                                    {event.description && (
                                        <p className="celebration-description" style={{ marginTop: '8px', fontSize: '13px', color: '#634f31', maxWidth: '420px', textAlign: 'center' }}>
                                            {event.description}
                                        </p>
                                    )}
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
