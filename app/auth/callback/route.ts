import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const errorDescription = searchParams.get("error_description") || searchParams.get("error");
  
  // Support both 'next' and 'redirect' query params, defaulting to '/dashboard'
  let next = searchParams.get("next") || searchParams.get("redirect") || "/dashboard";

  // If password recovery link, route the user to the reset password form page
  if (type === "recovery" || next.includes("reset-password")) {
    next = "/reset-password";
  }

  // If Supabase returned an error in query params
  if (errorDescription) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorDescription)}`);
  }

  const supabase = await createClient();

  // 1. PKCE Code Exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  // 2. Token Hash Verification (OTP / Email Confirmation / Password Recovery)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  // If redirected directly with recovery type or next parameter, redirect to next
  if (type === "recovery" || next === "/reset-password") {
    return NextResponse.redirect(`${origin}/reset-password`);
  }

  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication link is invalid or expired. Please request a new one.")}`);
}
