"use client";

import { useState } from "react";
import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";
import { Star, Send, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Footer() {
    const invitation = useRoseMandap();
    const params = useParams();
    const slug = typeof params?.id === "string" ? params.id : "";

    const [rating, setRating] = useState<number | null>(null);
    const [hoverRating, setHoverRating] = useState<number | null>(null);
    const [note, setNote] = useState("");
    const [noteSubmitting, setNoteSubmitting] = useState(false);
    const [noteSent, setNoteSent] = useState(false);
    const [showNoteInput, setShowNoteInput] = useState(false);

    // Instant rating submission on star click
    const handleStarClick = async (star: number) => {
        setRating(star);
        setShowNoteInput(true);

        if (!slug) return;

        try {
            await fetch(`/api/invitation/${slug}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating: star,
                    feedback: "",
                    guestName: "Guest"
                }),
            });
        } catch {}
    };

    // Optional follow-up quick note submission
    const handleNoteSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!note.trim() || !slug) {
            setNoteSent(true);
            return;
        }

        setNoteSubmitting(true);
        try {
            await fetch(`/api/invitation/${slug}/feedback`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    rating: rating || 5,
                    feedback: note.trim(),
                    guestName: "Guest"
                }),
            });
            setNoteSent(true);
        } catch {
            setNoteSent(true);
        } finally {
            setNoteSubmitting(false);
        }
    };

    return (
        <footer className="wedding-footer-section" style={{ background: "transparent", padding: "clamp(14px, 2vw, 20px) 16px clamp(18px, 2.5vw, 24px)" }}>
            <div style={{ maxWidth: "580px", margin: "0 auto", textAlign: "center" }}>
                <SectionReveal>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
                        
                        {/* Decorative Gold Line */}
                        <div 
                            style={{ 
                                width: "40px", 
                                height: "1px", 
                                background: "linear-gradient(90deg, transparent, #c88728, transparent)", 
                                margin: "0 auto" 
                            }} 
                        />

                        {/* 1. Quote */}
                        <p 
                            style={{ 
                                fontFamily: "Georgia, 'Times New Roman', serif", 
                                fontStyle: "italic", 
                                fontSize: "clamp(11.5px, 2vw, 13px)", 
                                color: "#7b521b", 
                                opacity: 0.9, 
                                margin: 0,
                                lineHeight: 1.35,
                                padding: "0 6px"
                            }}
                        >
                            &ldquo;{invitation.footer.quote}&rdquo;
                        </p>

                        {/* 2. Designed by Ahvaanam */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1px", alignItems: "center" }}>
                            <p 
                                style={{ 
                                    fontSize: "clamp(9.5px, 1.8vw, 11px)", 
                                    fontWeight: 700, 
                                    letterSpacing: "0.14em", 
                                    textTransform: "uppercase", 
                                    color: "#6b4515", 
                                    margin: 0 
                                }}
                            >
                                Designed by <span style={{ color: "#b57b2b" }}>{invitation.footer.designer}</span>
                            </p>
                            
                            <p 
                                style={{ 
                                    fontFamily: "Georgia, 'Times New Roman', serif", 
                                    fontSize: "clamp(9.5px, 1.6vw, 10.5px)", 
                                    color: "#8c6a38", 
                                    opacity: 0.85, 
                                    margin: 0, 
                                    lineHeight: 1.2
                                }}
                            >
                                {invitation.footer.service}
                            </p>
                        </div>
                        
                        {/* 3. Location & Contact info */}
                        <div 
                            style={{ 
                                display: "flex", 
                                flexWrap: "wrap",
                                gap: "3px 8px", 
                                justifyContent: "center", 
                                alignItems: "center", 
                                fontSize: "clamp(9px, 1.8vw, 10px)", 
                                fontWeight: 500, 
                                color: "#806335", 
                                opacity: 0.85,
                                lineHeight: 1.3,
                                padding: "0 6px"
                            }}
                        >
                            <span style={{ letterSpacing: "0.02em" }}>
                                📍 {invitation.footer.location}
                            </span>
                            <span style={{ opacity: 0.4 }}>•</span>
                            <a 
                                href={`tel:${invitation.footer.contact}`} 
                                style={{ 
                                    letterSpacing: "0.02em", 
                                    color: "#99621b", 
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "2px"
                                }}
                            >
                                📞 {invitation.footer.contact}
                            </a>
                        </div>

                        {/* 4. A LITTLE LOVE FOR AHVAANAM (EMBEDDED SIGNATURE RATING) */}
                        <div 
                            style={{
                                width: "100%",
                                maxWidth: "340px",
                                background: "rgba(255, 252, 244, 0.88)",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgba(184, 137, 45, 0.28)",
                                borderRadius: "16px",
                                padding: "5px 12px",
                                marginTop: "3px",
                                boxShadow: "0 3px 12px -2px rgba(120, 80, 20, 0.05)"
                            }}
                        >
                            <div style={{ display: "flex", flexDirection: "column", gap: "3px", alignItems: "center" }}>
                                
                                {/* Header / Emotional response */}
                                <span 
                                    style={{ 
                                        fontFamily: "Georgia, 'Times New Roman', serif",
                                        fontSize: "10.5px", 
                                        fontWeight: 600, 
                                        letterSpacing: "0.06em", 
                                        color: rating ? "#5c4015" : "#8c6224",
                                        textTransform: rating ? "none" : "uppercase",
                                        transition: "color 0.2s ease"
                                    }}
                                >
                                    {rating 
                                        ? (rating === 5 ? "Thank you for the love! ❤️" : "Thank you for your feedback ✨")
                                        : "A Little Love For Ahvaanam ✨"
                                    }
                                </span>

                                {/* 5 Gold Stars */}
                                <div style={{ display: "flex", gap: "5px", alignItems: "center", padding: "2px 0" }}>
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const currentVal = hoverRating !== null ? hoverRating : (rating || 0);
                                        const isFilled = currentVal >= star;

                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => handleStarClick(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(null)}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    cursor: "pointer",
                                                    padding: "2px",
                                                    transform: isFilled ? "scale(1.18)" : "scale(1)",
                                                    transition: "transform 0.15s ease, filter 0.15s ease",
                                                    filter: isFilled ? "drop-shadow(0 0 4px rgba(245, 158, 11, 0.7))" : "none"
                                                }}
                                                aria-label={`Rate ${star} stars`}
                                                title={`Rate ${star} star${star > 1 ? 's' : ''}`}
                                            >
                                                <Star
                                                    size={18}
                                                    color={isFilled ? "#E5A918" : "#D4AF37"}
                                                    fill={isFilled ? "#F59E0B" : "rgba(212, 175, 55, 0.08)"}
                                                    strokeWidth={1.8}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Optional Compact Inline Note (Revealed only after rating) */}
                                <AnimatePresence>
                                    {showNoteInput && !noteSent && (
                                        <motion.form 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onSubmit={handleNoteSubmit}
                                            style={{ 
                                                display: "flex", 
                                                gap: "5px", 
                                                alignItems: "center", 
                                                width: "100%", 
                                                marginTop: "2px",
                                                overflow: "hidden"
                                            }}
                                        >
                                            <input
                                                type="text"
                                                placeholder="Leave a quick note? (optional)"
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                maxLength={150}
                                                style={{
                                                    flex: 1,
                                                    padding: "3px 8px",
                                                    fontSize: "10px",
                                                    borderRadius: "6px",
                                                    border: "1px solid rgba(184, 137, 45, 0.3)",
                                                    background: "#fffdf9",
                                                    color: "#5c4015",
                                                    outline: "none",
                                                    fontFamily: "inherit"
                                                }}
                                            />
                                            <button
                                                type="submit"
                                                disabled={noteSubmitting || !note.trim()}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "24px",
                                                    height: "22px",
                                                    background: "linear-gradient(135deg, #b8892d, #8f651c)",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    cursor: "pointer",
                                                    opacity: note.trim() ? 1 : 0.4
                                                }}
                                                aria-label="Send note"
                                                title="Send note"
                                            >
                                                <Send size={10} />
                                            </button>
                                        </motion.form>
                                    )}

                                    {noteSent && (
                                        <motion.div 
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ display: "flex", alignItems: "center", gap: "3px", fontSize: "9.5px", color: "#16a34a", fontWeight: 600 }}
                                        >
                                            <Check size={11} strokeWidth={2.5} />
                                            <span>Note received!</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>

                    </div>
                </SectionReveal>
            </div>
        </footer>
    );
}