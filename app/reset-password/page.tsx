"use client";

import React, { useState, useEffect } from "react";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let mounted = true;

    const initRecovery = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const token_hash = params.get("token_hash");
        const type = params.get("type");
        const urlError = params.get("error_description") || params.get("error");

        if (urlError) {
          if (mounted) {
            setError(urlError);
            setVerifyingSession(false);
          }
          return;
        }

        // 1. Exchange PKCE code if present in URL
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) {
            console.error("Code exchange error:", exchangeError);
          }
        }

        // 2. Verify token_hash if present in URL
        if (token_hash) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash,
            type: (type as any) || "recovery",
          });
          if (verifyError) {
            console.error("Token verification error:", verifyError);
          }
        }

        // 3. Check active session
        const { data: { session } } = await supabase.auth.getSession();

        if (mounted) {
          if (session) {
            setError(null);
          } else if (!code && !token_hash) {
            // Check hash fragment (implicit flow)
            const hash = window.location.hash;
            if (!hash || !hash.includes("access_token")) {
              setError("No active password reset session found. If your link expired, please request a new reset link.");
            }
          }
          setVerifyingSession(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || "Failed to initialize secure reset session.");
          setVerifyingSession(false);
        }
      }
    };

    // 4. Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        if (event === "PASSWORD_RECOVERY" || session) {
          setError(null);
          setVerifyingSession(false);
        }
      }
    });

    initRecovery();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
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
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update password. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#241E1C] flex items-center justify-center p-4 relative font-sans overflow-hidden">
      {/* Background radial glowing orbs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-yellow-600/[0.01] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[400px] h-[400px] rounded-full bg-amber-500/[0.01] blur-[120px] pointer-events-none" />

      {/* --- RESET PASSWORD CARD --- */}
      <div className="w-full max-w-md bg-white border border-amber-500/10 backdrop-blur-xl p-8 rounded-3xl shadow-sm relative z-10 space-y-6">
        <div className="text-center flex flex-col items-center gap-2">
          <img src="/images/logo.png" alt="Ahvaanam" className="h-26 w-auto object-contain mb-1.5" />
          <p className="text-[9px] text-[#241E1C]/45 uppercase tracking-[2.5px] font-bold">
            Choose New Password
          </p>
        </div>

        {verifyingSession ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-6 h-6 border-2 border-[#C49B27] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#241E1C]/60 font-medium">Verifying secure reset session...</p>
          </div>
        ) : success ? (
          <div className="space-y-4 text-center">
            <div className="bg-emerald-500/5 border border-emerald-500/20 text-emerald-700 text-xs px-4 py-4 rounded-2xl flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Password Updated!</span>
              <span className="text-center leading-relaxed">
                Your password has been successfully updated. You will be redirected to the login page shortly...
              </span>
            </div>
            <Link
              href="/login"
              className="w-full bg-[#C49B27] hover:bg-[#B0871B] text-white font-bold py-3.5 rounded-xl text-xs transition-all tracking-[1.5px] block text-center shadow-sm hover:scale-105 active:scale-95"
            >
              Sign In Now
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

            {/* Password input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-[#241E1C]/50 tracking-[1.5px]">
                New Password
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
                Confirm New Password
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
              {loading ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
