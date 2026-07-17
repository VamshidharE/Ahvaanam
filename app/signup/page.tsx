"use client";

import React, { useState } from "react";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let redirectTo = `${window.location.origin}/auth/callback`;
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get("redirect");
        if (redirect) {
          redirectTo += `?next=${encodeURIComponent(redirect)}`;
        }
      }

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to sign up. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* Background radial glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-600/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.01] blur-[120px] pointer-events-none" />

      {/* --- SIGNUP CARD --- */}
      <div className="w-full max-w-md bg-white border border-amber-500/10 backdrop-blur-xl p-8 rounded-3xl shadow-sm relative z-10 space-y-6">
        <div className="text-center flex flex-col items-center gap-2">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-26 w-auto object-contain mb-1.5" />
          <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[2.5px] font-bold">
            Create Your Client Account
          </p>
        </div>

        {success ? (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-4 rounded-2xl flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Registration Successful!</span>
              <span className="text-center leading-relaxed">
                Please check your email inbox to verify your account before logging in.
              </span>
            </div>
            <Link
              href="/login"
              className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] block text-center shadow-sm hover:scale-105 active:scale-95"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
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

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl pl-11 pr-11 py-3 text-xs text-[#241E1C] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35 hover:text-[#241E1C]/65 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#241E1C]/35" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="w-full bg-[#FAF9F6] border border-zinc-200 focus:border-[#C49B27] outline-none rounded-xl pl-11 pr-11 py-3 text-xs text-[#241E1C] transition-colors"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] disabled:opacity-50 mt-4 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 shadow-sm"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>

            {/* Link to Login */}
            <div className="text-center mt-6 pt-2 border-t border-zinc-100">
              <p className="text-[10px] text-[#241E1C]/50 tracking-[0.5px]">
                Already have an account?{" "}
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
