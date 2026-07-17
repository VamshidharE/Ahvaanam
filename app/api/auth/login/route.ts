import { NextRequest, NextResponse } from "next/server";
import { AUTH_CONFIG } from "../../../../lib/auth/config";
import { verifyPassword } from "../../../../lib/auth/hash";
import { signSession } from "../../../../lib/auth/session";
import { loginSchema } from "../../../../lib/validation";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: parsed.error.issues.map(err => ({ path: err.path.join("."), message: err.message })) 
      }, { status: 400 });
    }

    const { email, password } = parsed.data;

    const isAdminEmail = email.toLowerCase() === AUTH_CONFIG.ADMIN_EMAIL.toLowerCase();
    const isPasswordCorrect = verifyPassword(password, AUTH_CONFIG.ADMIN_PASSWORD_HASH);

    if (!isAdminEmail || !isPasswordCorrect) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create session token
    const token = await signSession({ email, role: "admin" });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_CONFIG.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: AUTH_CONFIG.SESSION_EXPIRY_SECONDS,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
