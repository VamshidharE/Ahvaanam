"use client";

import React, { useState } from "react";
import { rsvpSubmissionSchema } from "../../lib/validation";
import { Check, AlertCircle, Users, Phone, Mail, MessageSquare, User } from "lucide-react";

export default function RsvpSubmissionForm({ clientId }: { clientId: string }) {
  const [guestName, setGuestName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [attending, setAttending] = useState<boolean | null>(null);
  const [guestCount, setGuestCount] = useState(1);
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    if (attending === null) {
      setErrors({ attending: "Please let us know if you will attend." });
      return;
    }

    const payload = {
      guest_name: guestName,
      phone,
      email: email || undefined,
      attending,
      guest_count: attending ? Number(guestCount) : 1,
      message: message || undefined,
    };

    // Client-side Zod validation
    const parsed = rsvpSubmissionSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`/api/invitation/${clientId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit RSVP.");
      }

      setSuccess(true);
    } catch (err: any) {
      setGeneralError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-2xl mx-auto py-16 px-6">
        <div className="bg-white border-2 border-[#C49B27]/30 p-10 md:p-14 rounded-[36px] shadow-xl text-center relative overflow-hidden flex flex-col items-center">
          {/* Confetti-like orbs */}
          <div className="absolute -top-12 -left-12 w-24 h-24 rounded-full bg-amber-500/5 blur-xl" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 rounded-full bg-yellow-600/5 blur-xl" />

          {/* Success Check Animation Container */}
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
            <Check size={36} strokeWidth={3} />
          </div>

          <h3 className="text-2xl text-[#241E1C] font-bold uppercase tracking-[2px] font-sans mb-3">
            Response Submitted
          </h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed mb-6 font-sans">
            Thank you for responding! Your RSVP response has been successfully recorded. We look forward to celebrating together.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto py-16 px-6" id="rsvp-submit-form">
      <div className="bg-[#FAF9F6] border border-[#C49B27]/20 p-8 md:p-12 rounded-[36px] shadow-sm relative overflow-hidden">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[3px] text-[#C49B27] font-bold block mb-1">
            R.S.V.P
          </span>
          <h2 className="text-3xl text-[#241E1C] font-sans uppercase font-bold tracking-[1.5px]">
            Are You Attending?
          </h2>
          <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#C49B27] to-transparent mx-auto mt-3" />
        </div>

        {generalError && (
          <div className="mb-6 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-3 text-red-600 text-xs">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <p>{generalError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Guest Name */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[1.5px] font-bold text-slate-500 flex items-center gap-1.5 font-sans">
                <User size={12} className="text-[#C49B27]" /> Guest Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#C49B27] text-sm text-[#241E1C] bg-white transition-all shadow-sm font-sans"
              />
              {errors.guest_name && (
                <p className="text-red-500 text-[10px] font-bold font-sans">{errors.guest_name}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[1.5px] font-bold text-slate-500 flex items-center gap-1.5 font-sans">
                <Phone size={12} className="text-[#C49B27]" /> Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +919999999999"
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#C49B27] text-sm text-[#241E1C] bg-white transition-all shadow-sm font-sans"
              />
              {errors.phone && (
                <p className="text-red-500 text-[10px] font-bold font-sans">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[1.5px] font-bold text-slate-500 flex items-center gap-1.5 font-sans">
              <Mail size={12} className="text-[#C49B27]" /> Email Address <span className="text-slate-400 font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#C49B27] text-sm text-[#241E1C] bg-white transition-all shadow-sm font-sans"
            />
            {errors.email && (
              <p className="text-red-500 text-[10px] font-bold font-sans">{errors.email}</p>
            )}
          </div>

          {/* Attendance Selection */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[1.5px] font-bold text-slate-500 font-sans">
              Will you attend? <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`py-3.5 rounded-xl border font-bold text-xs uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2 font-sans ${
                  attending === true
                    ? "border-[#C49B27] bg-[#C49B27]/10 text-[#C49B27]"
                    : "border-zinc-200 bg-white text-slate-500 hover:border-zinc-300"
                }`}
              >
                Yes, Attending
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`py-3.5 rounded-xl border font-bold text-xs uppercase tracking-[1.5px] transition-all flex items-center justify-center gap-2 font-sans ${
                  attending === false
                    ? "border-red-500 bg-red-500/10 text-red-600"
                    : "border-zinc-200 bg-white text-slate-500 hover:border-zinc-300"
                }`}
              >
                No, Decline
              </button>
            </div>
            {errors.attending && (
              <p className="text-red-500 text-[10px] font-bold font-sans">{errors.attending}</p>
            )}
          </div>

          {/* Number of Guests (Only visible if attending = true) */}
          {attending === true && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[1.5px] font-bold text-slate-500 flex items-center gap-1.5 font-sans">
                <Users size={12} className="text-[#C49B27]" /> Number of Guests
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                  className="w-10 h-10 border border-zinc-200 bg-white text-[#241E1C] rounded-full flex items-center justify-center hover:border-[#C49B27] transition-all shadow-sm font-sans"
                >
                  -
                </button>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Math.min(20, Math.max(1, Number(e.target.value))))}
                  className="w-20 text-center py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-[#241E1C] font-sans"
                />
                <button
                  type="button"
                  onClick={() => setGuestCount(prev => Math.min(20, prev + 1))}
                  className="w-10 h-10 border border-zinc-200 bg-white text-[#241E1C] rounded-full flex items-center justify-center hover:border-[#C49B27] transition-all shadow-sm font-sans"
                >
                  +
                </button>
              </div>
              {errors.guest_count && (
                <p className="text-red-500 text-[10px] font-bold font-sans">{errors.guest_count}</p>
              )}
            </div>
          )}

          {/* Message */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-[1.5px] font-bold text-slate-500 flex items-center gap-1.5 font-sans">
              <MessageSquare size={12} className="text-[#C49B27]" /> Personal Message
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Leave a warm message for the couple"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:outline-none focus:border-[#C49B27] text-sm text-[#241E1C] bg-white transition-all shadow-sm resize-none font-sans"
            />
            {errors.message && (
              <p className="text-red-500 text-[10px] font-bold font-sans">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-4 rounded-xl text-xs uppercase tracking-[2px] transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-sans"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : null}
            {loading ? "Submitting..." : "Submit RSVP Response"}
          </button>
        </form>
      </div>
    </div>
  );
}
