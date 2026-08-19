"use client";

import { useState } from "react";
import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";
import { Star, Send, Heart, CheckCircle2, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";

export default function Footer() {
    const invitation = useRoseMandap();
    const params = useParams();
    const slug = typeof params?.id === "string" ? params.id : "";

    const [rating, setRating] = useState<number>(5);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [feedback, setFeedback] = useState("");
    const [guestName, setGuestName] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showInput, setShowInput] = useState(false);

    const handleSubmitFeedback = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!slug) {
            setSubmitted(true);
            return;
        }

        setSubmitting(true);
        try {
            await fetch(`/api/invitation/${slug}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating: rating || 5,
                    feedback: feedback.trim(),
                    guestName: guestName.trim() || "Guest"
                }),
            });
            setSubmitted(true);
        } catch {
            setSubmitted(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <footer className="wedding-footer-section" style={{ background: "transparent", padding: "clamp(32px, 5vw, 48px) 16px clamp(40px, 6vw, 60px)" }}>
            <div style={{ maxWidth: "620px", margin: "0 auto", textAlign: "center" }}>
                <SectionReveal>
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
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
                                marginTop: "2px", 
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

                        {/* --- RATE THIS INVITATION (AT BOTTOM WITH THEME STYLING) --- */}
                        <div 
                            style={{
                                width: "100%",
                                maxWidth: "330px",
                                background: "rgba(255, 250, 240, 0.92)",
                                backdropFilter: "blur(8px)",
                                border: "1px solid rgba(184, 137, 45, 0.35)",
                                borderRadius: "14px",
                                padding: "8px 14px",
                                marginTop: "12px",
                                boxShadow: "0 6px 18px -4px rgba(120, 80, 20, 0.08)"
                            }}
                        >
                            {!submitted ? (
                                <form onSubmit={handleSubmitFeedback} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    {/* Line 1: Title & 5 Stars */}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                                        <span style={{ 
                                            fontFamily: "Georgia, 'Times New Roman', serif",
                                            fontStyle: "italic",
                                            fontSize: "11px", 
                                            fontWeight: 600, 
                                            letterSpacing: "0.04em", 
                                            color: "#76521b" 
                                        }}>
                                            Rate this Invitation
                                        </span>
                                        <div style={{ display: "flex", gap: "3px" }}>
                                            {[1, 2, 3, 4, 5].map((star) => {
                                                const isFilled = (hoverRating !== null ? hoverRating : rating) >= star;
                                                return (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => {
                                                            setRating(star);
                                                            setShowInput(true);
                                                        }}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(null)}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            cursor: "pointer",
                                                            padding: "1px",
                                                            transform: isFilled ? "scale(1.15)" : "scale(1)",
                                                            transition: "transform 0.15s ease",
                                                            filter: isFilled ? "drop-shadow(0 0 3px rgba(184, 137, 45, 0.5))" : "none"
                                                        }}
                                                        title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                                    >
                                                        <Star
                                                            size={15}
                                                            color="#b8892d"
                                                            fill={isFilled ? "#b8892d" : "transparent"}
                                                        />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Line 2: Inline Wish input & Send */}
                                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                        <input
                                            type="text"
                                            placeholder="Leave a wish or feedback (optional)..."
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            style={{
                                                flex: 1,
                                                padding: "5px 9px",
                                                fontSize: "10.5px",
                                                borderRadius: "8px",
                                                border: "1px solid rgba(184, 137, 45, 0.3)",
                                                background: "#fffdf9",
                                                color: "#5c4015",
                                                outline: "none",
                                                fontFamily: "inherit"
                                            }}
                                        />
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "4px",
                                                background: "linear-gradient(135deg, #b8892d, #8f651c)",
                                                color: "white",
                                                border: "none",
                                                borderRadius: "8px",
                                                padding: "5px 10px",
                                                fontSize: "10px",
                                                fontWeight: 700,
                                                letterSpacing: "0.04em",
                                                textTransform: "uppercase",
                                                cursor: "pointer",
                                                whiteSpace: "nowrap",
                                                boxShadow: "0 2px 6px rgba(184, 137, 45, 0.25)"
                                            }}
                                        >
                                            <Send size={10} /> {submitting ? "..." : "Send"}
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "3px 0" }}>
                                    <CheckCircle2 size={14} color="#16a34a" />
                                    <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "#16a34a", fontFamily: "Georgia, serif" }}>
                                        Thank you for your rating &amp; blessings!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </SectionReveal>
            </div>
        </footer>
    );
}