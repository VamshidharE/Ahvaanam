"use client";

import { useState } from "react";
import SectionReveal from "../shared/SectionReveal";
import { useRoseMandap } from "../context";

export default function RSVP({ clientId }: { clientId?: string }) {
    const invitation = useRoseMandap();
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [attendance, setAttendance] = useState("yes");
    const [guestCount, setGuestCount] = useState("1");
    const [message, setMessage] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setLoading(true);

        if (clientId) {
            try {
                const res = await fetch(`/api/invitation/${clientId}/rsvp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        guest_name: name,
                        phone: phone.trim() || undefined,
                        attending: attendance === "yes",
                        guest_count: attendance === "yes" ? parseInt(guestCount, 10) || 1 : 1,
                        message: message.trim() || undefined,
                    }),
                });

                const data = await res.json();
                if (!res.ok || !data.success) {
                    throw new Error(data.error || "Failed to submit RSVP. Please try again.");
                }

                setSubmitted(true);
            } catch (err: any) {
                console.error("RSVP submission error:", err);
                setError(err.message || "Failed to submit your response. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            // Local preview mode fallback
            setLoading(false);
            setSubmitted(true);
        }
    }

    return (
        <section className="invitation-section rsvp-section">
            <div className="invitation-inner">
                <SectionReveal>
                    <div className="section-heading">
                        <p className="section-kicker">Your presence is our gift</p>
                        <h2>{invitation.rsvp.title}</h2>
                        <span className="heading-ornament">✦</span>
                    </div>
                    <p className="rsvp-copy">{invitation.rsvp.message}</p>

                    {!submitted ? (
                        <form
                            onSubmit={handleSubmit}
                            className="rsvp-form"
                        >
                            {error && (
                                <div 
                                    style={{
                                        padding: "10px 14px",
                                        background: "rgba(225, 29, 72, 0.1)",
                                        border: "1px solid rgba(225, 29, 72, 0.3)",
                                        borderRadius: "10px",
                                        color: "#9f1239",
                                        fontSize: "12px",
                                        textAlign: "center",
                                        marginBottom: "12px"
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            <div className="rsvp-field">
                                <label htmlFor="guest-name">
                                    Your Full Name *
                                </label>
                                <input
                                    id="guest-name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="rsvp-field">
                                <label htmlFor="guest-phone">
                                    Phone Number (Optional)
                                </label>
                                <input
                                    id="guest-phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="e.g. +91 98765 43210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            <div className="rsvp-field">
                                <label htmlFor="guest-attendance">
                                    Will You Be Joining Us? *
                                </label>
                                <select
                                    id="guest-attendance"
                                    name="attendance"
                                    value={attendance}
                                    onChange={(e) => setAttendance(e.target.value)}
                                    required
                                >
                                    <option value="yes">
                                        Joyfully Accept (Attending)
                                    </option>
                                    <option value="no">
                                        Regretfully Decline
                                    </option>
                                </select>
                            </div>

                            {attendance === "yes" && (
                                <div className="rsvp-field">
                                    <label htmlFor="guest-count">
                                        Total Guests Attending
                                    </label>
                                    <select
                                        id="guest-count"
                                        name="guestCount"
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(e.target.value)}
                                    >
                                        <option value="1">1 Person</option>
                                        <option value="2">2 Persons</option>
                                        <option value="3">3 Persons</option>
                                        <option value="4">4 Persons</option>
                                        <option value="5">5+ Persons</option>
                                    </select>
                                </div>
                            )}

                            <div className="rsvp-field rsvp-message-field">
                                <label htmlFor="guest-message">
                                    A Message / Blessings
                                </label>
                                <textarea
                                    id="guest-message"
                                    name="message"
                                    rows={4}
                                    placeholder="Send your blessings..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                className="rsvp-button"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : (invitation.rsvp.buttonText || "Confirm RSVP")}
                            </button>
                        </form>
                    ) : (
                        <div className="rsvp-thanks">
                            <span>✦</span>
                            <h3>Thank You!</h3>
                            <p>
                                Your response has been recorded. We look forward to
                                celebrating this beautiful day with you!
                            </p>
                        </div>
                    )}

                    {/* Compact Direct WhatsApp Contact */}
                    {invitation.rsvp.whatsappNumber && (
                        <div 
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "6px"
                            }}
                        >
                            <span 
                                style={{
                                    fontSize: "clamp(11px, 2vw, 12px)",
                                    color: "#7b521b",
                                    opacity: 0.85,
                                    fontWeight: 500
                                }}
                            >
                                Or connect directly via message
                            </span>
                            <a
                                href={`https://wa.me/${invitation.rsvp.whatsappNumber}?text=${encodeURIComponent(
                                    `Hi, I received the wedding invitation for ${invitation.couple.groom} & ${invitation.couple.bride}.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "6px",
                                    padding: "6px 14px",
                                    borderRadius: "999px",
                                    background: "#25D366",
                                    color: "#ffffff",
                                    textDecoration: "none",
                                    fontSize: "11.5px",
                                    fontWeight: 600,
                                    letterSpacing: "0.02em",
                                    boxShadow: "0 2px 8px rgba(37, 211, 102, 0.28)",
                                    transition: "transform 0.15s ease, box-shadow 0.15s ease"
                                }}
                            >
                                <svg 
                                    width="14" 
                                    height="14" 
                                    viewBox="0 0 24 24" 
                                    fill="currentColor"
                                    style={{ flexShrink: 0 }}
                                >
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-5.805 1.554zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>{invitation.rsvp.whatsappLabel || "WhatsApp RSVP"}</span>
                            </a>
                        </div>
                    )}
                </SectionReveal>
            </div>
        </section>
    );
}
