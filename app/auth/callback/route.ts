import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  
  // Support both 'next' and 'redirect' query params, defaulting to '/dashboard'
  let next = searchParams.get("next") || searchParams.get("redirect") || "/dashboard";

  // If password recovery link, route the user to the reset password form page
  if (type === "recovery") {
    next = "/reset-password";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    // Redirect with the actual error message
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  // Redirect to login if code is missing
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent("Authentication code is missing or invalid.")}`);
}
