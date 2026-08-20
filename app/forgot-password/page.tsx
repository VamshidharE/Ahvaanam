"use client";

import React, { useState } from "react";
import { Mail, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const cleanEmail = email.trim().toLowerCase();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        cleanEmail,
        {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        }
      );

      if (resetError) {
        throw new Error(resetError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset link. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* Background radial glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-600/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.01] blur-[120px] pointer-events-none" />

      {/* --- FORGOT PASSWORD CARD --- */}
      <div className="w-full max-w-md bg-white border border-amber-500/10 backdrop-blur-xl p-8 rounded-3xl shadow-sm relative z-10 space-y-6">
        <div className="text-center flex flex-col items-center gap-2">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-8 md:h-9 w-auto object-contain mb-2" />
          <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[2.5px] font-bold">
            Reset Your Password
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-4 rounded-2xl flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Recovery Link Sent!</span>
              <span className="text-center leading-relaxed">
                If the email is associated with an active account, you will receive a link to reset your password.
              </span>
            </div>
            <Link
              href="/login"
              className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] block text-center shadow-sm hover:scale-105 active:scale-95"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <p className="text-[11px] text-[#241E1C]/60 text-center leading-relaxed mb-2">
              Enter the email address associated with your account, and we'll send you a secure link to reset your password.
            </p>

            {error && (
              <div className="bg-red-500/5 border border-red-500/20 text-red-600 text-xs px-4 py-3 rounded-xl flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span className="font-semibold">{error}</span>
              </div>
            )}

            {/* Email input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35" size={16} />
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl pl-11 pr-4 py-3 text-xs text-[#241E1C] transition-colors"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] disabled:opacity-50 mt-4 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-sm"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            {/* Link to Login */}
            <div className="text-center mt-6 pt-2 border-t border-zinc-100">
              <p className="text-[10px] text-[#241E1C]/50 tracking-[0.5px]">
                Remembered your password?{" "}
                <Link href="/login" className="text-[#C49B27] hover:underline font-bold">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
