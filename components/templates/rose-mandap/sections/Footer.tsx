"use client";

import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

export default function Footer() {
    const invitation = useRoseMandap();

    return (
        <footer className="wedding-footer-section" style={{ background: "transparent", padding: "clamp(32px, 5vw, 48px) 16px clamp(40px, 6vw, 60px)" }}>
            <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
                <SectionReveal>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "center" }}>
                        {/* Decorative Gold Rule */}
                        <div 
                            style={{ 
                                width: "60px", 
                                height: "1px", 
                                background: "linear-gradient(90deg, transparent, #c88728, transparent)", 
                                margin: "0 auto 4px" 
                            }} 
                        />

                        {/* 1. Quote */}
                        <p 
                            style={{ 
                                fontFamily: "Georgia, 'Times New Roman', serif", 
                                fontStyle: "italic", 
                                fontSize: "clamp(12.5px, 2.5vw, 14.5px)", 
                                color: "#7b521b", 
                                opacity: 0.9, 
                                margin: 0,
                                lineHeight: 1.5,
                                padding: "0 8px"
                            }}
                        >
                            &ldquo;{invitation.footer.quote}&rdquo;
                        </p>
                        
                        {/* 2. Designed by Ahvaanam */}
                        <div style={{ marginTop: "4px", display: "flex", flexDirection: "column", gap: "3px", alignItems: "center" }}>
                            <p 
                                style={{ 
                                    fontSize: "clamp(10.5px, 2.2vw, 12px)", 
                                    fontWeight: 700, 
                                    letterSpacing: "0.16em", 
                                    textTransform: "uppercase", 
                                    color: "#6b4515", 
                                    margin: 0 
                                }}
                            >
                                Designed by <span style={{ color: "#b57b2b" }}>{invitation.footer.designer}</span>
                            </p>
                            
                            {/* 3. Service description */}
                            <p 
                                style={{ 
                                    fontFamily: "Georgia, 'Times New Roman', serif", 
                                    fontSize: "clamp(10.5px, 2vw, 12px)", 
                                    color: "#8c6a38", 
                                    opacity: 0.85, 
                                    margin: 0,
                                    lineHeight: 1.4
                                }}
                            >
                                {invitation.footer.service}
                            </p>
                        </div>
                        
                        {/* 4. Location & Contact info (Responsive & Wrap-safe) */}
                        <div 
                            style={{ 
                                display: "flex", 
                                flexWrap: "wrap",
                                gap: "6px 12px", 
                                justifySelf: "center",
                                justifyContent: "center", 
                                alignItems: "center", 
                                marginTop: "6px", 
                                fontSize: "clamp(10px, 2.2vw, 11px)", 
                                fontWeight: 500, 
                                color: "#806335", 
                                opacity: 0.85,
                                lineHeight: 1.5,
                                padding: "0 12px"
                            }}
                        >
                            <span style={{ letterSpacing: "0.03em" }}>
                                📍 {invitation.footer.location}
                            </span>
                            <span style={{ opacity: 0.4, display: "inline-block" }}>•</span>
                            <a 
                                href={`tel:${invitation.footer.contact}`} 
                                style={{ 
                                    letterSpacing: "0.03em", 
                                    color: "#99621b", 
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "4px"
                                }}
                            >
                                📞 {invitation.footer.contact}
                            </a>
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </footer>
    );
}